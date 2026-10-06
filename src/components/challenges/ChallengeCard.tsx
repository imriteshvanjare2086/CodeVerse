import { motion } from "framer-motion";
import { CheckCircle2, ExternalLink, BookOpen, Code2, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Question {
  q: string;
  options: string[];
  answer: number;
}

export interface Challenge {
  id: number;
  title: string;
  type: "MCQ" | "Coding" | "Task";
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  questions?: Question[];
  url?: string;
}

interface ChallengeCardProps {
  challenge: Challenge;
  isCompleted: boolean;
  onStart: () => void;
  onToggleComplete: () => void;
  index: number;
}

export function ChallengeCard({
  challenge,
  isCompleted,
  onStart,
  onToggleComplete,
  index,
}: ChallengeCardProps) {
  const getDifficultyColor = (diff: string) => {
    if (diff === "Easy") return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    if (diff === "Medium") return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    return "bg-rose-500/10 text-rose-500 border-rose-500/20";
  };

  const getTypeStyle = (type: string) => {
    if (type === "MCQ") return { cls: "bg-violet-500/10 text-violet-400 border-violet-500/20", Icon: BookOpen };
    if (type === "Coding") return { cls: "bg-sky-500/10 text-sky-400 border-sky-500/20", Icon: Code2 };
    return { cls: "bg-orange-500/10 text-orange-400 border-orange-500/20", Icon: ClipboardList };
  };

  const { cls: typeCls, Icon: TypeIcon } = getTypeStyle(challenge.type);

  const getStartLabel = () => {
    if (challenge.type === "Coding") return "Solve";
    if (challenge.type === "MCQ") return "Start Quiz";
    return isCompleted ? "Completed" : "Mark Done";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      layout
      className={cn(
        "glass group relative overflow-hidden rounded-2xl p-5 transition-all duration-300",
        "hover:shadow-xl hover:border-primary/20",
        isCompleted && "opacity-60"
      )}
    >
      {/* Completed overlay checkmark */}
      {isCompleted && (
        <div className="absolute right-4 top-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        </div>
      )}

      <div className="flex flex-col gap-4">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={cn("gap-1.5 font-mono text-xs", typeCls)}>
            <TypeIcon className="h-3 w-3" />
            {challenge.type}
          </Badge>
          <Badge variant="outline" className={cn("font-mono text-xs", getDifficultyColor(challenge.difficulty))}>
            {challenge.difficulty}
          </Badge>
        </div>

        {/* Title + Description */}
        <div>
          <h3 className={cn(
            "font-heading text-base font-semibold leading-snug transition-colors group-hover:text-primary",
            isCompleted ? "line-through text-muted-foreground" : "text-foreground"
          )}>
            {challenge.title}
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
            {challenge.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          {challenge.type !== "Task" && (
            <Button
              size="sm"
              onClick={onStart}
              className={cn(
                "h-8 gap-2 rounded-lg font-mono text-xs",
                "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              )}
            >
              {getStartLabel()}
              {challenge.type === "Coding" && <ExternalLink className="h-3 w-3" />}
            </Button>
          )}

          {challenge.type === "Task" ? (
            <Button
              size="sm"
              onClick={() => { onToggleComplete(); onStart(); }}
              className={cn(
                "h-8 gap-2 rounded-lg font-mono text-xs transition-all duration-300",
                isCompleted
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20"
                  : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
              )}
            >
              {isCompleted ? (
                <><CheckCircle2 className="h-3 w-3" /> Done</>
              ) : (
                "Mark Done"
              )}
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggleComplete}
              className={cn(
                "h-8 gap-1.5 rounded-lg font-mono text-xs text-muted-foreground hover:text-foreground",
                isCompleted && "text-emerald-500 hover:text-rose-400"
              )}
            >
              {isCompleted ? (
                <><CheckCircle2 className="h-3 w-3" /> Completed</>
              ) : (
                "Mark done"
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className={cn(
        "absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full",
        challenge.type === "MCQ" && "bg-violet-500",
        challenge.type === "Coding" && "bg-sky-500",
        challenge.type === "Task" && "bg-orange-500",
        isCompleted && "bg-emerald-500 w-full"
      )} />
    </motion.div>
  );
}
