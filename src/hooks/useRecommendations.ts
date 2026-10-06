import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import type { GoalRecommendation } from '@/components/goals/RecommendationCard';

export function useRecommendations(profile?: { _id?: string; updatedAt?: string }, enabled = true) {
  return useQuery({
    queryKey: ['gemma-recommendations', profile?._id, profile?.updatedAt],
    enabled: enabled && !!profile?._id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
    queryFn: async () => {
      const { data } = await api.post<{ recommendations: GoalRecommendation[] }>('/ai/recommendations', {}, { timeout: 55000 });
      return data.recommendations;
    },
  });
}
