'use client';

import { useState } from 'react';
import { PageHeader, Card, SectionHeader, Avatar, Tag } from '@/components/ui';
import { User, Building, Shield, Check, ChevronRight } from 'lucide-react';

const SECTIONS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'company', label: 'Company', icon: Building },
    { id: 'security', label: 'Security', icon: Shield },
] as const;

type SectionId = typeof SECTIONS[number]['id'];

export function Settings() {
    const [active, setActive] = useState<SectionId>('profile');
    const [saved, setSaved] = useState('');
    const save = (message: string) => setSaved(message);

    return (
        <div className="space-y-6 animate-fadeIn">
            <PageHeader title="Settings" subtitle="Manage your account, company and security details" />
            <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
                <Card className="p-3 h-fit">
                    <nav className="space-y-1">
                        {SECTIONS.map((section) => {
                            const Icon = section.icon;
                            return (
                                <button key={section.id} onClick={() => { setActive(section.id); setSaved(''); }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${active === section.id ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                                    <Icon className={`h-4 w-4 ${active === section.id ? 'text-primary-600' : 'text-slate-400'}`} />
                                    {section.label}
                                    <ChevronRight className={`ml-auto h-4 w-4 ${active === section.id ? 'text-primary-400' : 'text-slate-300'}`} />
                                </button>
                            );
                        })}
                    </nav>
                </Card>

                <div className="space-y-4">
                    {active === 'profile' && (
                        <Card className="p-6">
                            <SectionHeader title="Profile Information" subtitle="Update your personal details" />
                            <div className="mt-6 flex items-center gap-4">
                                <Avatar initials="AK" color="primary" size="lg" />
                                <div><button onClick={() => save('Profile photo placeholder selected.')} className="btn-secondary btn-sm">Change Photo</button><p className="text-xs text-slate-400 mt-1.5">Mock profile photo</p></div>
                            </div>
                            <form className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); save('Profile changes saved.'); }}>
                                <div><label className="label">First Name</label><input className="input" defaultValue="Anil" /></div>
                                <div><label className="label">Last Name</label><input className="input" defaultValue="Kothari" /></div>
                                <div><label className="label">Email</label><input className="input" defaultValue="anil@builddesk.in" /></div>
                                <div><label className="label">Phone</label><input className="input" defaultValue="+91 98765 43210" /></div>
                                <div className="sm:col-span-2"><label className="label">Role / Title</label><input className="input" defaultValue="Principal Civil Engineer" /></div>
                                <div className="sm:col-span-2 flex items-center justify-end gap-3"><button type="button" onClick={() => save('No changes to discard.')} className="btn-secondary btn-md">Cancel</button><button type="submit" className="btn-primary btn-md"><Check className="h-4 w-4" /> Save Changes</button></div>
                            </form>
                        </Card>
                    )}

                    {active === 'company' && (
                        <Card className="p-6">
                            <SectionHeader title="Company Information" subtitle="Details shown on project forms and invoices" />
                            <form className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); save('Company changes saved.'); }}>
                                <div><label className="label">Company Name</label><input className="input" defaultValue="Kothari Civil Engineering" /></div>
                                <div><label className="label">License Number</label><input className="input" defaultValue="GJ/CE/2018/4521" /></div>
                                <div><label className="label">GST Number</label><input className="input" defaultValue="24ABCDE1234F1Z5" /></div>
                                <div><label className="label">PAN</label><input className="input" defaultValue="ABCDE1234F" /></div>
                                <div className="sm:col-span-2"><label className="label">Office Address</label><input className="input" defaultValue="Station Road, Bhuj, Kutch — 370001" /></div>
                                <div className="sm:col-span-2 flex justify-end"><button type="submit" className="btn-primary btn-md"><Check className="h-4 w-4" /> Save Company</button></div>
                            </form>
                        </Card>
                    )}

                    {active === 'security' && (
                        <Card className="p-6">
                            <SectionHeader title="Security" subtitle="Manage your demo account security settings" />
                            <form className="mt-6 space-y-4" onSubmit={(event) => { event.preventDefault(); save('Password changes saved in mock mode.'); }}>
                                <div><label className="label">Current Password</label><input type="password" className="input" placeholder="Enter current password" /></div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div><label className="label">New Password</label><input type="password" className="input" /></div><div><label className="label">Confirm Password</label><input type="password" className="input" /></div></div>
                                <div className="rounded-xl bg-slate-50 p-4 flex items-center justify-between"><div><div className="text-sm font-medium text-slate-900">Two-Factor Authentication</div><div className="text-xs text-slate-500 mt-0.5">Mock security status</div></div><Tag color="success">Enabled</Tag></div>
                                <div className="flex justify-end"><button type="submit" className="btn-primary btn-md"><Check className="h-4 w-4" /> Update Password</button></div>
                            </form>
                        </Card>
                    )}
                    {saved && <div className="rounded-xl bg-success-50 border border-success-200 px-4 py-3 text-sm text-success-700">{saved}</div>}
                </div>
            </div>
        </div>
    );
}
