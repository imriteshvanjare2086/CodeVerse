import { cn } from "@/lib/utils";

interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-heading font-semibold text-foreground">
          Weekly Progress
        </span>
        <span className="font-mono font-semibold text-primary">
          {completed} / {total} completed
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted/40">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            pct === 100
              ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
              : "bg-gradient-to-r from-primary to-primary/70"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-right font-mono text-xs text-muted-foreground">
        {pct === 100 ? "🎉 All done!" : `${pct}% complete`}
      </p>
    </div>
  );
}
