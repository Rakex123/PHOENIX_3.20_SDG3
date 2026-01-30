import { Sprout } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Sprout className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold font-headline text-foreground">
              WellSpring
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
