"use client";

import { useRouter } from 'next/navigation';
import { useMoodMapper } from '@/hooks/use-mood-mapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SentimentChart } from '@/components/sentiment-chart';
import { BarChart3, Info, Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DiaryEntryCard } from '@/components/diary-entry-card';
import type { DiaryEntry } from '@/lib/types';


export default function HistoryPage() {
  const { entries, isReady, clearEntries, deleteEntry } = useMoodMapper();
  const router = useRouter();

  const chartData = entries
    .map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sentiment: entry.sentimentScore,
    }))
    .reverse();

  const handleEdit = (entry: DiaryEntry) => {
    router.push(`/dashboard?edit_id=${entry.id}`);
  };

  const handleDelete = async (entryId: string) => {
    await deleteEntry(entryId);
  };

  if (!isReady) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-[500px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between items-start">
        <div className="text-left">
            <h1 className="text-4xl font-bold font-headline flex items-center gap-3"><BarChart3/> Sentiment History</h1>
            <p className="text-lg text-muted-foreground mt-2">Visualize your emotional journey over time.</p>
        </div>
        {entries.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="shrink-0">
                <Trash2 className="mr-2" />
                Clear History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your diary entries and reset your achievements.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearEntries}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Mood Over Time</CardTitle>
          <CardDescription>
            This chart tracks the sentiment of your diary entries. Scores range from -1 (negative) to 1 (positive).
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[500px] p-2 sm:p-6">
          {entries.length > 0 ? (
            <SentimentChart data={chartData} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Info className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-semibold font-headline">Not enough data yet</h3>
              <p className="mt-1 text-muted-foreground">
                Write a few diary entries, and your sentiment history will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-3xl font-bold font-headline flex items-center gap-3">
          <BookOpen />
          All Entries
        </h2>
        {entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map((entry) => (
              <DiaryEntryCard 
                key={entry.id} 
                entry={entry}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-10 text-center">
              <p className="text-muted-foreground">You have no entries yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
