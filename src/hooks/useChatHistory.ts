import { useRef, useState } from 'react';
import type { SetStateAction } from 'react';

export interface Message { role: 'user' | 'assistant'; content: string }
export interface ChatSession { id: string; title: string; messages: Message[]; updatedAt: number }

export function useChatHistory() {
  const [key] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      return user?._id ? `codetrack-chat-v2:${user._id}` : null;
    } catch { return null; }
  });
  const [initial] = useState(() => {
    try {
      const saved = key ? JSON.parse(localStorage.getItem(key) || 'null') : null;
      if (Array.isArray(saved?.sessions) && saved.sessions.every((s: ChatSession) =>
        typeof s.id === 'string' && typeof s.title === 'string' && Array.isArray(s.messages) &&
        s.messages.every(m => ['user', 'assistant'].includes(m.role) && typeof m.content === 'string'))) {
        return { sessions: saved.sessions as ChatSession[], active: saved.active as string | null };
      }
    } catch { /* Invalid/unavailable storage must not crash chat. */ }
    return { sessions: [] as ChatSession[], active: null as string | null };
  });
  const [sessions, updateSessions] = useState(initial.sessions);
  const [activeSessionId, updateActive] = useState<string | null>(initial.active);
  const current = useRef(initial);
  const [storageError, setStorageError] = useState(false);
  const save = () => {
    if (!key) return;
    try { localStorage.setItem(key, JSON.stringify(current.current)); setStorageError(false); }
    catch { setStorageError(true); }
  };
  // Write before React renders, so leaving mid-stream retains every received chunk.
  const setSessions = (action: SetStateAction<ChatSession[]>) => {
    const next = typeof action === 'function' ? action(current.current.sessions) : action;
    current.current = { ...current.current, sessions: next };
    save();
    updateSessions(next);
  };
  const setActiveSessionId = (active: string | null) => {
    current.current = { ...current.current, active };
    save();
    updateActive(active);
  };
  return { sessions, setSessions, activeSessionId, setActiveSessionId, storageError };
}
