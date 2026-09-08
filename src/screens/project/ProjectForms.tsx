'use client';

import { useState } from 'react';
import { addForm, getProject, getForms, syncExample, type FormDoc, useMockDataVersion } from '@/lib/mockData';
import { formatRelative } from '@/lib/format';
import { ProjectScreenWrapper } from './ProjectShell';
import { Card, StatusBadge, Tag, Modal, EmptyState } from '@/components/ui';
import { FileText, Upload, AlertTriangle, RefreshCw, Eye, Info, ArrowRight, Search, FileWarning, Edit3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ProjectForms({ projectId }: { projectId: string }) {
  const project = getProject(projectId)!;
  useMockDataVersion();
  const forms = getForms(projectId);
  const { push: navigate } = useRouter();
  const [preview, setPreview] = useState<FormDoc | null>(null);
  const [search, setSearch] = useState('');
  const [masterInfo, setMasterInfo] = useState(project.masterInfo);
  const [editMasterOpen, setEditMasterOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadName, setUploadName] = useState('New Project Form');
  const masterFields: { key: keyof typeof masterInfo; label: string }[] = [
    { key: 'ownerName', label: 'Owner Name' },
    { key: 'plotNumber', label: 'Plot Number' },
    { key: 'surveyNumber', label: 'Survey Number' },
    { key: 'plotArea', label: 'Plot Area' },
    { key: 'address', label: 'Address' },
    { key: 'village', label: 'Village' },
    { key: 'taluka', label: 'Taluka' },
    { key: 'district', label: 'District' },
  ];

  const filtered = forms.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
  const needsReview = forms.filter((f) => f.status === 'Needs Review').length;
  const synced = forms.filter((f) => f.status === 'Synced').length;

  return (
    <ProjectScreenWrapper projectId={projectId} active="forms">
      <div className="space-y-6">
        {/* Sync alert */}
        {needsReview > 0 && (
          <Card className="p-5 border-warning-200 bg-warning-50/50">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-100 text-warning-700 flex-shrink-0">
                  <FileWarning className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Master info changed — {needsReview} forms need synchronization</h3>
                  <p className="text-sm text-slate-600 mt-0.5">Plot Area: <span className="font-medium line-through text-slate-400">2,400 sq.ft</span> → <span className="font-medium text-warning-700">2,500 sq.ft</span></p>
                </div>
              </div>
              <button onClick={() => navigate(`/projects/${projectId}/forms/sync`)} className="btn-primary btn-md whitespace-nowrap">
                <RefreshCw className="h-4 w-4" /> Review & Sync
              </button>
            </div>
          </Card>
        )}

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="section-title">Smart Forms</h2>
            <p className="text-sm text-slate-500 mt-0.5">{forms.length} forms · {synced} synced · {needsReview} need review</p>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input className="input pl-10 w-full sm:w-56" placeholder="Search forms..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button onClick={() => setUploadOpen(true)} className="btn-primary btn-md whitespace-nowrap"><Upload className="h-4 w-4" /> Upload Form</button>
          </div>
        </div>

        {/* Master info */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">Master Project Information</h3>
              <p className="text-sm text-slate-500 mt-0.5">Source of truth — synced to all linked forms</p>
            </div>
            <div className="flex items-center gap-2">
              <Tag color="primary"><Info className="h-3 w-3" /> Auto-sync source</Tag>
              <button onClick={() => setEditMasterOpen(true)} className="btn-secondary btn-sm"><Edit3 className="h-3.5 w-3.5" /> Edit</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
            {masterFields.map((field) => (
              <div key={field.key} className="border-b border-slate-100 pb-2">
                <div className="text-xs text-slate-500">{field.label}</div>
                <div className={`text-sm font-medium mt-0.5 ${field.key === 'plotArea' ? 'text-warning-700' : 'text-slate-900'}`}>{masterInfo[field.key]}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Forms list */}
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((form) => (
            <Card key={form.id} className="p-5" hover>
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 flex-shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{form.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{form.category} · {form.fields.length} fields</p>
                    </div>
                    <StatusBadge status={form.status} />
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                    <span>Synced {formatRelative(form.lastSync)}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => setPreview(form)} className="btn-secondary btn-sm">
                      <Eye className="h-3.5 w-3.5" /> Preview
                    </button>
                    {form.status === 'Needs Review' && (
                      <button onClick={() => navigate(`/projects/${projectId}/forms/sync`)} className="btn-primary btn-sm">
                        <RefreshCw className="h-3.5 w-3.5" /> Sync
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <Card className="p-8">
            <EmptyState icon={<FileText className="h-7 w-7" />} title="No forms found" description="Upload your first form to start smart synchronization." action={<button onClick={() => setUploadOpen(true)} className="btn-primary btn-md"><Upload className="h-4 w-4" /> Upload Form</button>} />
          </Card>
        )}

        {/* Preview modal */}
        <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.name} size="lg">
          {preview && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <StatusBadge status={preview.status} />
                <Tag color="neutral">{preview.category}</Tag>
                <span className="text-xs text-slate-400">Last synced {formatRelative(preview.lastSync)}</span>
              </div>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Form Fields</div>
                <div className="divide-y divide-slate-100">
                  {preview.fields.map((field) => {
                    const isChanging = field.key === syncExample.fieldKey;
                    return (
                      <div key={field.key} className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600">{field.label}</span>
                          {field.sourceForm === 'Master' && <Tag color="primary">Master</Tag>}
                          {isChanging && <Tag color="warning">Changed</Tag>}
                        </div>
                        <span className={`text-sm font-medium ${isChanging ? 'text-warning-700' : 'text-slate-900'}`}>
                          {isChanging ? <span className="line-through text-slate-400 mr-2">{syncExample.oldValue}</span> : null}
                          {isChanging ? syncExample.newValue : field.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {preview.status === 'Needs Review' && (
                <div className="flex items-center justify-between rounded-xl bg-warning-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-warning-800">
                    <AlertTriangle className="h-4 w-4" /> This form has pending changes from master info.
                  </div>
                  <button onClick={() => { setPreview(null); navigate(`/projects/${projectId}/forms/sync`); }} className="btn-primary btn-sm">
                    Review Changes <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </Modal>

        <Modal open={editMasterOpen} onClose={() => setEditMasterOpen(false)} title="Edit Master Project Information" size="lg">
          <div className="grid gap-4 sm:grid-cols-2">
            {masterFields.map((field) => (
              <div key={field.key} className={field.key === 'address' ? 'sm:col-span-2' : ''}>
                <label className="label">{field.label}</label>
                <input
                  className="input"
                  value={masterInfo[field.key]}
                  onChange={(event) => setMasterInfo((current) => ({ ...current, [field.key]: event.target.value }))}
                />
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-warning-50 p-4 text-sm text-warning-800">
            Save a master value to preview which linked forms will be affected before synchronization.
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button onClick={() => setEditMasterOpen(false)} className="btn-secondary btn-md">Cancel</button>
            <button onClick={() => setEditMasterOpen(false)} className="btn-primary btn-md">Save Master Field</button>
          </div>
        </Modal>
        <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Mock Form">
          <div><label className="label">Form Name</label><input className="input" value={uploadName} onChange={(event) => setUploadName(event.target.value)} /></div>
          <div className="mt-4 rounded-xl border-2 border-dashed border-slate-200 p-8 text-center text-sm text-slate-500"><Upload className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-2">Mock form file selected</p></div>
          <div className="mt-5 flex justify-end gap-2"><button onClick={() => setUploadOpen(false)} className="btn-secondary btn-md">Cancel</button><button onClick={() => { addForm(projectId, { id: `form-${Date.now()}`, name: uploadName || 'New Project Form', category: 'Other', status: 'Draft', lastSync: new Date().toISOString(), uploadedAt: new Date().toISOString(), fields: [] }); setUploadOpen(false); }} className="btn-primary btn-md">Add Form</button></div>
        </Modal>
      </div>
    </ProjectScreenWrapper>
  );
}
