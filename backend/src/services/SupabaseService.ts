import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { BilingualSummary } from "../types/index.js";

export interface SavedSermon {
  id: string;
  title_en: string;
  created_at: string;
}

export class SupabaseService {
  private client: SupabaseClient;

  constructor(url: string, serviceRoleKey: string) {
    this.client = createClient(url, serviceRoleKey);
  }

  async save(summary: BilingualSummary): Promise<SavedSermon> {
    const { data, error } = await this.client
      .from("sermons")
      .insert({
        title_en: summary.en.title,
        title_id: summary.id.title,
        summary_en: summary.en.summary,
        summary_id: summary.id.summary,
        key_points_en: summary.en.keyPoints,
        key_points_id: summary.id.keyPoints,
        bible_verses_en: summary.en.bibleVerses,
        bible_verses_id: summary.id.bibleVerses,
        quotes_en: summary.en.quotes,
        quotes_id: summary.id.quotes,
        action_items_en: summary.en.actionItems,
        action_items_id: summary.id.actionItems,
        reflection_questions_en: summary.en.reflectionQuestions,
        reflection_questions_id: summary.id.reflectionQuestions,
      })
      .select("id, title_en, created_at")
      .single();

    if (error) {
      throw new Error(`Failed to save sermon: ${error.message}`);
    }

    return data;
  }
}
