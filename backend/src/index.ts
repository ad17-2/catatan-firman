import "dotenv/config";
import { loadConfig, validateConfig, validateSupabaseConfig } from "./config/index.js";
import { Pipeline } from "./pipeline/index.js";
import { SupabaseService } from "./services/SupabaseService.js";
import { parseArgs, printHeader, printSummary, printError, consoleLogger } from "./cli/index.js";
import { AppError } from "./errors/index.js";

async function main(): Promise<void> {
  const args = parseArgs(process.argv);

  const validation = validateConfig();
  if (!validation.isValid) {
    validation.missingKeys.forEach((k) => printError(`${k} is not set`));
    process.exit(1);
  }

  if (args.save) {
    const supabaseValidation = validateSupabaseConfig();
    if (!supabaseValidation.isValid) {
      printError("SUPABASE_URL and SUPABASE_ANON_KEY are required when using --save");
      process.exit(1);
    }
  }

  printHeader(args.input, args.title);

  try {
    const config = loadConfig();
    const pipeline = new Pipeline(config, consoleLogger);
    const result = await pipeline.execute(
      { inputPath: args.input, title: args.title },
      { keepAudio: args.keepAudio }
    );

    printSummary(result.summary);

    if (args.save && config.supabase) {
      consoleLogger.info("\nSaving to Supabase...");
      const supabase = new SupabaseService(config.supabase.url, config.supabase.anonKey);
      const saved = await supabase.save(args.title, result.summary);
      consoleLogger.info(`Saved with ID: ${saved.id}`);
    }
  } catch (error) {
    printError(error instanceof AppError ? `[${error.code}] ${error.message}` : String(error));
    process.exit(1);
  }
}

main();
