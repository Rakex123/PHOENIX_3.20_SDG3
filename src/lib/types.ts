import type { LucideIcon } from 'lucide-react';

export type DiaryTheme = 'pink' | 'blue' | 'white' | 'black';

export type DiaryEntry = {
  id: string;
  date: string;
  content: string;
  sentimentScore: number;
  sentimentLabel: string;
};

export type AchievementId = 'FIRST_ENTRY' | 'CONSISTENT_WRITER' | 'DEEP_THINKER' | 'POSITIVE_STREAK';

export type Achievement = {
  id: AchievementId;
  name: string;
  description: string;
  unlocked: boolean;
  icon: LucideIcon;
};
