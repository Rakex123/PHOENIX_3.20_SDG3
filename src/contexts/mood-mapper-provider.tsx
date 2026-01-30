"use client";

import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { DiaryTheme, DiaryEntry, Achievement, AchievementId } from '@/lib/types';
import { analyzeEntrySentiment } from '@/ai/flows/analyze-entry-sentiment';
import { Award, Feather, Sparkles, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { isSameDay, subDays } from 'date-fns';

const initialAchievements: Achievement[] = [
  { id: 'FIRST_ENTRY', name: 'First Entry', description: 'You wrote your first diary entry!', unlocked: false, icon: Feather },
  { id: 'CONSISTENT_WRITER', name: 'Consistent Writer', description: 'Wrote for 3 consecutive days.', unlocked: false, icon: TrendingUp },
  { id: 'DEEP_THINKER', name: 'Deep Thinker', description: 'Wrote an entry longer than 100 words.', unlocked: false, icon: Sparkles },
  { id: 'POSITIVE_STREAK', name: 'Positive Streak', description: 'Had 3 consecutive positive entries.', unlocked: false, icon: Award },
];

interface MoodMapperContextType {
  theme: DiaryTheme;
  setTheme: (theme: DiaryTheme) => void;
  entries: DiaryEntry[];
  addEntry: (content: string) => Promise<void>;
  updateEntry: (id: string, content: string) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  achievements: Achievement[];
  isReady: boolean;
  isLoading: boolean;
  clearEntries: () => void;
}

export const MoodMapperContext = createContext<MoodMapperContextType | undefined>(undefined);

export function MoodMapperProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<DiaryTheme>('pink');
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('mood-mapper-theme');
      if (storedTheme) setThemeState(storedTheme as DiaryTheme);

      const storedEntries = localStorage.getItem('mood-mapper-entries');
      if (storedEntries) {
        const parsedEntries = JSON.parse(storedEntries);
        // Ensure entries are sorted by date, descending
        const sortedEntries = parsedEntries.sort((a: DiaryEntry, b: DiaryEntry) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setEntries(sortedEntries);
      }

      const storedAchievementsData = localStorage.getItem('mood-mapper-achievements');
      if (storedAchievementsData) {
        const storedAchievements: Pick<Achievement, 'id' | 'unlocked'>[] = JSON.parse(storedAchievementsData);
        const hydratedAchievements = initialAchievements.map(initialAch => {
          const stored = storedAchievements.find(sa => sa.id === initialAch.id);
          return {
            ...initialAch,
            unlocked: stored ? stored.unlocked : initialAch.unlocked,
          };
        });
        setAchievements(hydratedAchievements);
      } else {
        setAchievements(initialAchievements);
      }

    } catch (error) {
      console.error("Failed to read from localStorage", error);
    } finally {
      setIsReady(true);
    }
  }, []);

  const checkAchievements = useCallback((newEntries: DiaryEntry[], newEntry: DiaryEntry) => {
    let updatedAchievements = [...achievements];
    let achievementUnlocked = false;

    const unlockAchievement = (id: AchievementId) => {
      const achievementIndex = updatedAchievements.findIndex(a => a.id === id);
      if (achievementIndex !== -1 && !updatedAchievements[achievementIndex].unlocked) {
        updatedAchievements[achievementIndex] = { ...updatedAchievements[achievementIndex], unlocked: true };
        achievementUnlocked = true;
        toast({
          title: 'Achievement Unlocked!',
          description: `${updatedAchievements[achievementIndex].name}: ${updatedAchievements[achievementIndex].description}`,
        });
      }
    };

    // First Entry
    if (newEntries.length >= 1) {
      unlockAchievement('FIRST_ENTRY');
    }

    // Deep Thinker
    if (newEntry.content.split(' ').length > 100) {
      unlockAchievement('DEEP_THINKER');
    }

    // Positive Streak
    if (newEntries.length >= 3) {
      const lastThree = newEntries.slice(0, 3);
      if (lastThree.length === 3 && lastThree.every(e => e.sentimentScore > 0.2)) {
        unlockAchievement('POSITIVE_STREAK');
      }
    }

    // Consistent Writer
    if (newEntries.length >= 3) {
        const entryDates = newEntries.map(e => new Date(e.date)).sort((a, b) => b.getTime() - a.getTime());
        const today = new Date();
        const yesterday = subDays(today, 1);
        const dayBefore = subDays(today, 2);

        const hasEntryForToday = entryDates.some(d => isSameDay(d, today));
        const hasEntryForYesterday = entryDates.some(d => isSameDay(d, yesterday));
        const hasEntryForDayBefore = entryDates.some(d => isSameDay(d, dayBefore));
        
        if (hasEntryForToday && hasEntryForYesterday && hasEntryForDayBefore) {
            unlockAchievement('CONSISTENT_WRITER');
        }
    }

    if (achievementUnlocked) {
      setAchievements(updatedAchievements);
      localStorage.setItem('mood-mapper-achievements', JSON.stringify(updatedAchievements.map(({ id, unlocked }) => ({ id, unlocked }))));
    }
  }, [toast, achievements]);

  const setTheme = (newTheme: DiaryTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('mood-mapper-theme', newTheme);
  };

  const addEntry = async (content: string) => {
    if (!content.trim()) return;
    setIsLoading(true);
    try {
      const sentiment = await analyzeEntrySentiment({ diaryEntry: content });
      const newEntry: DiaryEntry = {
        id: new Date().toISOString(),
        date: new Date().toISOString(),
        content,
        ...sentiment,
      };

      const updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries);
      localStorage.setItem('mood-mapper-entries', JSON.stringify(updatedEntries));
      checkAchievements(updatedEntries, newEntry);
    } catch (error) {
      console.error("Failed to add entry:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not analyze or save your entry. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateEntry = async (id: string, content: string) => {
    if (!content.trim()) return;
    setIsLoading(true);
    try {
      const sentiment = await analyzeEntrySentiment({ diaryEntry: content });
      const originalEntry = entries.find(e => e.id === id);

      const updatedEntry: DiaryEntry = {
        id,
        date: originalEntry?.date || new Date().toISOString(), // Keep original date
        content,
        ...sentiment,
      };

      const updatedEntries = entries.map(entry => (entry.id === id ? updatedEntry : entry));
      
      setEntries(updatedEntries);
      localStorage.setItem('mood-mapper-entries', JSON.stringify(updatedEntries));
      
      checkAchievements(updatedEntries, updatedEntry);

      toast({
        title: 'Entry Updated',
        description: 'Your diary entry has been successfully updated.',
      });

    } catch (error) {
      console.error("Failed to update entry:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update your entry. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEntry = async (id: string) => {
    setIsLoading(true);
    try {
      const updatedEntries = entries.filter(entry => entry.id !== id);
      setEntries(updatedEntries);
      localStorage.setItem('mood-mapper-entries', JSON.stringify(updatedEntries));
      toast({
        title: 'Entry Deleted',
        description: 'Your diary entry has been removed.',
      });
    } catch (error) {
      console.error("Failed to delete entry:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete your entry. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearEntries = () => {
    try {
      setEntries([]);
      localStorage.removeItem('mood-mapper-entries');
      const resetAchievements = initialAchievements.map(a => ({...a, unlocked: false}));
      setAchievements(resetAchievements);
      localStorage.setItem('mood-mapper-achievements', JSON.stringify(resetAchievements.map(({id, unlocked}) => ({id, unlocked}))));
      toast({
        title: 'History Cleared',
        description: 'Your diary entries and achievements have been deleted.',
      });
    } catch (error) {
      console.error('Failed to clear history:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not clear your history. Please try again.',
      });
    }
  };

  const value = { theme, setTheme, entries, addEntry, updateEntry, deleteEntry, achievements, isReady, isLoading, clearEntries };

  return <MoodMapperContext.Provider value={value}>{children}</MoodMapperContext.Provider>;
}
