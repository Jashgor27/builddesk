'use client';

import { getProject, getExpenses, getMaterials, getForms } from '@/lib/mockData';
import { formatINR, formatDate, pct } from '@/lib/format';
import { ProjectScreenWrapper } from './ProjectShell';
import { Card, SectionHeader, StatusBadge, ProgressBar, Avatar, Tag } from '@/components/ui';
import { DonutChart, ProgressRing, Legend } from '@/components/charts';
import { Users, Calendar, MapPin, AlertTriangle, FileWarning, Wallet, Package, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export function ProjectOverview({ projectId }: { projectId: string }) {
  const project = getProject(projectId)!;
  const expenses = getExpenses(projectId);
  const materials = getMaterials(projectId);
  const forms = getForms(projectId);
  const remaining = project.budget - project.spent;
  const spentPct = pct(project.spent, project.budget);

  const categoryData = expenses.reduce((acc, e) => {
    const existing = acc.find((a) => a.label === e.category);
    if (existing) existing.value += e.amount;
    else acc.push({ label: e.category, value: e.amount, color: '' });
    return acc;
  }, [] as { label: string; value: number; color: string }[]);

  const palette = ['#1d66f1', '#16bd66', '#f59e0b', '#8ec6ff', '#3dd584', '#fbbf24', '#94a3b8', '#cbd5e1'];
  categoryData.forEach((d, i) => (d.color = palette[i % palette.length]));

  const milestones = [
    { label: 'Foundation & RCC', done: true, date: '15 Feb 2026' },
    { label: 'Brickwork & Plastering', done: true, date: '30 Apr 2026' },
    { label: 'Roof Casting', done: true, date: '15 Jun 2026' },
    { label: 'Electrical & Plumbing Rough-in', done: false, date: '30 Sep 2026' },
    { label: 'Finishing & Paint', done: false, date: '15 Aug 2026' },
    { label: 'Handover', done: false, date: '30 Aug 2026' },
  ];

  return (
    <ProjectScreenWrapper projectId={projectId} active="overview">
      <div className="space-y-6">
        {/* Budget hero */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <SectionHeader title="Budget Overview" subtitle={project.description} />
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div>
                <div className="stat-label">Total Budget</div>
                <div className="stat-value mt-1">{formatINR(project.budget, { compact: true })}</div>
                <div className="text-xs text-slate-400 mt-1">{formatINR(project.budget)}</div>
              </div>
              <div>
                <div className="stat-label">Spent</div>
                <div className="stat-value mt-1 text-primary-600">{formatINR(project.spent, { compact: true })}</div>
                <div className="text-xs text-slate-400 mt-1">{formatINR(project.spent)}</div>
              </div>
              <div>
                <div className="stat-label">Remaining</div>
                <div className={`stat-value mt-1 ${remaining < project.budget * 0.2 ? 'text-error-600' : 'text-success-600'}`}>{formatINR(remaining, { compact: true })}</div>
                <div className="text-xs text-slate-400 mt-1">{formatINR(remaining)}</div>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-500">Budget Utilization</span>
                <span className="font-semibold text-slate-900">{spentPct}%</span>
              </div>
              <ProgressBar value={spentPct} color={spentPct > 85 ? 'error' : 'primary'} />
            </div>
          </Card>

          <Card className="p-6 flex flex-col items-center justify-center">
            <ProgressRing value={project.progress} size={130} label="Complete" />
            <div className="mt-4 flex items-center gap-2">
              <StatusBadge status={project.status} />
              <Tag color="neutral">{project.type}</Tag>
            </div>
          </Card>
        </div>

        {/* Info + spending */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="p-6">
            <SectionHeader title="Project Information" />
            <div className="mt-4 space-y-3">
              {[
                { icon: Users, label: 'Client', value: project.client },
                { icon: MapPin, label: 'Location', value: project.location },
                { icon: Calendar, label: 'Start Date', value: formatDate(project.startDate) },
                { icon: Calendar, label: 'End Date', value: formatDate(project.endDate) },
              ].map((r, i) => {
                const Icon = r.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-400 flex-shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-slate-500">{r.label}</div>
                      <div className="text-sm font-medium text-slate-900">{r.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 pt-5 border-t border-slate-100">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Team</div>
              <div className="space-y-2.5">
                {project.team.map((m) => (
                  <div key={m.name} className="flex items-center gap-2.5">
                    <Avatar initials={m.initials} size="sm" />
                    <div>
                      <div className="text-sm font-medium text-slate-900">{m.name}</div>
                      <div className="text-xs text-slate-500">{m.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <SectionHeader title="Spending by Category" subtitle={`${categoryData.length} categories tracked`} />
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col items-center gap-4">
                <DonutChart
                  data={categoryData}
                  centerValue={formatINR(project.spent, { compact: true })}
                  centerLabel="Total Spent"
                />
              </div>
              <Legend items={categoryData.map((d) => ({ label: d.label, color: d.color, value: formatINR(d.value, { compact: true }) }))} />
            </div>
          </Card>
        </div>

        {/* Milestones + alerts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-6">
            <SectionHeader title="Project Milestones" />
            <div className="mt-5 space-y-1">
              {milestones.map((m, i) => (
                <div key={i} className="flex items-start gap-3 py-2.5">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full flex-shrink-0 ${m.done ? 'bg-success-100 text-success-600' : 'bg-slate-100 text-slate-400'}`}>
                    {m.done ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-3.5 w-3.5" />}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className={`text-sm font-medium ${m.done ? 'text-slate-900' : 'text-slate-600'}`}>{m.label}</div>
                    <div className="text-xs text-slate-500">{m.date}</div>
                  </div>
                  {m.done && <Tag color="success">Done</Tag>}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <SectionHeader title="Quick Stats & Alerts" />
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { icon: FileWarning, label: 'Needs Review', value: forms.filter((f) => f.status === 'Needs Review').length, color: 'bg-warning-50 text-warning-600', to: `${projectId}/forms` },
                { icon: CheckCircle2, label: 'Synced Forms', value: forms.filter((f) => f.status === 'Synced').length, color: 'bg-success-50 text-success-600', to: `${projectId}/forms` },
                { icon: Wallet, label: 'Total Expenses', value: expenses.length, color: 'bg-primary-50 text-primary-600', to: `${projectId}/expenses` },
                { icon: Package, label: 'Materials', value: materials.length, color: 'bg-accent-50 text-accent-600', to: `${projectId}/materials` },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <Link key={i} href={`/projects/${s.to}`} className="rounded-xl border border-slate-200 p-4 hover:border-primary-200 hover:bg-primary-50/30 transition-all">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="text-xl font-bold text-slate-900 mt-2">{s.value}</div>
                    <div className="text-xs text-slate-500">{s.label}</div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 rounded-xl bg-warning-50 border border-warning-200 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-warning-800">Plot Area change needs review</div>
                  <p className="text-xs text-warning-700 mt-1">Master info updated from 2,400 sq.ft → 2,500 sq.ft. 4 forms need synchronization.</p>
                  <Link href={`/projects/${projectId}/forms`} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-warning-800 hover:text-warning-900">
                    Review now <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ProjectScreenWrapper>
  );
}
