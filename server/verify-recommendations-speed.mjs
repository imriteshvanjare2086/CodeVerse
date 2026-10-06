import assert from 'node:assert/strict';
const base = 'http://127.0.0.1:4100/api';
const login = await fetch(`${base}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'gemma-local-test@example.test', password: 'LocalTest-Only-4100!' }) });
assert.equal(login.status, 200);
const { token } = await login.json();
let first;
for (let i = 0; i < 2; i++) {
  const start = performance.now();
  const response = await fetch(`${base}/ai/recommendations`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: '{}', signal: AbortSignal.timeout(55000) });
  const data = await response.json();
  assert.equal(response.status, 200, data.message);
  assert.match(data.model, /^gemma-4-/);
  assert.ok(data.recommendations.length > 0);
  if (i === 0) { first = data; console.log(JSON.stringify(data.recommendations.map(({title, description, actions}) => ({title, description, actions})), null, 2)); }
  else assert.deepEqual(data, first);
  console.log(`${i === 0 ? 'Initial real inference' : 'Cached repeat'}: ${Math.round(performance.now() - start)}ms; ${data.recommendations.length} recommendations`);
}
