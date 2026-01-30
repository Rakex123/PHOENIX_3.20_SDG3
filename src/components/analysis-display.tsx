import type { AnalyzeJournalEntryOutput } from '@/ai/flows/analyze-journal-entry-and-generate-response';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HeartPulse, Info, Lightbulb, ShieldAlert, Smile, Frown, Meh } from 'lucide-react';
import { cn } from '@/lib/utils';

type AnalysisDisplayProps = {
  result: AnalyzeJournalEntryOutput;
};

const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-chart-2';
    if (score >= 50) return 'text-chart-4';
    if (score >= 20) return 'text-chart-5';
    return 'text-chart-1';
};

const getSentimentIcon = (sentiment: string) => {
    switch(sentiment.toLowerCase()) {
        case 'positive': return <Smile className="h-5 w-5 text-chart-2" />;
        case 'negative': return <Frown className="h-5 w-5 text-chart-1" />;
        default: return <Meh className="h-5 w-5 text-chart-4" />;
    }
}

const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-chart-2';
    if (score >= 50) return 'bg-chart-4';
    if (score >= 20) return 'bg-chart-5';
    return 'bg-chart-1';
}

export function AnalysisDisplay({ result }: AnalysisDisplayProps) {
  const { internalAnalysis, studentResponse, recommendAlert } = result;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Lightbulb className="h-6 w-6 text-primary" />
            A Moment for You
          </CardTitle>
          <CardDescription>A gentle reflection from your MindGuard AI wellness coach.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">{studentResponse}</p>
        </CardContent>
      </Card>

      {recommendAlert && (
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Support is Available</AlertTitle>
          <AlertDescription>
            It can be helpful to talk to someone you trust. Consider reaching out to a school counselor, a teacher, or a family member. You are not alone, and help is a sign of strength.
          </AlertDescription>
        </Alert>
      )}

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              View AI-Powered Insights
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card className="border-dashed">
                <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-muted-foreground">Sentiment</h4>
                        <div className="flex items-center gap-2">
                            {getSentimentIcon(internalAnalysis.sentiment)}
                            <span className="capitalize font-medium">{internalAnalysis.sentiment}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-muted-foreground">Dominant Emotions</h4>
                        <p className="font-medium">{internalAnalysis.emotions}</p>
                    </div>
                    <div className="space-y-2 col-span-1 sm:col-span-2">
                        <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                            <HeartPulse className="h-4 w-4" />
                            Wellness Risk Score
                        </h4>
                        <div className="flex items-center gap-4">
                            <div className="w-full bg-muted rounded-full h-2.5">
                                <div
                                    className={cn("h-2.5 rounded-full", getProgressColor(internalAnalysis.riskScore))}
                                    style={{ width: `${internalAnalysis.riskScore}%` }}
                                ></div>
                            </div>
                            <span className={cn("font-bold text-lg", getRiskColor(internalAnalysis.riskScore))}>{internalAnalysis.riskScore}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Risk Level: <span className="font-medium">{internalAnalysis.riskLevel}</span></p>
                    </div>
                </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
