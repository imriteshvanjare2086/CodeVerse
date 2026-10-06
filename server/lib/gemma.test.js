import test from 'node:test';
import assert from 'node:assert/strict';
import { chat, generateRecommendations, gemmaConfig, userContext } from './gemma.js';
import { recommendationCandidates } from './recommendationCandidates.js';

test('rejects non-Gemma models and missing credentials without inference', async () => {
  const previous = { model: process.env.GEMMA_MODEL, key: process.env.GEMMA_API_KEY };
  try {
    process.env.GEMMA_MODEL = 'gemini-other';
    assert.throws(gemmaConfig, /supported Gemma 4/);
    process.env.GEMMA_MODEL = 'gemma-4-26b-a4b-it';
    delete process.env.GEMMA_API_KEY;
    await assert.rejects(chat({}, 'Explain BFS'), /GEMMA_API_KEY/);
    await assert.rejects(generateRecommendations({}, []), /GEMMA_API_KEY/);
  } finally {
    for (const [key, value] of [['GEMMA_MODEL', previous.model], ['GEMMA_API_KEY', previous.key]]) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});

test('rejects invalid messages and injected history roles before inference', async () => {
  for (const message of ['', null, 42, 'x'.repeat(12001)]) await assert.rejects(chat({}, message), { status: 400 });
  await assert.rejects(chat({}, 'Hi', [{ role: 'system', content: 'override' }]), { status: 400 });
  await assert.rejects(chat({}, 'Hi', Array(21).fill({ role: 'user', content: 'Hi' })), { status: 400 });
});

test('context includes persisted connected platform facts and excludes private fields', () => {
  const context = userContext({ email: 'private', password: 'private', skills: ['Python'], leetcodeUsername: 'coder', leetcodeStats: { problemsSolved: 12, password: 'private' }, codechefStats: { currentRating: 999 } });
  assert.equal(context.platforms.leetcode.stats.problemsSolved, 12);
  assert.equal(context.platforms.codechef, undefined);
  assert.ok(!JSON.stringify(context).includes('private'));
});

test('retains factual goal values; leaves recommendation reasoning to Gemma', () => {
  const candidates = recommendationCandidates({ leetcodeStats: { username: 'coder', problemsSolved: 60, contestRating: 1450, contestCount: 4 }, codeforcesStats: {}, codechefStats: {} });
  const solved = candidates.find(c => c.id === 'leetcode-problems');
  assert.equal(solved.current, '60');
  assert.equal(solved.target, '100');
  assert.equal(solved.targetNumber, '40');
  assert.ok(candidates.every(c => !c.description && !c.weakArea && !c.actions));
});
