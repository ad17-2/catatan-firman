import OpenAI from "openai";
import { z } from "zod";
import type { AppConfig } from "../config/index.js";
import type { SermonSummary } from "../types/index.js";
import { SummarizationError, wrapError } from "../errors/index.js";
import { SummarySchema } from "./schemas/summary.js";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompts/summarization.js";

export interface ISummarizationService {
  summarize(transcript: string): Promise<SermonSummary>;
}

export class SummarizationService implements ISummarizationService {
  private readonly client: OpenAI;
  private readonly model: string;
  private readonly maxOutputTokens: number = 8192;

  constructor(config: AppConfig["openai"]) {
    this.client = new OpenAI({ apiKey: config.apiKey });
    this.model = config.summaryModel;
  }

  async summarize(transcript: string): Promise<SermonSummary> {
    try {
      const schema = z.toJSONSchema(SummarySchema);

      const response = await this.client.responses.create({
        model: this.model,
        instructions: SYSTEM_PROMPT,
        input: buildUserPrompt(transcript),
        max_output_tokens: this.maxOutputTokens,
        text: {
          format: {
            type: "json_schema",
            name: "sermon_summary",
            schema,
            strict: true,
          },
        },
      });

      const parsed = SummarySchema.parse(JSON.parse(response.output_text));

      return {
        ...parsed,
        rawResponse: response.output_text,
      };
    } catch (error) {
      throw wrapError(error, SummarizationError);
    }
  }
}
