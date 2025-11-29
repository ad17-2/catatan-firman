import { Command } from "commander";
import type { CliArgs } from "../types/index.js";

const program = new Command();

program
  .name("sermon-summary")
  .description("Transcribe and summarize sermon videos/audio")
  .version("1.0.0")
  .requiredOption("-i, --input <file>", "Input video/audio file")
  .option("--keep-audio", "Keep extracted audio file", false)
  .option("--save", "Save summary to Supabase", false);

export function parseArgs(argv: string[]): CliArgs {
  program.parse(argv);
  const opts = program.opts();
  return { input: opts.input, keepAudio: opts.keepAudio, save: opts.save };
}
