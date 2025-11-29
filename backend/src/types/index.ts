import type { SermonSummaryOutput } from "../services/schemas/summary.js";

export type SermonSummary = SermonSummaryOutput & { rawResponse: string };

export interface AudioExtractionResult {
  outputPath: string;
  durationSeconds: number;
  fileSizeMB: number;
}

export interface AudioMetadata {
  path: string;
  durationMinutes: number;
  requiresChunking: boolean;
}

export interface TranscriptionResult {
  text: string;
  segments: { start: number; end: number; text: string }[];
  language: string;
  durationSeconds: number;
}

export interface PipelineInput {
  inputPath: string;
  title: string;
}

export interface PipelineOptions {
  keepAudio: boolean;
}

export interface PipelineResult {
  transcript: TranscriptionResult;
  summary: SermonSummary;
}

export interface CliArgs {
  input: string;
  title: string;
  keepAudio: boolean;
  save: boolean;
}
