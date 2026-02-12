export interface Sermon {
  id: number;
  title: string;
  summary: string;
  key_points: string[];
  bible_verses: string[];
  quotes: string[];
  action_items: string[];
  reflection_questions: string[];
  youtube_url: string | null;
  created_at: string;
}
