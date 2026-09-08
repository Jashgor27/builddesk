'use client';

import { getDocuments } from '@/lib/mockData';
import { formatDate, formatRelative } from '@/lib/format';
import { ProjectScreenWrapper } from './ProjectShell';
import { Card, SectionHeader, Tag, Avatar } from '@/components/ui';
import { ArrowLeft, History, Download, Eye, FileImage, FileCheck, Receipt, ClipboardList, File, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

const TYPE_META: Record<string, { icon: typeof FileImage; color: string }> = {
  Drawing: { icon: FileImage, color: 'bg-accent-50 text-accent-600' },
  Estimate: { icon: FileCheck, color: 'bg-primary-50 text-primary-600' },
  Invoice: { icon: Receipt, color: 'bg-error-50 text-error-600' },
  Report: { icon: ClipboardList, color: 'bg-slate-100 text-slate-600' },
  Other: { icon: File, color: 'bg-slate-100 text-slate-600' },
};

export function DocumentVersionHistory({ projectId, docId }: { projectId: string; docId: string }) {
  const documents = getDocuments(projectId);
  const doc = documents.find((d) => d.id === docId);

  if (!doc) {
    return (
      <ProjectScreenWrapper projectId={projectId} active="documents">
        <Card className="p-12 text-center">
          <p className="text-slate-500">Document not found.</p>
          <Link href={`/projects/${projectId}/documents`} className="btn-primary btn-md mt-4 inline-flex">Back to Documents</Link>
        </Card>
      </ProjectScreenWrapper>
    );
  }

  const meta = TYPE_META[doc.type];
  const Icon = meta.icon;
  const versions = [...doc.versions];

  return (
    <ProjectScreenWrapper projectId={projectId} active="documents">
      <div className="space-y-6 max-w-3xl">
        <Link href={`/projects/${projectId}/documents`} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to Documents
        </Link>

        {/* Document header */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl flex-shrink-0 ${meta.color}`}>
              <Icon className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-slate-900">{doc.name}</h1>
              <div className="flex items-center gap-2 mt-1.5">
                <Tag color="neutral">{doc.type}</Tag>
                <span className="text-xs text-slate-400">{doc.size}</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-400">{versions.length} versions</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">Uploaded by {doc.uploadedBy} · {formatRelative(doc.uploadedAt)}</p>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary btn-md"><Eye className="h-4 w-4" /> Preview</button>
              <button className="btn-primary btn-md"><Download className="h-4 w-4" /> Download</button>
            </div>
          </div>
        </Card>

        {/* Version timeline */}
        <Card className="p-6">
          <SectionHeader title="Version History" subtitle="All changes to this document over time" />

          <div className="mt-6 relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-200" />

            <div className="space-y-1">
              {versions.map((v, i) => {
                const isLatest = i === 0;
                return (
                  <div key={v.version} className="relative flex gap-4 py-3">
                    {/* Node */}
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0 z-10 ${isLatest ? 'bg-success-100 text-success-600 ring-4 ring-success-50' : 'bg-white border-2 border-slate-200 text-slate-400'
                      }`}>
                      {isLatest ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-4 w-4" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900">{v.version}</span>
                        {isLatest && <Tag color="success">Latest</Tag>}
                        <span className="text-xs text-slate-400">{v.size}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{v.note}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar initials={v.by.split(' ').map((w) => w[0]).join('').toUpperCase()} size="sm" />
                        <span className="text-xs text-slate-500">{v.by} · {formatDate(v.date)}</span>
                      </div>
                      {!isLatest && (
                        <div className="mt-3 flex gap-2">
                          <button className="btn-ghost btn-sm"><Eye className="h-3.5 w-3.5" /> View</button>
                          <button className="btn-ghost btn-sm"><Download className="h-3.5 w-3.5" /> Download</button>
                          <button className="btn-ghost btn-sm text-primary-600 hover:bg-primary-50">Restore</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Compare */}
          <div className="mt-6 rounded-xl bg-primary-50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-primary-800">
              <History className="h-4 w-4" /> Compare versions side-by-side
            </div>
            <button className="btn-primary btn-sm">Compare <ChevronRight className="h-3.5 w-3.5" /></button>
          </div>
        </Card>
      </div>
    </ProjectScreenWrapper>
  );
}
