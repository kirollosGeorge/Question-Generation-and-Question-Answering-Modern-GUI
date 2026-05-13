import { Clock, Trash2 } from 'lucide-react';
import type { GenerateMcqResponse, SessionHistoryItem } from '../../types/domain';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface HistoryPanelProps {
  history: SessionHistoryItem[];
  onSelect: (result: GenerateMcqResponse) => void;
  onClear: () => void;
}

export function HistoryPanel({ history, onSelect, onClear }: HistoryPanelProps) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-950">Session History</h2>
          <p className="mt-1 text-sm text-slate-600">Local browser snapshots from generated responses.</p>
        </div>
        <Button variant="ghost" disabled={!history.length} onClick={onClear} icon={<Trash2 className="h-4 w-4" />}>
          Clear
        </Button>
      </div>

      {history.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">No generated sessions stored yet.</div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.result)}
              className="focus-ring w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
            >
              <div className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-500">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {new Date(item.createdAt).toLocaleString()}
              </div>
              <p className="line-clamp-2 text-sm font-semibold text-slate-800">{item.inputPreview}</p>
              <p className="mt-2 text-xs font-bold text-blue-700">{item.questionCount} questions</p>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
