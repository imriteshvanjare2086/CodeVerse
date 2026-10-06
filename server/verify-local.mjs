// Real local HTTP checks. No provider responses are mocked or simulated.
import assert from 'node:assert/strict';
const base = 'http://127.0.0.1:4100/api';
const credentials = { username: 'Gemma Local Test', email: 'gemma-local-test@example.test', password: 'LocalTest-Only-4100!' };
async function request(path, body, token) {
  const response = await fetch(base + path, {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body), signal: AbortSignal.timeout(60000),
  });
  return { status: response.status, data: await response.json() };
}
await request('/auth/register', credentials);
const login = await request('/auth/login', credentials);
assert.equal(login.status, 200);
const token = login.data.token;
assert.ok(token);
console.log('PASS: local registration/login');
const profile = await fetch(base + '/user/profile', { headers: { Authorization: `Bearer ${token}` } });
assert.equal(profile.status, 200);
console.log('PASS: authenticated local profile');
for (const [path, body] of [['/ai/chat', { message: 'Explain binary search in two sentences.', history: [] }], ['/ai/recommendations', {}]]) {
  const unauthorized = await request(path, body);
  assert.equal(unauthorized.status, 401);
  const result = await request(path, body, token);
  if (result.status === 200) {
    assert.match(result.data.model, /^gemma-4-/);
    if (path.endsWith('chat')) assert.ok(result.data.text?.length);
    else assert.ok(result.data.recommendations?.length);
    console.log(`PASS: real inference ${path}; model=${result.data.model}; provider=${result.data.provider}`);
  } else {
    console.log(`NOT VERIFIED: ${path}; HTTP ${result.status}; ${result.data.message}`);
    process.exitCode = 1;
  }
}
