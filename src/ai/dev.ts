import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-entry-sentiment.ts';
import '@/ai/flows/age-appropriate-ai-chat.ts';
import '@/ai/flows/detect-emotion-from-face.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/get-deepgram-token.ts';
