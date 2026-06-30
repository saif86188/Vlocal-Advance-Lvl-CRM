'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, Shield, Globe, Bell, Save, 
  RefreshCw, CreditCard, Clock, Languages,
  DollarSign, CheckCircle2, Layout, Zap
} from 'lucide-react';
import { useClientStore } from '@/modules/client/data/store';
import { toast } from 'sonner';

const tabs = [
  { id: 'general', label: 'Preferences', icon: Layout, color: 'text-blue-500' },
  { id: 'billing', label: 'Billing & Currency', icon: DollarSign, color: 'text-emerald-500' },
  { id: 'notifications', label: 'Alert Settings', icon: Bell, color: 'text-amber-500' },
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
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-8 md:gap-10 pb-20 relative overflow-hidden">
      {/* Client-Trust Background Accents */}
      <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl border border-white/10">
              <Settings className="h-6 w-6 text-white animate-[spin_4s_linear_infinite]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-neutral-900 uppercase">Partner Settings</h1>
          </div>
          <p className="text-sm font-bold text-neutral-400 max-w-lg leading-relaxed uppercase tracking-widest">Manage your workspace preferences and project telemetry</p>
        </div>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="vlocal-btn bg-blue-600 text-white min-w-[200px] shadow-2xl hover:bg-blue-700 hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 transition-all flex gap-3 group"
        >
          {isSaving ? <RefreshCw className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4 group-hover:scale-125 transition-transform" />}
          <span className="uppercase tracking-[0.2em] text-[11px] font-black">Save Changes</span>
        </button>
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
                <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-blue-400' : tab.color}`} />
                <span className="text-[12px] font-black uppercase tracking-widest">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="client-tab-active"
                    className="absolute inset-0 bg-neutral-900 rounded-[24px] -z-10"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="mt-8 p-8 rounded-[40px] bg-blue-600 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
            <h3 className="text-xl font-display font-bold mb-1">Partner Tier: Gold</h3>
            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Nexus Partner Program v4.0</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="flex flex-col gap-8"
            >
              {activeTab === 'general' && (
                <div className="space-y-8">
                  <div className="glass-card p-10 rounded-[48px] border border-white shadow-xl flex flex-col gap-10">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-display font-bold text-neutral-900 uppercase tracking-tight">Regional & Language</h2>
                      <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Customize your workspace environment</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 px-1 flex items-center gap-2">
                           <Languages size={12} /> Preferred Language
                        </label>
                        <select 
                          value={state.settings.language}
                          onChange={(e) => handleUpdate({ language: e.target.value })}
                          className="vlocal-input w-full bg-neutral-50/50 border-neutral-100 focus:bg-white rounded-2xl px-6 font-bold appearance-none cursor-pointer"
                        >
                           <option>English</option>
                           <option>Spanish</option>
                           <option>French</option>
                           <option>German</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 px-1 flex items-center gap-2">
                           <Clock size={12} /> Regional Timezone
                        </label>
                        <select 
                          value={state.settings.timezone}
                          onChange={(e) => handleUpdate({ timezone: e.target.value })}
                          className="vlocal-input w-full bg-neutral-50/50 border-neutral-100 focus:bg-white rounded-2xl px-6 font-bold appearance-none cursor-pointer"
                        >
                           <option value="UTC-8">Pacific Time (PT)</option>
                           <option value="UTC-5">Eastern Time (ET)</option>
                           <option value="UTC+0">Greenwich Mean Time (GMT)</option>
                           <option value="UTC+5:30">India Standard Time (IST)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-8">
                  <div className="glass-card p-10 rounded-[48px] border border-white shadow-xl flex flex-col gap-10">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-display font-bold text-neutral-900 uppercase tracking-tight">Financial & Currency</h2>
                      <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Manage billing identity and payment tokens</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 px-1 flex items-center gap-2">
                           <DollarSign size={12} /> Preferred Currency
                        </label>
                        <select 
                          value={state.settings.currency}
                          onChange={(e) => handleUpdate({ currency: e.target.value })}
                          className="vlocal-input w-full bg-neutral-50/50 border-neutral-100 focus:bg-white rounded-2xl px-6 font-bold appearance-none cursor-pointer"
                        >
                           <option>USD ($)</option>
                           <option>EUR (€)</option>
                           <option>INR (₹)</option>
                           <option>GBP (£)</option>
                        </select>
                      </div>
                      
                      <div className="p-6 rounded-[32px] bg-emerald-50/50 border border-emerald-100 flex items-center justify-between group">
                          <div className="space-y-1">
                             <h4 className="text-[13px] font-black uppercase tracking-widest text-emerald-600">Billing Alerts</h4>
                             <p className="text-[10px] font-bold text-emerald-900/40 uppercase">Invoice & payment notifications</p>
                          </div>
                          <button 
                            onClick={() => handleUpdate({ billingAlerts: !state.settings.billingAlerts })}
                            className={`w-14 h-8 rounded-full p-1.5 transition-all duration-500 ${state.settings.billingAlerts ? 'bg-emerald-500' : 'bg-neutral-200'}`}
                          >
                             <div className={`h-full aspect-square bg-white rounded-full transition-all duration-500 ${state.settings.billingAlerts ? 'translate-x-6' : 'translate-x-0'}`} />
                          </button>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  <div className="glass-card p-10 rounded-[48px] border border-white shadow-xl flex flex-col gap-10">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-display font-bold text-neutral-900 uppercase tracking-tight">Alert Preferences</h2>
                      <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Control how you receive project intelligence</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="p-8 rounded-[40px] bg-neutral-50/50 border border-neutral-100 space-y-6">
                          <div className="flex items-center justify-between">
                             <div className="space-y-1">
                                <h4 className="text-sm font-black uppercase tracking-widest text-neutral-900">Project Updates</h4>
                                <p className="text-[10px] font-bold text-neutral-400 uppercase">Real-time milestone tracking</p>
                             </div>
                             <button 
                                onClick={() => handleUpdate({ projectUpdates: !state.settings.projectUpdates })}
                                className={`w-14 h-8 rounded-full p-1.5 transition-all duration-500 ${state.settings.projectUpdates ? 'bg-blue-500' : 'bg-neutral-200'}`}
                              >
                                <div className={`h-full aspect-square bg-white rounded-full transition-all duration-500 ${state.settings.projectUpdates ? 'translate-x-6' : 'translate-x-0'}`} />
                              </button>
                          </div>
                          <div className="h-px bg-neutral-200/50" />
                          <div className="flex items-center justify-between">
                             <div className="space-y-1">
                                <h4 className="text-sm font-black uppercase tracking-widest text-neutral-900">Marketing Intelligence</h4>
                                <p className="text-[10px] font-bold text-neutral-400 uppercase">Nexus insights and strategies</p>
                             </div>
                             <button 
                                onClick={() => handleUpdate({ marketingEmails: !state.settings.marketingEmails })}
                                className={`w-14 h-8 rounded-full p-1.5 transition-all duration-500 ${state.settings.marketingEmails ? 'bg-indigo-500' : 'bg-neutral-200'}`}
                              >
                                <div className={`h-full aspect-square bg-white rounded-full transition-all duration-500 ${state.settings.marketingEmails ? 'translate-x-6' : 'translate-x-0'}`} />
                              </button>
                          </div>
                       </div>
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
