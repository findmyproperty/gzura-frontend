'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  IndianRupee,
  Plus,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react';
import {
  formatAdminDate,
  StatusBadge,
} from '@/components/admin/AdminDataTable';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { api, DashboardStats, Event, hasPendingEdits } from '@/lib/api';
import { AdminPageHeader } from '@/components/admin/admin-chrome';
import { isFullAdmin } from '@/lib/user-roles';

const registrationChartConfig = {
  count: {
    label: 'Registrations',
    color: '#2D0A4E',
  },
} satisfies ChartConfig;

const revenueChartConfig = {
  revenue: {
    label: 'Revenue',
    color: '#C9A227',
  },
} satisfies ChartConfig;

const topEventsChartConfig = {
  registrations: {
    label: 'Registrations',
    color: '#6b3fa8',
  },
} satisfies ChartConfig;

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: 'purple' | 'gold' | 'green' | 'blue';
}) {
  const accents = {
    purple: 'from-purple-deep to-purple-700',
    gold: 'from-gold-royal to-gold-500',
    green: 'from-emerald-600 to-emerald-500',
    blue: 'from-blue-600 to-blue-500',
  };

  return (
    <Card className="border-gray-200/80 shadow-none rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-zinc-900 mt-2 tabular-nums">
              {value}
            </p>
            <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
          </div>
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accents[accent]} flex items-center justify-center shrink-0`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function hostStatusBadge(status: Event['status']) {
  if (status === 'PUBLISHED') return <StatusBadge label="Approved" tone="success" />;
  if (status === 'REJECTED') return <StatusBadge label="Rejected" tone="danger" />;
  if (status === 'PENDING') return <StatusBadge label="Pending" tone="warning" />;
  return <StatusBadge label="Draft" tone="muted" />;
}

function HostStatCard({
  title,
  value,
  href,
  icon: Icon,
  tone,
}: {
  title: string;
  value: number;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: 'neutral' | 'success' | 'danger' | 'warning';
}) {
  const tones = {
    neutral: 'bg-zinc-100 text-zinc-700',
    success: 'bg-emerald-50 text-emerald-700',
    danger: 'bg-red-50 text-red-700',
    warning: 'bg-amber-50 text-amber-700',
  };

  return (
    <Link
      href={href}
      className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-none transition-colors hover:border-gray-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-zinc-900">{value}</p>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Link>
  );
}

function HostDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getEvents(true)
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const created = events.length;
  const approved = events.filter((event) => event.status === 'PUBLISHED').length;
  const rejected = events.filter((event) => event.status === 'REJECTED');
  const pending = events.filter((event) => event.status === 'PENDING');
  const attention = [...rejected, ...pending];
  const recent = [...events]
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt || b.dateStart).getTime() -
        new Date(a.updatedAt || a.createdAt || a.dateStart).getTime(),
    )
    .slice(0, 6);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <AdminPageHeader
        breadcrumb="Admin / Dashboard"
        title="Host dashboard"
        subtitle={
          attention.length > 0
            ? `${attention.length} event${attention.length === 1 ? '' : 's'} need your attention.`
            : `Welcome${user?.firstName ? `, ${user.firstName}` : ''}. No events waiting for review.`
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[92px] animate-pulse rounded-2xl border border-gray-100 bg-white"
              />
            ))
          : (
            <>
              <HostStatCard
                title="Courses created"
                value={created}
                href="/admin/events"
                icon={BookOpen}
                tone="neutral"
              />
              <HostStatCard
                title="Approved"
                value={approved}
                href="/admin/events?status=PUBLISHED"
                icon={CheckCircle2}
                tone="success"
              />
              <HostStatCard
                title="Rejected"
                value={rejected.length}
                href="/admin/events?status=REJECTED"
                icon={XCircle}
                tone="danger"
              />
              <HostStatCard
                title="Pending review"
                value={pending.length}
                href="/admin/events?status=PENDING"
                icon={Clock}
                tone="warning"
              />
            </>
          )}
      </div>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2">
        <section className="flex min-h-0 flex-col rounded-2xl border border-gray-200/80 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-zinc-900">Needs attention</h2>
            {attention.length > 0 ? (
              <Link
                href="/admin/events?status=REJECTED"
                className="text-sm font-medium text-gray-500 hover:text-zinc-900"
              >
                View all
              </Link>
            ) : null}
          </div>
          {loading ? (
            <div className="flex-1 animate-pulse rounded-xl bg-[#F8F6FB]" />
          ) : attention.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-500">
              Nothing needs your attention right now.
            </div>
          ) : (
            <div className="min-h-0 flex-1 space-y-2 overflow-auto">
              {attention.map((event) => (
                <Link
                  key={event.id}
                  href={`/admin/events/${event.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 px-3 py-3 hover:bg-[#F8F6FB]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900">{event.title}</p>
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {event.status === 'REJECTED'
                        ? event.rejectionReason || 'Rejected — review notes and resubmit.'
                        : 'Waiting for admin approval.'}
                    </p>
                  </div>
                  {hostStatusBadge(event.status)}
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="flex min-h-0 flex-col rounded-2xl border border-gray-200/80 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-zinc-900">Recent courses</h2>
            <Link
              href="/admin/events"
              className="text-sm font-medium text-gray-500 hover:text-zinc-900"
            >
              View all
            </Link>
          </div>
          {loading ? (
            <div className="flex-1 animate-pulse rounded-xl bg-[#F8F6FB]" />
          ) : recent.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-500">
              You have not created any courses yet.
            </div>
          ) : (
            <div className="min-h-0 flex-1 space-y-2 overflow-auto">
              {recent.map((event) => (
                <Link
                  key={event.id}
                  href={`/admin/events/${event.id}`}
                  className="flex items-center gap-3 rounded-xl px-1 py-2 hover:bg-[#F8F6FB]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700">
                    {event.title.trim().charAt(0).toUpperCase() || 'E'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900">{event.title}</p>
                    <p className="text-xs text-gray-500">
                      {event.type} · {formatAdminDate(event.dateStart)}
                    </p>
                  </div>
                  {hostStatusBadge(event.status)}
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.getDashboardStats(),
      api.getEvents(true)
    ])
      .then(([statsData, eventsData]) => {
        setStats(statsData);
        setPendingEvents(
          eventsData.filter(
            (e) => e.status === 'PENDING' || hasPendingEdits(e),
          ),
        );
      })
      .catch((err) => setError(err.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          breadcrumb="Admin / Dashboard"
          title="Overview"
          subtitle="Loading dashboard metrics..."
        />
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-white border border-gray-100 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="space-y-4">
        <AdminPageHeader breadcrumb="Admin / Dashboard" title="Overview" />
        <p className="text-red-600 text-sm">{error || 'Unable to load stats'}</p>
      </div>
    );
  }

  const { totals, registrationsByMonth, revenueByMonth, topEvents } = stats;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        breadcrumb="Admin / Dashboard"
        title="Overview"
        subtitle="Platform metrics, registrations, and revenue at a glance."
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Ongoing Events"
          value={totals.ongoingEvents}
          subtitle="Published upcoming & active events"
          icon={Calendar}
          accent="purple"
        />
        <StatCard
          title="Registered Users"
          value={totals.registeredUsers}
          subtitle="Total member accounts"
          icon={Users}
          accent="blue"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totals.totalRevenue)}
          subtitle="From all event registrations"
          icon={IndianRupee}
          accent="gold"
        />
        <StatCard
          title="New Registrations"
          value={totals.newRegistrations}
          subtitle={`Last 30 days · ${totals.totalRegistrations} all time`}
          icon={TrendingUp}
          accent="green"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-gray-200/80 shadow-none rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg text-zinc-900">
              Registrations by Month
            </CardTitle>
            <CardDescription>Last 6 months of event sign-ups</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={registrationChartConfig}
              className="h-[280px] w-full aspect-auto"
            >
              <BarChart data={registrationsByMonth} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-gray-200/80 shadow-none rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg text-zinc-900">
              Revenue by Month
            </CardTitle>
            <CardDescription>Registration revenue over last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={revenueChartConfig}
              className="h-[280px] w-full aspect-auto"
            >
              <BarChart data={revenueByMonth} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) =>
                    value >= 1000 ? `₹${(value / 1000).toFixed(0)}k` : `₹${value}`
                  }
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                  }
                />
                <Bar
                  dataKey="revenue"
                  fill="var(--color-revenue)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200/80 shadow-none rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg text-zinc-900">
            Top Events by Registrations
          </CardTitle>
          <CardDescription>Most popular events on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {topEvents.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">
              No registrations yet. Create an event to get started.
            </p>
          ) : (
            <ChartContainer
              config={topEventsChartConfig}
              className="w-full aspect-auto min-h-[240px]"
              style={{ height: Math.max(240, topEvents.length * 48) }}
            >
              <BarChart
                data={topEvents}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="title"
                  width={140}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    value.length > 18 ? `${value.slice(0, 18)}…` : value
                  }
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="registrations"
                  fill="var(--color-registrations)"
                  radius={[0, 6, 6, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {pendingEvents.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                Pending Approvals
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[11px] font-bold text-white">
                  {pendingEvents.length}
                </span>
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Events submitted by hosts that need your review.
              </p>
            </div>
            <Button asChild variant="outline" className="text-zinc-900">
              <Link href="/admin/events?status=APPROVAL">View all</Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {pendingEvents.slice(0, 3).map(event => (
              <Link
                key={event.id}
                href={`/admin/events/${event.id}`}
                className="bg-white rounded-2xl p-5 shadow-sm border border-amber-200 hover:border-amber-400 hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-full -z-10 group-hover:bg-amber-100 transition-colors" />
                <h3 className="font-semibold text-zinc-900 mb-1 truncate pr-6">{event.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{event.speakerName || 'Unknown Host'}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                    {hasPendingEdits(event) ? 'Edits pending' : 'Needs Review'}
                  </span>
                  <span className="text-sm text-zinc-900 font-medium flex items-center group-hover:translate-x-1 transition-transform">
                    Review →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/admin/events"
          className="bg-white rounded-2xl p-8 border border-gray-200/80 card-hover group"
        >
          <Calendar className="w-8 h-8 text-zinc-900 mb-4 group-hover:text-gold-royal transition-colors" />
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">Manage Events</h2>
          <p className="text-gray-600 text-sm">Create, edit, and publish events</p>
        </Link>

        <Link
          href="/admin/registrations"
          className="bg-white rounded-2xl p-8 border border-gray-200/80 card-hover group"
        >
          <ClipboardList className="w-8 h-8 text-zinc-900 mb-4 group-hover:text-gold-royal transition-colors" />
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">Registrations</h2>
          <p className="text-gray-600 text-sm">View all event registrations</p>
        </Link>

        <Link
          href="/admin/events/new"
          className="bg-white rounded-2xl p-8 border border-gray-200/80 card-hover group"
        >
          <Plus className="w-8 h-8 text-zinc-900 mb-4 group-hover:text-gold-royal transition-colors" />
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">New Event</h2>
          <p className="text-gray-500 text-sm">Quickly create a new event</p>
        </Link>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <div className="space-y-6">
        <AdminPageHeader breadcrumb="Admin / Dashboard" title="Overview" subtitle="Loading..." />
      </div>
    );
  }

  if (!isFullAdmin(user.role)) {
    return <HostDashboard />;
  }

  return <AdminDashboard />;
}
