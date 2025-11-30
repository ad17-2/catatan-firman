import type { BilingualSummaryOutput } from "../services/schemas/summary.js";

export type BilingualSummary = BilingualSummaryOutput & { rawResponse: string };

export interface TranscriptionResult {
  text: string;
  segments: { start: number; end: number; text: string }[];
  language: string;
  durationSeconds: number;
}

export interface PipelineInput {
  inputPath: string;
}

export interface PipelineResult {
  transcript: TranscriptionResult;
  summary: BilingualSummary;
  youtubeUrl: string;
}

export interface CliArgs {
  input: string;
  save: boolean;
}
