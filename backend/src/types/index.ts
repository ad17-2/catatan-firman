import type { BilingualSummaryOutput } from "../services/schemas/summary.js";

export type BilingualSummary = BilingualSummaryOutput & { rawResponse: string };

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
}

export interface PipelineOptions {
  keepAudio: boolean;
}

export interface PipelineResult {
  transcript: TranscriptionResult;
  summary: BilingualSummary;
}

export interface CliArgs {
  input: string;
  keepAudio: boolean;
  save: boolean;
}
