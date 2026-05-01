import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const config = {
  api: { bodyParser: false },
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", chunk => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawBody = await getRawBody(req);
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_details?.email;
    const metadata = session.metadata || {};

    if (!email) {
      return res.status(400).json({ error: "No email found" });
    }

    // PAGO DE CATÁLOGO
    if (metadata.type === "catalog" && metadata.prompt_slug) {
      const slug = metadata.prompt_slug;

      // Añade el slug al array de catalog_prompts_paid del usuario
      const { data: userData } = await supabase
        .from("users")
        .select("catalog_prompts_paid")
        .eq("email", email)
        .single();

      const currentPaid = userData?.catalog_prompts_paid || [];
      if (!currentPaid.includes(slug)) {
        await supabase
          .from("users")
          .update({ catalog_prompts_paid: [...currentPaid, slug] })
          .eq("email", email);
      }

      // Incrementa uses_count
      await supabase.rpc("increment_uses_count", { prompt_slug: slug });

      console.log(`Catálogo: ${slug} comprado por ${email}`);
    }
    // PAGO DEL GENERADOR (lógica existente)
    else {
      const { data: userData } = await supabase
        .from("users")
        .select("prompts_paid")
        .eq("email", email)
        .single();

      if (!userData) {
        await supabase.from("users").insert({
          email,
          prompts_used: 1,
          prompts_paid: 1,
        });
      } else {
        await supabase
          .from("users")
          .update({ prompts_paid: userData.prompts_paid + 1 })
          .eq("email", email);
      }

      console.log(`Generador: crédito añadido para ${email}`);
    }
  }

  return res.status(200).json({ received: true });
}