'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Phone, MapPin, Calendar, 
  ShieldCheck, Lock, Activity, LogOut, 
  Camera, Edit3, Key, Bell, CreditCard,
  CheckCircle2, Clock, Smartphone
} from 'lucide-react';
import { useAdminStore } from '@/modules/admin/data/store';
import { toast } from 'sonner';

const tabs = [
  { id: 'personal', label: 'Identity', icon: User },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'activity', label: 'Activity', icon: Activity },
];

export default function ProfilePage() {
  const { state, dispatch } = useAdminStore();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = (updates: any) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: updates });
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Identity profile updated successfully');
  };

  return (
    <div className="flex flex-col gap-8 md:gap-10 pb-20 relative overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute top-0 left-0 w-full h-[320px] bg-gradient-to-b from-[var(--accent-glow)] to-transparent -z-10 overflow-hidden opacity-60">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>
      <div className="absolute top-[-5%] left-[-10%] w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Identity Card */}
      <div className="relative z-10 pt-20">
        <div className="glass-card p-8 md:p-12 rounded-[48px] border border-white/60 shadow-2xl flex flex-col md:flex-row items-center md:items-end gap-10">
           <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] bg-neutral-900 border-[8px] border-white/80 shadow-2xl flex items-center justify-center text-5xl font-display font-black text-white select-none overflow-hidden group-hover:scale-105 transition-transform duration-500">
                 {state.adminProfile.avatar}
              </div>
              <button className="absolute bottom-[-10px] right-[-10px] w-12 h-12 bg-[var(--accent)] text-neutral-900 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                 <Camera size={20} />
              </button>
           </div>

           <div className="flex-1 text-center md:text-left space-y-3">
              <div className="space-y-1">
                 <h1 className="text-4xl md:text-5xl font-display font-black text-neutral-900 tracking-tight">{state.adminProfile.name}</h1>
                 <p className="text-sm font-bold text-[var(--accent)] uppercase tracking-[0.3em] font-display">{state.adminProfile.role}</p>
              </div>
              <p className="text-sm font-medium text-neutral-500 max-w-xl leading-relaxed">{state.adminProfile.bio}</p>
           </div>

           <div className="flex flex-col gap-3 min-w-[200px]">
              <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="CODEVATE-btn bg-neutral-900 text-white w-full shadow-xl hover:scale-[1.02] flex gap-3 transition-all"
              >
                 {isEditing ? <CheckCircle2 size={16} /> : <Edit3 size={16} />}
                 <span className="uppercase tracking-widest text-[11px] font-black">{isEditing ? 'Save Profile' : 'Edit Profile'}</span>
              </button>
              <button className="CODEVATE-btn bg-white border border-neutral-200 text-neutral-500 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 w-full shadow-sm flex gap-3 transition-all">
                 <LogOut size={16} />
                 <span className="uppercase tracking-widest text-[11px] font-black">Secure Logout</span>
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3">
           <div className="glass-card p-4 rounded-[40px] border border-white shadow-xl flex flex-col gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-[24px] transition-all duration-500 group relative ${
                    activeTab === tab.id 
                      ? 'bg-neutral-900 text-white shadow-2xl' 
                      : 'hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <tab.icon size={18} className={activeTab === tab.id ? 'text-[var(--accent)]' : 'text-neutral-400 group-hover:text-neutral-900'} />
                  <span className="text-[12px] font-black uppercase tracking-widest">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="profile-tab-active"
                      className="absolute inset-0 bg-neutral-900 rounded-[24px] -z-10"
                    />
                  )}
                </button>
              ))}
           </div>

           <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { label: 'Uptime', value: '142h', color: 'text-emerald-500' },
                { label: 'Security', value: 'High', color: 'text-blue-500' },
              ].map((stat, i) => (
                <div key={i} className="glass-card p-6 rounded-[32px] border border-white shadow-lg text-center">
                   <h3 className={`text-xl font-display font-black ${stat.color}`}>{stat.value}</h3>
                   <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">{stat.label}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
           <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className="flex flex-col gap-8"
              >
                {activeTab === 'personal' && (
                  <div className="space-y-8">
                     <div className="glass-card p-10 rounded-[48px] border border-white shadow-xl flex flex-col gap-10">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-display font-bold text-neutral-900 uppercase tracking-tight">Identity Details</h2>
                          <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Public and private core credentials</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 px-1 flex items-center gap-2">
                                 <User size={12} /> Full Name
                              </label>
                              <input 
                                type="text" 
                                disabled={!isEditing}
                                value={state.adminProfile.name}
                                onChange={(e) => handleUpdate({ name: e.target.value })}
                                className="CODEVATE-input w-full bg-neutral-50/50 border-neutral-100 disabled:opacity-70 disabled:bg-transparent rounded-2xl px-6 font-bold"
                              />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 px-1 flex items-center gap-2">
                                 <Mail size={12} /> Email Address
                              </label>
                              <input 
                                type="email" 
                                disabled={!isEditing}
                                value={state.adminProfile.email}
                                onChange={(e) => handleUpdate({ email: e.target.value })}
                                className="CODEVATE-input w-full bg-neutral-50/50 border-neutral-100 disabled:opacity-70 disabled:bg-transparent rounded-2xl px-6 font-bold"
                              />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 px-1 flex items-center gap-2">
                                 <Phone size={12} /> Contact Number
                              </label>
                              <input 
                                type="text" 
                                disabled={!isEditing}
                                value={state.adminProfile.phone}
                                onChange={(e) => handleUpdate({ phone: e.target.value })}
                                className="CODEVATE-input w-full bg-neutral-50/50 border-neutral-100 disabled:opacity-70 disabled:bg-transparent rounded-2xl px-6 font-bold"
                              />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 px-1 flex items-center gap-2">
                                 <MapPin size={12} /> Location Base
                              </label>
                              <input 
                                type="text" 
                                disabled={!isEditing}
                                value={state.adminProfile.location}
                                onChange={(e) => handleUpdate({ location: e.target.value })}
                                className="CODEVATE-input w-full bg-neutral-50/50 border-neutral-100 disabled:opacity-70 disabled:bg-transparent rounded-2xl px-6 font-bold"
                              />
                           </div>
                        </div>

                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 px-1 flex items-center gap-2">
                              <Edit3 size={12} /> Bio / Executive Summary
                           </label>
                           <textarea 
                              disabled={!isEditing}
                              value={state.adminProfile.bio}
                              onChange={(e) => handleUpdate({ bio: e.target.value })}
                              rows={4}
                              className="CODEVATE-input w-full bg-neutral-50/50 border-neutral-100 disabled:opacity-70 disabled:bg-transparent rounded-2xl px-6 py-4 font-bold resize-none"
                           />
                        </div>
                     </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-8">
                     <div className="glass-card p-10 rounded-[48px] border border-white shadow-xl flex flex-col gap-10">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center text-[var(--accent)] shadow-xl">
                              <Lock size={24} />
                           </div>
                           <div className="space-y-1">
                              <h2 className="text-2xl font-display font-bold text-neutral-900 uppercase tracking-tight">Security Vault</h2>
                              <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Authentication guardrails and clearance</p>
                           </div>
                        </div>

                        <div className="flex flex-col gap-4">
                           {[
                             { label: 'Master Password', sub: 'Last changed 24 days ago', icon: Key, action: 'Change' },
                             { label: '2FA Biometrics', sub: 'Active — Fingerprint & FaceID', icon: Smartphone, action: 'Manage' },
                             { label: 'Session Control', sub: '4 Active sessions globally', icon: Clock, action: 'View' },
                           ].map((item, i) => (
                             <div key={i} className="flex items-center justify-between p-6 rounded-[32px] bg-neutral-50/50 border border-neutral-100 hover:bg-white hover:shadow-xl transition-all group">
                                <div className="flex items-center gap-6">
                                   <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center text-neutral-900 group-hover:bg-neutral-900 group-hover:text-white transition-all duration-500 shadow-sm">
                                      <item.icon size={20} />
                                   </div>
                                   <div className="space-y-1">
                                      <h4 className="text-sm font-black text-neutral-900 tracking-tight uppercase tracking-[0.1em]">{item.label}</h4>
                                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{item.sub}</p>
                                   </div>
                                </div>
                                <button className="px-6 py-2 bg-neutral-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                                   {item.action}
                                </button>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="p-10 rounded-[48px] bg-rose-500 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:scale-125 transition-transform duration-1000" />
                        <h3 className="text-2xl font-display font-bold mb-4 relative z-10">Advanced Security Lockdown</h3>
                        <p className="text-sm font-bold text-white/70 mb-8 relative z-10 max-w-lg uppercase tracking-widest leading-relaxed">Instantly invalidate all active sessions and block master credentials across the entire node cluster.</p>
                        <button className="relative z-10 py-5 px-10 bg-white text-rose-500 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl hover:scale-105 transition-all">Initiate Global Lockdown</button>
                     </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="space-y-8">
                     <div className="glass-card p-10 rounded-[48px] border border-white shadow-xl">
                        <div className="flex justify-between items-center mb-10">
                           <div className="space-y-1">
                              <h2 className="text-2xl font-display font-bold text-neutral-900 uppercase tracking-tight">Executive Activity Log</h2>
                              <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">History of master node operations</p>
                           </div>
                           <button className="p-3 rounded-full bg-neutral-900 text-white shadow-lg hover:rotate-180 transition-transform duration-700">
                              <Calendar size={18} />
                           </button>
                        </div>

                        <div className="space-y-4">
                           {[
                             { action: 'Sync Configuration', details: 'Core Node Alpha', time: '12m ago', type: 'system' },
                             { action: 'Password Change', details: 'Security Vault', time: '24d ago', type: 'security' },
                             { action: 'New Client Onboarded', details: 'Apex Corp Enterprise', time: '2h ago', type: 'ops' },
                             { action: 'Proposal Approved', details: 'Project Nova v2', time: '5h ago', type: 'business' },
                           ].map((item, i) => (
                              <div key={i} className="flex items-center justify-between p-6 rounded-[32px] bg-white border border-neutral-100 hover:shadow-2xl transition-all duration-700 group">
                                 <div className="flex items-center gap-6">
                                    <div className="w-2 h-10 bg-neutral-900 rounded-full group-hover:bg-[var(--accent)] transition-colors" />
                                    <div className="space-y-1">
                                       <h4 className="text-sm font-black text-neutral-900 tracking-tight">{item.action}</h4>
                                       <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{item.details}</p>
                                    </div>
                                 </div>
                                 <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">{item.time}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
                )}
              </motion.div>
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
