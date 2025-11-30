import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import os from "os";
import { wrapError, YouTubeDownloadError } from "../errors/index.js";

const execAsync = promisify(exec);

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

export class YouTubeService {
  async downloadAudio(url: string): Promise<YouTubeDownloadResult> {
    try {
      const tempDir = os.tmpdir();
      const outputTemplate = path.join(tempDir, `sermon_%(id)s.%(ext)s`);

      // Get video ID and duration first
      const { stdout: info } = await execAsync(
        `yt-dlp --print id --print duration "${url}"`,
      );
      const [videoId, durationStr] = info.trim().split("\n");
      const durationSeconds = parseFloat(durationStr);

      // Download audio only using yt-dlp
      await execAsync(
        `yt-dlp -x --audio-format mp3 --audio-quality 128K -o "${outputTemplate}" "${url}"`,
      );

      const audioPath = path.join(tempDir, `sermon_${videoId}.mp3`);

      return { audioPath, videoUrl: url, durationSeconds };
    } catch (error) {
      throw wrapError(error, YouTubeDownloadError);
    }
  }
}
