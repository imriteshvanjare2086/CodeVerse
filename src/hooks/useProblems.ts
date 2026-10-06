import { useQuery } from "@tanstack/react-query";
import { fetchProblems, type ProblemFilters } from "@/services/problems";

export function useProblems(filters: ProblemFilters) {
  return useQuery({
    queryKey: ["problems", filters],
    queryFn: async () => fetchProblems(filters),
  });
}

