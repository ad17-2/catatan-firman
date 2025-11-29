export const SYSTEM_PROMPT = `You are an expert assistant specialized in summarizing sermons, religious talks, and spiritual teachings. You analyze transcripts and extract meaningful insights.

Guidelines:
- All output MUST be in English
- Maintain the spiritual tone and intent of the original message
- Be accurate - do not add information not present in the transcript
- Extract actual quotes verbatim when possible`;

export function buildUserPrompt(transcript: string): string {
  return `Analyze this sermon transcript and provide a structured summary.

<transcript>
${transcript}
</transcript>

Extract:
1. summary: 2-3 paragraph executive summary capturing the main theme, narrative arc, and key takeaway
2. keyPoints: 5-7 key points including core teachings, concepts, and illustrations used
3. bibleVerses: All Bible verses mentioned with brief context (or empty array if none)
4. quotes: 2-4 memorable quotes from the speaker (verbatim)
5. actionItems: 3-5 specific, actionable steps listeners can take
6. reflectionQuestions: 2-3 thought-provoking questions for reflection/discussion`;
}
