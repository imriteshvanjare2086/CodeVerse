import { setTimeout as delay } from 'node:timers/promises';

// Retry only before a response stream is handed to the caller. Never duplicate
// already displayed text, retry authentication failures, or extend the deadline.
export async function providerFetch(url, options, { fetchFn = fetch, wait = delay } = {}) {
  for (let attempt = 0; attempt < 3; attempt++) {
    options.signal?.throwIfAborted();
    let response;
    try {
      response = await fetchFn(url, options);
    } catch (error) {
      if (options.signal?.aborted || attempt === 2 || !(error instanceof TypeError)) throw error;
    }
    if (response && (![500, 502, 503, 504].includes(response.status) || attempt === 2)) return response;
    await response?.body?.cancel();
    await wait(400 * (attempt + 1), undefined, { signal: options.signal });
  }
}
