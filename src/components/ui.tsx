'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export function PageHeader({
  title,
  subtitle,
  actions,
  breadcrumb,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumb?: { label: string; to?: string }[];
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="mb-2 flex items-center gap-1.5 text-sm text-slate-500">
            <Link href="/" className="hover:text-primary-600 transition-colors">
              <Home className="h-3.5 w-3.5" />
            </Link>
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                {b.to ? (
                  <Link href={b.to} className="hover:text-primary-600 transition-colors">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-slate-700 font-medium">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5 flex-wrap">{actions}</div>}
    </div>
  );
}

export function Card({
  children,
  className = '',
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return <div className={`${hover ? 'card-hover' : 'card'} ${className}`}>{children}</div>;
}

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h3 className="section-title">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Avatar({
  initials,
  color = 'primary',
  size = 'md',
}: {
  initials: string;
  color?: 'primary' | 'accent' | 'warning' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
}) {
  const colors = {
    primary: 'bg-primary-100 text-primary-700',
    accent: 'bg-accent-100 text-accent-700',
    warning: 'bg-warning-100 text-warning-700',
    neutral: 'bg-slate-200 text-slate-600',
  };
  const sizes = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-12 w-12 text-base',
  };
  return (
    <div className={`inline-flex items-center justify-center rounded-full font-semibold ${colors[color]} ${sizes[size]}`}>
      {initials}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string }> = {
    'In Progress': { cls: 'bg-primary-50 text-primary-700' },
    Planning: { cls: 'bg-warning-50 text-warning-700' },
    'On Hold': { cls: 'bg-slate-100 text-slate-600' },
    Completed: { cls: 'bg-success-50 text-success-700' },
    Synced: { cls: 'bg-success-50 text-success-700' },
    'Needs Review': { cls: 'bg-warning-50 text-warning-700' },
    Draft: { cls: 'bg-slate-100 text-slate-500' },
    Paid: { cls: 'bg-success-50 text-success-700' },
    Pending: { cls: 'bg-warning-50 text-warning-700' },
    Overdue: { cls: 'bg-error-50 text-error-700' },
  };
  const s = map[status] || { cls: 'bg-slate-100 text-slate-600' };
  return <span className={`badge ${s.cls}`}>{status}</span>;
}

export function ProgressBar({
  value,
  max = 100,
  color = 'primary',
  size = 'md',
}: {
  value: number;
  max?: number;
  color?: 'primary' | 'accent' | 'warning' | 'error';
  size?: 'sm' | 'md';
}) {
  const pctVal = Math.min(100, Math.round((value / max) * 100));
  const colors = {
    primary: 'bg-primary-500',
    accent: 'bg-accent-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
  };
  return (
    <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${size === 'sm' ? 'h-1.5' : 'h-2'}`}>
      <div
        className={`h-full ${colors[color]} rounded-full transition-all duration-500`}
        style={{ width: `${pctVal}%` }}
      />
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  children,
  title,
  size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  if (!open) return null;
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} card shadow-pop animate-scaleIn max-h-[90vh] flex flex-col`}>
        {title && (
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1 transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="overflow-y-auto scrollbar-thin p-5">{children}</div>
      </div>
    </div>
  );
}

export function Tag({ children, color = 'neutral' }: { children: ReactNode; color?: 'primary' | 'accent' | 'warning' | 'error' | 'success' | 'neutral' }) {
  const colors = {
    primary: 'bg-primary-50 text-primary-700',
    accent: 'bg-accent-50 text-accent-700',
    warning: 'bg-warning-50 text-warning-700',
    error: 'bg-error-50 text-error-700',
    success: 'bg-success-50 text-success-700',
    neutral: 'bg-slate-100 text-slate-600',
  };
  return <span className={`badge ${colors[color]}`}>{children}</span>;
}
