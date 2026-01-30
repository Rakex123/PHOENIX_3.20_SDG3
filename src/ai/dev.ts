import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-journal-entry-and-generate-response.ts';
import '@/ai/flows/detect-emotional-risk-level.ts';