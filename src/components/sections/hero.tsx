'use client';

import { useState } from 'react';
import type { AnalyzeMarketingMaturityOutput } from '@/ai/flows/analyze-marketing-maturity';
import type { FunnelFormValues } from '@/lib/schema';
import { submitFunnelForm } from '@/app/actions';
import { FunnelForm } from '@/components/funnel-form';
import { AnalysisResult } from '@/components/analysis-result';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';

export default function Hero() {
  const [analysis, setAnalysis] = useState<AnalyzeMarketingMaturityOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (data: FunnelFormValues) => {
    setIsLoading(true);
    setError(null);
    const result = await submitFunnelForm(data);
    
    if (result.success) {
      setAnalysis(result.data!);
      if (result.contactWillBeMade) {
        toast({
          title: 'Analysis Complete!',
          description: 'Raul will contact you soon.',
        });
      }
    } else {
      const errorMessage = result.error || 'There was an issue with your submission. Please check your inputs and try again.';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
  };

  const handleReset = () => {
    setAnalysis(null);
    setError(null);
  };

  return (
    <section className="py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <Card className="overflow-hidden shadow-2xl shadow-primary/10">
            <CardContent className="p-4 sm:p-8">
              {isLoading ? (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-primary">Analyzing your business...</h2>
                    <p className="text-muted-foreground">Our AI is crafting your personalized marketing strategy.</p>
                  </div>
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-12 w-1/2 mx-auto" />
                </div>
              ) : analysis ? (
                <AnalysisResult result={analysis} onReset={handleReset} />
              ) : (
                <FunnelForm onSubmit={handleFormSubmit} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
