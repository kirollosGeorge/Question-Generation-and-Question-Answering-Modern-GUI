import { useCallback, useEffect, useState } from 'react';
import type { GenerateMcqResponse, SessionHistoryItem } from '../types/domain';

const STORAGE_KEY = 'qgqa-session-history';
const MAX_HISTORY_ITEMS = 8;

function readHistory(): SessionHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useSessionHistory() {
  const [history, setHistory] = useState<SessionHistoryItem[]>([]);

  useEffect(() => {
    setHistory(readHistory());
  }, []);

  const persist = useCallback((items: SessionHistoryItem[]) => {
    setHistory(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, []);

  const addSession = useCallback(
    (inputText: string, result: GenerateMcqResponse) => {
      const item: SessionHistoryItem = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        inputPreview: inputText.trim().slice(0, 120),
        questionCount: result.questions.length,
        result
      };
      persist([item, ...readHistory()].slice(0, MAX_HISTORY_ITEMS));
    },
    [persist]
  );

  const clearHistory = useCallback(() => persist([]), [persist]);

  return { history, addSession, clearHistory };
}
