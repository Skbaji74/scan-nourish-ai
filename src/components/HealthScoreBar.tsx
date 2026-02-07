import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface HealthScoreBarProps {
  score: number;
  className?: string;
}

const HealthScoreBar = ({ score, className }: HealthScoreBarProps) => {
  const [displayScore, setDisplayScore] = useState(0);
  const prevTargetRef = useRef(0);

  const getScoreColor = (val: number) => {
    if (val >= 80) return "text-health-excellent";
    if (val >= 60) return "text-health-good";
    if (val >= 40) return "text-health-moderate";
    return "text-health-poor";
  };

  const getScoreLabel = (val: number) => {
    if (val >= 80) return "Excellent";
    if (val >= 60) return "Good";
    if (val >= 40) return "Fair";
    return "Poor";
  };

  useEffect(() => {
    const start = prevTargetRef.current;
    const end = Math.max(0, Math.min(100, score));
    const duration = 1200;
    let raf: number;
    const startTime = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const value = start + (end - start) * easeOutCubic(progress);
      setDisplayScore(value);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        prevTargetRef.current = end;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Score Display */}
      <div className="text-center">
        <div className={cn("text-6xl font-bold", getScoreColor(displayScore))}>
          {Math.round(displayScore)}
        </div>
        <div className="text-lg font-medium text-muted-foreground">
          {getScoreLabel(displayScore)} Health Score
        </div>
      </div>

      {/* Color Bar */}
      <div className="relative">
        <div className="h-4 w-full bg-gradient-health rounded-full shadow-soft" />
        {/* Score Indicator */}
        <div 
          className="absolute top-0 -mt-2 w-6 h-6 bg-background border-4 border-current rounded-full shadow-elegant transform -translate-x-1/2"
          style={{ 
            left: `${displayScore}%`,
            color: displayScore >= 80 ? 'hsl(var(--health-excellent))' : 
                   displayScore >= 60 ? 'hsl(var(--health-good))' : 
                   displayScore >= 40 ? 'hsl(var(--health-moderate))' : 
                   'hsl(var(--health-poor))'
          }}
        />
      </div>

      {/* Scale Labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0 - Poor</span>
        <span>40 - Fair</span>
        <span>60 - Good</span>
        <span>80+ - Excellent</span>
      </div>
    </div>
  );
};

export default HealthScoreBar;