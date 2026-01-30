'use client';

import { useFormStatus } from 'react-dom';
import { Loader2, Send } from 'lucide-react';
import { handleJournalSubmission } from '@/app/actions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AnalysisDisplay } from './analysis-display';
import { useEffect, useRef, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { AnalyzeJournalEntryOutput } from '@/ai/flows/analyze-journal-entry-and-generate-response';
import { Card, CardContent } from '@/components/ui/card';

type FormState = {
  result: AnalyzeJournalEntryOutput | null;
  error: string | null;
};

const initialState: FormState = {
  result: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Analyze Entry
        </>
      )}
    </Button>
  );
}

export function JournalSection() {
  const [state, formAction] = useActionState(handleJournalSubmission, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: state.error,
      });
    }
    if (state.result) {
        formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold font-headline">MindGuard AI</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Welcome. This is a safe space to reflect. Write down your thoughts and feelings, and I'll offer a moment of gentle guidance.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
            <form ref={formRef} action={formAction} className="space-y-4">
                <Textarea
                name="journalEntry"
                placeholder="How are you feeling today?"
                className="min-h-[200px] text-base"
                required
                />
                <div className="flex justify-end">
                <SubmitButton />
                </div>
            </form>
        </CardContent>
      </Card>

      {state.result && <AnalysisDisplay result={state.result} />}
    </div>
  );
}
