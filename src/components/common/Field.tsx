import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function Field({ label, hint, error, children }: FieldProps) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center justify-between gap-4 text-sm font-semibold text-slate-800">
        {label}
        {hint ? <span className="text-xs font-medium text-slate-500">{hint}</span> : null}
      </span>
      {children}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </label>
  );
}
