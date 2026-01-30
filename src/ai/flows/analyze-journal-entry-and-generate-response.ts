'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing a student's journal entry,
 * assessing emotional risk, and generating a supportive response.
 *
 * - analyzeJournalEntryAndGenerateResponse - The main function to analyze journal entries and generate responses.
 * - AnalyzeJournalEntryInput - The input type for the analyzeJournalEntryAndGenerateResponse function.
 * - AnalyzeJournalEntryOutput - The output type for the analyzeJournalEntryAndGenerateResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeJournalEntryInputSchema = z.object({
  journalEntry: z
    .string()
    .describe('The journal entry text submitted by the student.'),
});
export type AnalyzeJournalEntryInput = z.infer<typeof AnalyzeJournalEntryInputSchema>;

const AnalyzeJournalEntryOutputSchema = z.object({
  internalAnalysis: z.object({
    sentiment: z
      .string()
      .describe('Overall sentiment of the journal entry (positive, neutral, negative).'),
    emotions: z.string().describe('Dominant emotions expressed in the journal entry.'),
    riskScore: z.number().describe('Wellness Risk Score from 0 to 100.'),
    riskLevel: z.string().describe('Risk level based on the risk score (Emotionally stable, Mild distress, High distress, Critical distress).'),
  }).describe('Hidden internal analysis of the journal entry.'),
  studentResponse: z
    .string()
    .describe('A supportive message written directly to the student.'),
  recommendAlert: z.boolean().describe('Whether a confidential alert to a school counselor is recommended'),
});
export type AnalyzeJournalEntryOutput = z.infer<typeof AnalyzeJournalEntryOutputSchema>;

export async function analyzeJournalEntryAndGenerateResponse(
  input: AnalyzeJournalEntryInput
): Promise<AnalyzeJournalEntryOutput> {
  return analyzeJournalEntryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeJournalEntryPrompt',
  input: {schema: AnalyzeJournalEntryInputSchema},
  output: {schema: AnalyzeJournalEntryOutputSchema},
  prompt: `You are MindGuard, an AI wellness coach for students aged 13-22. Analyze the following journal entry and generate a supportive response.

Journal Entry: {{{journalEntry}}}

Analyze the journal entry for:
- Overall sentiment (positive, neutral, negative)
- Dominant emotions (sadness, anxiety, stress, anger, loneliness, hope)
- Indicators of emotional distress or hopelessness (low, medium, high)

Assign a Wellness Risk Score from 0 to 100:
- 80-100: Emotionally stable
- 50-79: Mild emotional distress
- 20-49: High emotional distress
- 0-19: Critical emotional distress

Internally classify the risk level based on the score.

Generate a response to the student that:
- Is calm, empathetic, and non-judgmental
- Does NOT diagnose or label any condition
- Does NOT validate harmful thoughts or behaviors
- Encourages healthy coping strategies (breathing, grounding, reflection)
- Uses age-appropriate, supportive language
- Avoids alarmist or emergency tone unless risk is critical

If risk is high or critical:
- Gently encourage reaching out to a trusted adult or school counselor
- Emphasize that seeking help is a strength
- Do NOT present yourself as the only support

If risk is critical and persistent:
- Indicate that a confidential, anonymized alert should be recommended to a school counselor for a human follow-up
- Do NOT include journal text or student identity

Output the analysis in JSON format, including:
- internalAnalysis: { sentiment, emotions, riskScore, riskLevel }
- studentResponse: A supportive message written directly to the student
- recommendAlert: A boolean value indicating whether to recommend an alert to a counselor.

Ensure the response adheres to these core rules:
- You are a support tool, not a replacement for human care.
- You prioritize prevention, safety, dignity, and privacy.
- You respect student autonomy and confidentiality.
- Your tone must always be warm, human, and reassuring.

Remember, your goal is to help students feel heard, supported, and guided toward healthier emotional outcomes before a crisis occurs.

Output:`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const analyzeJournalEntryFlow = ai.defineFlow(
  {
    name: 'analyzeJournalEntryFlow',
    inputSchema: AnalyzeJournalEntryInputSchema,
    outputSchema: AnalyzeJournalEntryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
