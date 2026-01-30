"use client";

import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMoodMapper } from '@/hooks/use-mood-mapper';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Pen, Loader2, Wand2 } from 'lucide-react';
import type { DiaryEntry } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, entries, addEntry, updateEntry, isReady, isLoading } = useMoodMapper();
  const [content, setContent] = useState('');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const editId = searchParams.get('edit_id');
  
  const handleEdit = (entry: DiaryEntry) => {
    setEditingEntryId(entry.id);
    setContent(entry.content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    textareaRef.current?.focus();
  };
  
  useEffect(() => {
    if (editId && isReady) {
        const entryToEdit = entries.find(e => e.id === editId);
        if (entryToEdit) {
            handleEdit(entryToEdit);
            router.replace('/dashboard', { scroll: false });
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId, isReady, router]); // Dependencies are intentionally limited

  const handleCancelEdit = () => {
    setEditingEntryId(null);
    setContent('');
  };

  const handleSubmit = async () => {
    if (editingEntryId) {
      await updateEntry(editingEntryId, content);
    } else {
      await addEntry(content);
    }
    setContent('');
    setEditingEntryId(null);
  };

  if (!isReady) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[80vh] w-full" />
      </div>
    );
  }

  return (
    <div data-theme={theme} className="w-full">
      <div className="diary-book diary-book-lg">
        {/* Writing Page */}
        <div className="diary-page w-full">
            <div>
              <h2 className="text-3xl font-bold font-headline mb-6 flex items-center gap-3">
                  <Pen /> {editingEntryId ? "Edit Your Entry" : "What's on your mind?"}
              </h2>
              <div className="space-y-4">
                <Textarea
                  ref={textareaRef}
                  placeholder="Write your thoughts here..."
                  className="min-h-[80vh] text-base diary-textarea"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={isLoading}
                />
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleSubmit} disabled={isLoading || !content.trim()}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    {editingEntryId ? 'Update & Re-analyze' : 'Save & Analyze'}
                  </Button>
                  {editingEntryId && (
                    <Button variant="outline" onClick={handleCancelEdit} disabled={isLoading}>
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
