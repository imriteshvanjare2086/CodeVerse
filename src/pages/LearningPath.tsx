import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Map, BookOpen, Layers } from "lucide-react";

import { AssessmentData, RoadmapStep } from "@/components/learning-path/types";
import { AssessmentForm } from "@/components/learning-path/AssessmentForm";
import { RoadmapSection } from "@/components/learning-path/RoadmapSection";
import { CareerGuidance } from "@/components/learning-path/CareerGuidance";

const getRoadmapByLevel = (level: "Beginner" | "Intermediate" | "Advanced" | null): RoadmapStep[] => {
  switch (level) {
    case "Beginner":
      return [
        {
          title: "1. Programming Fundamentals",
          description: "Learn syntax, variables, loops, and conditions using C or C++.",
          levelTag: "Beginner",
        },
        {
          title: "2. Logic Building",
          description: "Solve basic pattern printing and number math problems to build logic.",
          levelTag: "Beginner",
        },
        {
          title: "3. Intro to Data Structures",
          description: "Understand Arrays, Strings, and basic searching/sorting algorithms.",
          levelTag: "Beginner",
        },
      ];
    case "Intermediate":
      return [
        {
          title: "1. Advanced Data Structures",
          description: "Master Linked Lists, Stacks, Queues, and Recursion techniques.",
          levelTag: "Intermediate",
        },
        {
          title: "2. Frontend Web Development",
          description: "Build interfaces using HTML, CSS, JavaScript, and Tailwind.",
          levelTag: "Intermediate",
        },
        {
          title: "3. Object Oriented Programming",
          description: "Learn Classes, Inheritance, Polymorphism, and Encapsulation.",
          levelTag: "Intermediate",
        },
      ];
    case "Advanced":
      return [
        {
          title: "1. Complex Algorithms",
          description: "Deep dive into Dynamic Programming, Graphs, and Trees.",
          levelTag: "Advanced",
        },
        {
          title: "2. Full Stack Architecture",
          description: "Design applications using Node.js, React, and MongoDB/SQL.",
          levelTag: "Advanced",
        },
        {
          title: "3. System Design Basics",
          description: "Understand scaling, load balancing, caching, and database sharding.",
          levelTag: "Advanced",
        },
      ];
    default:
      return [];
  }
};

export default function LearningPath() {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("codecraft_learning_path");
    if (saved) {
      try {
        setAssessmentData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse learning path", e);
      }
    }
  }, []);

  const handleAssessmentComplete = (data: AssessmentData) => {
    setAssessmentData(data);
    setIsAssessing(false);
    localStorage.setItem("codecraft_learning_path", JSON.stringify(data));
  };

  const handleReassess = () => {
    setAssessmentData(null);
    setIsAssessing(true);
    localStorage.removeItem("codecraft_learning_path");
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-8">
        <PageHeader
          title="Learning Path"
          description="Your personalized AI-driven roadmap to mastery."
        />

        {!assessmentData && !isAssessing ? (
          <div className="glass rounded-3xl border border-border/50 p-12 text-center flex flex-col items-center justify-center gap-6 min-h-[50vh]">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 border border-primary/20 shadow-xl shadow-primary/5">
              <Map className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2 max-w-lg">
              <h2 className="font-heading font-bold text-2xl text-foreground">
                No more confusion. Just follow your path.
              </h2>
              <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                Answer a few quick questions to generate your highly personalized, step-by-step learning roadmap tailored to your specific goals and current skill level.
              </p>
            </div>
            <Button onClick={() => setIsAssessing(true)} className="mt-4 gap-2 rounded-xl h-12 px-8 text-base shadow-primary/20 shadow-lg">
              Start Assessment
            </Button>
          </div>
        ) : isAssessing ? (
          <div className="py-8">
            <AssessmentForm onComplete={handleAssessmentComplete} />
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            {/* Top Info Strip */}
            <div className="glass rounded-3xl border border-border/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shrink-0">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-mono text-xs text-muted-foreground mb-1 uppercase tracking-wider">Current Selected Level</p>
                  <div className="flex items-center gap-3">
                    <h2 className="font-heading text-2xl font-bold text-foreground">
                      {assessmentData?.level}
                    </h2>
                    <Badge variant="secondary" className="font-mono">
                      {assessmentData?.goal}
                    </Badge>
                  </div>
                </div>
              </div>

              <Button onClick={handleReassess} variant="outline" className="gap-2 rounded-xl shrink-0">
                <RotateCcw className="h-4 w-4" /> Reassess
              </Button>
            </div>

            {/* Roadmap Generation */}
            {assessmentData?.level && (
              <RoadmapSection steps={getRoadmapByLevel(assessmentData.level)} />
            )}

            {/* Career Guidance */}
            {assessmentData?.goal && (
              <CareerGuidance goal={assessmentData.goal} />
            )}

            {/* Recommended Resources Link Block */}
            <div className="glass relative overflow-hidden rounded-3xl border border-primary/30 p-8 bg-gradient-to-br from-primary/10 to-transparent">
              <div className="flex flex-col md:flex-row gap-6 items-center justify-between relative z-10">
                <div className="text-center md:text-left space-y-2">
                  <h3 className="font-heading text-xl font-bold text-foreground flex items-center justify-center md:justify-start gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Recommended Resources
                  </h3>
                  <p className="font-mono text-sm text-foreground/80 max-w-md">
                    Jump into our curated courses and DSA sheets designed specifically for your target goal.
                  </p>
                </div>
                <Link to="/courses">
                  <Button className="rounded-xl px-8 h-12 shadow-xl shadow-primary/20">
                    Explore Courses
                  </Button>
                </Link>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
