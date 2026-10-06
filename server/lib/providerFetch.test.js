import test from 'node:test';
import assert from 'node:assert/strict';
import { providerFetch } from './providerFetch.js';

test('recovers from temporary server and network failures before streaming', async () => {
  let calls = 0;
  const response = await providerFetch('test', {}, {
    fetchFn: async () => { calls++; if (calls === 1) throw new TypeError('network'); return new Response('body', { status: calls === 2 ? 500 : 200 }); },
    wait: async () => {},
  });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'body');
  assert.equal(calls, 3);
});
test('bounds retries and does not retry auth or quota errors', async () => {
  for (const status of [400, 401, 403, 429, 500]) {
    let calls = 0;
    const result = await providerFetch('test', {}, { fetchFn: async () => { calls++; return new Response('', { status }); }, wait: async () => {} });
    assert.equal(result.status, status);
    assert.equal(calls, status === 500 ? 3 : 1);
  }
});
test('cancellation prevents further attempts', async () => {
  const controller = new AbortController();
  let calls = 0;
  await assert.rejects(providerFetch('test', { signal: controller.signal }, {
    fetchFn: async () => { calls++; controller.abort(); throw new TypeError('network'); }, wait: async () => {},
  }));
  assert.equal(calls, 1);
});
