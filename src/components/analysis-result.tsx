import type { AnalyzeMarketingMaturityOutput } from '@/ai/flows/analyze-marketing-maturity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Target, TrendingUp, RotateCcw } from 'lucide-react';

interface AnalysisResultProps {
  result: AnalyzeMarketingMaturityOutput;
  onReset: () => void;
}

const getMaturityVariant = (level: string) => {
  switch (level.toLowerCase()) {
    case 'advanced':
      return 'success';
    case 'intermediate':
      return 'warning';
    case 'beginner':
      return 'destructive';
    default:
      return 'default';
  }
}

export function AnalysisResult({ result, onReset }: AnalysisResultProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Your Personalized Marketing Analysis</h2>
        <p className="text-muted-foreground">Here are your AI-powered insights and recommendations.</p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle>Your Marketing Maturity Level</CardTitle>
          <div className="flex justify-center pt-2">
            <Badge variant="secondary" className="text-lg font-semibold px-4 py-1">{result.maturityLevel}</Badge>
          </div>
        </CardHeader>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader className="flex-row items-center gap-4">
            <div className="bg-accent/10 p-3 rounded-full">
              <Lightbulb className="h-6 w-6 text-accent" />
            </div>
            <CardTitle>Suggested Solutions</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-muted-foreground whitespace-pre-wrap">{result.suggestedSolutions}</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex-row items-center gap-4">
            <div className="bg-accent/10 p-3 rounded-full">
              <Target className="h-6 w-6 text-accent" />
            </div>
            <CardTitle>Suggested Tactics</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-muted-foreground whitespace-pre-wrap">{result.suggestedTactics}</p>
          </CardContent>
        </Card>
      </div>
      <div className="text-center pt-4">
        <Button onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Start a New Analysis
        </Button>
      </div>
    </div>
  );
}
