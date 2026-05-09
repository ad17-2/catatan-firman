import "server-only";
import mysql from "mysql2/promise";
import { cache } from "react";
import type { Sermon, TranscriptSegment } from "./types";

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

type SermonRow = Omit<Sermon, "transcript" | "transcript_segments"> & {
  transcript?: string | null;
  transcript_segments?: unknown;
};

const SELECT_SERMON_LIST = `
  SELECT id, title, summary, key_points, bible_verses, quotes,
    action_items, reflection_questions, youtube_url, created_at
  FROM sermons
`;

const SELECT_SERMON_DETAIL = `
  SELECT id, title, summary, key_points, bible_verses, quotes,
    action_items, reflection_questions, youtube_url, transcript,
    transcript_segments, created_at
  FROM sermons
`;

function sanitizeSearchTerm(raw: string): string {
  return raw.replace(/[+\-<>()~*"@]/g, "").trim();
}

function isTranscriptSegment(value: unknown): value is TranscriptSegment {
  if (!value || typeof value !== "object") return false;
  const segment = value as Record<string, unknown>;

  return (
    typeof segment.start === "number" &&
    typeof segment.end === "number" &&
    typeof segment.text === "string"
  );
}

function parseTranscriptSegments(raw: unknown): TranscriptSegment[] | null {
  if (!raw) return null;

  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!Array.isArray(parsed)) return null;

    const segments = parsed.filter(isTranscriptSegment);
    return segments.length > 0 ? segments : null;
  } catch {
    return null;
  }
}

function mapSermon(row: SermonRow): Sermon {
  return {
    ...row,
    transcript: row.transcript ?? null,
    transcript_segments: parseTranscriptSegments(row.transcript_segments),
  };
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
      `${SELECT_SERMON_LIST} WHERE MATCH(title, summary) AGAINST (? IN BOOLEAN MODE) ORDER BY created_at DESC`,
      [terms],
    );
    return (rows as SermonRow[]).map(mapSermon);
  }

  const [rows] = await pool.query(
    `${SELECT_SERMON_LIST} ORDER BY created_at DESC`,
  );
  return (rows as SermonRow[]).map(mapSermon);
}

export const getSermonById = cache(
  async (id: number): Promise<Sermon | null> => {
    const [rows] = await pool.query(`${SELECT_SERMON_DETAIL} WHERE id = ?`, [
      id,
    ]);
    const results = (rows as SermonRow[]).map(mapSermon);
    return results[0] || null;
  },
);
