import OpenAI from "openai";
import fs from "fs";
import type { AppConfig } from "../config/index.js";
import type { TranscriptionResult } from "../types/index.js";
import { TranscriptionError, wrapError } from "../errors/index.js";

export class TranscriptionService {
  private readonly client: OpenAI;
  private readonly model: string;
  private readonly language: string;

  constructor(config: AppConfig["openai"] & AppConfig["whisper"]) {
    this.client = new OpenAI({ apiKey: config.apiKey });
    this.model = config.model;
    this.language = config.language;
  }

  async transcribe(audioPath: string): Promise<TranscriptionResult> {
    try {
      const response = await this.client.audio.transcriptions.create({
        file: fs.createReadStream(audioPath),
        model: this.model,
        language: this.language,
        response_format: "verbose_json",
      });

      return this.mapResponse(response);
    } catch (error) {
      throw wrapError(error, TranscriptionError);
    }
  }

  async transcribeChunks(chunkPaths: string[]): Promise<TranscriptionResult> {
    try {
      const results: TranscriptionResult[] = [];
      let offset = 0;

      for (const path of chunkPaths) {
        const result = await this.transcribe(path);
        result.segments = result.segments.map((s) => ({
          ...s,
          start: s.start + offset,
          end: s.end + offset,
        }));
        offset += result.durationSeconds;
        results.push(result);
      }

      return {
        text: results.map((r) => r.text).join(" "),
        segments: results.flatMap((r) => r.segments),
        language: results[0]?.language || this.language,
        durationSeconds: offset,
      };
    } catch (error) {
      throw wrapError(error, TranscriptionError);
    }
  }

  private mapResponse(res: OpenAI.Audio.Transcription): TranscriptionResult {
    const verbose = res as OpenAI.Audio.Transcription & {
      segments?: { start: number; end: number; text: string }[];
      language: string;
      duration: number;
    };

    return {
      text: verbose.text,
      segments: verbose.segments || [],
      language: verbose.language || this.language,
      durationSeconds: verbose.duration || 0,
    };
  }
}
