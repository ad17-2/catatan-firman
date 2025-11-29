import { createClient } from "@supabase/supabase-js";
import type { Language } from "./translations";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SermonRaw {
  id: string;
  title_en: string;
  title_id: string;
  summary_en: string;
  summary_id: string;
  key_points_en: string[];
  key_points_id: string[];
  bible_verses_en: string[];
  bible_verses_id: string[];
  quotes_en: string[];
  quotes_id: string[];
  action_items_en: string[];
  action_items_id: string[];
  reflection_questions_en: string[];
  reflection_questions_id: string[];
  created_at: string;
}

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

export function getLocalizedSermon(sermon: SermonRaw, lang: Language): Sermon {
  return {
    id: sermon.id,
    title: sermon[`title_${lang}`],
    summary: sermon[`summary_${lang}`],
    key_points: sermon[`key_points_${lang}`],
    bible_verses: sermon[`bible_verses_${lang}`],
    quotes: sermon[`quotes_${lang}`],
    action_items: sermon[`action_items_${lang}`],
    reflection_questions: sermon[`reflection_questions_${lang}`],
    created_at: sermon.created_at,
  };
}

export async function getSermons(
  searchQuery?: string,
  lang: Language = "en",
): Promise<SermonRaw[]> {
  let query = supabase
    .from("sermons")
    .select("*")
    .order("created_at", { ascending: false });

  if (searchQuery) {
    const trimmed = searchQuery.trim();

    const tsQuery = trimmed
      .split(/\s+/)
      .map((word) => `${word}:*`)
      .join(" & ");

    const ftsColumn = lang === "en" ? "fts_en" : "fts_id";
    query = query.textSearch(ftsColumn, tsQuery);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function getSermonById(id: string): Promise<SermonRaw | null> {
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
