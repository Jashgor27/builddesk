'use client';

import { useState } from 'react';
import { Building2, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Login() {
  const { push: navigate } = useRouter();
  const [showPwd, setShowPwd] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xl font-bold">BuildDesk</div>
              <div className="text-sm text-primary-200">Construction Management</div>
            </div>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold leading-tight">Manage every form, expense and material in one place.</h1>
            <p className="mt-4 text-primary-200 text-lg leading-relaxed">
              Built for civil engineers and construction professionals across India. Smart form sync, budget tracking and project intelligence.
            </p>
            <div className="mt-8 space-y-3">
              {['Smart Form Synchronization across all approvals', 'Real-time budget & material tracking', 'AI Assistant trained on your project data'].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent-400 flex-shrink-0" />
                  <span className="text-primary-100">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-primary-300">
            Built for construction teams across India
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="text-xl font-bold text-slate-900">BuildDesk</div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="mt-1.5 text-sm text-slate-500">Sign in to your BuildDesk account to continue.</p>

          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              navigate('/dashboard');
            }}
          >
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="email" className="input pl-10" placeholder="anil@builddesk.in" defaultValue="anil@builddesk.in" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="label">Password</label>
                <button type="button" className="text-xs font-medium text-primary-600 hover:text-primary-700">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type={showPwd ? 'text' : 'password'} className="input pl-10 pr-10" placeholder="••••••••" defaultValue="builddesk123" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-primary-600 focus:ring-primary-400" />
              Keep me signed in
            </label>

            <button type="submit" className="btn-primary btn-md w-full">
              Sign in <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-primary-600 hover:text-primary-700">Create one</Link>
          </p>

          <p className="mt-8 text-center text-xs text-slate-400">
            Demo prototype — use any credentials to sign in.
          </p>
        </div>
      </div>
    </div>
  );
}
