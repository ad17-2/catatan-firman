import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import os from "os";
import { randomUUID } from "crypto";
import { unlink, writeFile } from "fs/promises";
import { wrapError, YouTubeDownloadError } from "../errors/index.js";

const execFileAsync = promisify(execFile);
const YTDLP_JS_RUNTIME = "node";

const YOUTUBE_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|m\.youtube\.com)\/.+/;

export function isYouTubeUrl(input: string): boolean {
  return YOUTUBE_REGEX.test(input);
}

export interface YouTubeDownloadResult {
  audioPath: string;
  videoUrl: string;
  durationSeconds: number;
}

interface YtDlpRuntimeOptions {
  args: string[];
  cookieFilePath?: string;
}

function readOptionalEnv(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value ? value : undefined;
}

async function createCookieFileFromBase64(cookiesBase64: string): Promise<string> {
  const cookieFilePath = path.join(os.tmpdir(), `ytdlp_cookies_${randomUUID()}.txt`);
  await writeFile(cookieFilePath, Buffer.from(cookiesBase64, "base64"), {
    flag: "wx",
    mode: 0o600,
  });
  return cookieFilePath;
}

async function createYtDlpRuntimeOptions(): Promise<YtDlpRuntimeOptions> {
  const args = ["--js-runtimes", YTDLP_JS_RUNTIME];
  const cookiesBase64 = readOptionalEnv("YTDLP_COOKIES_BASE64");
  const cookiesPath = readOptionalEnv("YTDLP_COOKIES_PATH");
  const proxy = readOptionalEnv("YTDLP_PROXY");
  let cookieFilePath: string | undefined;

  if (cookiesBase64) {
    // Prefer the Railway-friendly base64 secret when both cookie options are set.
    cookieFilePath = await createCookieFileFromBase64(cookiesBase64);
    args.push("--cookies", cookieFilePath);
  } else if (cookiesPath) {
    args.push("--cookies", cookiesPath);
  }

  if (proxy) {
    args.push("--proxy", proxy);
  }

  return { args, cookieFilePath };
}

async function cleanupCookieFile(cookieFilePath?: string): Promise<void> {
  if (!cookieFilePath) return;
  await unlink(cookieFilePath).catch(() => undefined);
}

async function runYtDlp(args: string[]): Promise<{ stdout: string }> {
  try {
    return await execFileAsync("yt-dlp", args);
  } catch (error) {
    const cause = error instanceof Error ? error : new Error(String(error));
    throw new YouTubeDownloadError("yt-dlp command failed", cause);
  }
}

export class YouTubeService {
  async downloadAudio(url: string): Promise<YouTubeDownloadResult> {
    const runtimeOptions = await createYtDlpRuntimeOptions();

    try {
      const tempDir = os.tmpdir();
      const outputTemplate = path.join(tempDir, `sermon_%(id)s.%(ext)s`);

      const { stdout: info } = await runYtDlp([
        ...runtimeOptions.args,
        "--print", "id",
        "--print", "duration",
        url,
      ]);
      const [videoId, durationStr] = info.trim().split("\n");
      const durationSeconds = parseFloat(durationStr);

      await runYtDlp([
        ...runtimeOptions.args,
        "-x",
        "--audio-format", "mp3",
        "--audio-quality", "128K",
        "-o", outputTemplate,
        url,
      ]);

      const audioPath = path.join(tempDir, `sermon_${videoId}.mp3`);

      return { audioPath, videoUrl: url, durationSeconds };
    } catch (error) {
      throw wrapError(error, YouTubeDownloadError);
    } finally {
      await cleanupCookieFile(runtimeOptions.cookieFilePath);
    }
  }
}
