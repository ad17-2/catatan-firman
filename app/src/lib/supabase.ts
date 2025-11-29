import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Sermon {
  id: string;
  title: string;
  summary: string;
  key_points: string[];
  bible_verses: string[];
  quotes: string[];
  action_items: string[];
  reflection_questions: string[];
  created_at: string;
}

export async function getSermons(searchQuery?: string): Promise<Sermon[]> {
  let query = supabase
    .from("sermons")
    .select("*")
    .order("created_at", { ascending: false });

  if (searchQuery) {
    const trimmed = searchQuery.trim();

    // Convert "word1 word2" to "word1 & word2" for AND matching
    // Also add :* for prefix matching (e.g., "Sam" matches "Samson")
    const tsQuery = trimmed
      .split(/\s+/)
      .map(word => `${word}:*`)
      .join(" & ");

    query = query.textSearch("fts", tsQuery);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function getSermonById(id: string): Promise<Sermon | null> {
  const { data, error } = await supabase
    .from("sermons")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}
