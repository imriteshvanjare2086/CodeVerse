import { renderHook, waitFor, cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, expect, test, vi } from 'vitest';
import type { ReactNode } from 'react';
import { useRecommendations } from './useRecommendations';
import { api } from '@/lib/apiClient';

vi.mock('@/lib/apiClient', () => ({ api: { post: vi.fn() } }));
afterEach(() => { cleanup(); localStorage.clear(); vi.clearAllMocks(); });
function wrapper() {
  const client = new QueryClient();
  return ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
test('restores saved results after reload and ignores unrelated profile updates', async () => {
  const items = [{ id: 'test', title: 'Test fixture' }];
  vi.mocked(api.post).mockResolvedValue({ data: { recommendations: items } });
  const first = renderHook(() => useRecommendations({ _id: 'a', updatedAt: 'old' }), { wrapper: wrapper() });
  await waitFor(() => expect(first.result.current.data).toEqual(items));
  first.unmount();
  const restored = renderHook(() => useRecommendations({ _id: 'a', updatedAt: 'new' }), { wrapper: wrapper() });
  expect(restored.result.current.data).toEqual(items);
  expect(restored.result.current.isLoading).toBe(false);
  expect(api.post).toHaveBeenCalledTimes(1);
});
test('does not reuse another user or changed coding statistics', async () => {
  vi.mocked(api.post).mockResolvedValue({ data: { recommendations: [{ id: 'test' }] } });
  const profile = { _id: 'a', codechefStats: { currentRating: 1454 } };
  const first = renderHook(() => useRecommendations(profile), { wrapper: wrapper() });
  await waitFor(() => expect(first.result.current.isSuccess).toBe(true));
  first.unmount();
  vi.mocked(api.post).mockImplementation(() => new Promise(() => {}));
  const changedProfile = { ...profile, codechefStats: { currentRating: 1600 } };
  const changed = renderHook(() => useRecommendations(changedProfile), { wrapper: wrapper() });
  const other = renderHook(() => useRecommendations({ ...profile, _id: 'b' }), { wrapper: wrapper() });
  expect(changed.result.current.data).toBeUndefined();
  expect(other.result.current.data).toBeUndefined();
});
