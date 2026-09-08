'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addExpense, getProject } from '@/lib/mockData';
import { formatINR } from '@/lib/format';
import { ProjectScreenWrapper } from './ProjectShell';
import { Card, SectionHeader, Tag } from '@/components/ui';
import { ArrowLeft, Check, FileText, Upload } from 'lucide-react';

type Mode = 'choose' | 'manual' | 'upload' | 'review';
const CATEGORIES = ['Cement', 'Steel', 'Sand', 'Aggregate', 'Labour', 'Transport', 'Electrical', 'Plumbing', 'Other'];
const initialForm = { category: 'Cement', description: '', amount: '', date: '2026-09-07', vendor: '', quantity: '', unit: '', notes: '' };

export function AddExpense({ projectId }: { projectId: string }) {
    const project = getProject(projectId)!;
    const { push: navigate } = useRouter();
    const [mode, setMode] = useState<Mode>('choose');
    const [uploaded, setUploaded] = useState(false);
    const [form, setForm] = useState(initialForm);
    const setField = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

    const saveExpense = () => {
        addExpense(projectId, {
            id: `expense-${Date.now()}`,
            date: form.date,
            category: form.category,
            vendor: form.vendor || 'Local Supplier',
            description: form.description || `${form.category} purchase`,
            amount: Number(form.amount) || 0,
            status: 'Paid',
            invoice: mode === 'review' ? 'MOCK-INV-001' : undefined,
        });
        setMode('choose');
        navigate(`/projects/${projectId}/expenses`);
    };

    const field = (key: keyof typeof form, label: string, type = 'text') => (
        <div><label className="label">{label}</label><input type={type} className="input" value={form[key]} onChange={(event) => setField(key, event.target.value)} /></div>
    );

    return (
        <ProjectScreenWrapper projectId={projectId} active="expenses">
            <div className="space-y-6 max-w-3xl mx-auto">
                <Link href={`/projects/${projectId}/expenses`} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"><ArrowLeft className="h-4 w-4" /> Back to Expenses</Link>
                <div><h1 className="text-2xl font-bold text-slate-900">Add Expense</h1><p className="text-sm text-slate-500 mt-1">Add a mock expense to {project.name}.</p></div>

                {mode === 'choose' && <Card className="p-6"><SectionHeader title="Choose an entry method" subtitle="Both options save to this project's mock expense ledger." /><div className="mt-6 grid gap-4 sm:grid-cols-2"><button onClick={() => setMode('manual')} className="rounded-xl border border-slate-200 p-5 text-left hover:border-primary-300 hover:bg-primary-50/30"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Check className="h-5 w-5" /></div><h3 className="mt-4 text-sm font-semibold text-slate-900">Manual Expense</h3><p className="mt-1 text-sm text-slate-500">Enter supplier, quantity, amount and notes directly.</p></button><button onClick={() => setMode('upload')} className="rounded-xl border border-slate-200 p-5 text-left hover:border-primary-300 hover:bg-primary-50/30"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Upload className="h-5 w-5" /></div><h3 className="mt-4 text-sm font-semibold text-slate-900">Upload Invoice</h3><p className="mt-1 text-sm text-slate-500">Select a mock invoice and review extracted details.</p></button></div></Card>}

                {mode === 'manual' && <Card className="p-6"><SectionHeader title="Manual Expense" subtitle="All fields are local mock data." /><div className="mt-6 grid gap-4 sm:grid-cols-2"><div><label className="label">Category</label><select className="input" value={form.category} onChange={(event) => setField('category', event.target.value)}>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></div>{field('description', 'Description')}{field('amount', 'Amount', 'number')}{field('date', 'Date', 'date')}{field('vendor', 'Supplier')}{field('quantity', 'Quantity', 'number')}{field('unit', 'Unit')}<div className="sm:col-span-2">{field('notes', 'Notes')}</div></div><div className="mt-6 flex justify-end gap-2"><button onClick={() => setMode('choose')} className="btn-secondary btn-md">Back</button><button onClick={saveExpense} className="btn-primary btn-md"><Check className="h-4 w-4" /> Add Expense</button></div></Card>}

                {mode === 'upload' && <Card className="p-6"><SectionHeader title="Upload Invoice" subtitle="Choose a mock file to generate editable extracted details." /><button onClick={() => { setUploaded(true); setForm({ category: 'Cement', description: '50 cement bags', amount: '23500', date: '2026-09-04', vendor: 'ABC Traders', quantity: '50', unit: 'bags', notes: 'Mock invoice extraction' }); }} className="mt-6 w-full rounded-xl border-2 border-dashed border-slate-200 p-10 text-center hover:border-primary-300"><Upload className="mx-auto h-9 w-9 text-slate-300" /><div className="mt-3 text-sm font-medium text-slate-700">{uploaded ? 'invoice-abc-traders.pdf selected' : 'Select mock invoice'}</div><div className="mt-1 text-xs text-slate-400">No real file processing</div></button>{uploaded && <div className="mt-5 flex justify-end"><button onClick={() => setMode('review')} className="btn-primary btn-md">Review Extracted Expense</button></div>}</Card>}

                {mode === 'review' && <Card className="p-6"><div className="flex items-center justify-between"><SectionHeader title="Review Extracted Expense" subtitle="Edit the mock extraction before saving." /><Tag color="success"><FileText className="h-3 w-3" /> Mock extracted</Tag></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><div><label className="label">Category</label><select className="input" value={form.category} onChange={(event) => setField('category', event.target.value)}>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></div>{field('description', 'Description')}{field('amount', 'Amount', 'number')}{field('date', 'Date', 'date')}{field('vendor', 'Supplier')}{field('quantity', 'Quantity', 'number')}{field('unit', 'Unit')}<div className="sm:col-span-2">{field('notes', 'Notes')}</div></div><div className="mt-6 rounded-xl bg-primary-50 p-4 text-sm text-primary-800">Extracted total: <strong>{formatINR(Number(form.amount) || 0)}</strong></div><div className="mt-6 flex justify-end gap-2"><button onClick={() => setMode('upload')} className="btn-secondary btn-md">Back</button><button onClick={saveExpense} className="btn-primary btn-md"><Check className="h-4 w-4" /> Add Expense</button></div></Card>}
            </div>
        </ProjectScreenWrapper>
    );
}
