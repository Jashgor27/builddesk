'use client';

import Link from 'next/link';
import { getExpenses, getForms, projects, useMockDataVersion } from '@/lib/mockData';
import { formatINR, formatDate, pct } from '@/lib/format';
import { PageHeader, Card, StatusBadge, ProgressBar, SectionHeader, Tag } from '@/components/ui';
import { DonutChart, BarChart, Legend, LineChart } from '@/components/charts';
import { FolderKanban, TrendingUp, Wallet, FileText, ArrowUpRight, AlertTriangle, Sparkles, Plus, Clock, CheckCircle2 } from 'lucide-react';

export function Dashboard() {
  useMockDataVersion();
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0);
  const activeProjects = projects.filter((p) => p.status === 'In Progress').length;
  const allExpenses = projects.flatMap((p) => getExpenses(p.id));
  const allForms = projects.flatMap((p) => getForms(p.id));
  const needsReview = allForms.filter((form) => form.status === 'Needs Review').length;

  const statusData = [
    { label: 'In Progress', value: projects.filter((p) => p.status === 'In Progress').length, color: '#1d66f1' },
    { label: 'Planning', value: projects.filter((p) => p.status === 'Planning').length, color: '#f59e0b' },
    { label: 'On Hold', value: projects.filter((p) => p.status === 'On Hold').length, color: '#94a3b8' },
    { label: 'Completed', value: projects.filter((p) => p.status === 'Completed').length, color: '#16bd66' },
  ];

  const monthlySpend = [
    { label: 'Apr', value: 410000 },
    { label: 'May', value: 520000 },
    { label: 'Jun', value: 680000 },
    { label: 'Jul', value: 890000 },
    { label: 'Aug', value: 1240000 },
    { label: 'Sep', value: 720000 },
  ];

  const categoryColors = ['#1d66f1', '#16bd66', '#f59e0b', '#8ec6ff', '#3dd584', '#94a3b8'];
  const categorySpend = Array.from(
    allExpenses.reduce((categories, expense) => {
      categories.set(expense.category, (categories.get(expense.category) || 0) + expense.amount);
      return categories;
    }, new Map<string, number>()),
  ).map(([label, value], index) => ({ label, value, color: categoryColors[index % categoryColors.length] }));
  const spentThisMonth = allExpenses
    .filter((expense) => expense.date.startsWith('2026-09'))
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of all your construction projects in Kutch region"
        actions={
          <>
            <Link href="/ai-assistant" className="btn-secondary btn-md">
              <Sparkles className="h-4 w-4 text-primary-500" /> Ask AI
            </Link>
            <Link href="/projects/create" className="btn-primary btn-md">
              <Plus className="h-4 w-4" /> New Project
            </Link>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={FolderKanban} label="Active Projects" value={String(activeProjects)} sub={`of ${projects.length} total`} color="primary" trend="+1 this month" />
        <StatCard icon={Wallet} label="Total Budget" value={formatINR(totalBudget, { compact: true })} sub={`Spent ${formatINR(totalSpent, { compact: true })}`} color="accent" trend={`${pct(totalSpent, totalBudget)}% used`} />
        <StatCard icon={TrendingUp} label="Spent This Month" value={formatINR(spentThisMonth, { compact: true })} sub="September 2026 · all projects" color="warning" trend="Portfolio total" />
        <StatCard icon={AlertTriangle} label="Needs Review" value={String(needsReview)} sub="forms pending sync" color="error" trend="2 new today" />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <SectionHeader
            title="Spending Trend"
            subtitle="Monthly expenditure across all projects"
            action={<Tag color="primary">Last 6 months</Tag>}
          />
          <div className="mt-6">
            <LineChart data={monthlySpend} height={220} formatValue={(v) => formatINR(v, { compact: true })} />
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Project Status" subtitle="Current pipeline" />
          <div className="mt-6 flex flex-col items-center gap-5">
            <DonutChart data={statusData} centerValue={String(projects.length)} centerLabel="Projects" />
            <Legend items={statusData.map((d) => ({ label: d.label, color: d.color, value: String(d.value) }))} />
          </div>
        </Card>
      </div>

      {/* Category spend + Recent projects */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <SectionHeader title="Spending by Category" subtitle="All projects combined" />
          <div className="mt-6">
            <BarChart data={categorySpend} height={200} formatValue={(v) => formatINR(v, { compact: true })} />
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <SectionHeader
            title="Recent Projects"
            action={<Link href="/projects" className="text-sm font-medium text-primary-600 hover:text-primary-700">View all</Link>}
          />
          <div className="mt-4 space-y-1">
            {projects.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="flex items-center gap-4 rounded-lg p-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 font-semibold text-sm flex-shrink-0">
                  {p.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 truncate">{p.name}</span>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{p.location} · {formatINR(p.spent, { compact: true })} / {formatINR(p.budget, { compact: true })}</div>
                </div>
                <div className="hidden sm:block w-28">
                  <ProgressBar value={p.progress} size="sm" />
                  <div className="text-xs text-slate-400 mt-1 text-right">{p.progress}%</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-300 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Activity + alerts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <SectionHeader title="Recent Activity" />
          <div className="mt-4 space-y-4">
            {[
              { icon: FileText, color: 'bg-primary-50 text-primary-600', title: 'Expense added — ₹23,500 to ABC Traders', project: 'Patel Residence', time: '2h ago' },
              { icon: AlertTriangle, color: 'bg-warning-50 text-warning-600', title: 'Plot Area change needs review', project: 'Patel Residence', time: '5h ago' },
              { icon: CheckCircle2, color: 'bg-success-50 text-success-600', title: 'Building Permission Application synced', project: 'Shah Villa', time: '1d ago' },
              { icon: Wallet, color: 'bg-accent-50 text-accent-600', title: 'Invoice uploaded — Kutch Steel Works', project: 'Mehta Commercial Building', time: '2d ago' },
            ].map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0 ${a.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{a.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{a.project} · {a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Upcoming Deadlines" />
          <div className="mt-4 space-y-3">
            {projects
              .filter((p) => p.status !== 'Completed')
              .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
              .slice(0, 4)
              .map((p) => {
                const days = Math.ceil((new Date(p.endDate).getTime() - Date.now()) / 86400000);
                return (
                  <Link key={p.id} href={`/projects/${p.id}`} className="flex items-center gap-3 rounded-lg p-3 hover:bg-slate-50 transition-colors">
                    <Clock className="h-5 w-5 text-slate-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{p.name}</p>
                      <p className="text-xs text-slate-500">{formatDate(p.endDate)}</p>
                    </div>
                    <Tag color={days < 30 ? 'error' : days < 60 ? 'warning' : 'neutral'}>
                      {days > 0 ? `${days}d left` : 'Overdue'}
                    </Tag>
                  </Link>
                );
              })}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  trend,
  trendDown,
}: {
  icon: typeof FolderKanban;
  label: string;
  value: string;
  sub: string;
  color: 'primary' | 'accent' | 'warning' | 'error';
  trend: string;
  trendDown?: boolean;
}) {
  const colors = {
    primary: 'bg-primary-50 text-primary-600',
    accent: 'bg-accent-50 text-accent-600',
    warning: 'bg-warning-50 text-warning-600',
    error: 'bg-error-50 text-error-600',
  };
  return (
    <Card className="p-5" hover>
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={`text-xs font-medium ${trendDown ? 'text-error-600' : 'text-success-600'}`}>{trend}</span>
      </div>
      <div className="mt-4">
        <div className="stat-value">{value}</div>
        <div className="stat-label mt-1">{label}</div>
        <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
      </div>
    </Card>
  );
}
