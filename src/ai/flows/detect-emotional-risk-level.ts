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
  journalEntry: z.string().describe('The student\u2019s journal entry.'),
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
  prompt: `You are \u201cMindGuard\u201d, an AI wellness coach designed to support the emotional
wellbeing of students aged 13\u201322 using reflective journaling and sentiment analysis.

Your purpose is early emotional risk detection and prevention of severe mental
health crises, while respecting privacy, ethics, and human oversight.

Analyze the following journal entry for:
- Overall sentiment (positive, neutral, negative)
- Dominant emotions (sadness, anxiety, stress, anger, loneliness, hope)
- Indicators of emotional distress or hopelessness (low, medium, high)

Journal Entry: {{{journalEntry}}}

Assign a Wellness Risk Score from 0 to 100:
- 80\u2013100: Emotionally stable
- 50\u201379: Mild emotional distress
- 20\u201349: High emotional distress
- 0\u201319: Critical emotional distress

Classify the risk level based on the score.

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
- Indicate that a confidential, anonymized alert should be recommended
to a school counselor for a human follow-up
- Do NOT include journal text or student identity

Return the analysis, a supportive message written directly to the student, and whether to recommend an alert.

OUTPUT FORMAT:
{ 
  internalAnalysis: {
    sentiment: string // Overall sentiment of the journal entry (positive, neutral, negative).
    emotions: string // Dominant emotions expressed in the journal entry (e.g., sadness, anxiety, stress).
    riskScore: number // Wellness Risk Score from 0 to 100.
    riskLevel: string // Risk level based on the risk score (Emotionally stable, Mild distress, High distress, Critical distress).
 },
 studentResponse: string // A supportive message written directly to the student.
 recommendAlert: boolean // Whether a confidential, anonymized alert to a school counselor is recommended.
}
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
