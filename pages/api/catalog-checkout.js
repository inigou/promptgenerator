import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const baseUrl = "https://www.promptbien.com";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "login_required" });

  const { slug, fields, type = "catalog" } = req.body;
  if (!slug) return res.status(400).json({ error: "Falta el slug del prompt" });

  const isConsultation = type === "consultation";
  const price = isConsultation ? 499 : 199;
  const productName = isConsultation
    ? "Consulta directa promptbien"
    : "Prompt de catálogo promptbien";
  const successUrl = isConsultation
    ? `${baseUrl}/pago-exitoso?type=consultation&slug=${slug}&fields=${encodeURIComponent(JSON.stringify(fields || {}))}`
    : `${baseUrl}/pago-exitoso?type=catalog&slug=${slug}&fields=${encodeURIComponent(JSON.stringify(fields || {}))}`;

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: {
            name: productName,
            description: `${isConsultation ? "Consulta directa" : "Prompt personalizado"}: ${slug}`,
          },
          unit_amount: price,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: successUrl,
      cancel_url: `${baseUrl}/catalogo`,
      customer_email: session.user.email,
      metadata: {
        type,
        prompt_slug: slug,
        user_email: session.user.email,
        fields: JSON.stringify(fields || {}),
      },
    });

    return res.status(200).json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return res.status(500).json({ error: "Error creando sesión de pago" });
  }
}