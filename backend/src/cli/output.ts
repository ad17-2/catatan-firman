import type { Logger } from "../pipeline/index.js";
import type { SermonSummary } from "../types/index.js";

const SEP = "=".repeat(50);

export function printHeader(input: string): void {
  console.log(SEP);
  console.log("Catatan Firman");
  console.log(SEP);
  console.log(`Input: ${input}\n`);
}

export function printSummary(summary: SermonSummary): void {
  console.log(`\n${SEP}`);
  console.log(`# ${summary.title}\n`);

  console.log("## Ringkasan\n");
  console.log(summary.summary + "\n");

  console.log("## Poin-Poin Utama\n");
  summary.keyPoints.forEach((p) => console.log(`- ${p}`));

  console.log("\n## Ayat Alkitab\n");
  if (summary.bibleVerses.length) {
    summary.bibleVerses.forEach((v) => console.log(`- ${v}`));
  } else {
    console.log("Tidak ada ayat yang disebutkan");
  }

  console.log("\n## Kutipan\n");
  summary.quotes.forEach((q) => console.log(`> ${q}\n`));

  console.log("## Langkah Tindakan\n");
  summary.actionItems.forEach((a, i) => console.log(`${i + 1}. ${a}`));

  console.log("\n## Pertanyaan Refleksi\n");
  summary.reflectionQuestions.forEach((q, i) => console.log(`${i + 1}. ${q}`));

  console.log(`\n${SEP}`);
  console.log("Selesai!");
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
