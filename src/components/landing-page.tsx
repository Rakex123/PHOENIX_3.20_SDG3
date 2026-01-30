import { Button } from '@/components/ui/button';
import { JournalSection } from '@/components/journal-section';
import { Bot, FileText, HeartPulse, HelpingHand, ScanFace, ShieldCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaceRecognitionDemo } from './face-recognition-demo';

export function LandingPage() {
  return (
    <main className="flex-1">
      {/* 1. Hero Section */}
      <section id="hero" className="text-center py-20 md:py-32 bg-card/50">
        <div className="container">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
            Listen Before the Silence.
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
            MindGuard is an AI-powered wellness platform that helps schools detect student distress early and connect them to the support they need.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <a href="#how-it-works">See How It Works</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#solution">Explore the Idea</a>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. The Problem */}
      <section id="problem" className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-headline">The Silent Struggle in Our Schools</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Today's students face unprecedented mental health challenges. Too often, their emotional distress goes unnoticed until it becomes a crisis. Schools need a way to move from reactive crisis response to proactive, preventive care.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Our Solution */}
      <section id="solution" className="py-16 md:py-24 bg-card/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold font-headline">Our Solution: MindGuard</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              MindGuard brings together secure technology and compassionate AI to create a safety net for students, focusing on prevention, not punishment.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                <ScanFace className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Secure Identity</h3>
              <p className="text-muted-foreground mt-2">Consent-based face recognition for private and secure identity verification.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Journal Analysis</h3>
              <p className="text-muted-foreground mt-2">AI-powered text recognition and sentiment analysis of student journal entries.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                <Bot className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">AI Wellness Coach</h3>
              <p className="text-muted-foreground mt-2">An empathetic chatbot that listens, responds, and encourages reflection.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 4. How It Works */}
      <section id="how-it-works" className="py-16 md:py-24">
        <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-bold font-headline">A Clear Path to Support</h2>
                <p className="mt-4 text-muted-foreground text-lg">
                    Our process is simple, secure, and designed with student privacy at its core. Try the interactive demo below.
                </p>
            </div>

            <Tabs defaultValue="step1" className="max-w-4xl mx-auto">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="step1">Step 1: Secure Login</TabsTrigger>
                    <TabsTrigger value="step2">Step 2: Journal & Analysis</TabsTrigger>
                </TabsList>
                <TabsContent value="step1" className="mt-6">
                    <FaceRecognitionDemo />
                </TabsContent>
                <TabsContent value="step2" className="mt-6">
                    <JournalSection />
                </TabsContent>
            </Tabs>
            
            <div className="max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 rounded-lg">
                    <div className="flex items-center justify-center mx-auto h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-2">3</div>
                    <h4 className="font-semibold">Wellness Score</h4>
                    <p className="text-sm text-muted-foreground">A private score is generated.</p>
                </div>
                <div className="p-4 rounded-lg">
                    <div className="flex items-center justify-center mx-auto h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-2">4</div>
                    <h4 className="font-semibold">AI Coach Response</h4>
                    <p className="text-sm text-muted-foreground">The AI provides supportive guidance.</p>
                </div>
                <div className="p-4 rounded-lg">
                    <div className="flex items-center justify-center mx-auto h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-2">5</div>
                    <h4 className="font-semibold">Human Support</h4>
                    <p className="text-sm text-muted-foreground">Help is encouraged when needed.</p>
                </div>
            </div>
        </div>
    </section>

      {/* 5. Safety, Ethics & Privacy */}
      <section id="safety" className="py-16 md:py-24 bg-card/50">
        <div className="container">
           <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold font-headline">Safety, Ethics & Privacy First</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Trust is our foundation. We built MindGuard with an unwavering commitment to protecting student privacy and data.
            </p>
          </div>
          <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-x-8 gap-y-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">No Diagnosis or Labeling</h3>
                <p className="text-sm text-muted-foreground">Our AI provides support, not medical diagnoses.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">No Facial Emotion Detection</h3>
                <p className="text-sm text-muted-foreground">Face recognition is for identity verification only.</p>
              </div>
            </div>
             <div className="flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">No Continuous Monitoring</h3>
                <p className="text-sm text-muted-foreground">Analysis only happens when a student submits an entry.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Student Consent & Transparency</h3>
                <p className="text-sm text-muted-foreground">Students have control and are informed about how the platform works.</p>
              </div>
            </div>
             <div className="flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Data Encryption & Anonymization</h3>
                <p className="text-sm text-muted-foreground">All data is encrypted, and insights are anonymized.</p>
              </div>
            </div>
             <div className="flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Supporting Counselors, Not Replacing Them</h3>
                <p className="text-sm text-muted-foreground">Our goal is to give counselors better tools to support their students.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 6. Benefits for Schools */}
      <section id="benefits" className="py-16 md:py-24">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
            <div className="pr-8">
                 <h2 className="text-3xl font-bold font-headline">A Smarter Way to Support Student Wellbeing</h2>
                <p className="mt-4 text-muted-foreground text-lg">MindGuard empowers schools to build a more proactive and effective wellness ecosystem.</p>
            </div>
            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <HeartPulse className="h-8 w-8 text-primary flex-shrink-0 mt-1"/>
                    <div>
                        <h3 className="font-semibold text-lg">Early Identification of Distress</h3>
                        <p className="text-muted-foreground">Identify at-risk students before their struggles escalate into a crisis.</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <HelpingHand className="h-8 w-8 text-primary flex-shrink-0 mt-1"/>
                    <div>
                        <h3 className="font-semibold text-lg">Reduce Counselor Overload</h3>
                        <p className="text-muted-foreground">Allow counselors to focus their time and resources where they are needed most.</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <ShieldCheck className="h-8 w-8 text-primary flex-shrink-0 mt-1"/>
                    <div>
                        <h3 className="font-semibold text-lg">Privacy-First Insights</h3>
                        <p className="text-muted-foreground">Gain anonymized, group-level insights into school-wide emotional trends.</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 7 & 8. Impact, Vision & Why This Matters */}
      <section id="vision" className="py-16 md:py-24 bg-card/50 text-center">
        <div className="container max-w-3xl mx-auto">
             <h2 className="text-3xl font-bold font-headline">From Prevention to Resilience</h2>
            <p className="mt-4 text-muted-foreground text-lg">
                Our vision is to create safer, more supportive learning environments where every student feels seen, heard, and valued. By focusing on prevention and early listening, we can build emotionally resilient students prepared for the challenges ahead.
            </p>
            <div className="mt-8 border-t border-border pt-8">
                 <h3 className="text-2xl font-semibold">Why This Matters</h3>
                 <p className="mt-4 text-muted-foreground/90 text-lg">
                    Listening early can save a life. Behind every statistic is a student waiting to be heard. By providing a safe space to share and a system that listens, we can ensure that no student has to navigate their struggles alone. Every student deserves to be heard and supported.
                 </p>
            </div>
        </div>
      </section>
    </main>
  );
}
