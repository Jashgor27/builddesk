'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getProject } from '@/lib/mockData';
import { Card } from '@/components/ui';
import { FileText, Wallet, Package, FolderOpen, Sparkles, ChevronRight } from 'lucide-react';

export function ProjectTabBar({ projectId, active }: { projectId: string; active: string }) {
  const { push: navigate } = useRouter();
  const project = getProject(projectId);
  const base = `/projects/${projectId}`;

  const tabs = [
    { key: 'overview', label: 'Overview', to: base, icon: FolderOpen },
    { key: 'forms', label: 'Forms', to: `${base}/forms`, icon: FileText },
    { key: 'expenses', label: 'Expenses', to: `${base}/expenses`, icon: Wallet },
    { key: 'materials', label: 'Materials', to: `${base}/materials`, icon: Package },
    { key: 'documents', label: 'Documents', to: `${base}/documents`, icon: FolderOpen },
    { key: 'ai', label: 'AI Assistant', to: `${base}/ai`, icon: Sparkles },
  ];

  return (
    <>
      {/* Project header strip */}
      <div className="mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-2">
              <Link href="/projects" className="hover:text-primary-600">Projects</Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
              <span className="text-slate-700 font-medium">{project?.name}</span>
            </nav>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{project?.name}</h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">{project?.location} · {project?.client}</p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="border-b border-slate-200 mb-6">
        <div className="flex gap-1 overflow-x-auto no-scrollbar -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => navigate(tab.to)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-all ${isActive
                  ? 'border-primary-600 text-primary-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-200'
                  }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export function ProjectScreenWrapper({
  projectId,
  active,
  children,
}: {
  projectId: string;
  active: string;
  children: ReactNode;
}) {
  const project = getProject(projectId);
  if (!project) {
    return (
      <Card className="p-12 text-center">
        <p className="text-slate-500">Project not found.</p>
        <Link href="/projects" className="btn-primary btn-md mt-4 inline-flex">Back to Projects</Link>
      </Card>
    );
  }
  return (
    <div className="animate-fadeIn">
      <ProjectTabBar projectId={projectId} active={active} />
      {children}
    </div>
  );
}
