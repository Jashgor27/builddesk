'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageHeader, Card } from '@/components/ui';
import { addProject, type ProjectType } from '@/lib/mockData';
import { ArrowLeft, ArrowRight, Check, Home, Briefcase, Factory, MapPin, User, Calendar, IndianRupee, FileText, Upload } from 'lucide-react';

const STEPS = ['Project Details', 'Owner Information', 'Budget & Timeline', 'Review'];

const TYPES = [
  { value: 'Residential', icon: Home, desc: 'Houses, villas, bungalows' },
  { value: 'Commercial', icon: Briefcase, desc: 'Shops, offices, complexes' },
  { value: 'Industrial', icon: Factory, desc: 'Sheds, warehouses, factories' },
];

export function CreateProject() {
  const { push: navigate } = useRouter();
  const [step, setStep] = useState(0);
  const [type, setType] = useState('Residential');
  const [form, setForm] = useState({ name: '', location: '', owner: '', description: '', budget: '', startDate: '2026-09-07', endDate: '2027-09-07', plotArea: '' });
  const setField = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const createProject = () => {
    const id = `${form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'new-project'}-${Date.now()}`;
    addProject({ id, name: form.name || 'New Project', client: form.owner || 'Project Owner', location: form.location || 'Bhuj', type: type as ProjectType, status: 'Planning', progress: 0, budget: Number(form.budget) || 0, spent: 0, startDate: form.startDate, endDate: form.endDate, thumbnail: 'new', description: form.description || 'New construction project.', team: [], masterInfo: { ownerName: form.owner || 'Project Owner', plotNumber: '', surveyNumber: '', plotArea: form.plotArea, address: form.location, village: '', taluka: '', district: 'Kutch' } });
    navigate(`/projects/${id}`);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      <PageHeader
        title="Create New Project"
        subtitle="Set up a new construction project in a few steps"
        breadcrumb={[{ label: 'Projects', to: '/projects' }, { label: 'Create' }]}
        actions={
          <Link href="/projects" className="btn-secondary btn-md">
            <ArrowLeft className="h-4 w-4" /> Cancel
          </Link>
        }
      />

      {/* Stepper */}
      <div className="flex items-center justify-between">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all ${i < step
                  ? 'bg-success-500 text-white'
                  : i === step
                    ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                    : 'bg-slate-100 text-slate-400'
                  }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:inline ${i <= step ? 'text-slate-900' : 'text-slate-400'}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-3 rounded ${i < step ? 'bg-success-500' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      <Card className="p-6">
        {step === 0 && (
          <div className="space-y-5 animate-slideUp">
            <h3 className="section-title">Project Details</h3>
            <div>
              <label className="label">Project Name</label>
              <input className="input" placeholder="e.g. Patel Residence — Bhuj" value={form.name} onChange={(event) => setField('name', event.target.value)} />
            </div>
            <div>
              <label className="label">Project Type</label>
              <div className="grid grid-cols-3 gap-3">
                {TYPES.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.value}
                      onClick={() => setType(t.value)}
                      className={`rounded-xl border-2 p-4 text-left transition-all ${type === t.value ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      <Icon className={`h-5 w-5 mb-2 ${type === t.value ? 'text-primary-600' : 'text-slate-400'}`} />
                      <div className="text-sm font-semibold text-slate-900">{t.value}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{t.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Location (City/Town)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input className="input pl-10" placeholder="Bhuj" value={form.location} onChange={(event) => setField('location', event.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Client / Owner Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input className="input pl-10" placeholder="Ramesh Patel" value={form.owner} onChange={(event) => setField('owner', event.target.value)} />
                </div>
              </div>
            </div>
            <div>
              <label className="label">Project Description</label>
              <textarea className="input min-h-[80px] resize-none" placeholder="Brief description of the project scope..." value={form.description} onChange={(event) => setField('description', event.target.value)} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5 animate-slideUp">
            <h3 className="section-title">Master Project Information</h3>
            <p className="text-sm text-slate-500">These fields will be synchronized across all project forms.</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Owner Name (as per records)</label>
                <input className="input" placeholder="Ramesh Patel" />
              </div>
              <div>
                <label className="label">Plot Number</label>
                <input className="input" placeholder="Plot 14, Krishnanagar" />
              </div>
              <div>
                <label className="label">Survey Number</label>
                <input className="input" placeholder="245/2" />
              </div>
              <div>
                <label className="label">Plot Area</label>
                <input className="input" placeholder="2,400 sq.ft" value={form.plotArea} onChange={(event) => setField('plotArea', event.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Address</label>
                <input className="input" placeholder="Plot 14, Krishnanagar, Bhuj" />
              </div>
              <div>
                <label className="label">Village</label>
                <input className="input" placeholder="Bhuj (Municipality)" />
              </div>
              <div>
                <label className="label">Taluka</label>
                <input className="input" placeholder="Bhuj" />
              </div>
              <div>
                <label className="label">District</label>
                <input className="input" placeholder="Kutch" defaultValue="Kutch" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-slideUp">
            <h3 className="section-title">Budget & Timeline</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Total Budget</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input className="input pl-10" placeholder="45,00,000" value={form.budget} onChange={(event) => setField('budget', event.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="date" className="input pl-10" value={form.startDate} onChange={(event) => setField('startDate', event.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Expected End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="date" className="input pl-10" value={form.endDate} onChange={(event) => setField('endDate', event.target.value)} />
                </div>
              </div>
            </div>
            <div>
              <label className="label">Upload Initial Forms (optional)</label>
              <div className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center hover:border-primary-300 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-600 font-medium">Drop form files here or click to browse</p>
                <p className="text-xs text-slate-400 mt-1">PDF, DOCX, JPG up to 10 MB each</p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-slideUp">
            <h3 className="section-title">Review & Create</h3>
            <div className="space-y-4">
              {[
                { label: 'Project Name', value: form.name || 'New Project' },
                { label: 'Type', value: type },
                { label: 'Location', value: form.location || 'Bhuj, Kutch' },
                { label: 'Owner', value: form.owner || 'Project Owner' },
                { label: 'Plot Area', value: form.plotArea || 'Not specified' },
                { label: 'Budget', value: form.budget ? `₹${form.budget}` : 'Not specified' },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-sm text-slate-500">{r.label}</span>
                  <span className="text-sm font-semibold text-slate-900">{r.value}</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-primary-50 p-4 flex items-start gap-3">
              <FileText className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-primary-800">
                Master Project Information will be auto-synced to Building Permission Application, Property Tax Assessment and other linked forms.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
          <button
            onClick={() => (step === 0 ? navigate('/projects') : setStep(step - 1))}
            className="btn-secondary btn-md"
          >
            {step === 0 ? 'Cancel' : 'Back'}
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(step + 1)} className="btn-primary btn-md">
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={createProject} className="btn-primary btn-md">
              <Check className="h-4 w-4" /> Create Project
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
