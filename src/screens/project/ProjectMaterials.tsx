'use client';

import { addMaterial, getMaterials, useMockDataVersion } from '@/lib/mockData';
import { formatINR, pct } from '@/lib/format';
import { ProjectScreenWrapper } from './ProjectShell';
import { Card, SectionHeader, Tag, ProgressBar, Modal } from '@/components/ui';
import { BarChart } from '@/components/charts';
import { Package, TrendingUp, TrendingDown, AlertTriangle, Plus, Search, Check } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

export function ProjectMaterials({ projectId }: { projectId: string }) {
  useMockDataVersion();
  const materials = getMaterials(projectId);
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Concrete', quantity: '', unit: 'bags', unitCost: '', vendor: '', date: '2026-09-07', notes: '' });
  const setField = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const saveMaterial = (event: FormEvent) => {
    event.preventDefault();
    const quantity = Number(form.quantity) || 0;
    const unitCost = Number(form.unitCost) || 0;
    addMaterial(projectId, { id: `material-${Date.now()}`, name: form.name || 'New Material', category: form.category, vendor: form.vendor || 'Local Supplier', plannedQty: quantity, actualQty: quantity, unit: form.unit, plannedCost: quantity * unitCost, actualCost: quantity * unitCost });
    setForm({ name: '', category: 'Concrete', quantity: '', unit: 'bags', unitCost: '', vendor: '', date: '2026-09-07', notes: '' });
    setAddOpen(false);
  };

  const filtered = materials.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  const totalPlanned = materials.reduce((s, m) => s + m.plannedCost, 0);
  const totalActual = materials.reduce((s, m) => s + m.actualCost, 0);
  const overBudget = materials.filter((m) => m.actualCost > m.plannedCost);

  const chartData = materials.slice(0, 6).map((m) => ({
    label: m.name.split(' ')[0],
    value: m.actualCost,
  }));

  return (
    <ProjectScreenWrapper projectId={projectId} active="materials">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="stat-label">Planned Cost</div>
              <Package className="h-4 w-4 text-slate-300" />
            </div>
            <div className="stat-value mt-1">{formatINR(totalPlanned, { compact: true })}</div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="stat-label">Actual Cost</div>
              <TrendingUp className="h-4 w-4 text-primary-400" />
            </div>
            <div className="stat-value mt-1 text-primary-600">{formatINR(totalActual, { compact: true })}</div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="stat-label">Variance</div>
              {totalActual > totalPlanned ? <TrendingUp className="h-4 w-4 text-error-400" /> : <TrendingDown className="h-4 w-4 text-success-400" />}
            </div>
            <div className={`stat-value mt-1 ${totalActual > totalPlanned ? 'text-error-600' : 'text-success-600'}`}>
              {totalActual > totalPlanned ? '+' : '−'}{formatINR(Math.abs(totalPlanned - totalActual), { compact: true })}
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="stat-label">Over Budget</div>
              <AlertTriangle className="h-4 w-4 text-warning-400" />
            </div>
            <div className="stat-value mt-1 text-warning-600">{overBudget.length}</div>
            <div className="text-xs text-slate-400 mt-1">materials exceeding plan</div>
          </Card>
        </div>

        {/* Chart */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="p-5 lg:col-span-2">
            <SectionHeader title="Planned vs Actual Cost" subtitle="By material category" />
            <div className="mt-6">
              <BarChart
                data={chartData}
                height={200}
                formatValue={(v) => formatINR(v, { compact: true })}
              />
            </div>
          </Card>
          <Card className="p-5">
            <SectionHeader title="Procurement Progress" />
            <div className="mt-4 space-y-3">
              {materials.slice(0, 5).map((m) => {
                const procPct = pct(m.actualQty, m.plannedQty);
                return (
                  <div key={m.id}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-700 font-medium">{m.name}</span>
                      <span className="text-xs text-slate-500">{m.actualQty}/{m.plannedQty} {m.unit}</span>
                    </div>
                    <ProgressBar value={procPct} size="sm" color={procPct > 100 ? 'error' : procPct > 80 ? 'warning' : 'primary'} />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="section-title">Material Tracker</h2>
            <p className="text-sm text-slate-500 mt-0.5">{filtered.length} materials · planned vs actual</p>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input className="input pl-10 w-full sm:w-52" placeholder="Search materials..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button onClick={() => setAddOpen(true)} className="btn-primary btn-md whitespace-nowrap"><Plus className="h-4 w-4" /> Add Material</button>
          </div>
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Material</th><th>Category</th><th>Vendor</th>
                  <th>Planned Qty</th><th>Purchased</th><th>Used</th><th>Remaining</th>
                  <th>Planned Cost</th><th>Actual Cost</th><th>Variance</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => {
                  const variance = m.actualCost - m.plannedCost;
                  const overBudget = m.actualCost > m.plannedCost && m.actualCost > 0;
                  const usedQty = Math.round(m.actualQty * 0.6 * 10) / 10;
                  const remainingQty = Math.max(m.actualQty - usedQty, 0);
                  return (
                    <tr key={m.id}>
                      <td className="font-semibold text-slate-900">{m.name}</td>
                      <td><Tag color="neutral">{m.category}</Tag></td>
                      <td className="text-slate-600">{m.vendor}</td>
                      <td className="text-slate-600">{m.plannedQty} {m.unit}</td>
                      <td className="text-slate-600">{m.actualQty} {m.unit}</td>
                      <td className="text-slate-600">{usedQty} {m.unit}</td>
                      <td className="text-slate-600">{remainingQty} {m.unit}</td>
                      <td className="text-slate-600 whitespace-nowrap">{formatINR(m.plannedCost, { compact: true })}</td>
                      <td className="font-semibold text-slate-900 whitespace-nowrap">{formatINR(m.actualCost, { compact: true })}</td>
                      <td>
                        {m.actualCost === 0 ? (
                          <Tag color="neutral">Not started</Tag>
                        ) : overBudget ? (
                          <span className="text-sm font-semibold text-error-600">+{formatINR(Math.abs(variance), { compact: true })}</span>
                        ) : (
                          <span className="text-sm font-semibold text-success-600">−{formatINR(Math.abs(variance), { compact: true })}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Material" size="lg">
        <form onSubmit={saveMaterial} className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Material Name</label><input required className="input" value={form.name} onChange={(event) => setField('name', event.target.value)} /></div>
          <div><label className="label">Category</label><select className="input" value={form.category} onChange={(event) => setField('category', event.target.value)}><option>Concrete</option><option>Reinforcement</option><option>Aggregate</option><option>Masonry</option><option>Electrical</option><option>Plumbing</option><option>Finishing</option><option>Other</option></select></div>
          <div><label className="label">Quantity</label><input required type="number" min="0" className="input" value={form.quantity} onChange={(event) => setField('quantity', event.target.value)} /></div>
          <div><label className="label">Unit</label><input required className="input" value={form.unit} onChange={(event) => setField('unit', event.target.value)} /></div>
          <div><label className="label">Estimated Unit Cost</label><input required type="number" min="0" className="input" value={form.unitCost} onChange={(event) => setField('unitCost', event.target.value)} /></div>
          <div><label className="label">Supplier</label><input className="input" value={form.vendor} onChange={(event) => setField('vendor', event.target.value)} /></div>
          <div><label className="label">Purchase Date</label><input type="date" className="input" value={form.date} onChange={(event) => setField('date', event.target.value)} /></div>
          <div><label className="label">Notes</label><input className="input" value={form.notes} onChange={(event) => setField('notes', event.target.value)} /></div>
          <div className="sm:col-span-2 flex justify-end gap-2"><button type="button" onClick={() => setAddOpen(false)} className="btn-secondary btn-md">Cancel</button><button type="submit" className="btn-primary btn-md"><Check className="h-4 w-4" /> Add Material</button></div>
        </form>
      </Modal>
    </ProjectScreenWrapper>
  );
}
