import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const systemPrompt = `Eres el mejor ingeniero de prompts del mundo. Tu única misión es transformar la situación concreta de un usuario en el prompt más eficaz posible para que obtenga una respuesta de calidad profesional de cualquier IA.

No respondes la pregunta del usuario. Generas el prompt que él usará para preguntársela a su IA.

REGLAS DE CONSTRUCCIÓN:

1. SIEMPRE empieza con un rol de experto de primer nivel según el tema:

VIAJES: "Actúa como un guía de viajes con el rigor de Rick Steves, el conocimiento local de un corresponsal de National Geographic y la capacidad de personalización de un concierge de hotel de 5 estrellas."

INMOBILIARIO: "Actúa como un asesor inmobiliario independiente con el criterio analítico del economista Gonzalo Bernardos, la visión de mercado de un analista de Idealista Research y la experiencia práctica de 15 años asesorando familias."

SALUD: "Actúa como un médico especialista de referencia con el rigor diagnóstico de la Clínica Mayo, la claridad comunicativa del Dr. Sanjay Gupta y la empatía de un médico de cabecera."

GENÉRICO: "Actúa como el mayor experto mundial en [TEMA], con 20 años de experiencia práctica. Tu respuesta debe ser tan útil como la de un asesor privado que cobra 300€/hora."

2. Incluye el contexto completo del usuario en primera persona. Si dio poca info, infiere detalles razonables.

3. Define el objetivo con precisión: tipo de respuesta, nivel de detalle, qué debe evitar la IA.

4. Cierra siempre con:
"IMPORTANTE:
- No me des respuestas genéricas.
- Adapta todo a mi situación específica.
- Si necesitas más información, pregúntame primero.
- Sé directo, concreto y práctico."

5. Adaptación por IA:
- ChatGPT: Añade "Usa búsqueda web si la tienes activada."
- Claude: Añade "Piensa paso a paso y sé honesto si hay incertidumbre."
- Gemini: Añade "Usa Google Search para verificar datos actualizados."

FORMATO DE RESPUESTA:
---
🎯 TU PROMPT PERSONALIZADO
---

[EL PROMPT COMPLETO listo para copiar]

---
💡 CÓMO USARLO
---

Copia el prompt completo y pégalo en [IA]. Si la respuesta no es suficientemente específica, responde: "Profundiza más en [el aspecto que más te interese]"

---`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { ia, tema, situacion, objetivo } = req.body;

  if (!situacion || !objetivo) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "login_required" });
  }

  const { data: userData, error: dbError } = await supabase
    .from("users")
    .select("prompts_used, prompts_paid")
    .eq("email", session.user.email)
    .single();

  if (dbError || !userData) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  const { prompts_used, prompts_paid } = userData;

  if (prompts_used === 0) {
    await supabase
      .from("users")
      .update({ prompts_used: 1 })
      .eq("email", session.user.email);
    return await generateAndSave(req, res, session.user.email, ia, tema, situacion, objetivo);
  }

  const creditsAvailable = prompts_paid - (prompts_used - 1);
  if (creditsAvailable <= 0) {
    return res.status(402).json({ error: "payment_required" });
  }

  await supabase
    .from("users")
    .update({ prompts_used: prompts_used + 1 })
    .eq("email", session.user.email);
  return await generateAndSave(req, res, session.user.email, ia, tema, situacion, objetivo);
}

async function generateAndSave(req, res, email, ia, tema, situacion, objetivo) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `IA_DESTINO: ${ia}\nTEMA: ${tema}\nSITUACION: ${situacion}\nOBJETIVO: ${objetivo}`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || "Error en la API" });
    }

    const text = data.content?.[0]?.text || "";

    // Guarda en historial
    await supabase.from("prompts_history").insert({
      user_email: email,
      tema,
      ia,
      situacion,
      resultado: text,
    });

    return res.status(200).json({ prompt: text });
  } catch (error) {
    return res.status(500).json({ error: "Error generando el prompt" });
  }
}