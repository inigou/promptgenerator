import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { category } = req.query;

  let query = supabase
    .from("catalog_prompts")
    .select("id, slug, category, title, subtitle, preview_text, fields, uses_count")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (category && category !== "todos") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: "Error cargando catálogo" });
  }

  return res.status(200).json({ prompts: data || [] });
}