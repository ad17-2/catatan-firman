import Anthropic from "@anthropic-ai/sdk";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { AppConfig } from "../config/index.js";
import type { SermonSummary } from "../types/index.js";
import { SummarizationError, wrapError } from "../errors/index.js";
import { SermonSummarySchema } from "./schemas/summary.js";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompts/summarization.js";

export interface ISummarizationService {
  summarize(transcript: string): Promise<SermonSummary>;
}

export class SummarizationService implements ISummarizationService {
  private readonly client: Anthropic;
  private readonly model: string;
  private readonly maxTokens: number = 4096;

  constructor(config: AppConfig["anthropic"]) {
    this.client = new Anthropic({ apiKey: config.apiKey });
    this.model = config.model;
  }

  /**
   * Generate summary from transcript using structured outputs
   */
  async summarize(transcript: string): Promise<SermonSummary> {
    try {
      const jsonSchema = zodToJsonSchema(SermonSummarySchema, "SermonSummary");
      const schema = jsonSchema.definitions?.SermonSummary || jsonSchema;

      // Using beta API with structured outputs
      // Type assertion needed as SDK types may lag behind API
      const response = await (this.client.beta.messages.create as Function)({
        model: this.model,
        max_tokens: this.maxTokens,
        system: SYSTEM_PROMPT,
        betas: ["structured-outputs-2025-11-13"],
        messages: [
          {
            role: "user",
            content: buildUserPrompt(transcript),
          },
        ],
        output_format: {
          type: "json_schema",
          schema,
        },
      });

      const textBlock = response.content?.find(
        (block: { type: string }) => block.type === "text"
      );
      const text = textBlock?.text || "";
      const parsed = SermonSummarySchema.parse(JSON.parse(text));

      return {
        ...parsed,
        rawResponse: text,
      };
    } catch (error) {
      throw wrapError(error, SummarizationError);
    }
  }
}
