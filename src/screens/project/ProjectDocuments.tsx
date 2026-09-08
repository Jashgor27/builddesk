'use client';

import { useState } from 'react';
import { addDocument, getDocuments, type ProjectDocument, updateDocument, useMockDataVersion } from '@/lib/mockData';
import { formatRelative } from '@/lib/format';
import { ProjectScreenWrapper } from './ProjectShell';
import { Card, Tag, Modal, EmptyState } from '@/components/ui';
import { Upload, Search, FileImage, FileCheck, Receipt, ClipboardList, Eye, History, Download, FolderOpen, File, Edit3, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const TYPE_META: Record<string, { icon: typeof FileImage; color: string }> = {
  Drawing: { icon: FileImage, color: 'bg-accent-50 text-accent-600' },
  Estimate: { icon: FileCheck, color: 'bg-primary-50 text-primary-600' },
  Invoice: { icon: Receipt, color: 'bg-error-50 text-error-600' },
  Report: { icon: ClipboardList, color: 'bg-slate-100 text-slate-600' },
  Other: { icon: File, color: 'bg-slate-100 text-slate-600' },
};

const FILTERS = ['All', 'Drawing', 'Invoice', 'Report', 'Estimate', 'Other'];

export function ProjectDocuments({ projectId }: { projectId: string }) {
  useMockDataVersion();
  const documents = getDocuments(projectId);
  const { push: navigate } = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [preview, setPreview] = useState<ProjectDocument | null>(null);
  const [downloaded, setDownloaded] = useState<ProjectDocument | null>(null);
  const [editing, setEditing] = useState<ProjectDocument | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [replacementFile, setReplacementFile] = useState<File | null>(null);

  const filtered = documents.filter((d) => {
    const s = d.name.toLowerCase().includes(search.toLowerCase());
    const c = filter === 'All' || d.type === filter;
    return s && c;
  });

  const saveDocument = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    const content = new FormData(event.currentTarget).get('content')?.toString() || 'Mock document content';
    const replacementName = replacementFile?.name || editing.name;
    const replacementSize = replacementFile ? `${Math.max(1, Math.round(replacementFile.size / 1024))} KB` : editing.size;
    const next = {
      ...editing,
      name: isNew ? (replacementName || 'Untitled project document') : editing.name,
      size: replacementSize,
      versions: isNew
        ? [{ version: 'v1', date: '2026-09-07', by: 'Anil Kothari', note: content, size: replacementSize }]
        : [{ version: `v${editing.versions.length + 1}`, date: '2026-09-07', by: 'Anil Kothari', note: replacementFile ? `Re-uploaded ${replacementFile.name}. ${content}` : content, size: replacementSize }, ...editing.versions],
    };
    if (isNew) addDocument(projectId, next);
    else updateDocument(projectId, next);
    setEditing(null);
    setReplacementFile(null);
  };

  return (
    <ProjectScreenWrapper projectId={projectId} active="documents">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {FILTERS.slice(1).map((type) => {
            const meta = TYPE_META[type];
            const Icon = meta.icon;
            const count = documents.filter((d) => d.type === type).length;
            return (
              <Card key={type} className="p-4" hover>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${meta.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-xl font-bold text-slate-900 mt-2">{count}</div>
                <div className="text-xs text-slate-500">{type}s</div>
              </Card>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="section-title">Project Documents</h2>
            <p className="text-sm text-slate-500 mt-0.5">{filtered.length} documents · {documents.length} total</p>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input className="input pl-10 w-full sm:w-52" placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button onClick={() => { setIsNew(true); setEditing({ id: `doc-${Date.now()}`, name: '', type: 'Other', size: 'Mock file', uploadedAt: new Date().toISOString(), uploadedBy: 'Anil Kothari', versions: [] }); }} className="btn-primary btn-md whitespace-nowrap"><Upload className="h-4 w-4" /> Upload</button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${filter === f ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Document grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => {
            const meta = TYPE_META[doc.type];
            const Icon = meta.icon;
            return (
              <Card key={doc.id} className="p-5" hover>
                <div className="flex items-start gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0 ${meta.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">{doc.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Tag color="neutral">{doc.type}</Tag>
                      <span className="text-xs text-slate-400">{doc.size}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  Uploaded {formatRelative(doc.uploadedAt)} by {doc.uploadedBy}
                </div>
                <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400">{doc.versions.length} version{doc.versions.length > 1 ? 's' : ''}</span>
                  <div className="flex gap-1">
                    <button onClick={() => setPreview(doc)} className="btn-ghost btn-sm" title="Preview">
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => { setIsNew(false); setReplacementFile(null); setEditing(doc); }} className="btn-ghost btn-sm" title="Edit / Re-upload">
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => navigate(`/projects/${projectId}/documents/${doc.id}/versions`)} className="btn-ghost btn-sm" title="Version history">
                      <History className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setDownloaded(doc)} className="btn-ghost btn-sm" title="Download">
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <Card className="p-12">
            <EmptyState
              icon={<FolderOpen className="h-7 w-7" />}
              title="No documents found"
              description="Upload drawings, invoices, reports, estimates or other project files."
              action={<button onClick={() => { setIsNew(true); setEditing({ id: `doc-${Date.now()}`, name: '', type: 'Other', size: 'Mock file', uploadedAt: new Date().toISOString(), uploadedBy: 'Anil Kothari', versions: [] }); }} className="btn-primary btn-md"><Upload className="h-4 w-4" /> Upload Document</button>}
            />
          </Card>
        )}

        {/* Preview modal */}
        <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.name} size="lg">
          {preview && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Tag color="neutral">{preview.type}</Tag>
                <span className="text-xs text-slate-400">{preview.size}</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-400">{preview.versions.length} versions</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 flex flex-col items-center justify-center min-h-[300px]">
                {(() => {
                  const meta = TYPE_META[preview.type];
                  const Icon = meta.icon;
                  return (
                    <>
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${meta.color} mb-3`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">{preview.name}</p>
                      <p className="text-xs text-slate-400 mt-1">Preview not available in demo</p>
                    </>
                  );
                })()}
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <div className="text-sm text-slate-600">
                  Latest: <span className="font-medium text-slate-900">{preview.versions[0].version}</span> · {preview.versions[0].note}
                </div>
                <Link href={`/projects/${projectId}/documents/${preview.id}/versions`} className="text-sm font-medium text-primary-600 hover:text-primary-700" onClick={() => setPreview(null)}>
                  View history →
                </Link>
              </div>
            </div>
          )}
        </Modal>

        <Modal open={!!downloaded} onClose={() => setDownloaded(null)} title="Download ready">
          {downloaded && (
            <div className="space-y-4">
              <div className="rounded-xl bg-success-50 p-4 text-sm text-success-800">
                Mock download prepared for <span className="font-semibold">{downloaded.name}</span>.
              </div>
              <p className="text-sm text-slate-500">This demo does not create a real file download.</p>
              <div className="flex justify-end">
                <button onClick={() => setDownloaded(null)} className="btn-primary btn-md">Done</button>
              </div>
            </div>
          )}
        </Modal>

        <Modal open={!!editing} onClose={() => { setEditing(null); setReplacementFile(null); }} title={isNew ? 'Upload Document' : 'Edit / Re-upload Document'} size="lg">
          {editing && <form className="space-y-4" onSubmit={saveDocument}>
            <div><label className="label">Document Name</label><input required className="input" value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} /></div>
            <div><label className="label">Document Type</label><select className="input" value={editing.type} onChange={(event) => setEditing({ ...editing, type: event.target.value as ProjectDocument['type'] })}>{FILTERS.slice(1).map((type) => <option key={type}>{type}</option>)}</select></div>
            <div>
              <label className="label">{isNew ? 'Select File' : 'Replacement File'}</label>
              <input id="document-file" type="file" className="sr-only" onChange={(event) => setReplacementFile(event.target.files?.[0] || null)} />
              <label htmlFor="document-file" className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-slate-200 p-4 hover:border-primary-300 hover:bg-primary-50/30">
                <Upload className="h-5 w-5 text-slate-400" />
                <span className="text-sm text-slate-600">{replacementFile ? `${replacementFile.name} selected` : 'Choose a mock replacement file'}</span>
              </label>
              {replacementFile && <p className="text-xs text-success-600">Ready to save as {isNew ? 'the new document' : 'the next document version'}.</p>}
            </div>
            <div><label className="label">Mock Content / Notes</label><textarea name="content" className="input min-h-[120px] resize-none" defaultValue={editing.versions[0]?.note || 'Mock document content'} /></div>
            <div className="flex justify-end gap-2"><button type="button" onClick={() => { setEditing(null); setReplacementFile(null); }} className="btn-secondary btn-md">Cancel</button><button type="submit" className="btn-primary btn-md"><Check className="h-4 w-4" /> {isNew ? 'Save Document' : 'Save New Version'}</button></div>
          </form>}
        </Modal>
      </div>
    </ProjectScreenWrapper>
  );
}
