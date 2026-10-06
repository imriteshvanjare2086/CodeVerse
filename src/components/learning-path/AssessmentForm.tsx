import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Target, Compass, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssessmentData, Level, Goal } from "./types";
import { cn } from "@/lib/utils";

interface AssessmentFormProps {
  onComplete: (data: AssessmentData) => void;
}

const TOPICS = ["C / C++", "Python / Java", "DSA Basics", "Web Development", "OOPs", "DBMS / SQL"];
const GOALS: Goal[] = ["Placement", "Web Developer", "Competitive Programming", "General Learning"];

export function AssessmentForm({ onComplete }: AssessmentFormProps) {
  const [level, setLevel] = useState<Level>(null);
  const [knownTopics, setKnownTopics] = useState<string[]>([]);
  const [goal, setGoal] = useState<Goal>(null);

  const toggleTopic = (t: string) => {
    setKnownTopics(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  const handleGenerate = () => {
    if (level && goal) {
      onComplete({ level, knownTopics, goal });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl p-8 max-w-2xl mx-auto space-y-10 border-border/50 shadow-2xl"
    >
      <div className="text-center space-y-2">
        <h2 className="font-heading text-2xl font-bold text-foreground flex items-center justify-center gap-3">
          <Compass className="h-6 w-6 text-primary" />
          Customize Your Learning Path
        </h2>
        <p className="font-mono text-sm text-muted-foreground">
          Tell us where you are, and we'll show you where to go.
        </p>
      </div>

      <div className="space-y-8">
        {/* Step 1: Current Level */}
        <div className="space-y-4">
          <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs text-primary">1</span>
            Current Level
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(["Beginner", "Intermediate", "Advanced"] as Level[]).map(l => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={cn(
                  "p-4 rounded-xl border transition-all text-sm font-mono flex items-center justify-between",
                  level === l ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(_59,130,246,0.15_)]" : "border-border/50 bg-card/40 text-muted-foreground hover:bg-card/80"
                )}
              >
                {l}
                {level === l && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Known Topics */}
        <div className="space-y-4">
          <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs text-primary">2</span>
            What do you already know?
          </h3>
          <div className="flex flex-wrap gap-3">
            {TOPICS.map(t => {
              const isSelected = knownTopics.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleTopic(t)}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm font-mono transition-all flex items-center gap-2",
                    isSelected ? "border-sky-500/50 bg-sky-500/10 text-sky-400" : "border-border/50 bg-card/40 text-muted-foreground hover:bg-card/80"
                  )}
                >
                  <div className={cn("h-3 w-3 rounded-sm border flex items-center justify-center", isSelected ? "border-sky-500 bg-sky-500/20" : "border-muted-foreground")}>
                    {isSelected && <Check className="h-2 w-2 text-sky-400" />}
                  </div>
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Goal */}
        <div className="space-y-4">
          <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs text-primary">3</span>
            What is your main goal?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GOALS.map(g => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={cn(
                  "p-4 rounded-xl border transition-all text-sm font-mono flex items-center justify-between",
                  goal === g ? "border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-400 shadow-[0_0_15px_rgba(_217,70,239,0.15_)]" : "border-border/50 bg-card/40 text-muted-foreground hover:bg-card/80"
                )}
              >
                {g}
                {goal === g && <Target className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>

        <Button 
          className="w-full h-14 rounded-xl text-lg font-heading shadow-lg shadow-primary/20 gap-2 mt-4"
          disabled={!level || !goal}
          onClick={handleGenerate}
        >
          <BookOpen className="h-5 w-5" />
          Generate My Path
        </Button>
      </div>
    </motion.div>
  );
}
