'use server';

/**
 * @fileOverview Analyzes student journal entries to detect emotional risk levels and generate supportive responses.
 *
 * - detectEmotionalRiskLevel - A function that analyzes journal entries and determines the emotional risk level.
 * - DetectEmotionalRiskLevelInput - The input type for the detectEmotionalRiskLevel function.
 * - DetectEmotionalRiskLevelOutput - The return type for the detectEmotionalRiskLevel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectEmotionalRiskLevelInputSchema = z.object({
  journalEntry: z.string().describe('The student’s journal entry.'),
});
export type DetectEmotionalRiskLevelInput = z.infer<typeof DetectEmotionalRiskLevelInputSchema>;

const DetectEmotionalRiskLevelOutputSchema = z.object({
  internalAnalysis: z.object({
    sentiment: z.string().describe('Overall sentiment of the journal entry (positive, neutral, negative).'),
    emotions: z.string().describe('Dominant emotions expressed in the journal entry (e.g., sadness, anxiety, stress).'),
    riskScore: z.number().describe('Wellness Risk Score from 0 to 100.'),
    riskLevel: z.string().describe('Risk level based on the risk score (Emotionally stable, Mild distress, High distress, Critical distress).'),
  }).describe('Internal analysis of the journal entry.'),
  studentResponse: z.string().describe('A supportive message written directly to the student.'),
  recommendAlert: z.boolean().describe('Whether a confidential, anonymized alert to a school counselor is recommended.'),
});
export type DetectEmotionalRiskLevelOutput = z.infer<typeof DetectEmotionalRiskLevelOutputSchema>;

export async function detectEmotionalRiskLevel(input: DetectEmotionalRiskLevelInput): Promise<DetectEmotionalRiskLevelOutput> {
  return detectEmotionalRiskLevelFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectEmotionalRiskLevelPrompt',
  input: {schema: DetectEmotionalRiskLevelInputSchema},
  output: {schema: DetectEmotionalRiskLevelOutputSchema},
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
});

const detectEmotionalRiskLevelFlow = ai.defineFlow(
  {
    name: 'detectEmotionalRiskLevelFlow',
    inputSchema: DetectEmotionalRiskLevelInputSchema,
    outputSchema: DetectEmotionalRiskLevelOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
