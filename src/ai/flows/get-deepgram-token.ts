'use server';
/**
 * @fileOverview A flow to generate a temporary Deepgram API key.
 *
 * - getDeepgramToken - A function that returns a temporary API key for Deepgram.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {DeepgramError, createClient} from '@deepgram/sdk';

if (!process.env.DEEPGRAM_API_KEY) {
  console.warn(
    'DEEPGRAM_API_KEY is not set. Speech-to-text will not be available.'
  );
}

const GetDeepgramTokenOutputSchema = z.object({
  key: z.string().describe('A temporary Deepgram API key.'),
  error: z.string().optional().describe('An error message if key creation failed.'),
});
export type GetDeepgramTokenOutput = z.infer<typeof GetDeepgramTokenOutputSchema>;

export async function getDeepgramToken(): Promise<GetDeepgramTokenOutput> {
  return getDeepgramTokenFlow();
}

const getDeepgramTokenFlow = ai.defineFlow(
  {
    name: 'getDeepgramTokenFlow',
    inputSchema: z.void(),
    outputSchema: GetDeepgramTokenOutputSchema,
  },
  async () => {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      return { key: '', error: 'Deepgram API key not configured on the server.' };
    }

    try {
      const deepgram = createClient(apiKey);
      
      if (!deepgram.manage?.projects) {
        throw new Error("Your Deepgram API key does not have project management permissions. Please create a new key in your Deepgram console with 'Admin' or 'Owner' permissions.");
      }

      const { result: projectsResult, error: projectsError } = await deepgram.manage.projects.list();

      if (projectsError) {
        console.error('Deepgram list projects error:', projectsError);
        throw new Error('Could not list Deepgram projects.');
      }
      
      const project = projectsResult?.projects[0];
      
      if (!project) {
        throw new Error("No Deepgram projects found for this API key.");
      }

      const { result: keyResult, error: keyError } = await deepgram.manage.projects.createKey(
        project.project_id,
        {
          comment: 'Temporary key for browser',
          scopes: ['member'],
          timeToLiveInSeconds: 60 * 5, // Key is valid for 5 minutes
        }
      );

      if (keyError) {
        throw keyError;
      }
      if (!keyResult) {
        throw new Error('No key was generated');
      }
      return { key: keyResult.key };
    } catch (e: any) {
      console.error('Failed to create Deepgram key:', e);
      const message = e instanceof DeepgramError ? e.message : (e.message || 'Could not create temporary API key.');
      return { key: '', error: message };
    }
  }
);
