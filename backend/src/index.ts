import "dotenv/config";
import {
  loadConfig,
  validateConfig,
  validateMysqlConfig,
} from "./config/index.js";
import { Pipeline } from "./pipeline/index.js";
import { MysqlService } from "./services/MysqlService.js";
import {
  parseArgs,
  printHeader,
  printSummary,
  printError,
  consoleLogger,
} from "./cli/index.js";
import { AppError } from "./errors/index.js";

async function main(): Promise<void> {
  const args = parseArgs(process.argv);

  const validation = validateConfig();
  if (!validation.isValid) {
    validation.missingKeys.forEach((k) => printError(`${k} is not set`));
    process.exit(1);
  }

  if (args.save) {
    const mysqlValidation = validateMysqlConfig();
    if (!mysqlValidation.isValid) {
      printError(
        "MYSQL_HOST and MYSQL_DATABASE are required when using --save",
      );
      process.exit(1);
    }
  }

  printHeader(args.input);

  let mysqlService: MysqlService | null = null;
  try {
    const config = loadConfig();
    const pipeline = new Pipeline(config, consoleLogger);
    const result = await pipeline.execute({ inputPath: args.input });

    printSummary(result.summary);

    if (args.save && config.mysql) {
      consoleLogger.info("\nSaving to MySQL...");
      mysqlService = new MysqlService(config.mysql);
      const saved = await mysqlService.save(result.summary, result.youtubeUrl);
      consoleLogger.info(`Saved with ID: ${saved.id} (${saved.title})`);
    }
  } catch (error) {
    printError(
      error instanceof AppError
        ? `[${error.code}] ${error.message}`
        : String(error),
    );
    process.exit(1);
  } finally {
    await mysqlService?.close();
  }
}

main();
