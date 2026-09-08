'use client';

import { useState } from 'react';
import { getProject, getExpenses, useMockDataVersion } from '@/lib/mockData';
import { formatINR, formatDate, pct } from '@/lib/format';
import { ProjectScreenWrapper } from './ProjectShell';
import { Card, SectionHeader, StatusBadge, Tag, ProgressBar } from '@/components/ui';
import { BarChart, DonutChart, Legend } from '@/components/charts';
import { Plus, Search, FileText, Receipt } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ProjectExpenses({ projectId }: { projectId: string }) {
  useMockDataVersion();
  const project = getProject(projectId)!;
  const expenses = getExpenses(projectId);
  const { push: navigate } = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(expenses.map((e) => e.category)))];
  const filtered = expenses.filter((e) => {
    const s = e.description.toLowerCase().includes(search.toLowerCase()) || e.vendor.toLowerCase().includes(search.toLowerCase());
    const c = filter === 'All' || e.category === filter;
    return s && c;
  });

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const pending = expenses.filter((e) => e.status !== 'Paid').reduce((s, e) => s + e.amount, 0);

  const categoryData = expenses.reduce((acc, e) => {
    const ex = acc.find((a) => a.label === e.category);
    if (ex) ex.value += e.amount;
    else acc.push({ label: e.category, value: e.amount, color: '' });
    return acc;
  }, [] as { label: string; value: number; color: string }[]);
  const palette = ['#1d66f1', '#16bd66', '#f59e0b', '#8ec6ff', '#3dd584', '#fbbf24', '#94a3b8', '#cbd5e1'];
  categoryData.forEach((d, i) => (d.color = palette[i % palette.length]));

  const monthlyData = ['Jun', 'Jul', 'Aug', 'Sep'].map((month, index) => ({
    label: month,
    value: expenses.filter((expense) => new Date(expense.date).getMonth() === index + 5).reduce((sum, expense) => sum + expense.amount, 0),
  }));

  return (
    <ProjectScreenWrapper projectId={projectId} active="expenses">
      <div className="space-y-6">
        {/* Budget summary */}
        <div className="grid gap-4 lg:grid-cols-4">
          <Card className="p-5">
            <div className="stat-label">Total Budget</div>
            <div className="stat-value mt-1">{formatINR(project.budget, { compact: true })}</div>
            <div className="text-xs text-slate-400 mt-1">{formatINR(project.budget)}</div>
          </Card>
          <Card className="p-5">
            <div className="stat-label">Spent</div>
            <div className="stat-value mt-1 text-primary-600">{formatINR(totalSpent, { compact: true })}</div>
            <div className="mt-2"><ProgressBar value={pct(totalSpent, project.budget)} size="sm" /></div>
            <div className="text-xs text-slate-400 mt-1">{pct(totalSpent, project.budget)}% of budget</div>
          </Card>
          <Card className="p-5">
            <div className="stat-label">Remaining</div>
            <div className="stat-value mt-1 text-success-600">{formatINR(project.budget - totalSpent, { compact: true })}</div>
            <div className="text-xs text-slate-400 mt-1">{formatINR(project.budget - totalSpent)}</div>
          </Card>
          <Card className="p-5">
            <div className="stat-label">Pending / Overdue</div>
            <div className="stat-value mt-1 text-warning-600">{formatINR(pending, { compact: true })}</div>
            <div className="text-xs text-slate-400 mt-1">{expenses.filter((e) => e.status !== 'Paid').length} payments</div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="p-5 lg:col-span-2">
            <SectionHeader title="Monthly Spending" subtitle="Expense trend over recent months" />
            <div className="mt-6">
              <BarChart data={monthlyData} height={200} formatValue={(v) => formatINR(v, { compact: true })} />
            </div>
          </Card>
          <Card className="p-5">
            <SectionHeader title="By Category" />
            <div className="mt-4 flex flex-col items-center gap-4">
              <DonutChart data={categoryData} centerValue={formatINR(totalSpent, { compact: true })} centerLabel="Total" size={140} />
              <div className="w-full"><Legend items={categoryData.map((d) => ({ label: d.label, color: d.color, value: formatINR(d.value, { compact: true }) }))} /></div>
            </div>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="section-title">Expense Ledger</h2>
            <p className="text-sm text-slate-500 mt-0.5">{filtered.length} expenses recorded</p>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input className="input pl-10 w-full sm:w-52" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="input w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
            <button onClick={() => navigate(`/projects/${projectId}/expenses/add`)} className="btn-primary btn-md whitespace-nowrap">
              <Plus className="h-4 w-4" /> Add Expense
            </button>
          </div>
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th><th>Description</th><th>Category</th><th>Vendor</th><th>Amount</th><th>Status</th><th>Invoice</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id}>
                    <td className="text-slate-600 whitespace-nowrap">{formatDate(e.date)}</td>
                    <td className="font-medium text-slate-900">{e.description}</td>
                    <td><Tag color="neutral">{e.category}</Tag></td>
                    <td className="text-slate-600">{e.vendor}</td>
                    <td className="font-semibold text-slate-900 whitespace-nowrap">{formatINR(e.amount)}</td>
                    <td><StatusBadge status={e.status} /></td>
                    <td>
                      {e.invoice ? (
                        <button className="btn-ghost btn-sm text-primary-600 hover:bg-primary-50">
                          <FileText className="h-3.5 w-3.5" /> {e.invoice}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {filtered.length === 0 && (
          <Card className="p-12 text-center">
            <Receipt className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No expenses match your filters.</p>
          </Card>
        )}
      </div>
    </ProjectScreenWrapper>
  );
}
