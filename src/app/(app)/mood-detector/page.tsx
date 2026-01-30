"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Smile, Webcam } from 'lucide-react';
import { detectEmotionFromFace } from '@/ai/flows/detect-emotion-from-face';
import { Badge } from '@/components/ui/badge';

export default function MoodDetectorPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
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
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
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

    getCameraPermission();
    
    // Cleanup function to stop video stream
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }

  }, [toast]);

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsLoading(true);
    setDetectedEmotion(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not get canvas context.",
        });
        setIsLoading(false);
        return;
    }
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoDataUri = canvas.toDataURL('image/jpeg');

    try {
      const result = await detectEmotionFromFace({ photoDataUri });
      setDetectedEmotion(result.emotion);
    } catch (error) {
      console.error("Emotion detection error:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not analyze the image. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8 max-w-4xl mx-auto">
      <div className="text-left">
        <h1 className="text-4xl font-bold font-headline flex items-center gap-3"><Webcam /> Mood Detector</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Let's see how you're feeling. I'll use your camera to detect your facial expression.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Facial Emotion Recognition</CardTitle>
          <CardDescription>
            Position your face in the center of the video frame and click the button to analyze your mood. Your privacy is important; the image is processed and not stored.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative aspect-video w-full bg-muted rounded-md overflow-hidden border">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            <canvas ref={canvasRef} className="hidden" />
            {hasCameraPermission === false && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Alert variant="destructive" className="w-auto">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                            Please allow camera access to use this feature.
                        </AlertDescription>
                    </Alert>
                </div>
            )}
            {hasCameraPermission === null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
            )}
          </div>
          <Button onClick={captureAndAnalyze} disabled={isLoading || hasCameraPermission !== true}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Smile className="mr-2 h-4 w-4" />}
            Analyze My Mood
          </Button>
        </CardContent>
      </Card>
      
      {detectedEmotion && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
                <p className="text-lg">I think you're feeling:</p>
                <Badge className="text-lg px-4 py-1">{detectedEmotion}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
