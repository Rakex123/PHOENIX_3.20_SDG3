"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LifeBuoy, ExternalLink, TriangleAlert } from 'lucide-react';
import Link from 'next/link';

const resources = [
  {
    name: 'Vandrevala Foundation',
    description: 'A 24x7 mental health helpline providing free, confidential counseling and support across India.',
    href: 'https://www.vandrevalafoundation.com/',
  },
  {
    name: 'iCALL Psychosocial Helpline',
    description: 'Free telephone and email-based counseling services by the Tata Institute of Social Sciences (TISS).',
    href: 'http://icallhelpline.org/',
  },
  {
    name: 'AASRA',
    description: 'A 24-hour helpline providing confidential support to the distressed, depressed, or suicidal. Serves all of India.',
    href: 'http://www.aasra.info/',
  },
  {
    name: 'Befrienders India',
    description: 'Part of a global network providing emotional support to prevent suicide. Find a center in India.',
    href: 'https://www.befriendersindia.net/',
  }
];

export default function ResourcesPage() {
  return (
    <div className="w-full space-y-8 max-w-4xl mx-auto">
      <div className="text-left">
        <h1 className="text-4xl font-bold font-headline flex items-center gap-3"><LifeBuoy /> Mental Health Resources in India</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Help is available. Here are some resources in India that can provide immediate support.
        </p>
      </div>

      <Alert variant="destructive">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Important Disclaimer</AlertTitle>
        <AlertDescription>
          This app is a tool for self-reflection and is not a substitute for professional medical advice, diagnosis, or treatment. If you are in a crisis or any other person may be in danger, please use these resources to get help immediately.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {resources.map((resource) => (
          <Card key={resource.name}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {resource.name}
                <Link href={resource.href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  <ExternalLink className="h-5 w-5" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{resource.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
