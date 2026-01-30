'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Camera, ShieldCheck } from 'lucide-react';

export function FaceRecognitionDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

   useEffect(() => {
    // This effect runs only on the client
    if (typeof window !== 'undefined' && hasCameraPermission === null) {
        setHasCameraPermission(false);
    }
  }, [hasCameraPermission]);

  const getCameraPermission = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
       toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        setHasCameraPermission(false);
        return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to use this feature.',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Camera />
            Secure Login Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="relative aspect-video w-full bg-muted rounded-md overflow-hidden border">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            {hasCameraPermission === false && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-4">
                    <p className="text-center text-muted-foreground mb-4">Click below to test the secure login.</p>
                    <Button onClick={getCameraPermission}>
                        <Camera className="mr-2 h-4 w-4" />
                        Enable Camera
                    </Button>
                </div>
            )}
        </div>
        {hasCameraPermission === false && (
            <Alert variant="default">
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>Privacy Note</AlertTitle>
                <AlertDescription>
                    Your camera is used for on-device identity verification only. No video is recorded or stored.
                </AlertDescription>
            </Alert>
        )}
         {hasCameraPermission === true && (
            <Alert variant="default" className="border-primary/50 text-primary [&>svg]:text-primary">
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>Camera Enabled</AlertTitle>
                <AlertDescription>
                    In a real application, our AI would securely verify your identity without storing your image.
                </AlertDescription>
            </Alert>
        )}
      </CardContent>
    </Card>
  );
}
