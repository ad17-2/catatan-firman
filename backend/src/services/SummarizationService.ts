import Anthropic from "@anthropic-ai/sdk";
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
  private readonly client: Anthropic;
  private readonly model: string;
  private readonly maxTokens: number = 8192;

  constructor(config: AppConfig["anthropic"]) {
    this.client = new Anthropic({ apiKey: config.apiKey });
    this.model = config.model;
  }

  async summarize(transcript: string): Promise<SermonSummary> {
    try {
      const schema = z.toJSONSchema(SummarySchema);

      const response = await this.client.messages.create(
        {
          model: this.model,
          max_tokens: this.maxTokens,
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: "user",
              content: buildUserPrompt(transcript),
            },
          ],
        },
        {
          headers: { "anthropic-beta": "structured-outputs-2025-11-13" },
          body: { output_format: { type: "json_schema", schema } },
        },
      );

      const textBlock = response.content.find(
        (block) => block.type === "text",
      );
      const text = textBlock && "text" in textBlock ? textBlock.text : "";
      const parsed = SummarySchema.parse(JSON.parse(text));

      return {
        ...parsed,
        rawResponse: text,
      };
    } catch (error) {
      throw wrapError(error, SummarizationError);
    }
  }
}
