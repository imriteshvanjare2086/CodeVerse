// Measures real inference through the local authenticated chatbot API.
import assert from 'node:assert/strict';
const base = 'http://127.0.0.1:4100/api';
const login = await fetch(base + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'gemma-local-test@example.test', password: 'LocalTest-Only-4100!' }) });
assert.equal(login.status, 200);
const { token } = await login.json();
const started = performance.now();
const streaming = process.argv.includes('--stream');
const message = process.argv.find(arg => arg.startsWith('--message='))?.slice('--message='.length) || 'Explain binary search with Python code and its time complexity.';
const response = await fetch(base + '/ai/chat', {
  method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify({ message, history: [], stream: streaming }),
  signal: AbortSignal.timeout(60000),
});
if (!response.ok) { const failure = await response.json(); throw new Error(`Chat failed: HTTP ${response.status}; ${failure.message}`); }
let firstText, text = '', buffer = '', done = false;
let chunks = 0;
if (streaming) {
  const decoder = new TextDecoder();
  for await (const bytes of response.body) {
    buffer += decoder.decode(bytes, { stream: true });
    let newline;
    while ((newline = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, newline); buffer = buffer.slice(newline + 1);
      if (!line.trim()) continue;
      const event = JSON.parse(line);
      if (event.error) throw new Error(`${event.error}; first text ${((firstText || 0) / 1000).toFixed(2)}s; characters ${text.length}`);
      if (event.text) { firstText ??= performance.now() - started; text += event.text; chunks++; }
      if (event.done) { done = true; assert.match(event.model, /^gemma-4-/); }
    }
  }
  assert.ok(done, 'Stream must end with a completion event');
  assert.ok(chunks > 1, 'Real response should arrive in multiple chunks');
} else {
  const result = await response.json();
  text = result.text; firstText = performance.now() - started;
  assert.match(result.model, /^gemma-4-/);
}
assert.ok(text?.trim());
console.log(JSON.stringify({ streaming, firstVisibleTextSeconds: +(firstText / 1000).toFixed(2), totalSeconds: +((performance.now() - started) / 1000).toFixed(2), characters: text.length, chunks }, null, 2));
