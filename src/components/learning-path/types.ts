export type Level = "Beginner" | "Intermediate" | "Advanced" | null;
export type Goal = "Placement" | "Web Developer" | "Competitive Programming" | "General Learning" | null;

export interface AssessmentData {
  level: Level;
  knownTopics: string[];
  goal: Goal;
}

export interface RoadmapStep {
  title: string;
  description: string;
  levelTag: string;
}
