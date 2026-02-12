import type { SummaryOutput } from "../services/schemas/summary.js";

export type SermonSummary = SummaryOutput & { rawResponse: string };

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
  summary: SermonSummary;
  youtubeUrl: string;
}

export interface CliArgs {
  input: string;
  save: boolean;
}
