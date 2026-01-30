import { Bot } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AppHeader() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 text-foreground border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
              <Bot className="h-7 w-7 text-primary" />
              <h1 className="text-2xl font-bold font-headline text-foreground">
              MindScape
              </h1>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            <Button asChild variant="ghost">
              <a href="#solution">Solution</a>
            </Button>
            <Button asChild variant="ghost">
              <a href="#how-it-works">How It Works</a>
            </Button>
            <Button asChild variant="ghost">
              <a href="#safety">Safety</a>
            </Button>
            <Button asChild variant="default">
              <a href="#">Request a Demo</a>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
