import type { AppConfig } from "../config/index.js";
import type { PipelineInput, PipelineResult } from "../types/index.js";
import {
  cleanup,
  TranscriptionService,
  SummarizationService,
  YouTubeService,
  isYouTubeUrl,
} from "../services/index.js";
import { ValidationError } from "../errors/index.js";

export interface Logger {
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
}

export class Pipeline {
  private readonly transcription: TranscriptionService;
  private readonly summarization: SummarizationService;
  private readonly youtube: YouTubeService;
  private readonly logger: Logger;

  constructor(config: AppConfig, logger: Logger) {
    this.transcription = new TranscriptionService({
      ...config.openai,
      ...config.whisper,
    });
    this.summarization = new SummarizationService(config.anthropic);
    this.youtube = new YouTubeService();
    this.logger = logger;
  }

  async execute(input: PipelineInput): Promise<PipelineResult> {
    if (!isYouTubeUrl(input.inputPath)) {
      throw new ValidationError("Input must be a YouTube URL");
    }

    const cleanupPaths: string[] = [];

    try {
      // Step 1: Download from YouTube
      this.logger.info("Step 1: Downloading from YouTube...");
      const { audioPath, videoUrl, durationSeconds } =
        await this.youtube.downloadAudio(input.inputPath);
      cleanupPaths.push(audioPath);
      this.logger.info(`Duration: ${Math.round(durationSeconds / 60)} minutes`);

      // Step 2: Transcribe
      this.logger.info("Step 2: Transcribing...");
      const transcript = await this.transcription.transcribe(audioPath);
      this.logger.info(`Transcription: ${transcript.text.length} chars`);

      // Step 3: Summarize
      this.logger.info("Step 3: Summarizing...");
      const summary = await this.summarization.summarize(transcript.text);
      this.logger.info("Done!");

      return { transcript, summary, youtubeUrl: videoUrl };
    } finally {
      await cleanup(cleanupPaths);
    }
  }
}
