import type { MysqlConfig } from "../services/MysqlService.js";

export interface AppConfig {
  openai: { apiKey: string; summaryModel: string };
  whisper: { model: string; language: string };
  mysql: MysqlConfig | null;
}

export interface ApiConfig {
  port: number;
  basicPassword: string;
}

const REQUIRED_KEYS = ["OPENAI_API_KEY"] as const;
const REQUIRED_API_KEYS = ["INGEST_BASIC_PASSWORD"] as const;

export function validateConfig() {
  const missing = REQUIRED_KEYS.filter((key) => !process.env[key]);
  return { isValid: missing.length === 0, missingKeys: missing };
}

export function validateMysqlConfig() {
  const hasHost = !!process.env.MYSQL_HOST;
  const hasDatabase = !!process.env.MYSQL_DATABASE;
  return { isValid: hasHost && hasDatabase, hasHost, hasDatabase };
}

export function validateApiConfig() {
  const appValidation = validateConfig();
  const mysqlValidation = validateMysqlConfig();
  const missingApiKeys = REQUIRED_API_KEYS.filter((key) => !process.env[key]);
  const missingKeys: string[] = [
    ...appValidation.missingKeys,
    ...missingApiKeys,
  ];

  if (!mysqlValidation.hasHost) missingKeys.push("MYSQL_HOST");
  if (!mysqlValidation.hasDatabase) missingKeys.push("MYSQL_DATABASE");

  return { isValid: missingKeys.length === 0, missingKeys };
}

export function loadApiConfig(): ApiConfig {
  const rawPort = process.env.PORT;
  const port = rawPort ? Number.parseInt(rawPort, 10) : 3000;

  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error("PORT must be an integer between 0 and 65535");
  }

  return {
    port,
    basicPassword: process.env.INGEST_BASIC_PASSWORD!,
  };
}

export function loadConfig(): AppConfig {
  const mysqlHost = process.env.MYSQL_HOST;
  const mysqlDatabase = process.env.MYSQL_DATABASE;

  return {
    openai: {
      apiKey: process.env.OPENAI_API_KEY!,
      summaryModel: process.env.OPENAI_SUMMARY_MODEL || "gpt-4.1-mini",
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
