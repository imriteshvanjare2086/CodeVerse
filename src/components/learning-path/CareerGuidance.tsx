import { Goal } from "./types";
import { Briefcase, Terminal, Layout, Orbit } from "lucide-react";

export function CareerGuidance({ goal }: { goal: Goal }) {
  const getGuidance = () => {
    switch (goal) {
      case "Placement":
        return {
          icon: <Briefcase className="h-6 w-6 text-emerald-500" />,
          title: "Placement Preparation",
          color: "emerald",
          points: [
            "Master DSA (Arrays, Strings, LL, Trees, Graphs).",
            "Understand Core CS (OOPs, DBMS, OS, Networks).",
            "Build 2-3 strong scalable projects (Full-Stack).",
            "Practice mock interviews and behavioral questions."
          ]
        };
      case "Web Developer":
        return {
          icon: <Layout className="h-6 w-6 text-sky-500" />,
          title: "Web Developer Roadmap",
          color: "sky",
          points: [
            "Solidify HTML, CSS, and modern JavaScript.",
            "Master a frontend framework (React / Next.js).",
            "Learn backend basics (Node.js/Express or Python/Django).",
            "Understand databases (MongoDB or PostgreSQL)."
          ]
        };
      case "Competitive Programming":
        return {
          icon: <Terminal className="h-6 w-6 text-fuchsia-500" />,
          title: "Competitive Programming Focus",
          color: "fuchsia",
          points: [
            "Master CP Math (Number Theory, Combinatorics).",
            "Deep dive into Advanced Graph Theory & Trees.",
            "Solve dynamic programming on Codeforces/CodeChef.",
            "Participate in weekly contests consistently."
          ]
        };
      default:
        return {
          icon: <Orbit className="h-6 w-6 text-violet-500" />,
          title: "General Learning",
          color: "violet",
          points: [
            "Explore different technical domains broadly.",
            "Build small fun projects using new technologies.",
            "Understand how the web and computers interact.",
            "Focus on consistent daily coding habits."
          ]
        };
    }
  };

  const guidance = getGuidance();

  return (
    <div className="glass rounded-3xl border border-border/50 p-6 md:p-8 space-y-6">
      <h3 className="font-heading text-xl font-bold flex items-center gap-2 text-foreground">
        {guidance.icon}
        Career Guidance: {guidance.title}
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {guidance.points.map((point, index) => (
          <div key={index} className="flex gap-3 items-start bg-muted/10 p-4 rounded-xl border border-border/30">
            <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full bg-${guidance.color}-500/50`} />
            <p className="font-mono text-sm leading-relaxed text-muted-foreground">
              {point}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
