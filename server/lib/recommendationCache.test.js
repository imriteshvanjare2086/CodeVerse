import test from 'node:test';
import assert from 'node:assert/strict';
import { createRecommendationCache } from './recommendationCache.js';

test('reuses results and simultaneous requests, invalidates changed stats, isolates users and expires', async () => {
  let time = 0, calls = 0;
  const cache = createRecommendationCache({ ttl: 10, now: () => time });
  const generate = async () => ++calls;
  assert.deepEqual(await Promise.all([cache('a', {rating: 1454}, generate), cache('a', {rating: 1454}, generate)]), [1,1]);
  assert.equal(await cache('a', {rating: 1454}, generate), 1);
  assert.equal(await cache('b', {rating: 1454}, generate), 2);
  assert.equal(await cache('a', {rating: 1500}, generate), 3);
  time = 11;
  assert.equal(await cache('a', {rating: 1454}, generate), 4);
});

test('failed inference is never cached', async () => {
  const cache = createRecommendationCache();
  await assert.rejects(cache('a', {}, async () => { throw new Error('unavailable'); }));
  assert.equal(await cache('a', {}, async () => 'recovered'), 'recovered');
});
