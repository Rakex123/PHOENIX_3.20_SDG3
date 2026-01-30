import { AppHeader } from '@/components/app-header';
import { JournalSection } from '@/components/journal-section';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <JournalSection />
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>WellSpring by MindGuard AI. Your privacy is our priority.</p>
      </footer>
    </div>
  );
}
