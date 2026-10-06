import { isAxiosError } from 'axios';
import { api, getToken } from '@/lib/apiClient';

class AIRequestError extends Error {}

export function aiErrorMessage(error: unknown): string {
  if (error instanceof AIRequestError) return error.message;
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string' && message.length <= 500) return message;
    if (error.code === 'ECONNABORTED') return 'Gemma 4 took too long to respond. Please try again.';
    if (!error.response) return 'Cannot reach the local backend. Check that it is running on port 4100.';
    if (error.response.status === 401) return 'Your session expired. Please sign in again.';
  }
  return 'Gemma 4 could not complete this request. Please try again.';
}

export async function streamChat(message: string, history: Array<{ role: 'user' | 'assistant'; content: string }>, onChunk: (text: string) => void, signal: AbortSignal) {
  const response = await fetch(`${api.defaults.baseURL}/ai/chat`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ message, history, stream: true }),
    signal: AbortSignal.any([signal, AbortSignal.timeout(55000)]),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new AIRequestError(typeof error?.message === 'string' ? error.message : `Chatbot request failed (HTTP ${response.status}).`);
  }
  if (!response.body) throw new AIRequestError('Gemma 4 did not return a reply stream. Please try again.');
  const reader = response.body.getReader(), decoder = new TextDecoder();
  let buffer = '', completed = false;
  try {
    while (true) {
      const { value, done } = await reader.read();
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      if (done && buffer.trim()) { lines.push(buffer); buffer = ''; }
      for (const line of lines) {
        if (!line.trim()) continue;
        const event = JSON.parse(line);
        if (typeof event.error === 'string') throw new AIRequestError(event.error);
        if (typeof event.text === 'string') onChunk(event.text);
        if (event.done === true) completed = true;
      }
      if (done) break;
    }
    if (!completed) throw new AIRequestError('Gemma 4 reply was interrupted. Please try again.');
  } finally { await reader.cancel().catch(() => undefined); reader.releaseLock(); }
}
