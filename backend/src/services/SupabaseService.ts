import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { SermonSummary } from "../types/index.js";

export interface SavedSermon {
  id: string;
  title: string;
  created_at: string;
}

export class SupabaseService {
  private client: SupabaseClient;

  constructor(url: string, anonKey: string) {
    this.client = createClient(url, anonKey);
  }

  async save(title: string, summary: SermonSummary): Promise<SavedSermon> {
    const { data, error } = await this.client
      .from("sermons")
      .insert({
        title,
        summary: summary.summary,
        key_points: summary.keyPoints,
        bible_verses: summary.bibleVerses,
        quotes: summary.quotes,
        action_items: summary.actionItems,
        reflection_questions: summary.reflectionQuestions,
      })
      .select("id, title, created_at")
      .single();

    if (error) {
      throw new Error(`Failed to save sermon: ${error.message}`);
    }

    return data;
  }
}
