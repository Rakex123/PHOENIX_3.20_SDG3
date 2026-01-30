'use server';
/**
 * @fileOverview An AI chat flow that tailors responses based on the user's age and questions.
 *
 * - ageAppropriateAIChat - A function that handles the AI chat process.
 * - AgeAppropriateAIChatInput - The input type for the ageAppropriateAIChat function.
 * - AgeAppropriateAIChatOutput - The return type for the ageAppropriateAIChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AgeAppropriateAIChatInputSchema = z.object({
  age: z.number().describe('The age of the user.'),
  question: z.string().describe('The question asked by the user.'),
});
export type AgeAppropriateAIChatInput = z.infer<typeof AgeAppropriateAIChatInputSchema>;

const AgeAppropriateAIChatOutputSchema = z.object({
  response: z.string().describe('The age-appropriate response from the AI.'),
});
export type AgeAppropriateAIChatOutput = z.infer<typeof AgeAppropriateAIChatOutputSchema>;

export async function ageAppropriateAIChat(input: AgeAppropriateAIChatInput): Promise<AgeAppropriateAIChatOutput> {
  return ageAppropriateAIChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ageAppropriateAIChatPrompt',
  input: {schema: AgeAppropriateAIChatInputSchema},
  output: {schema: AgeAppropriateAIChatOutputSchema},
  prompt: `You are an expert in child development and an AI assistant who is fantastic at explaining things to people of all ages. Your goal is to answer the user's question in a way that is safe, engaging, and perfectly tailored to their developmental stage.

User's Age: {{{age}}}
User's Question: {{{question}}}

Follow these rules when crafting your response:
- If the age is between 3 and 7: Use very simple words, short sentences, and relatable analogies (like talking about animals or toys). Keep the response short and positive.
- If the age is between 8 and 12: You can use more complex sentences and introduce more accurate terminology, but still explain things clearly. Use examples they might encounter in school or with friends.
- If the age is between 13 and 18: Speak to them like an intelligent young adult. You can use more nuanced language and explore more complex aspects of their question. Don't be condescending.
- For any age, if the question touches on sensitive topics (like violence, death, etc.), handle it with extreme care. Prioritize a feeling of safety and reassurance. If the topic is too complex or inappropriate, gently suggest they talk to a trusted adult, like a parent or teacher.
- Be encouraging and friendly in your tone.
- Directly answer the question.

Provide your response as a JSON object with a single key "response" containing your answer.
  `,
});

const ageAppropriateAIChatFlow = ai.defineFlow(
  {
    name: 'ageAppropriateAIChatFlow',
    inputSchema: AgeAppropriateAIChatInputSchema,
    outputSchema: AgeAppropriateAIChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
