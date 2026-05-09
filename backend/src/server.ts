import "dotenv/config";
import crypto from "node:crypto";
import http, {
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import { loadApiConfig, loadConfig, validateApiConfig } from "./config/index.js";
import { AppError, ValidationError } from "./errors/index.js";
import { Pipeline } from "./pipeline/index.js";
import { MysqlService } from "./services/MysqlService.js";
import { consoleLogger } from "./cli/index.js";

const JSON_CONTENT_TYPE = { "Content-Type": "application/json" };
const AUTH_HEADER = 'Basic realm="Catatan Firman Ingest", charset="UTF-8"';
const MAX_BODY_BYTES = 1_000_000;

function writeJson(
  response: ServerResponse,
  statusCode: number,
  body: unknown,
  headers: Record<string, string> = {},
): void {
  response.writeHead(statusCode, { ...JSON_CONTENT_TYPE, ...headers });
  response.end(JSON.stringify(body));
}

function timingSafeMatches(value: string, expected: string): boolean {
  const valueHash = crypto.createHash("sha256").update(value).digest();
  const expectedHash = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(valueHash, expectedHash);
}

function isAuthorized(request: IncomingMessage, expectedPassword: string): boolean {
  const authorization = request.headers.authorization;
  if (!authorization) return false;

  const match = /^Basic\s+(.+)$/i.exec(authorization);
  if (!match) return false;

  let decoded: string;
  try {
    decoded = Buffer.from(match[1], "base64").toString("utf8");
  } catch {
    return false;
  }

  const delimiter = decoded.indexOf(":");
  if (delimiter === -1) return false;

  const password = decoded.slice(delimiter + 1);
  return timingSafeMatches(password, expectedPassword);
}

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;

  for await (const chunk of request) {
    const buffer = typeof chunk === "string" ? Buffer.from(chunk) : chunk;
    size += buffer.byteLength;

    if (size > MAX_BODY_BYTES) {
      throw new ValidationError("Request body is too large");
    }

    chunks.push(buffer);
  }

  if (chunks.length === 0) {
    throw new ValidationError("Request body is required");
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
  } catch {
    throw new ValidationError("Request body must be valid JSON");
  }
}

function isIngestBody(value: unknown): value is { youtubeUrl: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return (
    "youtubeUrl" in value &&
    typeof value.youtubeUrl === "string" &&
    value.youtubeUrl.trim().length > 0
  );
}

interface IngestServerDependencies {
  pipeline: Pipeline;
  mysqlService: MysqlService;
  basicPassword: string;
}

function createIngestServer({
  pipeline,
  mysqlService,
  basicPassword,
}: IngestServerDependencies): Server {
  return http.createServer(async (request, response) => {
    const url = new URL(request.url || "/", "http://localhost");

    if (url.pathname === "/health") {
      if (request.method !== "GET") {
        writeJson(response, 405, { error: "Method not allowed" }, { Allow: "GET" });
        return;
      }

      writeJson(response, 200, { status: "ok" });
      return;
    }

    if (url.pathname !== "/api/ingest") {
      writeJson(response, 404, { error: "Not found" });
      return;
    }

    if (request.method !== "POST") {
      writeJson(response, 405, { error: "Method not allowed" }, { Allow: "POST" });
      return;
    }

    if (!isAuthorized(request, basicPassword)) {
      writeJson(
        response,
        401,
        { error: "Unauthorized" },
        { "WWW-Authenticate": AUTH_HEADER },
      );
      return;
    }

    try {
      const body = await readJsonBody(request);
      if (!isIngestBody(body)) {
        writeJson(response, 400, {
          error: 'Invalid request body. Expected JSON: { "youtubeUrl": "https://..." }',
        });
        return;
      }

      const result = await pipeline.execute({ inputPath: body.youtubeUrl.trim() });
      const saved = await mysqlService.save(
        result.summary,
        result.youtubeUrl,
        result.transcript,
      );

      writeJson(response, 201, saved);
    } catch (error) {
      if (error instanceof ValidationError) {
        writeJson(response, 400, { error: error.message, code: error.code });
        return;
      }

      const code = error instanceof AppError ? error.code : undefined;
      consoleLogger.error(
        error instanceof Error ? error.stack || error.message : String(error),
      );
      writeJson(response, 500, { error: "Processing failed", code });
    }
  });
}

async function startServer(): Promise<void> {
  const validation = validateApiConfig();
  if (!validation.isValid) {
    throw new Error(
      `Missing required environment variables for ingest API: ${validation.missingKeys.join(", ")}`,
    );
  }

  const apiConfig = loadApiConfig();
  const appConfig = loadConfig();
  if (!appConfig.mysql) {
    throw new Error("MySQL configuration is required for ingest API startup");
  }

  const mysqlService = new MysqlService(appConfig.mysql);
  const pipeline = new Pipeline(appConfig, consoleLogger);
  const server = createIngestServer({
    pipeline,
    mysqlService,
    basicPassword: apiConfig.basicPassword,
  });

  const close = async (): Promise<void> => {
    server.close();
    await mysqlService.close();
  };

  process.once("SIGINT", () => {
    void close().finally(() => process.exit(0));
  });
  process.once("SIGTERM", () => {
    void close().finally(() => process.exit(0));
  });

  server.listen(apiConfig.port, () => {
    consoleLogger.info(`Ingest API listening on port ${apiConfig.port}`);
  });
}

startServer().catch((error) => {
  consoleLogger.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
