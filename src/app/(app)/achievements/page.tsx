"use client";

import { useMoodMapper } from '@/hooks/use-mood-mapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Lock, Award } from 'lucide-react';
import type { Achievement } from '@/lib/types';

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const isUnlocked = achievement.unlocked;
  const Icon = achievement.icon;
  return (
    <Card className={cn(
      "text-center transition-all duration-300",
      isUnlocked ? "border-accent/50 shadow-lg" : "bg-muted/50"
    )}>
      <CardHeader className="items-center pb-4">
        <div className={cn(
          "flex h-16 w-16 items-center justify-center rounded-full mb-4 transition-colors",
          isUnlocked ? "bg-accent/20 text-accent" : "bg-muted-foreground/20 text-muted-foreground"
        )}>
          {isUnlocked ? <Icon className="h-8 w-8" /> : <Lock className="h-8 w-8" />}
        </div>
        <CardTitle className={cn(
          "font-headline text-xl",
          !isUnlocked && "text-muted-foreground"
          )}>{achievement.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={cn(
          "text-sm",
          isUnlocked ? "text-muted-foreground" : "text-muted-foreground/70"
          )}>{achievement.description}</p>
      </CardContent>
    </Card>
  );
}

export default function AchievementsPage() {
  const { achievements, isReady } = useMoodMapper();

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  if (!isReady) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div className="text-left">
          <h1 className="text-4xl font-bold font-headline flex items-center gap-3"><Award/> Your Achievements</h1>
          <p className="text-lg text-muted-foreground mt-2">You've unlocked {unlockedCount} of {totalCount} badges. Keep writing!</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {achievements.map(ach => (
          <AchievementCard key={ach.id} achievement={ach} />
        ))}
      </div>
    </div>
  );
}
