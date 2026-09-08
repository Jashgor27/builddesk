'use client';

import { useState } from 'react';
import { Building2, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2, Phone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Signup() {
  const { push: navigate } = useRouter();
  const [showPwd, setShowPwd] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left form */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-6 py-12 order-2 lg:order-1">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="text-xl font-bold text-slate-900">BuildDesk</div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
          <p className="mt-1.5 text-sm text-slate-500">Start managing your construction projects smarter.</p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              navigate('/dashboard');
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input className="input pl-10" placeholder="Anil" defaultValue="Anil" />
                </div>
              </div>
              <div>
                <label className="label">Last name</label>
                <input className="input" placeholder="Kothari" defaultValue="Kothari" />
              </div>
            </div>

            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="email" className="input pl-10" placeholder="you@firm.in" />
              </div>
            </div>

            <div>
              <label className="label">Phone number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="tel" className="input pl-10" placeholder="+91 98765 43210" />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type={showPwd ? 'text' : 'password'} className="input pl-10 pr-10" placeholder="Create a strong password" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-slate-400">At least 8 characters with a number and a symbol.</p>
            </div>

            <label className="flex items-start gap-2 text-sm text-slate-600">
              <input type="checkbox" defaultChecked className="mt-0.5 rounded border-slate-300 text-primary-600 focus:ring-primary-400" />
              I agree to the Terms of Service and Privacy Policy
            </label>

            <button type="submit" className="btn-primary btn-md w-full">
              Create account <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 relative overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3 justify-end">
            <div>
              <div className="text-xl font-bold text-right">BuildDesk</div>
              <div className="text-sm text-primary-200 text-right">Construction Management</div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Building2 className="h-6 w-6" />
            </div>
          </div>

          <div className="max-w-md ml-auto text-right">
            <h1 className="text-4xl font-bold leading-tight">Bring your project records into one workspace.</h1>
            <p className="mt-4 text-primary-200 text-lg leading-relaxed">
              From Bhuj to Mundra, engineers use BuildDesk to keep forms, budgets and materials in sync.
            </p>
            <div className="mt-8 space-y-3">
              {['14-day free trial — no card required', 'Cancel anytime', 'Data stored securely in India'].map((f) => (
                <div key={f} className="flex items-center gap-3 justify-end">
                  <span className="text-primary-100">{f}</span>
                  <CheckCircle2 className="h-5 w-5 text-accent-400 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-primary-300 text-right">
            Start your free trial today
          </div>
        </div>
      </div>
    </div>
  );
}
