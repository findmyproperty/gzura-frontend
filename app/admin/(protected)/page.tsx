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
  Calendar,
  ClipboardList,
  IndianRupee,
  Plus,
  TrendingUp,
  Users,
} from 'lucide-react';
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
import { api, DashboardStats } from '@/lib/api';

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
    <Card className="border-gray-100 shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-purple-deep mt-2 tabular-nums">
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

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-purple-deep">Overview</h1>
          <p className="text-gray-600 mt-1">Loading dashboard metrics...</p>
        </div>
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
        <h1 className="text-2xl font-bold text-purple-deep">Overview</h1>
        <p className="text-red-600 text-sm">{error || 'Unable to load stats'}</p>
      </div>
    );
  }

  const { totals, registrationsByMonth, revenueByMonth, topEvents } = stats;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-purple-deep">Overview</h1>
        <p className="text-gray-600 mt-1">
          Platform metrics, registrations, and revenue at a glance.
        </p>
      </div>

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
        <Card className="border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-purple-deep">
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

        <Card className="border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-purple-deep">
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

      <Card className="border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-purple-deep">
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

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/admin/events"
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 card-hover group"
        >
          <Calendar className="w-8 h-8 text-purple-deep mb-4 group-hover:text-gold-royal transition-colors" />
          <h2 className="text-xl font-semibold text-purple-deep mb-2">Manage Events</h2>
          <p className="text-gray-600 text-sm">Create, edit, and publish events</p>
        </Link>

        <Link
          href="/admin/registrations"
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 card-hover group"
        >
          <ClipboardList className="w-8 h-8 text-purple-deep mb-4 group-hover:text-gold-royal transition-colors" />
          <h2 className="text-xl font-semibold text-purple-deep mb-2">Registrations</h2>
          <p className="text-gray-600 text-sm">View all event registrations</p>
        </Link>

        <Link
          href="/admin/events"
          className="bg-gradient-to-br from-purple-deep to-purple-900 rounded-2xl p-8 shadow-sm card-hover group"
        >
          <Plus className="w-8 h-8 text-gold-royal mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">New Event</h2>
          <p className="text-white/70 text-sm">Quickly create a new event</p>
        </Link>
      </div>
    </div>
  );
}