import mysql, { type Pool, type PoolOptions } from "mysql2/promise";
import type { SermonSummary } from "../types/index.js";

export interface SavedSermon {
  id: number;
  title: string;
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
    summary: SermonSummary,
    youtubeUrl?: string,
  ): Promise<SavedSermon> {
    const [result] = await this.pool.execute(
      `INSERT INTO sermons (
        title, summary, key_points, bible_verses,
        quotes, action_items, reflection_questions, youtube_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        summary.title,
        summary.summary,
        JSON.stringify(summary.keyPoints),
        JSON.stringify(summary.bibleVerses),
        JSON.stringify(summary.quotes),
        JSON.stringify(summary.actionItems),
        JSON.stringify(summary.reflectionQuestions),
        youtubeUrl || null,
      ],
    );

    const insertId = (result as mysql.ResultSetHeader).insertId;

    const [rows] = await this.pool.execute(
      "SELECT id, title, created_at FROM sermons WHERE id = ?",
      [insertId],
    );

    const records = rows as SavedSermon[];
    return records[0];
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
