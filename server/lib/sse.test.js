import test from 'node:test';
import assert from 'node:assert/strict';
import { readSSE } from './sse.js';

test('SSE decoding handles split JSON, CRLF and multibyte UTF-8', async () => {
  const bytes = new TextEncoder().encode(': keepalive\r\n\r\ndata: {"text":"π🙂"}\r\n\r\ndata: {"done":true}\r\n\r\ndata: [DONE]\r\n\r\n');
  async function* fragmented() { for (const byte of bytes) yield new Uint8Array([byte]); }
  const events = [];
  for await (const event of readSSE(fragmented())) events.push(event);
  assert.deepEqual(events, [{ text: 'π🙂' }, { done: true }]);
});

test('SSE decoding rejects malformed provider events', async () => {
  async function* malformed() { yield new TextEncoder().encode('data: invalid-json\n\n'); }
  await assert.rejects(async () => { for await (const event of readSSE(malformed())) void event; }, SyntaxError);
});
