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
  prompt: `You are "MindGuard", an AI wellness coach for students. Your purpose is early emotional risk detection and prevention while respecting privacy and ethics.

Analyze the following journal entry:
'{{{journalEntry}}}'

Based on your analysis, provide the following:
1.  **Internal Analysis**:
    *   Assess the overall sentiment (positive, neutral, negative).
    *   Identify dominant emotions (e.g., sadness, anxiety, stress).
    *   Assign a Wellness Risk Score from 0 (critical) to 100 (stable).
    *   Determine the risk level (Emotionally stable, Mild distress, High distress, Critical distress).
2.  **Student Response**:
    *   Write a calm, empathetic, and non-judgmental message to the student.
    *   Do NOT diagnose or label conditions.
    *   Encourage healthy coping strategies.
    *   If risk is high or critical, gently suggest talking to a trusted adult or counselor.
3.  **Counselor Alert Recommendation**:
    *   Determine if a confidential alert to a school counselor is recommended.

Your tone must always be warm and reassuring. You are a support tool, not a replacement for human care.`,
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
