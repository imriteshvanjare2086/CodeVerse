import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen } from "lucide-react";
import { NoteCard, Note } from "./NoteCard";

interface NotesGridProps {
  notes: Note[];
}

export function NotesGrid({ notes }: NotesGridProps) {
  if (notes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24 text-center gap-4"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/20">
          <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground">No notes found</h3>
          <p className="mt-1 font-mono text-sm text-muted-foreground max-w-xs mx-auto">
            Try adjusting your search criteria or select a different category.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <AnimatePresence mode="popLayout">
        {notes.map((note, i) => (
          <NoteCard key={note.id} note={note} index={i} />
        ))}
      </AnimatePresence>
    </div>
  );
}
