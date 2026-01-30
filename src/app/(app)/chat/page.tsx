"use client";

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ageAppropriateAIChat } from '@/ai/flows/age-appropriate-ai-chat';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { getDeepgramToken } from '@/ai/flows/get-deepgram-token';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Bot, Loader2, User, Volume2, Mic, MicOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { createClient, LiveClient, LiveTranscriptionEvents, LiveError } from '@deepgram/sdk';

const chatSchema = z.object({
  age: z.coerce.number().min(3, "Age must be at least 3.").max(120, "Age must be less than 120."),
  question: z.string().min(1, "Please enter a question."),
});

type ChatFormValues = z.infer<typeof chatSchema>;

export default function AIChatPage() {
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedQuestion, setSubmittedQuestion] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [micOpen, setMicOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  const deepgramConnection = useRef<LiveClient | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      age: 18,
      question: '',
    },
  });

  const { setValue, watch, trigger } = form;
  const currentQuestion = watch('question');

  useEffect(() => {
    return () => {
      // Clean up resources on unmount
      if (deepgramConnection.current) {
        deepgramConnection.current.close();
      }
      if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
        mediaRecorder.current.stop();
      }
    };
  }, []);

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
        mediaRecorder.current.stop();
      }
      if (deepgramConnection.current) {
        deepgramConnection.current.close();
        deepgramConnection.current = null;
      }
      setIsRecording(false);
      setMicOpen(false);
      await trigger('question'); // Re-validate the question field after recording stops
    } else {
      // Start recording
      setIsRecording(true);
      
      try {
        const { key, error } = await getDeepgramToken();
        if (error || !key) {
          throw new Error(error || 'Could not get Deepgram token. Have you set your API key in the .env file?');
        }

        const deepgram = createClient(key);
        const connection = deepgram.listen.live({
          model: 'nova-2',
          smart_format: true,
        });

        connection.on(LiveTranscriptionEvents.Open, () => setMicOpen(true));
        connection.on(LiveTranscriptionEvents.Close, () => setMicOpen(false));
        connection.on(LiveTranscriptionEvents.Error, (e: LiveError) => {
            console.error('Deepgram Error:', e);
            toast({
              variant: "destructive",
              title: "Voice Error",
              description: e.message || "An error occurred with the voice recognition service.",
            });
        });

        connection.on(LiveTranscriptionEvents.Transcript, (data) => {
          const transcript = data.channel.alternatives[0].transcript;
          if (transcript && data.is_final) {
            setValue('question', (currentQuestion ? currentQuestion + ' ' : '') + transcript, { shouldValidate: true });
          }
        });
        
        deepgramConnection.current = connection;

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (event) => {
            if (event.data.size > 0 && connection.getReadyState() === 1) {
                connection.send(event.data);
            }
        };
        mediaRecorder.current = recorder;
        recorder.start(250); // a timeslice of 250ms

      } catch (e: any) {
        console.error('Failed to start recording:', e);
        toast({
          variant: "destructive",
          title: "Recording Failed",
          description: e.message || "Could not start microphone recording. Please check permissions and try again.",
        });
        setIsRecording(false);
        setMicOpen(false);
      }
    }
  };

  const onSubmit = async (data: ChatFormValues) => {
    if (isRecording) {
      await toggleRecording();
    }
    setIsLoading(true);
    setResponse(null);
    setAudioUrl(null);
    setSubmittedQuestion(data.question);
    try {
      const result = await ageAppropriateAIChat(data);
      setResponse(result.response);

      try {
        const audio = await textToSpeech(result.response);
        setAudioUrl(audio);
      } catch (audioError) {
        console.error("Text-to-speech error:", audioError);
        toast({
          variant: "destructive",
          title: "Audio Failed",
          description: "Could not generate audio for the response.",
        });
      }
    } catch (error: any) {
      console.error("AI chat error:", error);
      let errorMessage = "Sorry, I couldn't process your question right now. Please try again later.";
      if (error.message?.includes('429')) {
        errorMessage = "You've made too many requests in a short time. Please wait a moment before trying again.";
      }
      setResponse(errorMessage);
       toast({
        variant: "destructive",
        title: "AI Chat Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8 max-w-4xl mx-auto">
        <div className="text-left">
            <h1 className="text-4xl font-bold font-headline flex items-center gap-3"><Bot/> AI Companion</h1>
            <p className="text-lg text-muted-foreground mt-2">Ask anything, and get an answer tailored to your age. You can also use your voice!</p>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Start a Conversation</CardTitle>
          <CardDescription>
            Tell me your age and ask a question. I'll do my best to provide a thoughtful, age-appropriate response.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 18" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Question</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Type or use the microphone to ask your question..." className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2">
                <Button type="submit" disabled={isLoading || isRecording}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Ask AI
                </Button>
                <Button type="button" variant={isRecording ? "destructive" : "outline"} onClick={toggleRecording} disabled={isLoading}>
                  {isRecording ? (
                    micOpen ? <Mic className="mr-2 h-4 w-4 text-red-500 animate-pulse" /> : <MicOff className="mr-2 h-4 w-4" />
                  ) : (
                    <Mic className="mr-2 h-4 w-4" />
                  )}
                  {isRecording ? 'Stop' : 'Voice Input'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {(isLoading || response) && (
        <Card>
            <CardContent className="p-6 space-y-6">
            {submittedQuestion && (
                <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="font-bold">You asked:</p>
                        <p className="text-muted-foreground italic">"{submittedQuestion}"</p>
                    </div>
                </div>
            )}
            <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                    <Bot className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <p className="font-bold">AI Companion says:</p>
                    {isLoading ? (
                        <div className="space-y-2 mt-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    ) : (
                        response && (
                          <div className="mt-1">
                            <p className="whitespace-pre-wrap">{response}</p>
                            {audioUrl && (
                                <>
                                    <audio src={audioUrl} autoPlay ref={audioRef} className="hidden" />
                                    <Button variant="outline" size="icon" className="mt-4" onClick={() => audioRef.current?.play()}>
                                        <Volume2 className="h-5 w-5" />
                                        <span className="sr-only">Replay audio</span>
                                    </Button>
                                </>
                            )}
                          </div>
                        )
                    )}
                </div>
            </div>
            </CardContent>
        </Card>
      )}

    </div>
  );
}
