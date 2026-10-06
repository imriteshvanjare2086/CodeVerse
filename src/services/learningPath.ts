import { api } from "@/lib/apiClient";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type LearningSubtopic = { name: string; solved: number; total: number };

export type LearningTopic = {
  _id: string;
  name: string;
  icon: string;
  totalProblems: number;
  solved: number;
  difficulty: Difficulty;
  subtopics: LearningSubtopic[];
};

export type LearningSheet = {
  _id: string;
  name: string;
  description: string;
  totalProblems: number;
  solved: number;
  topics: string[];
  level: Difficulty;
};

export async function fetchLearningPath() {
  const res = await api.get("/learning-path");
  return res.data as { topics: LearningTopic[]; sheets: LearningSheet[] };
}

