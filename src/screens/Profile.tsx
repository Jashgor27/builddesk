'use client';

import { useState } from 'react';
import { PageHeader, Card, Avatar, Modal } from '@/components/ui';
import { Mail, Phone, MapPin, Briefcase, UserRound, Building2, ShieldCheck } from 'lucide-react';

const profileFields = [
    { label: 'Name', value: 'Anil Kothari', icon: UserRound },
    { label: 'Email', value: 'anil@builddesk.in', icon: Mail },
    { label: 'Phone', value: '+91 98765 43210', icon: Phone },
    { label: 'Company', value: 'Kothari Civil Engineering', icon: Building2 },
    { label: 'Role', value: 'Principal Civil Engineer', icon: Briefcase },
    { label: 'Location', value: 'Bhuj, Kutch, Gujarat', icon: MapPin },
];

export function Profile() {
    const [editOpen, setEditOpen] = useState(false);
    const [saved, setSaved] = useState(false);
    return (
        <div className="space-y-6 animate-fadeIn max-w-4xl">
            <PageHeader title="Profile" subtitle="Your BuildDesk account details" />

            <Card className="p-6">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                    <Avatar initials="AK" color="primary" size="lg" />
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Anil Kothari</h2>
                        <p className="text-sm text-slate-500 mt-1">Principal Civil Engineer</p>
                    </div>
                    <div className="ml-auto hidden sm:flex items-center gap-1.5 text-xs font-medium text-success-700">
                        <ShieldCheck className="h-4 w-4" /> Demo profile
                    </div>
                </div>

                <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                    {profileFields.map((field) => {
                        const Icon = field.icon;
                        return (
                            <div key={field.label}>
                                <div className="text-xs font-medium uppercase tracking-wider text-slate-400">{field.label}</div>
                                <div className="mt-2 flex items-center gap-2.5 text-sm font-medium text-slate-900">
                                    <Icon className="h-4 w-4 text-slate-400" />
                                    {field.value}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-7 flex justify-end border-t border-slate-100 pt-5">
                    <button onClick={() => setEditOpen(true)} className="btn-primary btn-md">Edit Profile</button>
                </div>
            </Card>
            <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
                <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); setSaved(true); setEditOpen(false); }}>
                    {profileFields.map((field) => <div key={field.label}><label className="label">{field.label}</label><input className="input" defaultValue={field.value} /></div>)}
                    <div className="flex justify-end gap-2"><button type="button" onClick={() => setEditOpen(false)} className="btn-secondary btn-md">Cancel</button><button type="submit" className="btn-primary btn-md">Save Profile</button></div>
                </form>
            </Modal>
            {saved && <div className="rounded-xl bg-success-50 border border-success-200 px-4 py-3 text-sm text-success-700">Profile changes saved in mock mode.</div>}
        </div>
    );
}
