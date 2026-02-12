import mysql, { type Pool, type PoolOptions } from "mysql2/promise";
import type { BilingualSummary } from "../types/index.js";

export interface SavedSermon {
  id: number;
  title_en: string;
  created_at: string;
}

export interface MysqlConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
}

export class MysqlService {
  private pool: Pool;

  constructor(config: MysqlConfig) {
    const poolOptions: PoolOptions = {
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      port: config.port || 3306,
      waitForConnections: true,
      connectionLimit: 2,
    };
    this.pool = mysql.createPool(poolOptions);
  }

  async save(
    summary: BilingualSummary,
    youtubeUrl?: string,
  ): Promise<SavedSermon> {
    const [result] = await this.pool.execute(
      `INSERT INTO sermons (
        title_en, title_id, summary_en, summary_id,
        key_points_en, key_points_id, bible_verses_en, bible_verses_id,
        quotes_en, quotes_id, action_items_en, action_items_id,
        reflection_questions_en, reflection_questions_id, youtube_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        summary.en.title,
        summary.id.title,
        summary.en.summary,
        summary.id.summary,
        JSON.stringify(summary.en.keyPoints),
        JSON.stringify(summary.id.keyPoints),
        JSON.stringify(summary.en.bibleVerses),
        JSON.stringify(summary.id.bibleVerses),
        JSON.stringify(summary.en.quotes),
        JSON.stringify(summary.id.quotes),
        JSON.stringify(summary.en.actionItems),
        JSON.stringify(summary.id.actionItems),
        JSON.stringify(summary.en.reflectionQuestions),
        JSON.stringify(summary.id.reflectionQuestions),
        youtubeUrl || null,
      ],
    );

    const insertId = (result as mysql.ResultSetHeader).insertId;

    const [rows] = await this.pool.execute(
      "SELECT id, title_en, created_at FROM sermons WHERE id = ?",
      [insertId],
    );

    const records = rows as SavedSermon[];
    return records[0];
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
