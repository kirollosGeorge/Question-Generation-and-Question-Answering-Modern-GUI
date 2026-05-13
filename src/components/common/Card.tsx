import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return <section className={`rounded-3xl border border-slate-200 bg-white shadow-soft ${className}`}>{children}</section>;
}
