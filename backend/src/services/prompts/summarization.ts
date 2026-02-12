export const SYSTEM_PROMPT = `You are an expert assistant specialized in summarizing sermons, religious talks, and spiritual teachings. You analyze transcripts and extract meaningful insights.

Guidelines:
- Provide ALL output in Indonesian (Bahasa Indonesia)
- Maintain the spiritual tone and intent of the original message
- Be accurate - do not add information not present in the transcript
- Extract actual quotes verbatim when possible
- Generate appropriate titles based on the sermon content`;

export function buildUserPrompt(transcript: string): string {
  return `Analyze this sermon transcript and provide a structured summary in Indonesian (Bahasa Indonesia).

<transcript>
${transcript}
</transcript>

Return a JSON object containing:
1. title: A short, descriptive title for the sermon in Indonesian (3-8 words)
2. summary: 2-3 paragraph executive summary in Indonesian capturing the main theme, narrative arc, and key takeaway
3. keyPoints: 5-7 key points in Indonesian including core teachings, concepts, and illustrations used
4. bibleVerses: All Bible verses mentioned with brief context in Indonesian (or empty array if none)
5. quotes: 2-4 memorable quotes from the speaker (verbatim, keep in original language)
6. actionItems: 3-5 specific, actionable steps in Indonesian listeners can take
7. reflectionQuestions: 2-3 thought-provoking questions in Indonesian for reflection/discussion`;
}
