import { StrictMode, type ReactNode } from 'react';
import { renderHook, act, cleanup } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';
import { useChatHistory } from './useChatHistory';

afterEach(() => { cleanup(); localStorage.clear(); });
const wrapper = ({ children }: { children: ReactNode }) => <StrictMode>{children}</StrictMode>;
test('retains streaming text and active conversation through remount, logout and same-account login', () => {
  localStorage.setItem('user', JSON.stringify({ _id: 'a' }));
  const chat = renderHook(useChatHistory, { wrapper });
  act(() => {
    chat.result.current.setSessions([{ id: 'one', title: 'Hello', updatedAt: 1, messages: [{ role: 'user', content: 'hello' }, { role: 'assistant', content: 'partial streamed text' }] }]);
    chat.result.current.setActiveSessionId('one');
  });
  chat.unmount();
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.setItem('user', JSON.stringify({ _id: 'b' }));
  const other = renderHook(useChatHistory, { wrapper });
  expect(other.result.current.sessions).toEqual([]);
  other.unmount();
  localStorage.setItem('user', JSON.stringify({ _id: 'a' }));
  const restored = renderHook(useChatHistory, { wrapper });
  expect(restored.result.current.sessions[0].messages[1].content).toBe('partial streamed text');
  expect(restored.result.current.activeSessionId).toBe('one');
  restored.unmount();
  const reload = renderHook(useChatHistory, { wrapper });
  expect(reload.result.current.sessions).toHaveLength(1);
});
test('explicit conversation deletion persists', () => {
  localStorage.setItem('user', JSON.stringify({ _id: 'a' }));
  const chat = renderHook(useChatHistory, { wrapper });
  act(() => chat.result.current.setSessions([{ id: 'one', title: 'Hello', updatedAt: 1, messages: [] }]));
  act(() => chat.result.current.setSessions([]));
  chat.unmount();
  expect(renderHook(useChatHistory, { wrapper }).result.current.sessions).toEqual([]);
});
