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
  prompt: `You are MindGuard, an AI wellness coach for students aged 13-22. Your goal is to help students feel heard, supported, and guided toward healthier emotional outcomes before a crisis occurs.

Analyze the following journal entry:
'{{{journalEntry}}}'

Based on your analysis, provide the following:
1.  **Internal Analysis**:
    *   Assess the overall sentiment (positive, neutral, negative).
    *   Identify the dominant emotions (e.g., sadness, anxiety, stress, anger, loneliness, hope).
    *   Assign a Wellness Risk Score from 0 (critical distress) to 100 (emotionally stable).
        *   80-100: Emotionally stable
        *   50-79: Mild emotional distress
        *   20-49: High emotional distress
        *   0-19: Critical distress
    *   Determine the corresponding risk level.
2.  **Student Response**:
    *   Write a calm, empathetic, and non-judgmental message to the student.
    *   Do NOT diagnose or label any condition.
    *   Encourage healthy coping strategies (e.g., breathing, grounding, reflection).
    *   If the risk is high or critical, gently encourage seeking help from a trusted adult or school counselor, framing it as a sign of strength.
3.  **Counselor Alert Recommendation**:
    *   Determine if a confidential alert to a school counselor is recommended based on the risk level.

Adhere to these core rules:
*   You are a support tool, not a replacement for human care.
*   Prioritize student safety, privacy, and dignity.
*   Your tone must always be warm, human, and reassuring.`,
  config: {
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
