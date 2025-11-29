import { exec } from "child_process";
import { promisify } from "util";
import { stat, unlink } from "fs/promises";
import path from "path";
import type { AppConfig } from "../config/index.js";
import type { AudioExtractionResult, AudioMetadata } from "../types/index.js";
import { AudioExtractionError, wrapError } from "../errors/index.js";

const execAsync = promisify(exec);

export const VIDEO_EXTENSIONS = [".mp4", ".mkv", ".avi", ".mov", ".webm"];
export const AUDIO_EXTENSIONS = [".mp3", ".wav", ".m4a", ".ogg", ".flac"];

export const isVideoFile = (p: string) => VIDEO_EXTENSIONS.includes(path.extname(p).toLowerCase());
export const isAudioFile = (p: string) => AUDIO_EXTENSIONS.includes(path.extname(p).toLowerCase());
export const isSupportedFile = (p: string) => isVideoFile(p) || isAudioFile(p);

export class AudioService {
  constructor(private readonly config: AppConfig["audio"]) {}

  async extractAudio(inputPath: string, outputPath?: string): Promise<AudioExtractionResult> {
    try {
      const output = outputPath || this.getOutputPath(inputPath);
      const durationSeconds = await this.getDuration(inputPath);

      await execAsync(
        `ffmpeg -y -i "${inputPath}" -vn -acodec libmp3lame -b:a ${this.config.bitrate} -ac 1 -ar ${this.config.sampleRate} "${output}"`
      );

      const { size } = await stat(output);
      return { outputPath: output, durationSeconds, fileSizeMB: size / (1024 * 1024) };
    } catch (error) {
      throw wrapError(error, AudioExtractionError);
    }
  }

  async getMetadata(inputPath: string): Promise<AudioMetadata> {
    try {
      const durationSeconds = await this.getDuration(inputPath);
      const durationMinutes = Math.round(durationSeconds / 60);
      const estimatedSizeMB = (parseInt(this.config.bitrate) * durationSeconds) / 8 / 1024;

      return {
        path: inputPath,
        durationMinutes,
        requiresChunking: estimatedSizeMB > this.config.maxFileSizeMB,
      };
    } catch (error) {
      throw wrapError(error, AudioExtractionError);
    }
  }

  async splitIntoChunks(inputPath: string): Promise<string[]> {
    try {
      const duration = await this.getDuration(inputPath);
      const chunkSeconds = this.config.chunkDurationMinutes * 60;
      const numChunks = Math.ceil(duration / chunkSeconds);
      const chunks: string[] = [];

      for (let i = 0; i < numChunks; i++) {
        const chunkPath = this.getChunkPath(inputPath, i + 1);
        await execAsync(
          `ffmpeg -y -i "${inputPath}" -ss ${i * chunkSeconds} -t ${chunkSeconds} -acodec libmp3lame -b:a ${this.config.bitrate} -ac 1 -ar ${this.config.sampleRate} "${chunkPath}"`
        );
        chunks.push(chunkPath);
      }
      return chunks;
    } catch (error) {
      throw wrapError(error, AudioExtractionError);
    }
  }

  async cleanup(paths: string[]): Promise<void> {
    await Promise.all(paths.map((p) => unlink(p).catch(() => {})));
  }

  private async getDuration(inputPath: string): Promise<number> {
    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${inputPath}"`
    );
    return parseFloat(stdout.trim());
  }

  private getOutputPath(inputPath: string): string {
    const dir = path.dirname(inputPath);
    const name = path.basename(inputPath, path.extname(inputPath));
    return path.join(dir, `${name}.mp3`);
  }

  private getChunkPath(inputPath: string, index: number): string {
    const dir = path.dirname(inputPath);
    const name = path.basename(inputPath, path.extname(inputPath));
    return path.join(dir, `${name}_chunk_${index}.mp3`);
  }
}
