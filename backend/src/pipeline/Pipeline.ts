import { stat } from "fs/promises";
import type { AppConfig } from "../config/index.js";
import type {
  PipelineInput,
  PipelineOptions,
  PipelineResult,
} from "../types/index.js";
import {
  AudioService,
  TranscriptionService,
  SummarizationService,
  isVideoFile,
  isAudioFile,
  isSupportedFile,
} from "../services/index.js";
import { ValidationError } from "../errors/index.js";

export interface Logger {
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
}

export class Pipeline {
  private readonly audio: AudioService;
  private readonly transcription: TranscriptionService;
  private readonly summarization: SummarizationService;
  private readonly logger: Logger;
  private readonly maxFileSizeMB: number;

  constructor(config: AppConfig, logger: Logger) {
    this.audio = new AudioService(config.audio);
    this.transcription = new TranscriptionService({
      ...config.openai,
      ...config.whisper,
    });
    this.summarization = new SummarizationService(config.anthropic);
    this.logger = logger;
    this.maxFileSizeMB = config.audio.maxFileSizeMB;
  }

  async execute(
    input: PipelineInput,
    options: PipelineOptions,
  ): Promise<PipelineResult> {
    this.validate(input);
    const cleanup: string[] = [];

    try {
      // Step 1: Audio
      this.logger.info("Step 1: Processing audio...");
      const { audioPath, durationMinutes, needsCleanup } =
        await this.processAudio(input.inputPath);
      if (needsCleanup && !options.keepAudio) cleanup.push(audioPath);
      this.logger.info(`Duration: ${durationMinutes} minutes`);

      // Step 2: Transcribe
      this.logger.info("Step 2: Transcribing...");
      const transcript = await this.transcribe(audioPath, cleanup);
      this.logger.info(`Transcription: ${transcript.text.length} chars`);

      // Step 3: Summarize
      this.logger.info("Step 3: Summarizing...");
      const summary = await this.summarization.summarize(transcript.text);
      this.logger.info("Done!");

      return { transcript, summary };
    } finally {
      if (cleanup.length) await this.audio.cleanup(cleanup);
    }
  }

  private validate(input: PipelineInput): void {
    if (!input.inputPath) throw new ValidationError("Input file required");
    if (!isSupportedFile(input.inputPath))
      throw new ValidationError("Unsupported format");
  }

  private async processAudio(inputPath: string) {
    if (isVideoFile(inputPath)) {
      const r = await this.audio.extractAudio(inputPath);
      return {
        audioPath: r.outputPath,
        durationMinutes: Math.round(r.durationSeconds / 60),
        needsCleanup: true,
      };
    }
    if (isAudioFile(inputPath)) {
      const m = await this.audio.getMetadata(inputPath);
      return {
        audioPath: inputPath,
        durationMinutes: m.durationMinutes,
        needsCleanup: false,
      };
    }
    throw new ValidationError(`Unsupported: ${inputPath}`);
  }

  private async transcribe(audioPath: string, cleanup: string[]) {
    const { size } = await stat(audioPath);
    if (size / (1024 * 1024) > this.maxFileSizeMB) {
      this.logger.warn("Chunking large file...");
      const chunks = await this.audio.splitIntoChunks(audioPath);
      cleanup.push(...chunks);
      return this.transcription.transcribeChunks(chunks);
    }
    return this.transcription.transcribe(audioPath);
  }
}
