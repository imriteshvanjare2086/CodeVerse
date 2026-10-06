import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const DURATIONS = [5, 10, 15, 25] as const;
type Duration = (typeof DURATIONS)[number];

function fmt(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

export function TimerCard() {
  const [minutes, setMinutes] = useState<Duration>(10);
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const total = minutes * 60;
  const pct = ((total - secondsLeft) / total) * 100;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - (total - secondsLeft) / total);

  const playAlert = useCallback(() => {
    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      [0, 0.3, 0.6].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.4, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.5);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.5);
      });
    } catch (_) {}
  }, []);

  useEffect(() => {
    setSecondsLeft(minutes * 60);
    setRunning(false);
    setFinished(false);
  }, [minutes]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setRunning(false);
          setFinished(true);
          playAlert();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, playAlert]);

  const reset = () => {
    setSecondsLeft(minutes * 60);
    setRunning(false);
    setFinished(false);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Duration picker */}
      <div className="flex items-center gap-2">
        {DURATIONS.map((d) => (
          <Button
            key={d}
            size="sm"
            variant={minutes === d ? "default" : "outline"}
            className="rounded-xl font-mono text-xs"
            onClick={() => setMinutes(d)}
          >
            {d} min
          </Button>
        ))}
      </div>

      {/* SVG ring timer */}
      <div className="relative flex items-center justify-center">
        <svg width="200" height="200" className="-rotate-90">
          <circle cx="100" cy="100" r={radius} stroke="hsl(var(--border))" strokeWidth="8" fill="none" />
          <circle
            cx="100" cy="100" r={radius}
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-linear"
            style={{ filter: "drop-shadow(0 0 8px hsl(var(--primary) / 0.6))" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center gap-1">
          <span className="font-mono text-5xl font-bold tracking-wider text-foreground tabular-nums">
            {fmt(secondsLeft)}
          </span>
          <span className="font-mono text-xs text-muted-foreground">{minutes} min session</span>
        </div>
      </div>

      {/* Finished message */}
      <AnimatePresence>
        {finished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl bg-primary/10 border border-primary/20 px-6 py-3 text-center"
          >
            <p className="font-heading font-semibold text-primary">🎉 Session complete!</p>
            <p className="font-mono text-xs text-muted-foreground mt-1">Take a deep breath. You earned it.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={reset}
          className="rounded-xl gap-2 font-mono text-xs"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
        <Button
          size="lg"
          onClick={() => { setFinished(false); setRunning((r) => !r); }}
          className={cn(
            "rounded-2xl gap-2 px-8 font-mono text-sm transition-all duration-300",
            running && "bg-amber-500 hover:bg-amber-600 text-white"
          )}
        >
          {running ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> {finished ? "Restart" : "Start"}</>}
        </Button>
      </div>

      <p className="font-mono text-xs text-muted-foreground opacity-60 flex items-center gap-2">
        <Timer className="h-3 w-3" />
        Sound alert plays when timer ends
      </p>
    </div>
  );
}
