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

    if (!email) {
      console.error("No email in session");
      return res.status(400).json({ error: "No email found" });
    }

    // Busca el usuario en Supabase
    const { data: userData, error } = await supabase
      .from("users")
      .select("prompts_paid")
      .eq("email", email)
      .single();

    if (error || !userData) {
      // Si no existe, lo crea con 1 crédito
      await supabase.from("users").insert({
        email,
        prompts_used: 1,
        prompts_paid: 1,
      });
    } else {
      // Si existe, añade 1 crédito
      await supabase
        .from("users")
        .update({ prompts_paid: userData.prompts_paid + 1 })
        .eq("email", email);
    }

    console.log(`Crédito añadido para ${email}`);
  }

  return res.status(200).json({ received: true });
}