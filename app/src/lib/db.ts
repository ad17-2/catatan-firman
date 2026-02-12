import "server-only";
import mysql from "mysql2/promise";
import { cache } from "react";
import type { Sermon } from "./types";

export type { Sermon } from "./types";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

const SELECT_SERMON = `
  SELECT id, title, summary, key_points, bible_verses, quotes,
    action_items, reflection_questions, youtube_url, created_at
  FROM sermons
`;

function sanitizeSearchTerm(raw: string): string {
  return raw.replace(/[+\-<>()~*"@]/g, "").trim();
}

export async function getSermons(searchQuery?: string): Promise<Sermon[]> {
  if (searchQuery) {
    const sanitized = sanitizeSearchTerm(searchQuery);
    if (!sanitized) return getSermons();

    const terms = sanitized
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => `+${w}*`)
      .join(" ");

    const [rows] = await pool.query(
      `${SELECT_SERMON} WHERE MATCH(title, summary) AGAINST (? IN BOOLEAN MODE) ORDER BY created_at DESC`,
      [terms],
    );
    return rows as Sermon[];
  }

  const [rows] = await pool.query(
    `${SELECT_SERMON} ORDER BY created_at DESC`,
  );
  return rows as Sermon[];
}

export const getSermonById = cache(
  async (id: number): Promise<Sermon | null> => {
    const [rows] = await pool.query(`${SELECT_SERMON} WHERE id = ?`, [id]);
    const results = rows as Sermon[];
    return results[0] || null;
  },
);
