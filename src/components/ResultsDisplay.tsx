import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import HealthScoreBar from "@/components/HealthScoreBar";
import { MessageCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface ScanResult {
  score: number;
  ingredients: string[];
  highlights: string[];
  summary?: string;
}

interface ResultsDisplayProps {
  result: ScanResult;
  onStartChat?: () => void;
  onNewScan?: () => void;
}

const ResultsDisplay = ({ result, onStartChat, onNewScan }: ResultsDisplayProps) => {
  const getHighlightIcon = (highlight: string) => {
    const lowerHighlight = highlight.toLowerCase();
    if (lowerHighlight.includes("high") || lowerHighlight.includes("contains")) {
      return <AlertTriangle className="w-4 h-4 text-warning" />;
    }
    if (lowerHighlight.includes("good") || lowerHighlight.includes("healthy")) {
      return <CheckCircle className="w-4 h-4 text-success" />;
    }
    return <Info className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-enter">
      {/* Main Score Card */}
      <Card className="text-center shadow-elegant">
        <CardContent className="pt-8 pb-8">
          <HealthScoreBar score={result.score} />
          {result.summary && (
            <p className="mt-6 text-muted-foreground max-w-md mx-auto">
              {result.summary}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Key Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Key Points
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.highlights.map((highlight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              {getHighlightIcon(highlight)}
              <span className="text-sm leading-relaxed">{highlight}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Ingredients List */}
      <Card>
        <CardHeader>
          <CardTitle>Ingredients Detected</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {result.ingredients.map((ingredient, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {ingredient}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={onStartChat}
          className="flex-1"
          variant="accent"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Ask AI About This Food
        </Button>
        <Button 
          onClick={onNewScan}
          variant="outline"
          className="flex-1"
        >
          Scan Another Product
        </Button>
      </div>

      {/* Disclaimer */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          This analysis is for informational purposes only and should not replace professional medical advice.
        </p>
      </div>
    </div>
  );
};

export default ResultsDisplay;