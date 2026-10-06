import { api } from "@/lib/apiClient";

export type Platform = "leetcode" | "codeforces" | "codechef";
export type ProblemDifficulty = "easy" | "medium" | "hard";
export type ProblemStatus = "solved" | "attempted" | "unsolved";

export type Problem = {
  _id: string;
  title: string;
  platform: Platform;
  difficulty: ProblemDifficulty;
  tags: string[];
  url: string;
  status?: ProblemStatus;
};

export type ProblemFilters = {
  platform?: Platform;
  difficulty?: ProblemDifficulty;
  topic?: string;
  status?: ProblemStatus;
};

export async function fetchProblems(filters: ProblemFilters) {
  const res = await api.get("/problems", { params: filters });
  return res.data.problems as Problem[];
}

