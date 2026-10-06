import { motion } from "framer-motion";
import { ExternalLink, GraduationCap, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface Course {
  id: number;
  title: string;
  category: string;
  platform: string;
  instructor: string;
  thumbnail: string;
  link: string;
}

interface CourseCardProps {
  course: Course;
  index: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  DSA:               "bg-primary/10 text-primary border-primary/20",
  "Web Development": "bg-sky-500/10 text-sky-400 border-sky-500/20",
  OOPs:              "bg-violet-500/10 text-violet-400 border-violet-500/20",
  SQL:               "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Game Development": "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
  "UI/UX":           "bg-pink-500/10 text-pink-400 border-pink-500/20",
  "C++":             "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "C":               "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  "Python":          "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

export function CourseCard({ course, index }: CourseCardProps) {
  const [imgError, setImgError] = useState(false);
  const categoryColor = CATEGORY_COLORS[course.category] ?? "bg-muted/20 text-muted-foreground border-border/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: "easeOut" }}
      layout
      className="glass group flex flex-col overflow-hidden rounded-2xl border border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted/20">
        {!imgError ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10">
            <GraduationCap className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <PlayCircle className="h-8 w-8 text-white" />
          </div>
        </div>
        {/* Platform pill */}
        <div className="absolute top-3 right-3 rounded-lg bg-black/60 backdrop-blur-sm px-2 py-0.5 font-mono text-[10px] text-white/80">
          {course.platform}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Badge variant="outline" className={cn("w-fit font-mono text-xs", categoryColor)}>
          {course.category}
        </Badge>

        <h3 className="font-heading text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-2">
          {course.title}
        </h3>

        <p className="font-mono text-xs text-muted-foreground">
          👨‍🏫 {course.instructor}
        </p>

        <div className="mt-auto pt-2">
          <Button
            size="sm"
            onClick={() => window.open(course.link, "_blank")}
            className="w-full gap-2 rounded-xl font-mono text-xs bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            Watch Now
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Bottom accent */}
      <div className={cn(
        "h-0.5 w-0 transition-all duration-500 group-hover:w-full",
        course.category === "DSA"               && "bg-primary",
        course.category === "Web Development"   && "bg-sky-500",
        course.category === "OOPs"              && "bg-violet-500",
        course.category === "SQL"               && "bg-amber-500",
        course.category === "Game Development"  && "bg-fuchsia-500",
        course.category === "UI/UX"             && "bg-pink-500",
        course.category === "C++"               && "bg-blue-500",
        course.category === "C"                 && "bg-indigo-500",
        course.category === "Python"            && "bg-yellow-500"
      )} />
    </motion.div>
  );
}
