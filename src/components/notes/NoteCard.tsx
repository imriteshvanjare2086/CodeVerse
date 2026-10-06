import { motion } from "framer-motion";
import { ExternalLink, ScrollText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Note {
  id: number;
  title: string;
  category: string;
  subCategory: string;
  type: string;
  link: string;
}

interface NoteCardProps {
  note: Note;
  index: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Programming Languages": "bg-primary/10 text-primary border-primary/20",
  "Web Development":       "bg-sky-500/10 text-sky-400 border-sky-500/20",
  "Core CS":               "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "Data Science & AI":     "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "DevOps & Cloud":        "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "System Design":         "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
};

export function NoteCard({ note, index }: NoteCardProps) {
  const catColor = CATEGORY_COLORS[note.category] ?? "bg-muted/20 text-muted-foreground border-border/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: "easeOut" }}
      layout
      className="glass group flex flex-col overflow-hidden rounded-2xl border border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 p-5"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/20 border border-border/40 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
          <ScrollText className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all" />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Badge variant="outline" className={cn("font-mono text-[10px]", catColor)}>
            {note.category}
          </Badge>
          <Badge variant="secondary" className="font-mono text-[9px] opacity-80">
            {note.type}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col flex-1 space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-wider text-primary mb-1">
          {note.subCategory}
        </p>
        <h3 className="font-heading text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {note.title}
        </h3>

        <div className="pt-5 mt-auto">
          <Button
            size="sm"
            onClick={() => window.open(note.link, "_blank")}
            className="w-full gap-2 rounded-xl font-mono text-xs bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            Open Notes
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
