// Legacy file kept for compatibility (previously bootstrapped anonymous auth).
// New auth flow uses Login/Register + ProtectedRoute.
export function useAuthBootstrap() {
  return { ready: true, error: null as string | null };
}

