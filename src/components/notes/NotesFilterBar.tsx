import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo } from "react";
import { Note } from "./NoteCard";

interface NotesFilterBarProps {
  notes: Note[];
  search: string;
  setSearch: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  subCategory: string;
  setSubCategory: (v: string) => void;
  filteredCount: number;
}

const CATEGORIES = [
  "All",
  "Programming Languages",
  "Web Development",
  "Core CS",
  "Data Science & AI",
  "DevOps & Cloud",
  "System Design"
] as const;

export function NotesFilterBar({
  notes,
  search,
  setSearch,
  category,
  setCategory,
  subCategory,
  setSubCategory,
  filteredCount,
}: NotesFilterBarProps) {
  
  // Dynamically get available subcategories based on the current active Category
  const availableSubcategories = useMemo(() => {
    let base = notes;
    if (category !== "All") {
      base = base.filter((n) => n.category === category);
    }
    const subs = new Set(base.map((n) => n.subCategory));
    return ["All", ...Array.from(subs).sort()];
  }, [notes, category]);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search notes by title or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-card/40 border-border/40 focus:bg-card/60 transition-all w-full"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Category dropdown */}
        <div className="w-full sm:w-[220px]">
          <Select
            value={category}
            onValueChange={(val) => {
              setCategory(val);
              setSubCategory("All"); // Reset sub on category change
            }}
          >
            <SelectTrigger className="bg-card/40 border-border/40">
              <SelectValue placeholder="Domain" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c === "All" ? "All Domains" : c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subcategory dropdown */}
        <div className="w-full sm:w-[200px]">
          <Select value={subCategory} onValueChange={setSubCategory}>
            <SelectTrigger className="bg-card/40 border-border/40">
              <SelectValue placeholder="Topic" />
            </SelectTrigger>
            <SelectContent>
              {availableSubcategories.map((sc) => (
                <SelectItem key={sc} value={sc}>
                  {sc === "All" ? "All Topics" : sc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Count badge */}
      <span className="shrink-0 font-mono text-xs text-muted-foreground whitespace-nowrap hidden xl:block">
        {filteredCount} note{filteredCount !== 1 && "s"} found
      </span>
    </div>
  );
}
