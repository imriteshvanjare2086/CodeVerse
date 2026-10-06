import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import type { GoalRecommendation } from '@/components/goals/RecommendationCard';

export function useRecommendations(profile?: { _id?: string; updatedAt?: string }, enabled = true) {
  // Only coding inputs invalidate recommendations; unrelated profile edits do not.
  const inputs = profile as Record<string, unknown> | undefined;
  const fingerprint = JSON.stringify(['skills', ...['leetcode', 'codeforces', 'codechef'].flatMap(p => [`${p}Username`, `${p}Stats`, `${p}RatingHistory`])].map(key => inputs?.[key]));
  const storageKey = `codetrack-recommendations-v2:${profile?._id}`;
  let saved: { fingerprint: string; at: number; items: GoalRecommendation[] } | undefined;
  try {
    const entry = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (entry?.fingerprint === fingerprint && Array.isArray(entry.items) && entry.items.length && Date.now() - entry.at < 24 * 60 * 60 * 1000) saved = entry;
  } catch { /* Storage can be unavailable; ordinary inference still works. */ }
  return useQuery({
    queryKey: ['gemma-recommendations', profile?._id, fingerprint],
    enabled: enabled && !!profile?._id,
    initialData: saved?.items,
    initialDataUpdatedAt: saved?.at,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
    queryFn: async () => {
      const { data } = await api.post<{ recommendations: GoalRecommendation[] }>('/ai/recommendations', {}, { timeout: 55000 });
      try { localStorage.setItem(storageKey, JSON.stringify({ fingerprint, at: Date.now(), items: data.recommendations })); } catch { /* Quota/privacy mode must not fail the request. */ }
      return data.recommendations;
    },
  });
}
