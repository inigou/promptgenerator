import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", chunk => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const rawBody = await getRawBody(req);
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_details?.email || session.customer_email;
    const metadata = session.metadata || {};
    const { type, prompt_slug, user_email, fields } = metadata;
    const userEmail = user_email || email;

    if (!userEmail) return res.status(400).json({ error: "No email found" });

    // CONSULTA DIRECTA
    if (type === "consultation" && prompt_slug) {
      await supabase.from("consultations").insert({
        user_email: userEmail,
        prompt_slug,
        fields: fields ? JSON.parse(fields) : {},
        status: "pending",
      });

      // Incrementa uses_count
      await supabase.rpc("increment_uses_count", { prompt_slug });

      console.log(`Consulta: ${prompt_slug} por ${userEmail}`);
    }
    // PROMPT DE CATÁLOGO
    else if (type === "catalog" && prompt_slug) {
      const { data: userData } = await supabase
        .from("users")
        .select("catalog_prompts_paid")
        .eq("email", userEmail)
        .single();

      const currentPaid = userData?.catalog_prompts_paid || [];
      if (!currentPaid.includes(prompt_slug)) {
        await supabase
          .from("users")
          .update({ catalog_prompts_paid: [...currentPaid, prompt_slug] })
          .eq("email", userEmail);
      }

      await supabase.rpc("increment_uses_count", { prompt_slug });

      console.log(`Catálogo: ${prompt_slug} por ${userEmail}`);
    }
    // GENERADOR (crédito adicional)
    else {
      const { data: userData } = await supabase
        .from("users")
        .select("prompts_paid")
        .eq("email", userEmail)
        .single();

      if (!userData) {
        await supabase.from("users").insert({ email: userEmail, prompts_used: 1, prompts_paid: 1 });
      } else {
        await supabase.from("users").update({ prompts_paid: userData.prompts_paid + 1 }).eq("email", userEmail);
      }

      console.log(`Generador: crédito para ${userEmail}`);
    }
  }

  return res.status(200).json({ received: true });
}