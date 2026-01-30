'use server';
/**
 * @fileOverview A flow to generate a pen scratching sound.
 *
 * - getPenScratchSound - A function that returns a data URI for a pen scratch sound.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as wav from 'wav';
import {googleAI} from '@genkit-ai/google-genai';

const PenScratchSoundOutputSchema = z.object({
  media: z.string().describe('A data URI of the generated audio file.'),
});

export async function getPenScratchSound(): Promise<string> {
  const result = await penScratchSoundFlow();
  return result.media;
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const penScratchSoundFlow = ai.defineFlow(
  {
    name: 'penScratchSoundFlow',
    inputSchema: z.void(),
    outputSchema: PenScratchSoundOutputSchema,
  },
  async () => {
    const {media} = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Algenib'},
          },
        },
      },
      prompt: 'Sound of a pen scratching on paper',
    });

    if (!media) {
      throw new Error('No media returned from TTS model.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = await toWav(audioBuffer);

    return {
      media: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
