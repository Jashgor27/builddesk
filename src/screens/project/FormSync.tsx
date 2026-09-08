'use client';

import { useState } from 'react';
import { getForms, syncExample } from '@/lib/mockData';
import { ProjectScreenWrapper } from './ProjectShell';
import { Card, StatusBadge, Tag, ProgressBar } from '@/components/ui';
import { ArrowLeft, ArrowRight, RefreshCw, CheckCircle2, AlertTriangle, FileText, Sparkles, Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type SyncState = 'review' | 'syncing' | 'success';

export function FormSync({ projectId }: { projectId: string }) {
  const forms = getForms(projectId);
  const affectedForms = syncExample.affectedForms.map((af) => ({
    ...af,
    form: forms.find((f) => f.id === af.id),
  })).filter((af) => af.form);
  const { push: navigate } = useRouter();
  const [state, setState] = useState<SyncState>('review');
  const [syncProgress, setSyncProgress] = useState(0);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(affectedForms[0]?.id || null);

  const selectedForm = affectedForms.find((af) => af.id === selectedFormId);

  const handleSync = () => {
    setState('syncing');
    setSyncProgress(0);
    const interval = setInterval(() => {
      setSyncProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setState('success');
          return 100;
        }
        return p + 25;
      });
    }, 500);
  };

  return (
    <ProjectScreenWrapper projectId={projectId} active="forms">
      <div className="space-y-6 max-w-5xl">
        {/* Back */}
        <Link href={`/projects/${projectId}/forms`} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to Forms
        </Link>

        {/* Header */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-warning-500 to-warning-600 p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur flex-shrink-0">
                <RefreshCw className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">Smart Form Synchronization</h2>
                <p className="text-warning-100 mt-1">Review and apply master info changes across all linked forms</p>
              </div>
              <Tag color="warning" >
                <span className="bg-warning-100 text-warning-800 rounded-full px-2.5 py-0.5 text-xs font-medium">{affectedForms.length} forms affected</span>
              </Tag>
            </div>
          </div>

          {/* Change summary */}
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Field</div>
                <div className="text-sm font-semibold text-slate-900 mt-1">{syncExample.fieldLabel}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Old Value</div>
                <div className="text-sm font-semibold text-slate-400 mt-1 line-through">{syncExample.oldValue}</div>
              </div>
              <div className="rounded-xl bg-warning-50 p-4 border border-warning-200">
                <div className="text-xs text-warning-700">New Value</div>
                <div className="text-sm font-bold text-warning-800 mt-1">{syncExample.newValue}</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Affected forms list */}
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <Card className="p-4 h-fit">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Affected Forms</h3>
            <div className="space-y-1">
              {affectedForms.map((af) => (
                <button
                  key={af.id}
                  onClick={() => setSelectedFormId(af.id)}
                  disabled={state !== 'review'}
                  className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-all ${selectedFormId === af.id ? 'bg-primary-50 ring-1 ring-primary-200' : 'hover:bg-slate-50'
                    } ${state !== 'review' ? 'cursor-default' : ''}`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 ${state === 'success' ? 'bg-success-100 text-success-600' : 'bg-slate-100 text-slate-400'}`}>
                    {state === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 truncate">{af.form?.name}</div>
                    <div className="text-xs text-slate-500 truncate">{af.form?.category}</div>
                  </div>
                  {state === 'review' && <StatusBadge status="Needs Review" />}
                  {state === 'success' && <Tag color="success">Synced</Tag>}
                </button>
              ))}
            </div>
          </Card>

          {/* Preview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="section-title">Preview Changes</h3>
                <p className="text-sm text-slate-500 mt-0.5">{selectedForm?.form?.name}</p>
              </div>
              <Tag color="warning"><Eye className="h-3 w-3" /> Before / After</Tag>
            </div>

            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500 grid grid-cols-[1fr_1fr_1fr] gap-4">
                <span>Field</span><span>Current Value</span><span>New Value</span>
              </div>
              <div className="divide-y divide-slate-100">
                {selectedForm?.form?.fields.map((field) => {
                  const isChanging = field.key === syncExample.fieldKey;
                  return (
                    <div key={field.key} className="px-4 py-3 grid grid-cols-[1fr_1fr_1fr] gap-4 items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">{field.label}</span>
                        {field.sourceForm === 'Master' && <Tag color="primary">M</Tag>}
                      </div>
                      {isChanging ? (
                        <>
                          <span className="text-sm text-slate-400 line-through">{syncExample.oldValue}</span>
                          <span className="text-sm font-semibold text-warning-700 flex items-center gap-1">
                            <ArrowRight className="h-3 w-3 text-warning-500" /> {syncExample.newValue}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm text-slate-700">{field.value}</span>
                          <span className="text-sm text-slate-400">— no change</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-primary-50 p-4 flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-primary-900">Impact Summary</div>
                <p className="text-xs text-primary-700 mt-1">{selectedForm?.impact}</p>
              </div>
            </div>

            {/* Sync progress */}
            {state === 'syncing' && (
              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="h-4 w-4 text-primary-600 animate-spin" />
                  <span className="text-sm font-medium text-slate-900">Synchronizing forms...</span>
                </div>
                <ProgressBar value={syncProgress} color="primary" />
                <div className="text-xs text-slate-500 mt-2">{syncProgress}% complete</div>
              </div>
            )}

            {/* Success */}
            {state === 'success' && (
              <div className="mt-4 rounded-xl bg-success-50 border border-success-200 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-success-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-success-900">Synchronization Complete</div>
                    <p className="text-sm text-success-700 mt-1">
                      {syncExample.fieldLabel} has been updated from {syncExample.oldValue} to {syncExample.newValue} across {affectedForms.length} forms. All forms are now in sync with the Master Project Information.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => navigate(`/projects/${projectId}/forms`)} className="btn-primary btn-sm">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Done
                      </button>
                      <button onClick={() => { setState('review'); setSyncProgress(0); }} className="btn-secondary btn-sm">
                        Sync Another Field
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action */}
            {state === 'review' && (
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <AlertTriangle className="h-4 w-4 text-warning-500" />
                  Review all changes before syncing
                </div>
                <button onClick={handleSync} className="btn-primary btn-md">
                  <RefreshCw className="h-4 w-4" /> Synchronize {affectedForms.length} Forms
                </button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </ProjectScreenWrapper>
  );
}
