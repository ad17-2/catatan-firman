import { z } from "zod";

export const SummarySchema = z.object({
  title: z.string().describe("Short, descriptive title for the sermon"),
  summary: z.string().describe("2-3 paragraph executive summary"),
  keyPoints: z.array(z.string()).describe("5-7 key points as bullet items"),
  bibleVerses: z
    .array(z.string())
    .describe("Bible verses mentioned with context, empty array if none"),
  quotes: z
    .array(z.string())
    .describe("2-4 notable quotes from the speaker verbatim"),
  actionItems: z.array(z.string()).describe("3-5 specific, actionable steps"),
  reflectionQuestions: z.array(z.string()).describe("2-3 reflection questions"),
});

export type SummaryOutput = z.infer<typeof SummarySchema>;
