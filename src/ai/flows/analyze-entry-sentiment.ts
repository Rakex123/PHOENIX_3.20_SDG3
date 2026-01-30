'use server';

/**
 * @fileOverview A sentiment analysis AI agent for diary entries.
 *
 * - analyzeEntrySentiment - A function that handles the sentiment analysis process.
 * - AnalyzeEntrySentimentInput - The input type for the analyzeEntrySentiment function.
 * - AnalyzeEntrySentimentOutput - The return type for the analyzeEntrySentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeEntrySentimentInputSchema = z.object({
  diaryEntry: z.string().describe('The diary entry to analyze.'),
});
export type AnalyzeEntrySentimentInput = z.infer<typeof AnalyzeEntrySentimentInputSchema>;

const AnalyzeEntrySentimentOutputSchema = z.object({
  sentimentScore: z
    .number()
    .describe(
      'The sentiment score of the diary entry, ranging from -1 (very negative) to 1 (very positive).'
    ),
  sentimentLabel: z
    .string()
    .describe('A label describing the sentiment of the diary entry (e.g., Positive, Negative, Neutral, Mixed).'),
});
export type AnalyzeEntrySentimentOutput = z.infer<typeof AnalyzeEntrySentimentOutputSchema>;

export async function analyzeEntrySentiment(
  input: AnalyzeEntrySentimentInput
): Promise<AnalyzeEntrySentimentOutput> {
  return analyzeEntrySentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeEntrySentimentPrompt',
  input: {schema: AnalyzeEntrySentimentInputSchema},
  output: {schema: AnalyzeEntrySentimentOutputSchema},
  prompt: `You are a sentiment analysis expert. Analyze the sentiment of the following diary entry.
The sentiment score should be a number between -1.0 (very negative) and 1.0 (very positive).
The sentiment label should be one of: "Positive", "Negative", "Neutral", "Mixed".

Diary Entry:
"{{{diaryEntry}}}"

Provide your analysis in a JSON object with 'sentimentScore' and 'sentimentLabel' fields.
`,
});

const analyzeEntrySentimentFlow = ai.defineFlow(
  {
    name: 'analyzeEntrySentimentFlow',
    inputSchema: AnalyzeEntrySentimentInputSchema,
    outputSchema: AnalyzeEntrySentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
