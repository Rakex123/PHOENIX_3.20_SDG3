import { Search, Sprout } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AppHeader() {
  return (
    <header className="bg-background text-foreground border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
                <Sprout className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold font-headline text-foreground">
                WellSpring
                </h1>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button asChild>
              <Link href="#">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Link>
            </Button>
            <Button asChild>
              <Link href="#">Contact Us</Link>
            </Button>
            <Button asChild>
              <Link href="#">About</Link>
            </Button>
          </div>
        </div>
        <nav className="flex items-center justify-start gap-x-8 h-12 text-sm font-medium">
          <Link href="#" className="text-foreground/80 hover:text-foreground transition-colors">Get Help</Link>
          <Link href="#" className="text-foreground/80 hover:text-foreground transition-colors">About WellSpring</Link>
          <Link href="#" className="text-foreground/80 hover:text-foreground transition-colors">Prevention</Link>
          <Link href="#" className="text-foreground/80 hover:text-foreground transition-colors">Resources</Link>
          <Link href="#" className="text-foreground/80 hover:text-foreground transition-colors">Best Practices</Link>
        </nav>
      </div>
    </header>
  );
}
