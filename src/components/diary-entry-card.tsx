"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Smile, Frown, Meh, Edit, Trash2 } from 'lucide-react';
import type { DiaryEntry } from '@/lib/types';
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

const SentimentIcon = ({ score }: { score: number }) => {
  if (score > 0.2) return <Smile className="h-5 w-5 text-green-500" />;
  if (score < -0.2) return <Frown className="h-5 w-5 text-red-500" />;
  return <Meh className="h-5 w-5 text-yellow-500" />;
};

export function DiaryEntryCard({ entry, onEdit, onDelete }: { entry: DiaryEntry; onEdit?: (entry: DiaryEntry) => void; onDelete?: (entryId: string) => void; }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongEntry = entry.content.length > 200;
  const displayContent = isLongEntry && !isExpanded ? `${entry.content.substring(0, 200)}...` : entry.content;

  return (
    <div className="past-entry-card p-4 sm:p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="mb-2">
            <p className="text-base font-semibold past-entry-meta">
              {format(new Date(entry.date), "EEEE, MMMM d, yyyy")}
            </p>
            <p className="text-sm text-muted-foreground past-entry-meta">
              {format(new Date(entry.date), "h:mm a")}
            </p>
          </div>
          <p className="mt-2 whitespace-pre-wrap past-entry-content leading-relaxed">{displayContent}</p>
          {isLongEntry && (
             <Button variant="link" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="px-0 h-auto py-1">
               {isExpanded ? 'Show less' : 'Show more'}
             </Button>
          )}
        </div>
        <div className="ml-4 flex flex-col items-center gap-2">
          <div className="flex flex-col items-center">
            <SentimentIcon score={entry.sentimentScore} />
            <span className="text-xs font-semibold">{entry.sentimentLabel}</span>
          </div>
          {(onEdit || onDelete) && (
            <div className="flex gap-1 mt-2">
              {onEdit && (
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(entry)} aria-label="Edit entry">
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" aria-label="Delete entry">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this diary entry. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(entry.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
