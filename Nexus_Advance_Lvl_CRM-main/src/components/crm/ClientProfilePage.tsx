'use client';

import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

export function ClientProfilePage() {
  const [profile, setProfile] = useState({ name: '', email: '', company: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/profile', { cache: 'no-store' });
      const json = await res.json();
      if (res.ok && json.user) {
        setProfile({
          name: json.user.name ?? '',
          email: json.user.email ?? '',
          company: json.user.company ?? '',
          phone: json.user.phone ?? '',
        });
      }
      setLoading(false);
    };
    load();
  }, []);

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: profile.name, company: profile.company, phone: profile.phone }),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error ?? 'Unable to update profile');
      return;
    }
    toast.success('Profile updated');
  };

  const changePassword = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/profile/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(passwordForm),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error ?? 'Unable to change password');
      return;
    }
    toast.success('Password updated');
    setPasswordForm({ currentPassword: '', newPassword: '' });
  };

  if (loading) return <p className="text-sm">Loading profile...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">My Profile</h1>
      <form onSubmit={saveProfile} className="rounded-xl border border-[var(--border-default)] bg-white p-4 space-y-3">
        <h2 className="text-lg font-semibold">Profile Details</h2>
        <input className="vlocal-input w-full" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Name" />
        <input className="vlocal-input w-full" value={profile.email} disabled placeholder="Email" />
        <input className="vlocal-input w-full" value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })} placeholder="Company" />
        <input className="vlocal-input w-full" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="Phone" />
        <button className="vlocal-btn bg-neutral-900 text-white">Save Profile</button>
      </form>

      <form onSubmit={changePassword} className="rounded-xl border border-[var(--border-default)] bg-white p-4 space-y-3">
        <h2 className="text-lg font-semibold">Change Password</h2>
        <input
          type="password"
          className="vlocal-input w-full"
          placeholder="Current password"
          value={passwordForm.currentPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
          required
        />
        <input
          type="password"
          className="vlocal-input w-full"
          placeholder="New password"
          minLength={8}
          value={passwordForm.newPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
          required
        />
        <button className="vlocal-btn bg-neutral-900 text-white">Update Password</button>
      </form>
    </div>
  );
}
