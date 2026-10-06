import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FiltersBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  platform: string;
  setPlatform: (value: string) => void;
  difficulty: string;
  setDifficulty: (value: string) => void;
}

export function FiltersBar({
  searchTerm,
  setSearchTerm,
  platform,
  setPlatform,
  difficulty,
  setDifficulty,
}: FiltersBarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search problems by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-card/40 border-border/40 focus:bg-card/60 transition-all"
        />
      </div>
      
      <div className="flex flex-wrap gap-4">
        <div className="w-[160px]">
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="bg-card/40 border-border/40">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="leetcode">LeetCode</SelectItem>
              <SelectItem value="codeforces">Codeforces</SelectItem>
              <SelectItem value="codechef">CodeChef</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-[160px]">
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="bg-card/40 border-border/40">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
