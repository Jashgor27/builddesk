'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { projects, type ProjectStatus, useMockDataVersion } from '@/lib/mockData';
import { formatINR } from '@/lib/format';
import { PageHeader, Card, StatusBadge, ProgressBar } from '@/components/ui';
import { Plus, Search, MapPin, ArrowUpRight, LayoutGrid, List, Building2, Briefcase, Factory, Home } from 'lucide-react';

const TYPE_ICONS: Record<string, typeof Home> = {
  Residential: Home,
  Commercial: Briefcase,
  Industrial: Factory,
};

const FILTERS: ('All' | ProjectStatus)[] = ['All', 'Planning', 'In Progress', 'On Hold', 'Completed'];

export function Projects() {
  const { push } = useRouter();
  useMockDataVersion();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | ProjectStatus>('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} projects across Bhuj, Gandhidham, Anjar and Mundra`}
        actions={
          <Link href="/projects/create" className="btn-primary btn-md">
            <Plus className="h-4 w-4" /> Create Project
          </Link>
        }
      />

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            className="input pl-10"
            placeholder="Search projects, clients, locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${filter === f ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
            <button onClick={() => setView('grid')} className={`rounded-md p-1.5 ${view === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}>
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button onClick={() => setView('list')} className={`rounded-md p-1.5 ${view === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}>
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {view === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const Icon = TYPE_ICONS[p.type] || Building2;
            return (
              <Link key={p.id} href={`/projects/${p.id}`} className="group">
                <Card className="overflow-hidden" hover>
                  <div className="relative h-32 bg-gradient-to-br from-primary-600 to-primary-800 p-5">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                    <div className="relative flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <StatusBadge status={p.status} />
                    </div>
                    <div className="relative mt-3">
                      <h3 className="text-lg font-bold text-white leading-tight">{p.name}</h3>
                      <p className="text-sm text-primary-200 flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {p.location}
                      </p>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-slate-600 line-clamp-2 mb-4">{p.description}</p>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-slate-500">Progress</span>
                          <span className="font-semibold text-slate-900">{p.progress}%</span>
                        </div>
                        <ProgressBar value={p.progress} size="sm" />
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div>
                          <div className="text-xs text-slate-500">Budget</div>
                          <div className="text-sm font-semibold text-slate-900">{formatINR(p.budget, { compact: true })}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Spent</div>
                          <div className="text-sm font-semibold text-slate-900">{formatINR(p.spent, { compact: true })}</div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-primary-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Client</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Budget</th>
                  <th>Spent</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="cursor-pointer" onClick={() => push(`/projects/${p.id}`)}>
                    <td>
                      <div className="font-semibold text-slate-900">{p.name}</div>
                      <div className="text-xs text-slate-500">{p.type}</div>
                    </td>
                    <td className="text-slate-600">{p.client}</td>
                    <td className="text-slate-600">{p.location}</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16"><ProgressBar value={p.progress} size="sm" /></div>
                        <span className="text-xs text-slate-500">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="font-semibold text-slate-900">{formatINR(p.budget, { compact: true })}</td>
                    <td className="text-slate-600">{formatINR(p.spent, { compact: true })}</td>
                    <td><ArrowUpRight className="h-4 w-4 text-slate-300" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {filtered.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-slate-500">No projects match your search.</p>
        </Card>
      )}
    </div>
  );
}
