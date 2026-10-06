import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoEntry {
  id: string;
  title: string;
  label: string;
  embedId: string;
  color: string;
  textColor: string;
}

const VIDEOS: VideoEntry[] = [
  {
    id: "focus-music",
    title: "Deep Focus Music",
    label: "🎵 Lofi / Focus",
    embedId: "jfKfPfyJRdk",
    color: "from-violet-500/10 to-transparent",
    textColor: "text-violet-400",
  },
  {
    id: "motivation",
    title: "Best Motivational Speech",
    label: "🔥 Motivation",
    embedId: "mgmVOuLgFB0",
    color: "from-amber-500/10 to-transparent",
    textColor: "text-amber-400",
  },
  {
    id: "system-design",
    title: "Study With Me — Pomodoro",
    label: "📚 Study Session",
    embedId: "dm5C6wKHgSc",
    color: "from-emerald-500/10 to-transparent",
    textColor: "text-emerald-400",
  },
];

export function VideoSection() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <p className="font-mono text-sm text-muted-foreground text-center">
        Curated videos to help you focus, study, or get motivated.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {VIDEOS.map((video, i) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="group space-y-3"
          >
            {/* Video badge */}
            <div className="flex items-center justify-between">
              <span className={cn("font-mono text-xs font-semibold rounded-lg px-2.5 py-1 bg-muted/20", video.textColor)}>
                {video.label}
              </span>
              <a
                href={`https://www.youtube.com/watch?v=${video.embedId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Embed or thumbnail */}
            <div className={cn(
              "relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br aspect-video",
              video.color
            )}>
              {activeId === video.id ? (
                <iframe
                  className="absolute inset-0 h-full w-full rounded-2xl"
                  src={`https://www.youtube.com/embed/${video.embedId}?autoplay=1&rel=0`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.08 }}
                    onClick={() => setActiveId(video.id)}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground/10 border border-border/50 backdrop-blur-sm hover:bg-primary/20 hover:border-primary/40 transition-all duration-300"
                  >
                    <Play className="h-6 w-6 text-foreground fill-foreground" />
                  </motion.button>
                  <p className="font-heading text-sm font-semibold text-foreground text-center px-4 leading-snug">
                    {video.title}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
