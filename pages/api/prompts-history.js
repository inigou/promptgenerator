import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "login_required" });
  }

  const { data, error } = await supabase
    .from("prompts_history")
    .select("id, tema, ia, situacion, resultado, created_at")
    .eq("user_email", session.user.email)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return res.status(500).json({ error: "Error cargando historial" });
  }

  return res.status(200).json({ history: data || [] });
}