'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, Shield, Globe, Bell, Save, 
  RefreshCw, CreditCard, Clock, Languages,
  DollarSign, CheckCircle2, Layout, Zap, Award
} from 'lucide-react';
import { useClientStore } from '@/modules/client/data/store';
import { toast } from 'sonner';

const tabs = [
  { id: 'general', label: 'Preferences', icon: Layout, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'billing', label: 'Billing & Currency', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'notifications', label: 'Alert Settings', icon: Bell, color: 'text-amber-500', bg: 'bg-amber-500/10' },
];

export default function ClientSettingsPage() {
  const { state, dispatch } = useClientStore();
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = (updates: any) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: updates });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Preferences synchronized successfully');
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-8 md:gap-10 pb-20 relative overflow-hidden">
      {/* Client-Trust Background Accents */}
      <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 border-b border-neutral-200/50 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center text-white shadow-2xl border border-white/10">
              <Settings className="h-6 w-6 text-white animate-[spin_6s_linear_infinite]" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Partner Settings</h1>
              <p className="text-xs text-neutral-500 font-medium">Manage your workspace preferences and project telemetry</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="CODEVATE-btn bg-neutral-900 text-white hover:bg-black min-w-[180px] shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 transition flex gap-2 justify-center items-center group py-3"
        >
          {isSaving ? <RefreshCw className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4 group-hover:scale-110 transition-transform" />}
          <span className="uppercase tracking-[0.1em] text-[10px] font-black">Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card p-3 rounded-[32px] border border-white shadow-xl flex flex-col gap-1.5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-[20px] transition duration-300 group relative ${
                    isActive 
                      ? 'text-neutral-900 font-bold' 
                      : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100/50'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tab.bg}`}>
                    <tab.icon className={`h-4 w-4 ${tab.color}`} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider">{tab.label}</span>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="client-tab-active-pill"
                      className="absolute inset-0 bg-neutral-50 border border-neutral-200/50 rounded-[20px] -z-10 shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-6 rounded-[32px] bg-gradient-to-br from-neutral-900 to-neutral-800 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
            <div className="flex items-center gap-2 mb-3">
              <Award className="text-yellow-400 h-4 w-4" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">Partner Program</span>
            </div>
            <h3 className="text-lg font-bold">Gold Tier Status</h3>
            <p className="text-[10px] font-medium text-white/50 mt-1">Access to premium acceleration and node orchestration clusters.</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex flex-col gap-6"
            >
              {activeTab === 'general' && (
                <div className="glass-card p-8 rounded-[36px] border border-white shadow-xl space-y-6">
                  <div>
                    <h2 className="text-lg font-black text-neutral-850 tracking-tight">Regional & Language</h2>
                    <p className="text-xs text-neutral-400 font-medium mt-0.5">Customize default UI languages and timestamps</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 px-1 flex items-center gap-1.5">
                         <Languages size={13} className="text-blue-500" /> Preferred Language
                      </label>
                      <select 
                        value={state.settings.language}
                        onChange={(e) => handleUpdate({ language: e.target.value })}
                        className="CODEVATE-input w-full bg-neutral-50/50 hover:bg-neutral-50 border-neutral-200 focus:bg-white rounded-2xl px-5 font-bold cursor-pointer transition text-xs py-3.5"
                      >
                         <option>English</option>
                         <option>Spanish</option>
                         <option>French</option>
                         <option>German</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 px-1 flex items-center gap-1.5">
                         <Clock size={13} className="text-indigo-500" /> Regional Timezone
                      </label>
                      <select 
                        value={state.settings.timezone}
                        onChange={(e) => handleUpdate({ timezone: e.target.value })}
                        className="CODEVATE-input w-full bg-neutral-50/50 hover:bg-neutral-50 border-neutral-200 focus:bg-white rounded-2xl px-5 font-bold cursor-pointer transition text-xs py-3.5"
                      >
                         <option value="UTC-8">Pacific Time (PT)</option>
                         <option value="UTC-5">Eastern Time (ET)</option>
                         <option value="UTC+0">Greenwich Mean Time (GMT)</option>
                         <option value="UTC+5:30">India Standard Time (IST)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="glass-card p-8 rounded-[36px] border border-white shadow-xl space-y-6">
                  <div>
                    <h2 className="text-lg font-black text-neutral-850 tracking-tight">Financial & Currency</h2>
                    <p className="text-xs text-neutral-400 font-medium mt-0.5">Manage billing currency and automated billing alerts</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 px-1 flex items-center gap-1.5">
                         <DollarSign size={13} className="text-emerald-500" /> Preferred Currency
                      </label>
                      <select 
                        value={state.settings.currency}
                        onChange={(e) => handleUpdate({ currency: e.target.value })}
                        className="CODEVATE-input w-full bg-neutral-50/50 hover:bg-neutral-50 border-neutral-200 focus:bg-white rounded-2xl px-5 font-bold cursor-pointer transition text-xs py-3.5"
                      >
                         <option>USD ($)</option>
                         <option>EUR (€)</option>
                         <option>INR (₹)</option>
                         <option>GBP (£)</option>
                      </select>
                    </div>
                    
                    <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-100/50 flex items-center justify-between group">
                      <div className="space-y-0.5">
                         <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800">Billing Alerts</h4>
                         <p className="text-[10px] font-semibold text-emerald-600/70">Notifications on invoices & charges</p>
                      </div>
                      <button 
                        onClick={() => handleUpdate({ billingAlerts: !state.settings.billingAlerts })}
                        className={`w-12 h-7 rounded-full p-1 transition-all duration-300 relative ${state.settings.billingAlerts ? 'bg-emerald-500' : 'bg-neutral-200'}`}
                      >
                         <div className={`h-full aspect-square bg-white rounded-full transition-all duration-300 ${state.settings.billingAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="glass-card p-8 rounded-[36px] border border-white shadow-xl space-y-6">
                  <div>
                    <h2 className="text-lg font-black text-neutral-850 tracking-tight">Alert Preferences</h2>
                    <p className="text-xs text-neutral-400 font-medium mt-0.5">Control how and when you receive intelligence feed updates</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 pt-2">
                    <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-100 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800">Project Updates</h4>
                        <p className="text-[10px] font-semibold text-neutral-500/70">Real-time alerts on milestones & output completions</p>
                      </div>
                      <button 
                        onClick={() => handleUpdate({ projectUpdates: !state.settings.projectUpdates })}
                        className={`w-12 h-7 rounded-full p-1 transition-all duration-300 relative ${state.settings.projectUpdates ? 'bg-neutral-900' : 'bg-neutral-200'}`}
                      >
                        <div className={`h-full aspect-square bg-white rounded-full transition-all duration-300 ${state.settings.projectUpdates ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-100 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800">Marketing Intelligence</h4>
                        <p className="text-[10px] font-semibold text-neutral-500/70">Updates on local growth telemetry and marketing campaigns</p>
                      </div>
                      <button 
                        onClick={() => handleUpdate({ marketingEmails: !state.settings.marketingEmails })}
                        className={`w-12 h-7 rounded-full p-1 transition-all duration-300 relative ${state.settings.marketingEmails ? 'bg-neutral-900' : 'bg-neutral-200'}`}
                      >
                        <div className={`h-full aspect-square bg-white rounded-full transition-all duration-300 ${state.settings.marketingEmails ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
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
