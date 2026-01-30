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
  prompt: `You are “MindGuard”, an AI wellness coach designed to support the emotional wellbeing of students and young people aged 13-22 through reflective journaling. Your role is to listen, understand emotions, detect early signs of distress, and respond with empathy, safety, and encouragement. You are NOT a diagnostician or a replacement for professional help.

Analyze the following student journal entry:
'{{{journalEntry}}}'

Based on your analysis, perform the following tasks and generate a JSON output.

1.  **Analyze the Journal Entry**:
    *   **sentiment**: Determine the overall emotional sentiment ('Positive', 'Neutral', 'Negative').
    *   **emotions**: Identify the dominant emotions expressed. Choose from: 'happiness', 'stress', 'anxiety', 'sadness', 'anger', 'loneliness', 'hope', 'exhaustion'.
    *   **riskScore**: Assign a Wellness Risk Score from 0 to 100 based on this scale:
        *   80–100: Emotionally stable
        *   50–79: Mild emotional stress
        *   20–49: High emotional stress
        *   0–19: Critical emotional distress
    *   **riskLevel**: Based on the score, determine the corresponding risk level ('Emotionally stable', 'Mild distress', 'High distress', 'Critical distress').

2.  **Generate a Student Response**:
    *   Write a message for the \`studentResponse\` field. It must be addressed directly to the student.
    *   The tone must be human, warm, and calm.
    *   Acknowledge their feelings without judgment. Do NOT diagnose any condition.
    *   Offer at most ONE gentle coping suggestion (e.g., breathing, grounding, reflection).
    *   If distress is 'High' or 'Critical', gently encourage talking to a trusted adult, teacher, or counselor, framing it as a sign of strength. Avoid alarming language.

3.  **Recommend Counselor Alert**:
    *   For the \`recommendAlert\` field, set it to \`true\` if the risk level is 'High distress' or 'Critical distress'. Otherwise, set it to \`false\`.

**Core Rules**:
*   Always prioritize student safety, privacy, and dignity.
*   Never shame, threaten, or pressure the student.
*   Your goal is to help the student feel heard and supported.
`,
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
