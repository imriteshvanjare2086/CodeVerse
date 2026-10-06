import assert from 'node:assert/strict';
const base = 'http://127.0.0.1:4100/api';
const login = await fetch(`${base}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'gemma-local-test@example.test', password: 'LocalTest-Only-4100!' }) });
assert.equal(login.status, 200);
const { token } = await login.json();
async function chat(message, history = []) {
  const response = await fetch(`${base}/ai/chat`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ message, history }), signal: AbortSignal.timeout(55000) });
  const data = await response.json();
  assert.equal(response.status, 200, data.message);
  assert.match(data.model, /^gemma-4-/);
  return data.text;
}
const question = 'How do I count the negative numbers in a list of integers using Python?';
const approach = await chat(question);
assert.ok(!approach.includes('```'), 'Approach should not contain code blocks');
console.log('Approach:', approach);
const code = await chat('code', [{ role: 'user', content: question }, { role: 'assistant', content: approach }]);
assert.match(code.trim(), /^```python\s*\n[\s\S]+\n```$/, 'Code reply should be one Python block without prose');
assert.equal((code.match(/```/g) || []).length, 2);
console.log('Code-only follow-up:', code);
console.log('PASS: real Gemma approach-first and contextual code-only follow-up');
