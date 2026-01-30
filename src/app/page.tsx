"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { useMoodMapper } from '@/hooks/use-mood-mapper';
import { cn } from '@/lib/utils';
import type { DiaryTheme } from '@/lib/types';
import { Paintbrush } from 'lucide-react';
import { Logo } from '@/components/logo';

const themes: { name: DiaryTheme; bg: string; text: string; border: string }[] = [
  { name: 'pink', bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300' },
  { name: 'blue', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  { name: 'white', bg: 'bg-white', text: 'text-gray-800', border: 'border-gray-300' },
  { name: 'black', bg: 'bg-gray-800', text: 'text-white', border: 'border-gray-600' },
];

export default function ThemeSelectionPage() {
  const router = useRouter();
  const { setTheme } = useMoodMapper();

  const handleThemeSelect = (theme: DiaryTheme) => {
    setTheme(theme);
    router.push('/dashboard');
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-8 bg-background">
      <div className="text-center mb-12">
        <div className="flex justify-center items-center gap-4 mb-4">
          <Logo className="h-16 w-16" />
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-foreground tracking-tight">
            Mood Mapper
          </h1>
        </div>
        <p className="text-xl text-muted-foreground font-headline max-w-2xl mx-auto">
          Your personal space to write, reflect, and understand your emotional landscape.
        </p>
      </div>

      <Card className="w-full max-w-4xl p-6 md:p-8 shadow-2xl bg-card/80 backdrop-blur-sm">
        <CardContent className="p-0">
          <h2 className="text-2xl font-bold font-headline text-center mb-2 flex items-center justify-center gap-2">
            <Paintbrush className="h-6 w-6 text-primary" />
            Choose Your Diary's Theme
          </h2>
          <p className="text-center text-muted-foreground mb-8">Select a style that feels like you.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => handleThemeSelect(theme.name)}
                className={cn(
                  'group relative flex h-48 flex-col items-center justify-center rounded-lg border-2 p-4 text-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-primary',
                  theme.bg,
                  theme.text,
                  theme.border
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                <span className="relative text-2xl font-bold capitalize font-headline drop-shadow-md">{theme.name}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
       <footer className="mt-12 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Mood Mapper. All rights reserved.</p>
      </footer>
    </main>
  );
}
