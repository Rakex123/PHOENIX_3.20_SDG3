'use server';
/**
 * @fileOverview An AI flow to detect emotion from a person's face in an image.
 *
 * - detectEmotionFromFace - A function that handles the emotion detection process.
 * - DetectEmotionFromFaceInput - The input type for the detectEmotionFromFace function.
 * - DetectEmotionFromFaceOutput - The return type for the detectEmotionFromFace function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectEmotionFromFaceInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectEmotionFromFaceInput = z.infer<typeof DetectEmotionFromFaceInputSchema>;

const DetectEmotionFromFaceOutputSchema = z.object({
  emotion: z.string().describe('The detected emotion of the person in the photo (e.g., Happy, Sad, Surprised, Angry, Neutral).'),
});
export type DetectEmotionFromFaceOutput = z.infer<typeof DetectEmotionFromFaceOutputSchema>;

export async function detectEmotionFromFace(input: DetectEmotionFromFaceInput): Promise<DetectEmotionFromFaceOutput> {
  return detectEmotionFromFaceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectEmotionFromFacePrompt',
  input: {schema: DetectEmotionFromFaceInputSchema},
  output: {schema: DetectEmotionFromFaceOutputSchema},
  prompt: `You are an expert in analyzing human emotions from facial expressions. Analyze the provided image and determine the primary emotion being displayed.
  
  Possible emotions include: Happy, Sad, Surprised, Angry, Neutral, Fearful, Disgusted. Respond with only one of these emotions.

  Image: {{media url=photoDataUri}}`,
});

const detectEmotionFromFaceFlow = ai.defineFlow(
  {
    name: 'detectEmotionFromFaceFlow',
    inputSchema: DetectEmotionFromFaceInputSchema,
    outputSchema: DetectEmotionFromFaceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
