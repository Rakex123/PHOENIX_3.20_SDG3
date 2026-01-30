import { AppHeader } from '@/components/app-header';
import { LandingPage } from '@/components/landing-page';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <LandingPage />
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border">
        <p className="mb-2">MindGuard is a wellness support tool and does not replace professional mental health care.</p>
        <p>WellSpring by MindGuard AI. Your privacy is our priority.</p>
      </footer>
    </div>
  );
}
