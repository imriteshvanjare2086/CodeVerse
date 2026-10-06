import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ScrollText } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { NotesFilterBar } from "@/components/notes/NotesFilterBar";
import { NotesGrid } from "@/components/notes/NotesGrid";
import { Note } from "@/components/notes/NoteCard";
import notesData from "@/data/notes.json";

export default function Notes() {
  const notes = notesData as Note[];
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [subCategory, setSubCategory] = useState("All");

  const filtered = useMemo(() => {
    return notes.filter((n) => {
      const matchesCategory = category === "All" || n.category === category;
      const matchesSubCategory = subCategory === "All" || n.subCategory === subCategory;
      const q = search.toLowerCase();
      const matchesSearch =
        n.title.toLowerCase().includes(q) ||
        n.subCategory.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q);
      
      return matchesCategory && matchesSubCategory && matchesSearch;
    });
  }, [notes, search, category, subCategory]);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <PageHeader
          title="Curated Notes"
          description="Access high-quality handwritten notes and cheatsheets across programming, web dev, and core CS."
        />

        {/* Hero stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-5"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Header / Stats Info */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                <ScrollText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-heading font-bold text-foreground text-lg">
                  {notes.length} Handwritten Resources
                </p>
                <p className="font-mono text-xs text-muted-foreground mt-0.5">
                  Hand-picked links to the best community notes
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-4"
        >
          <NotesFilterBar
            notes={notes}
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            subCategory={subCategory}
            setSubCategory={setSubCategory}
            filteredCount={filtered.length}
          />
        </motion.div>

        {/* Grid */}
        <NotesGrid notes={filtered} />
      </div>
    </DashboardLayout>
  );
}
