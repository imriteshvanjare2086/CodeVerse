import { createHash } from 'node:crypto';

// Store only validated inference results, isolated by user and relevant profile data.
export function createRecommendationCache({ ttl = 10 * 60 * 1000, limit = 200, now = Date.now } = {}) {
  const entries = new Map();
  return async function cached(userId, input, generate) {
    const key = `${userId}:${createHash('sha256').update(JSON.stringify(input)).digest('hex')}`;
    const existing = entries.get(key);
    if (existing && (existing.pending || existing.expires > now())) return existing.promise;
    const entry = { pending: true, expires: 0 };
    entry.promise = Promise.resolve().then(generate).then(result => {
      entry.pending = false;
      entry.expires = now() + ttl;
      return result;
    }).catch(error => {
      if (entries.get(key) === entry) entries.delete(key);
      throw error;
    });
    entries.delete(key);
    entries.set(key, entry);
    while (entries.size > limit) entries.delete(entries.keys().next().value);
    return entry.promise;
  };
}
