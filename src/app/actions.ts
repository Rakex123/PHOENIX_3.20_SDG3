'use server';

import { z } from 'zod';
import { analyzeJournalEntryAndGenerateResponse } from '@/ai/flows/analyze-journal-entry-and-generate-response';
import type { AnalyzeJournalEntryOutput } from '@/ai/flows/analyze-journal-entry-and-generate-response';

type FormState = {
  result: AnalyzeJournalEntryOutput | null;
  error: string | null;
};

const JournalEntrySchema = z.string().min(10, 'Journal entry must be at least 10 characters long.');

export async function handleJournalSubmission(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const journalEntry = formData.get('journalEntry');

  const validation = JournalEntrySchema.safeParse(journalEntry);

  if (!validation.success) {
    return {
      result: null,
      error: validation.error.errors[0].message,
    };
  }

  try {
    const result = await analyzeJournalEntryAndGenerateResponse({
      journalEntry: validation.data,
    });
    return { result, error: null };
  } catch (error) {
    console.error('Error analyzing journal entry:', error);
    return {
      result: null,
      error: 'Failed to analyze journal entry. Please try again.',
    };
  }
}
