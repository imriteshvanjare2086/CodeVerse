import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Brain, Gamepad2, Sparkles, Youtube, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TimerCard } from "@/components/focus/TimerCard";
import { MeditationCard } from "@/components/focus/MeditationCard";
import { GameCard } from "@/components/focus/GameCard";
import { QuoteCard } from "@/components/focus/QuoteCard";
import { VideoSection } from "@/components/focus/VideoSection";

const STORAGE_KEY = "focus_mode_last_tab";

type Tab = "timer" | "meditation" | "games" | "motivation" | "videos";

const TABS: { id: Tab; label: string; Icon: React.ElementType; color: string; desc: string }[] = [
  { id: "timer",      label: "Timer",      Icon: Timer,     color: "text-primary border-primary/40 bg-primary/10",          desc: "Focus session timer" },
  { id: "meditation", label: "Meditate",   Icon: Brain,     color: "text-violet-400 border-violet-400/40 bg-violet-400/10", desc: "Breathing exercises" },
  { id: "games",      label: "Games",      Icon: Gamepad2,  color: "text-sky-400 border-sky-400/40 bg-sky-400/10",          desc: "Light mental games" },
  { id: "motivation", label: "Motivation", Icon: Sparkles,  color: "text-amber-400 border-amber-400/40 bg-amber-400/10",    desc: "Inspiring quotes" },
  { id: "videos",     label: "Videos",     Icon: Youtube,   color: "text-rose-400 border-rose-400/40 bg-rose-400/10",       desc: "Focus & motivation" },
];

function loadTab(): Tab {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Tab | null;
    if (stored && TABS.find((t) => t.id === stored)) return stored;
  } catch (_) {}
  return "timer";
}

export default function FocusMode() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>(loadTab);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, activeTab);
  }, [activeTab]);

  const current = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen p-4 md:p-8">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-heading text-2xl font-bold text-foreground flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                <Timer className="h-5 w-5 text-primary" />
              </div>
              Focus Mode
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-1 font-mono text-xs text-muted-foreground pl-14"
            >
              Take a break. Reset your mind. Come back stronger.
            </motion.p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="rounded-xl gap-2 font-mono text-xs border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
          >
            <X className="h-3.5 w-3.5" />
            Exit Mode
          </Button>
        </div>

        {/* ── Tab Nav ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 rounded-2xl border px-4 py-2.5 font-mono text-xs font-medium transition-all duration-300",
                  isActive
                    ? tab.color
                    : "border-border/40 bg-muted/10 text-muted-foreground hover:border-border/70 hover:text-foreground hover:bg-muted/20"
                )}
              >
                <tab.Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* ── Content panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 md:p-10"
        >
          {/* Panel header */}
          <div className="mb-8 flex items-center gap-3">
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl border", current.color)}>
              <current.Icon className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground">{current.label}</h2>
              <p className="font-mono text-xs text-muted-foreground">{current.desc}</p>
            </div>
          </div>

          {/* Tab content — animated */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {activeTab === "timer"      && <TimerCard />}
              {activeTab === "meditation" && <MeditationCard />}
              {activeTab === "games"      && <GameCard />}
              {activeTab === "motivation" && <QuoteCard />}
              {activeTab === "videos"     && <VideoSection />}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <p className="mt-6 text-center font-mono text-[10px] text-muted-foreground/40">
          Focus Mode · Your last tab is restored automatically
        </p>
      </div>
    </div>
  );
}
