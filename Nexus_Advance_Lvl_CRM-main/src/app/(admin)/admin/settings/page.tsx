'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, Shield, Database, Activity, Cpu, 
  Globe, Bell, Save, RefreshCw, Lock, 
  Eye, Zap, Terminal, HardDrive, Share2
} from 'lucide-react';
import { useAdminStore } from '@/modules/admin/data/store';
import { toast } from 'sonner';

const tabs = [
  { id: 'general', label: 'Intelligence Hub', icon: Globe, color: 'text-blue-500' },
  { id: 'nodes', label: 'CODEVATE Nodes', icon: Cpu, color: 'text-emerald-500' },
  { id: 'security', label: 'Security & Audit', icon: Shield, color: 'text-rose-500' },
  { id: 'ops', label: 'Automated Ops', icon: Zap, color: 'text-amber-500' },
];

export default function SettingsPage() {
  const { state, dispatch } = useAdminStore();
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = (updates: any) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: updates });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Core configurations synchronized successfully');
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-8 md:gap-10 pb-20 relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center text-white shadow-2xl border border-white/10">
              <Settings className="h-6 w-6 text-[var(--accent)] animate-[spin_4s_linear_infinite]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-neutral-900 uppercase">Core Settings</h1>
          </div>
          <p className="text-sm font-bold text-neutral-400 max-w-lg leading-relaxed uppercase tracking-widest">Global Administrative Command & Node Configuration</p>
        </div>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="CODEVATE-btn bg-neutral-900 text-white min-w-[200px] shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 transition-all flex gap-3 group"
        >
          {isSaving ? <RefreshCw className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4 group-hover:scale-125 transition-transform" />}
          <span className="uppercase tracking-[0.2em] text-[11px] font-black">Sync Configuration</span>
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
                <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-[var(--accent)]' : tab.color}`} />
                <span className="text-[12px] font-black uppercase tracking-widest">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="tab-active"
                    className="absolute inset-0 bg-neutral-900 rounded-[24px] -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="mt-8 p-8 rounded-[40px] bg-neutral-900 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">CODEVATE Health</span>
            </div>
            <h3 className="text-xl font-display font-bold mb-1">Node v4.0.2</h3>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Protocol: APEX-Alpha</p>
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
                      <h2 className="text-2xl font-display font-bold text-neutral-900 uppercase tracking-tight">Global Workspace</h2>
                      <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Master identity and regional parameters</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 px-1">Workspace Identity</label>
                        <input 
                          type="text" 
                          value={state.settings.workspaceName}
                          onChange={(e) => handleUpdate({ workspaceName: e.target.value })}
                          className="CODEVATE-input w-full bg-neutral-50/50 border-neutral-100 focus:bg-white rounded-2xl px-6 font-bold"
                          placeholder="CODEVATE Core Enterprise"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 px-1">Primary Theme Token</label>
                        <div className="flex items-center gap-4">
                           <input 
                            type="color" 
                            value={state.settings.themeColor}
                            onChange={(e) => handleUpdate({ themeColor: e.target.value })}
                            className="w-12 h-12 rounded-xl cursor-pointer border-none p-0 overflow-hidden bg-transparent"
                          />
                          <span className="text-sm font-mono font-bold text-neutral-500 uppercase">{state.settings.themeColor}</span>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-neutral-100" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       <div className="flex items-center justify-between p-6 rounded-[32px] bg-neutral-50/50 border border-neutral-100 hover:bg-white transition-all group">
                          <div className="space-y-1">
                             <h4 className="text-[13px] font-black uppercase tracking-widest text-neutral-900">Maintenance Mode</h4>
                             <p className="text-[10px] font-bold text-neutral-400 uppercase">Lock console for node migration</p>
                          </div>
                          <button 
                            onClick={() => handleUpdate({ maintenanceMode: !state.settings.maintenanceMode })}
                            className={`w-14 h-8 rounded-full p-1.5 transition-all duration-500 ${state.settings.maintenanceMode ? 'bg-amber-500' : 'bg-neutral-200'}`}
                          >
                             <div className={`h-full aspect-square bg-white rounded-full transition-all duration-500 ${state.settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
                          </button>
                       </div>

                       <div className="flex items-center justify-between p-6 rounded-[32px] bg-neutral-50/50 border border-neutral-100 hover:bg-white transition-all group">
                          <div className="space-y-1">
                             <h4 className="text-[13px] font-black uppercase tracking-widest text-neutral-900">API Acceleration</h4>
                             <p className="text-[10px] font-bold text-neutral-400 uppercase">Global edge caching enabled</p>
                          </div>
                          <button 
                            onClick={() => handleUpdate({ apiCache: !state.settings.apiCache })}
                            className={`w-14 h-8 rounded-full p-1.5 transition-all duration-500 ${state.settings.apiCache ? 'bg-blue-500' : 'bg-neutral-200'}`}
                          >
                             <div className={`h-full aspect-square bg-white rounded-full transition-all duration-500 ${state.settings.apiCache ? 'translate-x-6' : 'translate-x-0'}`} />
                          </button>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'nodes' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {[
                       { label: 'Uptime', value: '99.98%', icon: Activity, color: 'text-emerald-500', glow: 'shadow-emerald-500/20' },
                       { label: 'Latency', value: '24ms', icon: Zap, color: 'text-blue-500', glow: 'shadow-blue-500/20' },
                       { label: 'Load', value: '12%', icon: Cpu, color: 'text-rose-500', glow: 'shadow-rose-500/20' },
                     ].map((m, i) => (
                        <div key={i} className="glass-card p-8 rounded-[40px] border border-white shadow-lg bg-white/60 backdrop-blur-xl group hover:scale-[1.02] transition-all">
                           <div className={`w-12 h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center mb-6 shadow-sm group-hover:${m.glow}`}>
                              <m.icon className={`h-6 w-6 ${m.color}`} />
                           </div>
                           <h3 className="text-3xl font-display font-black text-neutral-900 mb-1">{m.value}</h3>
                           <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{m.label}</span>
                        </div>
                     ))}
                  </div>

                  <div className="glass-card p-10 rounded-[48px] border border-white shadow-xl bg-white/40 backdrop-blur-3xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent)] pointer-events-none" />
                    <div className="flex justify-between items-center mb-10">
                       <div className="space-y-1">
                          <h2 className="text-2xl font-display font-bold text-neutral-900 uppercase tracking-tight">Intelligence Nodes</h2>
                          <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Operational Cluster Status</p>
                       </div>
                       <button className="p-3 rounded-full bg-neutral-900 text-white shadow-xl hover:rotate-180 transition-transform duration-700">
                          <RefreshCw size={18} />
                       </button>
                    </div>

                    <div className="space-y-4">
                       {[
                         { id: 'NODE-AX-1', loc: 'Mumbai, IN', load: 8, status: 'Active' },
                         { id: 'NODE-AX-2', loc: 'Singapore, SG', load: 15, status: 'Active' },
                         { id: 'NODE-AX-3', loc: 'Frankfurt, DE', load: 4, status: 'Standby' },
                       ].map((node, i) => (
                          <div key={i} className="p-6 rounded-[32px] bg-white border border-neutral-100 hover:border-neutral-200 hover:shadow-2xl transition-all duration-700 flex items-center justify-between group">
                             <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-900 font-bold group-hover:bg-neutral-900 group-hover:text-white transition-all duration-500">
                                   <Terminal size={20} />
                                </div>
                                <div className="space-y-1">
                                   <h4 className="text-sm font-black text-neutral-900 tracking-tight">{node.id}</h4>
                                   <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{node.loc}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-10">
                                <div className="flex flex-col items-end gap-1">
                                   <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Node Load</span>
                                   <div className="w-24 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                      <motion.div 
                                        initial={{ width: 0 }} 
                                        animate={{ width: `${node.load * 4}%` }} 
                                        className="h-full bg-neutral-900" 
                                      />
                                   </div>
                                </div>
                                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${node.status === 'Active' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-neutral-50 text-neutral-400 border-neutral-100'}`}>
                                   {node.status}
                                </span>
                             </div>
                          </div>
                       ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8">
                   <div className="glass-card p-10 rounded-[48px] border border-white shadow-xl flex flex-col gap-10">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                          <Lock size={24} />
                       </div>
                       <div className="space-y-1">
                        <h2 className="text-2xl font-display font-bold text-neutral-900 uppercase tracking-tight">Security Protocols</h2>
                        <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Authentication & Authorization Guardrails</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="p-8 rounded-[40px] bg-neutral-50/50 border border-neutral-100 space-y-6">
                          <div className="flex items-center justify-between">
                             <div className="space-y-1">
                                <h4 className="text-sm font-black uppercase tracking-widest text-neutral-900">2FA Enforcement</h4>
                                <p className="text-[10px] font-bold text-neutral-400 uppercase">Mandatory for all admin nodes</p>
                             </div>
                             <button 
                                onClick={() => handleUpdate({ twoFactorAuth: !state.settings.twoFactorAuth })}
                                className={`w-14 h-8 rounded-full p-1.5 transition-all duration-500 ${state.settings.twoFactorAuth ? 'bg-rose-500' : 'bg-neutral-200'}`}
                              >
                                <div className={`h-full aspect-square bg-white rounded-full transition-all duration-500 ${state.settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-0'}`} />
                              </button>
                          </div>
                          <div className="h-px bg-neutral-200/50" />
                          <div className="flex items-center justify-between">
                             <div className="space-y-1">
                                <h4 className="text-sm font-black uppercase tracking-widest text-neutral-900">Audit Protocol</h4>
                                <p className="text-[10px] font-bold text-neutral-400 uppercase">Track all executive actions</p>
                             </div>
                             <button 
                                onClick={() => handleUpdate({ auditLogging: !state.settings.auditLogging })}
                                className={`w-14 h-8 rounded-full p-1.5 transition-all duration-500 ${state.settings.auditLogging ? 'bg-neutral-900' : 'bg-neutral-200'}`}
                              >
                                <div className={`h-full aspect-square bg-white rounded-full transition-all duration-500 ${state.settings.auditLogging ? 'translate-x-6' : 'translate-x-0'}`} />
                              </button>
                          </div>
                       </div>

                       <div className="p-8 rounded-[40px] bg-rose-500/5 border border-rose-500/10 space-y-6">
                          <h4 className="text-sm font-black uppercase tracking-[0.2em] text-rose-500">Security Clearance</h4>
                          <p className="text-xs font-bold text-rose-900/60 leading-relaxed uppercase">Unauthorized access to core settings is logged and flagged to the global security cluster. Ensure credentials are rotated every 30 days.</p>
                          <button className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all">Rotate Master Key</button>
                       </div>
                    </div>
                  </div>

                  <div className="glass-card p-10 rounded-[48px] border border-white shadow-xl bg-white/40 backdrop-blur-3xl">
                     <div className="flex justify-between items-center mb-10">
                        <div className="space-y-1">
                          <h2 className="text-xl font-display font-bold text-neutral-900 uppercase tracking-tight">Recent Intelligence Audit</h2>
                          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">System logs — last 24 hours</p>
                       </div>
                       <button className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:underline">Export Logs</button>
                     </div>

                     <div className="flex flex-col gap-3">
                        {[
                          { action: 'SETTINGS_SYNC', user: 'Admin', time: '12m ago', status: 'SUCCESS' },
                          { action: 'MASTER_KEY_ROTATION', user: 'System', time: '2h ago', status: 'SUCCESS' },
                          { action: 'UNAUTHORIZED_LOGIN_ATTEMPT', user: 'IP 192.168.1.1', time: '5h ago', status: 'BLOCKED' },
                        ].map((log, i) => (
                           <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/50 border border-neutral-100 text-[11px]">
                              <div className="flex items-center gap-4">
                                 <div className={`w-2 h-2 rounded-full ${log.status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                 <span className="font-black text-neutral-900 tracking-tight">{log.action}</span>
                                 <span className="text-neutral-400 uppercase tracking-widest">•</span>
                                 <span className="font-bold text-neutral-500">{log.user}</span>
                              </div>
                              <span className="font-black text-neutral-400 uppercase tracking-widest">{log.time}</span>
                           </div>
                        ))}
                     </div>
                  </div>
                </div>
              )}

              {activeTab === 'ops' && (
                <div className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="glass-card p-10 rounded-[48px] border border-white shadow-xl space-y-8">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-sm">
                               <HardDrive size={24} />
                            </div>
                            <div className="space-y-1">
                              <h2 className="text-xl font-display font-bold text-neutral-900 uppercase tracking-tight">Data Management</h2>
                              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Storage & Recovery Protocols</p>
                            </div>
                         </div>

                         <div className="space-y-4">
                            <div className="flex items-center justify-between p-6 rounded-[32px] bg-neutral-50/50 border border-neutral-100">
                               <div className="space-y-1">
                                  <h4 className="text-[11px] font-black uppercase tracking-widest text-neutral-900">Auto-Backup</h4>
                                  <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Daily snapshot at 04:00 GMT</p>
                               </div>
                               <button 
                                  onClick={() => handleUpdate({ autoBackup: !state.settings.autoBackup })}
                                  className={`w-12 h-7 rounded-full p-1 transition-all duration-500 ${state.settings.autoBackup ? 'bg-amber-500' : 'bg-neutral-200'}`}
                                >
                                  <div className={`h-full aspect-square bg-white rounded-full transition-all duration-500 ${state.settings.autoBackup ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            <button className="w-full py-5 bg-neutral-900 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] transition-all">Initialize Force Backup</button>
                         </div>
                      </div>

                      <div className="glass-card p-10 rounded-[48px] border border-white shadow-xl space-y-8">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-sm">
                               <Share2 size={24} />
                            </div>
                            <div className="space-y-1">
                              <h2 className="text-xl font-display font-bold text-neutral-900 uppercase tracking-tight">Cluster Sync</h2>
                              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Cross-Region Node Orchestration</p>
                            </div>
                         </div>

                         <div className="p-6 rounded-[32px] bg-indigo-50/30 border border-indigo-100 space-y-4">
                            <div className="flex justify-between items-center">
                               <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Sync Status</span>
                               <span className="text-[10px] font-black text-indigo-900">92%</span>
                            </div>
                            <div className="h-1.5 w-full bg-indigo-100 rounded-full overflow-hidden">
                               <div className="h-full w-[92%] bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]" />
                            </div>
                            <p className="text-[9px] font-bold text-indigo-900/40 leading-relaxed uppercase">Node sync currently propagating through regional clusters. estimated completion in 140s.</p>
                         </div>
                         <button className="w-full py-5 border-2 border-indigo-200 text-indigo-600 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-indigo-50 transition-all">Flush API Cache</button>
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
