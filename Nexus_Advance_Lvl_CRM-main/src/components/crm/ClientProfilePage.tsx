'use client';

import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { 
  User as UserIcon, Mail, Building, Phone, Lock, Save, 
  Key, RefreshCw, AlertCircle, Award, Eye, EyeOff
} from 'lucide-react';
import { motion } from 'motion/react';

export function ClientProfilePage() {
  const [profile, setProfile] = useState({ name: '', email: '', company: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/profile', { cache: 'no-store' });
        const json = await res.json();
        if (res.ok && json.success && json.data.user) {
          setProfile({
            name: json.data.user.name || '',
            email: json.data.user.email || '',
            company: json.data.user.company || json.data.clientProfile?.companyName || '',
            phone: json.data.user.phone || json.data.clientProfile?.phone || '',
          });
        }
      } catch {
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profile.name, company: profile.company, phone: profile.phone }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.message ?? 'Unable to update profile');
        return;
      }
      toast.success('Profile details updated successfully');
    } catch {
      toast.error('Network error updating profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const changePassword = async (e: FormEvent) => {
    e.preventDefault();
    setIsSavingPassword(true);
    try {
      const res = await fetch('/api/profile/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordForm),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.message ?? 'Unable to change password');
        return;
      }
      toast.success('Password updated successfully');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch {
      toast.error('Network error changing password');
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
        <div className="h-80 bg-neutral-200 rounded-3xl"></div>
      </div>
    );
  }

  const initials = profile.name ? profile.name.slice(0, 2).toUpperCase() : 'JD';

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Decorative meshes */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-neutral-900/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/50 pb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-neutral-900 text-white flex items-center justify-center font-display font-black text-xl shadow-2xl border border-white/10">
            {initials}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">My Profile</h1>
            <p className="text-sm text-neutral-500 font-medium">Manage corporate identities and credentials</p>
          </div>
        </div>
        <span className="px-3.5 py-1 text-[10px] font-black uppercase tracking-widest bg-yellow-150 border border-yellow-300 text-yellow-800 rounded-full flex items-center gap-1.5 self-start md:self-auto">
          <Award size={12} />
          Premium Account
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Profile Form */}
        <form onSubmit={saveProfile} className="lg:col-span-7 glass-card p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-white shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-neutral-800 tracking-tight">Profile Details</h2>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">Primary workspace contact info</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 px-1">Full Name</label>
                <div className="relative">
                  <input 
                    className="vlocal-input w-full !pl-11" 
                    value={profile.name} 
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })} 
                    placeholder="e.g. Saif Client" 
                    required 
                  />
                  <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 px-1">Email Address</label>
                <div className="relative">
                  <input 
                    className="vlocal-input w-full !pl-11 bg-neutral-50/70 border-neutral-200 cursor-not-allowed opacity-70" 
                    value={profile.email} 
                    disabled 
                    placeholder="Email Address" 
                  />
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 px-1">Company / Organization</label>
                <div className="relative">
                  <input 
                    className="vlocal-input w-full !pl-11" 
                    value={profile.company} 
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })} 
                    placeholder="e.g. Vlocal Corp" 
                  />
                  <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 px-1">Phone Number</label>
                <div className="relative">
                  <input 
                    className="vlocal-input w-full !pl-11" 
                    value={profile.phone} 
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })} 
                    placeholder="e.g. +1 (555) 000-0000" 
                  />
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSavingProfile}
            className="vlocal-btn bg-neutral-900 text-white font-bold hover:bg-black transition flex items-center justify-center gap-2 self-start mt-6 w-full sm:w-auto"
          >
            {isSavingProfile ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Profile
          </button>
        </form>

        {/* Change Password Form */}
        <form onSubmit={changePassword} className="lg:col-span-5 glass-card p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-white shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-neutral-800 tracking-tight">Security Credentials</h2>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">Rotate passwords regularly</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 px-1">Current Password</label>
                <div className="relative">
                  <input 
                    type={showCurrentPassword ? 'text' : 'password'}
                    className="vlocal-input w-full !pl-11 !pr-12 bg-neutral-50/50 border-neutral-200 focus:bg-white text-neutral-850 placeholder-neutral-400" 
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required 
                  />
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 px-1">New Password</label>
                <div className="relative">
                  <input 
                    type={showNewPassword ? 'text' : 'password'}
                    className="vlocal-input w-full !pl-11 !pr-12 bg-neutral-50/50 border-neutral-200 focus:bg-white text-neutral-850 placeholder-neutral-400" 
                    placeholder="Minimum 8 characters"
                    minLength={8}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required 
                  />
                  <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSavingPassword}
            className="vlocal-btn bg-[var(--accent)] text-neutral-900 font-bold hover:brightness-110 transition flex items-center justify-center gap-2 self-start mt-6 w-full sm:w-auto"
          >
            {isSavingPassword ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Key className="h-4 w-4" />
            )}
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
