import { AlertTriangle, Loader2, Search } from 'lucide-react';

interface StatusPanelProps {
  type: 'loading' | 'error' | 'empty';
  title: string;
  description: string;
}

export function StatusPanel({ type, title, description }: StatusPanelProps) {
  const icon = {
    loading: <Loader2 className="h-6 w-6 animate-spin text-blue-700" aria-hidden="true" />,
    error: <AlertTriangle className="h-6 w-6 text-rose-600" aria-hidden="true" />,
    empty: <Search className="h-6 w-6 text-slate-500" aria-hidden="true" />
  }[type];

  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">{icon}</div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
