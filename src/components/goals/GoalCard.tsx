import { motion } from "framer-motion";
import { CheckCircle2, Trash2, Calendar, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Goal } from "./types";

interface GoalCardProps {
  goal: Goal;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  DSA: "bg-primary/10 text-primary border-primary/20",
  "Web Dev": "bg-sky-500/10 text-sky-400 border-sky-500/20",
  OOPs: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  SQL: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export function GoalCard({ goal, onComplete, onDelete }: GoalCardProps) {
  const isCompleted = goal.status === "Completed";
  const catColor = CATEGORY_COLORS[goal.category] ?? "bg-muted/20 text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className={cn(
        "glass group relative overflow-hidden rounded-2xl border transition-all duration-300 p-5 flex flex-col",
        isCompleted ? "border-emerald-500/20 bg-emerald-500/5 opacity-80" : "border-border/50 hover:border-primary/20 hover:shadow-xl hover:-translate-y-1"
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <Badge variant="outline" className={cn("font-mono text-xs", catColor)}>
          {goal.category}
        </Badge>
        <button
          onClick={() => onDelete(goal.id)}
          className="text-muted-foreground/40 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <h3 className={cn("font-heading text-lg font-semibold mb-4 leading-snug", isCompleted && "line-through text-muted-foreground")}>
        {goal.title}
      </h3>

      <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground mb-6">
        {goal.targetNumber && (
          <div className="flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5" />
            Target: {goal.targetNumber}
          </div>
        )}
        {goal.deadline && (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {goal.deadline}
          </div>
        )}
      </div>

      {/* Progress Bar UI */}
      <div className="mt-auto space-y-2">
        <div className="flex justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>{goal.status}</span>
          <span>{goal.progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted/30 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${goal.progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn("h-full rounded-full", isCompleted ? "bg-emerald-500" : "bg-primary")}
          />
        </div>
      </div>

      {!isCompleted && (
        <Button
          onClick={() => onComplete(goal.id)}
          variant="outline"
          size="sm"
          className="mt-5 w-full gap-2 rounded-xl border-dashed hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-500 transition-all font-mono text-xs"
        >
          <CheckCircle2 className="h-4 w-4" />
          Mark as Completed
        </Button>
      )}
    </motion.div>
  );
}
