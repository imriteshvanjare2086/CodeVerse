import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ───────────────────────────────────────────
   Memory Game
─────────────────────────────────────────── */
const EMOJI_POOL = ["🐶", "🐱", "🦊", "🐼", "🐨", "🦁", "🐸", "🦋"];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface MemoryCard {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function MemoryGame() {
  const init = (): MemoryCard[] =>
    shuffle([...EMOJI_POOL, ...EMOJI_POOL]).map((emoji, i) => ({
      id: i,
      emoji,
      flipped: false,
      matched: false,
    }));

  const [cards, setCards] = useState<MemoryCard[]>(init);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const won = cards.every((c) => c.matched);

  const flip = (id: number) => {
    const card = cards[id];
    if (locked || card.flipped || card.matched || flipped.length === 2) return;

    const newFlipped = [...flipped, id];
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, flipped: true } : c))
    );
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setLocked(true);
      const [a, b] = newFlipped;
      setTimeout(() => {
        setCards((prev) => {
          const isMatch = prev[a].emoji === prev[b].emoji;
          return prev.map((c) =>
            c.id === a || c.id === b
              ? { ...c, matched: isMatch, flipped: isMatch }
              : c
          );
        });
        setFlipped([]);
        setLocked(false);
      }, 800);
    }
  };

  const reset = () => {
    setCards(init());
    setFlipped([]);
    setMoves(0);
    setLocked(false);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-xs">
        <span className="font-mono text-sm text-muted-foreground">
          Moves: <span className="text-foreground font-bold">{moves}</span>
        </span>
        <Button variant="outline" size="sm" onClick={reset} className="rounded-xl gap-2 font-mono text-xs">
          <RotateCcw className="h-3.5 w-3.5" /> Shuffle
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-xs">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            onClick={() => flip(card.id)}
            whileTap={{ scale: 0.92 }}
            className={cn(
              "h-14 w-14 rounded-xl text-2xl border-2 transition-all duration-300 flex items-center justify-center",
              card.matched
                ? "border-emerald-500/50 bg-emerald-500/10"
                : card.flipped
                ? "border-primary/50 bg-primary/10"
                : "border-border/40 bg-muted/20 hover:border-primary/30 hover:bg-primary/5 cursor-pointer"
            )}
          >
            <AnimatePresence mode="wait">
              {card.flipped || card.matched ? (
                <motion.span
                  key="front"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {card.emoji}
                </motion.span>
              ) : (
                <motion.span
                  key="back"
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-muted-foreground/40 text-lg"
                >
                  ?
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 text-center"
          >
            <p className="font-heading font-bold text-emerald-400">🎉 You won in {moves} moves!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───────────────────────────────────────────
   Click Speed Test
─────────────────────────────────────────── */
function ClickSpeedTest() {
  const DURATION = 5;
  const [clicks, setClicks] = useState(0);
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          setRunning(false);
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const handleClick = () => {
    if (!running && !finished) {
      setRunning(true);
      setClicks(1);
      return;
    }
    if (running) setClicks((c) => c + 1);
  };

  const reset = () => {
    setClicks(0);
    setRunning(false);
    setTimeLeft(DURATION);
    setFinished(false);
  };

  const cps = finished ? (clicks / DURATION).toFixed(1) : null;
  const getRating = (c: number) => {
    const cps = c / DURATION;
    if (cps >= 10) return { label: "Insane! 🔥", color: "text-rose-400" };
    if (cps >= 7) return { label: "Lightning fast! ⚡", color: "text-amber-400" };
    if (cps >= 5) return { label: "Pretty quick! 💪", color: "text-primary" };
    return { label: "Keep practicing! 😄", color: "text-muted-foreground" };
  };

  const pct = ((DURATION - timeLeft) / DURATION) * 100;

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="font-mono text-sm text-muted-foreground text-center max-w-xs">
        Click the button as fast as you can for 5 seconds!
      </p>

      {/* Progress bar */}
      <div className="h-2 w-full max-w-xs rounded-full bg-muted/30 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
          style={{ width: `${running ? pct : finished ? 100 : 0}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="font-mono text-5xl font-bold text-foreground">{clicks}</p>
          <p className="font-mono text-xs text-muted-foreground">clicks</p>
        </div>
        <div className="text-center">
          <p className="font-mono text-5xl font-bold text-primary">{running ? timeLeft : finished ? 0 : DURATION}</p>
          <p className="font-mono text-xs text-muted-foreground">seconds</p>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={handleClick}
        disabled={finished}
        className={cn(
          "h-24 w-48 rounded-3xl font-heading text-lg font-bold transition-all duration-200 shadow-lg",
          !running && !finished && "bg-primary text-primary-foreground hover:bg-primary/90",
          running && "bg-amber-500 text-white hover:bg-amber-400 cursor-pointer",
          finished && "bg-muted/20 text-muted-foreground cursor-not-allowed"
        )}
      >
        {!running && !finished ? (
          <><Zap className="inline h-5 w-5 mr-2" />Click Me!</>
        ) : running ? (
          <><Zap className="inline h-5 w-5 mr-2" />CLICK!</>
        ) : (
          "Done!"
        )}
      </motion.button>

      <AnimatePresence>
        {finished && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-1"
          >
            <p className={cn("font-heading text-xl font-bold", getRating(clicks).color)}>
              {getRating(clicks).label}
            </p>
            <p className="font-mono text-sm text-muted-foreground">
              {cps} clicks/second · {clicks} total
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <Button variant="outline" size="sm" onClick={reset} className="rounded-xl gap-2 font-mono text-xs">
        <RotateCcw className="h-3.5 w-3.5" /> Try Again
      </Button>
    </div>
  );
}

/* ───────────────────────────────────────────
   Main GameCard
─────────────────────────────────────────── */
type Game = "memory" | "click";

export function GameCard() {
  const [game, setGame] = useState<Game>("memory");

  return (
    <div className="space-y-8">
      <div className="flex justify-center gap-2">
        {[
          { id: "memory" as Game, label: "🃏 Memory Game" },
          { id: "click" as Game, label: "⚡ Click Speed Test" },
        ].map((g) => (
          <button
            key={g.id}
            onClick={() => setGame(g.id)}
            className={cn(
              "rounded-xl px-4 py-2 font-mono text-xs transition-all duration-200 border",
              game === g.id
                ? "bg-primary/15 border-primary/40 text-primary"
                : "bg-muted/10 border-border/30 text-muted-foreground hover:border-primary/20 hover:text-foreground"
            )}
          >
            {g.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={game}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {game === "memory" ? <MemoryGame /> : <ClickSpeedTest />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
