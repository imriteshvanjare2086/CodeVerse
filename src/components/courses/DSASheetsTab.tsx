import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Database, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import dsaSheetsData from "@/data/dsaSheets.json";

export interface Sheet {
  id: number;
  title: string;
  creator: string;
  description: string;
  link: string;
}

const sheets = dsaSheetsData as Sheet[];

export function DSASheetsTab() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return sheets.filter((s) => {
      const q = search.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.creator.toLowerCase().includes(q)
      );
    });
  }, [search]);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search sheets by title or creator..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card/40 border-border/40 focus:bg-card/60 transition-all max-w-md"
          />
        </div>
        <span className="shrink-0 font-mono text-xs text-muted-foreground whitespace-nowrap">
          {filtered.length} format{filtered.length !== 1 ? "s" : ""}
        </span>
      </motion.div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center gap-4"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/20">
            <Database className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground">No sheets found</h3>
            <p className="mt-1 font-mono text-sm text-muted-foreground max-w-xs mx-auto">
              Try a different search term.
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((sheet, i) => (
              <SheetCard key={sheet.id} sheet={sheet} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

interface SheetCardProps {
  sheet: Sheet;
  index: number;
}

export function SheetCard({ sheet, index }: SheetCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: "easeOut" }}
      layout
      className="glass group flex flex-col overflow-hidden rounded-2xl border border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-500/5 hover:border-rose-500/20 p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20">
          <Database className="h-5 w-5 text-rose-400" />
        </div>
        <Badge variant="outline" className="font-mono text-[10px] bg-rose-500/5 text-rose-400 border-rose-500/20">
          DSA Sheet
        </Badge>
      </div>

      <div className="flex flex-col flex-1 space-y-2">
        <h3 className="font-heading text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-rose-400">
          {sheet.title}
        </h3>
        <p className="font-mono text-xs text-muted-foreground flex items-center gap-1.5 pb-2 border-b border-border/40">
           By {sheet.creator}
        </p>
        <p className="font-mono text-sm text-muted-foreground flex-1 pt-1 leading-relaxed">
          {sheet.description}
        </p>

        <div className="pt-4 mt-auto">
          <Button
            size="sm"
            onClick={() => window.open(sheet.link, "_blank")}
            className="w-full gap-2 rounded-xl font-mono text-xs bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300"
          >
            Open Sheet
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
