import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import quotesData from "@/data/quotes.json";

interface QuoteEntry {
  id: number;
  quote: string;
  author: string;
}

const quotes = quotesData as QuoteEntry[];

export function QuoteCard() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * quotes.length));
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i + 1) % quotes.length);
  }, []);

  const current = quotes[index];

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Big quote icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
        <Quote className="h-8 w-8 text-primary" />
      </div>

      {/* Quote text */}
      <div className="w-full max-w-lg min-h-[120px] flex items-center justify-center px-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            initial={{ opacity: 0, y: 20 * direction }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 * direction }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="text-center space-y-4"
          >
            <p className="font-heading text-xl font-semibold leading-relaxed text-foreground">
              "{current.quote}"
            </p>
            <p className="font-mono text-sm text-primary">— {current.author}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Quote dots */}
      <div className="flex items-center gap-1.5">
        {quotes.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-primary" : "w-1.5 bg-muted/50 hover:bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Next button */}
      <Button
        onClick={next}
        className="gap-2 rounded-2xl px-8 font-mono text-sm bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
      >
        <RefreshCw className="h-4 w-4" />
        Next Quote
      </Button>

      <p className="font-mono text-xs text-muted-foreground opacity-50">
        {index + 1} of {quotes.length} quotes
      </p>
    </div>
  );
}
