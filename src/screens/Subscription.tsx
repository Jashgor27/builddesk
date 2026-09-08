'use client';

import { useState } from 'react';
import { PageHeader, Card, SectionHeader, Tag, Modal } from '@/components/ui';
import { formatINR } from '@/lib/format';
import { Check, Sparkles, CreditCard, Download, Zap } from 'lucide-react';

const PLANS = [
  {
    name: 'Starter',
    price: 0,
    period: 'free forever',
    desc: 'For individual engineers getting started',
    features: ['Up to 2 projects', 'Basic form sync', 'Expense tracking', '1 GB document storage', 'Community support'],
    current: false,
    color: 'neutral' as const,
  },
  {
    name: 'Professional',
    price: 1499,
    period: 'per month',
    desc: 'For growing firms managing multiple projects',
    features: ['Unlimited projects', 'Smart form synchronization', 'Material tracking & budgeting', 'AI Assistant (Ask Your Project)', '50 GB document storage', 'Priority email support', 'Invoice uploads & extraction'],
    current: true,
    color: 'primary' as const,
  },
  {
    name: 'Enterprise',
    price: 4999,
    period: 'per month',
    desc: 'For large firms with advanced needs',
    features: ['Everything in Professional', 'Multi-user collaboration', 'Role-based access control', 'Unlimited storage', 'Custom form templates', 'Dedicated account manager', 'API access'],
    current: false,
    color: 'accent' as const,
  },
];

const INVOICES = [
  { id: 'INV-2026-009', date: '01 Sep 2026', amount: 1499, status: 'Paid' },
  { id: 'INV-2026-008', date: '01 Aug 2026', amount: 1499, status: 'Paid' },
  { id: 'INV-2026-007', date: '01 Jul 2026', amount: 1499, status: 'Paid' },
  { id: 'INV-2026-006', date: '01 Jun 2026', amount: 1499, status: 'Paid' },
  { id: 'INV-2026-005', date: '01 May 2026', amount: 1499, status: 'Paid' },
];

export function Subscription() {
  const [notice, setNotice] = useState('');
  const [confirm, setConfirm] = useState('');
  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader title="Subscription & Billing" subtitle="Manage your plan, payment method and invoices" />

      {/* Current plan */}
      <Card className="overflow-hidden">
        <div className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 p-6 text-white">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent-400" />
                <span className="text-sm font-medium text-primary-200">Current Plan</span>
              </div>
              <h2 className="text-3xl font-bold mt-2">Professional</h2>
              <p className="text-primary-200 mt-1">{formatINR(1499)}/month · Renews on 01 Oct 2026</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setNotice('Plan changes are available in this mock workspace.')} className="btn bg-white/15 text-white hover:bg-white/25 btn-md backdrop-blur">Change Plan</button>
              <button onClick={() => setConfirm('Cancel subscription')} className="btn bg-white text-primary-700 hover:bg-primary-50 btn-md">Cancel Subscription</button>
            </div>
          </div>
          <div className="relative mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Projects', value: '5 / Unlimited' },
              { label: 'Storage', value: '8.4 / 50 GB' },
              { label: 'Team Members', value: '1 / 1' },
              { label: 'AI Queries', value: '342 this month' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/10 backdrop-blur p-3">
                <div className="text-xs text-primary-200">{s.label}</div>
                <div className="text-sm font-semibold mt-0.5">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Plans */}
      <div>
        <SectionHeader title="Available Plans" subtitle="Upgrade or downgrade at any time" />
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <Card key={plan.name} className={`p-6 ${plan.current ? 'ring-2 ring-primary-500' : ''}`}>
              {plan.current && (
                <div className="mb-3">
                  <Tag color="primary"><Zap className="h-3 w-3" /> Current Plan</Tag>
                </div>
              )}
              <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{plan.desc}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900">{plan.price === 0 ? 'Free' : formatINR(plan.price)}</span>
                {plan.price > 0 && <span className="text-sm text-slate-500">/{plan.period}</span>}
                {plan.price === 0 && <span className="text-sm text-slate-500">{plan.period}</span>}
              </div>
              <ul className="mt-5 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Check className="h-4 w-4 text-success-500 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => setNotice(plan.current ? 'Professional is already active.' : `${plan.name} selected in mock mode.`)}
                className={`mt-6 w-full ${plan.current ? 'btn-secondary btn-md' : 'btn-primary btn-md'}`}
                disabled={plan.current}
              >
                {plan.current ? 'Current Plan' : plan.price === 0 ? 'Downgrade' : 'Upgrade'}
              </button>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment method */}
      <Card className="p-6">
        <SectionHeader title="Payment Method" />
        <div className="mt-4 flex items-center gap-4 rounded-xl border border-slate-200 p-4">
          <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-slate-900 text-white">
            <CreditCard className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-900">HDFC Bank Credit Card</div>
            <div className="text-xs text-slate-500">•••• •••• •••• 4521 · Expires 08/28</div>
          </div>
          <button onClick={() => setNotice('Payment method update opened in mock mode.')} className="btn-secondary btn-sm">Update</button>
        </div>
      </Card>

      {/* Invoice history */}
      <Card className="p-6">
        <SectionHeader title="Invoice History" subtitle="Download past invoices" />
        <div className="mt-4 table-wrap">
          <table className="table">
            <thead>
              <tr><th>Invoice</th><th>Date</th><th>Amount</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {INVOICES.map((inv) => (
                <tr key={inv.id}>
                  <td className="font-semibold text-slate-900">{inv.id}</td>
                  <td className="text-slate-600">{inv.date}</td>
                  <td className="font-semibold text-slate-900">{formatINR(inv.amount)}</td>
                  <td><Tag color="success">{inv.status}</Tag></td>
                  <td><button onClick={() => setNotice(`${inv.id} download prepared in mock mode.`)} className="btn-ghost btn-sm"><Download className="h-4 w-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {notice && <div className="rounded-xl bg-primary-50 border border-primary-200 px-4 py-3 text-sm text-primary-700">{notice}</div>}
      <Modal open={!!confirm} onClose={() => setConfirm('')} title={confirm}>
        <p className="text-sm text-slate-600">This is a mock subscription action. Continue?</p>
        <div className="mt-5 flex justify-end gap-2"><button onClick={() => setConfirm('')} className="btn-secondary btn-md">Keep Plan</button><button onClick={() => { setConfirm(''); setNotice('Subscription cancellation saved in mock mode.'); }} className="btn-danger btn-md">Confirm</button></div>
      </Modal>
    </div>
  );
}
