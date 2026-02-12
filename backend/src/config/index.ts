import type { MysqlConfig } from "../services/MysqlService.js";

export interface AppConfig {
  openai: { apiKey: string };
  anthropic: { apiKey: string; model: string };
  whisper: { model: string; language: string };
  mysql: MysqlConfig | null;
}

const REQUIRED_KEYS = ["OPENAI_API_KEY", "ANTHROPIC_API_KEY"] as const;

export function validateConfig() {
  const missing = REQUIRED_KEYS.filter((key) => !process.env[key]);
  return { isValid: missing.length === 0, missingKeys: missing };
}

export function validateMysqlConfig() {
  const hasHost = !!process.env.MYSQL_HOST;
  const hasDatabase = !!process.env.MYSQL_DATABASE;
  return { isValid: hasHost && hasDatabase, hasHost, hasDatabase };
}

export function loadConfig(): AppConfig {
  const mysqlHost = process.env.MYSQL_HOST;
  const mysqlDatabase = process.env.MYSQL_DATABASE;

  return {
    openai: { apiKey: process.env.OPENAI_API_KEY! },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY!,
      model: "claude-sonnet-4-5",
    },
    whisper: { model: "whisper-1", language: "id" },
    mysql:
      mysqlHost && mysqlDatabase
        ? {
            host: mysqlHost,
            user: process.env.MYSQL_USER || "root",
            password: process.env.MYSQL_PASSWORD || "",
            database: mysqlDatabase,
            port: process.env.MYSQL_PORT
              ? parseInt(process.env.MYSQL_PORT, 10)
              : 3306,
          }
        : null,
  };
}
