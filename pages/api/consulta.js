import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "login_required" });

  const { slug, fields } = req.body;
  if (!slug) return res.status(400).json({ error: "Falta el slug" });

  // Buscar consulta pending del usuario para este slug
  const { data: consultation } = await supabase
    .from("consultations")
    .select("id, status, response, prompt_slug")
    .eq("user_email", session.user.email)
    .eq("prompt_slug", slug)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Si no hay consulta pending (webhook aún no procesó), generamos directamente
  if (!consultation) {
    const result = await getPromptAndGenerate(slug, fields, session.user.email);
    return res.status(200).json(result);
  }

  // Si ya estaba completada, la devolvemos
  if (consultation.status === "completed" && consultation.response) {
    return res.status(200).json({ response: consultation.response });
  }

  // Estaba pending — generamos ahora
  const result = await generateResponse(consultation.id, slug, fields);
  return res.status(200).json(result);
}

// Genera directamente sin consulta previa en BD (webhook no llegó a tiempo)
async function getPromptAndGenerate(slug, fields, userEmail) {
  const { data: promptData } = await supabase
    .from("catalog_prompts")
    .select("prompt_body, fields, title, category")
    .eq("slug", slug)
    .single();

  if (!promptData) return { error: "Prompt no encontrado" };

  const promptText = buildPromptText(promptData.prompt_body, promptData.fields, fields);

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: promptText }],
    });
    const response = message.content[0].text;

    await supabase.from("consultations").insert({
      user_email: userEmail,
      prompt_slug: slug,
      fields: fields || {},
      response,
      status: "completed",
    });

    return { response, title: promptData.title };
  } catch (err) {
    console.error("Error en getPromptAndGenerate:", err);
    return { error: "Error generando la consulta" };
  }
}

// Genera a partir de una consulta pending existente en BD
async function generateResponse(consultationId, slug, fields) {
  const { data: promptData } = await supabase
    .from("catalog_prompts")
    .select("prompt_body, fields, title")
    .eq("slug", slug)
    .single();

  if (!promptData) return { error: "Prompt no encontrado" };

  const promptText = buildPromptText(promptData.prompt_body, promptData.fields, fields);

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: promptText }],
    });
    const response = message.content[0].text;

    await supabase
      .from("consultations")
      .update({ response, status: "completed" })
      .eq("id", consultationId);

    return { response, title: promptData.title };
  } catch (err) {
    console.error("Error en generateResponse:", err);
    await supabase
      .from("consultations")
      .update({ status: "error" })
      .eq("id", consultationId);
    return { error: "Error generando la consulta" };
  }
}

function buildPromptText(promptBody, promptFields, userFields) {
  let text = promptBody;
  const fields = typeof promptFields === "string" ? JSON.parse(promptFields) : promptFields || [];
  const values = userFields || {};
  fields.forEach(field => {
    const value = values[field.id];
    if (value) text = text.replaceAll(`[${field.id.toUpperCase()}]`, value);
  });
  return text;
}