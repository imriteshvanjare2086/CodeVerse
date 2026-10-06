import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Question {
  q: string;
  options: string[];
  answer: number;
}

interface Challenge {
  id: number;
  title: string;
  type: string;
  difficulty: string;
  description: string;
  questions?: Question[];
}

interface ChallengeModalProps {
  challenge: Challenge;
  onClose: () => void;
  onComplete: () => void;
  isCompleted: boolean;
}

export function ChallengeModal({
  challenge,
  onClose,
  onComplete,
  isCompleted,
}: ChallengeModalProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array((challenge.questions || []).length).fill(null)
  );

  const questions = challenge.questions || [];
  const current = questions[currentQ];

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelected(idx);
    const updated = [...answers];
    updated[currentQ] = idx;
    setAnswers(updated);
  };

  const handleSubmitAnswer = () => {
    if (selected === null) return;
    setSubmitted(true);
    if (selected === current.answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(answers[currentQ + 1]);
      setSubmitted(answers[currentQ + 1] !== null);
    } else {
      setFinished(true);
      if (!isCompleted) onComplete();
    }
  };

  const getDifficultyColor = (diff: string) => {
    if (diff === "Easy") return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    if (diff === "Medium") return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    return "bg-rose-500/10 text-rose-500 border-rose-500/20";
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="glass w-full max-w-lg rounded-3xl p-6 shadow-2xl"
        >
          {/* Header */}
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                {challenge.title}
              </h2>
              <div className="mt-2 flex items-center gap-2">
                <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20">MCQ</Badge>
                <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                  {challenge.difficulty}
                </Badge>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {finished ? (
            /* Results screen */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4 py-6 text-center"
            >
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-4xl">{score === questions.length ? "🎉" : score >= questions.length / 2 ? "👏" : "💪"}</span>
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold text-foreground">
                  {score} / {questions.length}
                </h3>
                <p className="mt-1 text-muted-foreground font-mono text-sm">
                  {score === questions.length
                    ? "Perfect score! Excellent work."
                    : score >= questions.length / 2
                    ? "Good job! Keep practicing."
                    : "Keep at it — practice makes perfect!"}
                </p>
              </div>
              <div className="w-full rounded-2xl bg-primary/5 border border-primary/10 p-4">
                <p className="font-mono text-xs text-muted-foreground">Challenge marked as completed ✓</p>
              </div>
              <Button onClick={onClose} className="w-full rounded-xl">
                Close
              </Button>
            </motion.div>
          ) : (
            /* Quiz screen */
            <>
              {/* Progress dots */}
              <div className="mb-5 flex items-center gap-1.5">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-all duration-300",
                      i < currentQ
                        ? "bg-primary"
                        : i === currentQ
                        ? "bg-primary/60"
                        : "bg-muted/40"
                    )}
                  />
                ))}
              </div>

              <p className="mb-1 font-mono text-xs text-muted-foreground">
                Question {currentQ + 1} of {questions.length}
              </p>
              <h3 className="mb-5 font-heading text-base font-semibold text-foreground leading-snug">
                {current.q}
              </h3>

              <div className="space-y-3">
                {current.options.map((opt, idx) => {
                  const isSelected = selected === idx;
                  const isCorrect = idx === current.answer;
                  const showResult = submitted;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      className={cn(
                        "w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200",
                        !showResult && !isSelected && "border-border/40 bg-muted/10 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-foreground",
                        !showResult && isSelected && "border-primary/60 bg-primary/10 text-foreground",
                        showResult && isCorrect && "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
                        showResult && isSelected && !isCorrect && "border-rose-500/50 bg-rose-500/10 text-rose-400",
                        showResult && !isSelected && !isCorrect && "border-border/30 bg-muted/5 text-muted-foreground opacity-60"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                          !showResult && isSelected && "border-primary bg-primary/20",
                          !showResult && !isSelected && "border-border/50",
                          showResult && isCorrect && "border-emerald-500 bg-emerald-500/20",
                          showResult && isSelected && !isCorrect && "border-rose-500 bg-rose-500/20",
                        )}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {opt}
                        {showResult && isCorrect && (
                          <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-500" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-end">
                {!submitted ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={selected === null}
                    className="rounded-xl gap-2"
                  >
                    Submit Answer
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="rounded-xl gap-2">
                    {currentQ < questions.length - 1 ? "Next Question" : "See Results"}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
