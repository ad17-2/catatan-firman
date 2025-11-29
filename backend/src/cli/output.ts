import type { Logger } from "../pipeline/index.js";
import type { SermonSummary } from "../types/index.js";

const SEP = "=".repeat(50);

export function printHeader(input: string, title: string): void {
  console.log(SEP);
  console.log("Sermon Summary Pipeline");
  console.log(SEP);
  console.log(`Input: ${input}`);
  console.log(`Title: ${title}\n`);
}

export function printSummary(summary: SermonSummary): void {
  console.log(`\n${SEP}`);
  console.log("SUMMARY");
  console.log(`${SEP}\n`);

  console.log("## Summary\n");
  console.log(summary.summary + "\n");

  console.log("## Key Points\n");
  summary.keyPoints.forEach((p) => console.log(`- ${p}`));

  console.log("\n## Bible Verses\n");
  if (summary.bibleVerses.length) {
    summary.bibleVerses.forEach((v) => console.log(`- ${v}`));
  } else {
    console.log("No verses mentioned");
  }

  console.log("\n## Quotes\n");
  summary.quotes.forEach((q) => console.log(`> ${q}\n`));

  console.log("## Action Items\n");
  summary.actionItems.forEach((a, i) => console.log(`${i + 1}. ${a}`));

  console.log("\n## Reflection Questions\n");
  summary.reflectionQuestions.forEach((q, i) => console.log(`${i + 1}. ${q}`));

  console.log(`\n${SEP}`);
  console.log("Done!");
  console.log(SEP);
}

export function printError(message: string): void {
  console.error(`Error: ${message}`);
}

export const consoleLogger: Logger = {
  info: (msg: string) => console.log(msg),
  warn: (msg: string) => console.warn(`Warning: ${msg}`),
  error: (msg: string) => console.error(`Error: ${msg}`),
};
