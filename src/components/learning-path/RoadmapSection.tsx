import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Milestone } from "lucide-react";
import { RoadmapStep } from "./types";

interface RoadmapSectionProps {
  steps: RoadmapStep[];
}

export function RoadmapSection({ steps }: RoadmapSectionProps) {
  return (
    <div className="glass rounded-3xl border border-border/50 p-6 md:p-8 space-y-6">
      <h3 className="font-heading text-xl font-bold flex items-center gap-2 text-foreground">
        <Milestone className="h-6 w-6 text-primary" />
        Recommended Path
      </h3>
      
      <div className="relative border-l border-primary/20 ml-3 pl-6 space-y-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {/* Timeline dot */}
            <div className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            </div>

            <div className="group rounded-2xl border border-border/50 bg-card/40 p-5 transition-all hover:bg-card/80 hover:border-primary/30">
              <div className="mb-2 flex items-center justify-between gap-4">
                <h4 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                  {step.title}
                </h4>
                <span className="shrink-0 rounded-md bg-muted/40 px-2.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                  {step.levelTag}
                </span>
              </div>
              <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
