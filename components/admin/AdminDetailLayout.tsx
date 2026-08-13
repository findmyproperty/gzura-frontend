'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-chrome';
import { cn } from '@/lib/utils';

function breadcrumbFromHref(href: string) {
  if (href.startsWith('/admin/events')) return 'Admin / Events';
  if (href.startsWith('/admin/users')) return 'Admin / Users';
  if (href.startsWith('/admin/registrations')) return 'Admin / Host Requests';
  return 'Admin';
}

export function AdminDetailLayout({
  backHref,
  backLabel,
  title,
  subtitle,
  actions,
  children,
}: {
  backHref: string;
  backLabel: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        breadcrumb={breadcrumbFromHref(backHref)}
        title={title}
        subtitle={subtitle}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Link>
        {actions}
      </div>

      {children}
    </div>
  );
}

export function DetailCard({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-gray-200/80 p-6',
        className,
      )}
    >
      {title && (
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

export function DetailField({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <div className="text-sm text-gray-900">{value ?? '—'}</div>
    </div>
  );
}