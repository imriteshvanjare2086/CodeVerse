import { api } from "@/lib/apiClient";

export type WeeklyChallenge = {
  _id: string;
  label: string;
  target: number;
  current: number;
  completed: boolean;
};

export async function fetchChallenges() {
  const res = await api.get("/challenges");
  return res.data.challenges as WeeklyChallenge[];
}

export async function completeChallenge(id: string) {
  await api.post(`/challenges/${id}/complete`);
}

