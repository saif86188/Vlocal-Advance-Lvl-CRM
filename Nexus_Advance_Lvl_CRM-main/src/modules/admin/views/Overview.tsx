import { useMemo, useState } from 'react';
import { useAdminStore } from '@/modules/admin/data/store';
import { 
  Briefcase, FileText, ClipboardList, IndianRupee, ArrowRight, 
  Calendar, CheckCircle2, ShieldCheck, Users, TrendingUp 
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';

const revenueData = [
  { month: 'Dec', revenue: 180000 },
  { month: 'Jan', revenue: 240000 },
  { month: 'Feb', revenue: 310000 },
  { month: 'Mar', revenue: 270000 },
  { month: 'Apr', revenue: 390000 },
  { month: 'May', revenue: 420000 },
];

const COLORS = ['var(--accent)', 'var(--warning)', 'var(--success)'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-[var(--border-default)] shadow-xl">
        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">{label}</p>
        <p className="text-sm font-black text-[var(--accent)]">
          ₹{new Intl.NumberFormat('en-IN').format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export function Overview() {
  const { state } = useAdminStore();

  const stats = useMemo(() => {
    const revenueThisMonth = state.payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.total, 0);
    return [
      { label: 'Active Campaigns', value: '15', sub: '+3 this week', icon: Briefcase, color: 'bg-neutral-900', text: 'text-white', glow: 'shadow-neutral-900/20' },
      { label: 'Current Campaigns', value: '25', sub: 'Global Reach', icon: Users, color: 'bg-blue-600', text: 'text-white', glow: 'shadow-blue-600/20' },
      { label: 'Proposals Pending', value: state.proposals.filter(p => p.status === 'awaiting_approval').length, sub: 'Action Required', icon: ClipboardList, color: 'bg-amber-500', text: 'text-white', glow: 'shadow-amber-500/20' },
      { label: 'Total Revenue', value: `₹${new Intl.NumberFormat('en-IN', { notation: 'compact' }).format(revenueThisMonth)}`, sub: 'Daily Flow', icon: IndianRupee, color: 'bg-emerald-600', text: 'text-white', glow: 'shadow-emerald-600/20' }
    ];
  }, [state]);

  const sparklineData = Array.from({ length: 12 }, (_, i) => ({ value: 30 + Math.random() * 70 }));

  return (
    <div className="flex flex-col gap-8 md:gap-10 relative pb-10 overflow-hidden">
      {/* Immersive Tactical Background */}
      <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Header + Vital Ribbon */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 relative z-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3 mb-1">
            <motion.div 
              initial={{ rotate: -12, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              className="w-12 h-12 bg-neutral-900 rounded-[16px] flex items-center justify-center text-white shadow-[0_15px_30px_rgba(0,0,0,0.2)] border border-white/10"
            >
              <ShieldCheck className="h-6 w-6 text-blue-400" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-display font-black tracking-tighter text-neutral-900 uppercase">Nexus Core</h1>
          </div>
          <p className="text-sm font-bold text-neutral-400 max-w-lg leading-relaxed uppercase tracking-widest">Global Administrator Command. Node intelligence operational.</p>
        </div>

        {/* Real-Time Pulse Monitoring */}
        <div className="glass-card p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-white/60 shadow-[0_24px_48px_rgba(0,0,0,0.06)] bg-white/40 backdrop-blur-3xl flex flex-wrap gap-4 sm:gap-8">
           {[
             { label: 'Network', value: 15, color: 'bg-blue-500', glow: 'shadow-blue-500/40' },
             { label: 'Nodes', value: 45, color: 'bg-indigo-500', glow: 'shadow-indigo-500/40' },
             { label: 'Health', value: 84, color: 'bg-emerald-500', glow: 'shadow-emerald-500/40' }
           ].map((m, i) => (
             <div key={i} className="flex flex-col gap-2 min-w-[100px] sm:min-w-[120px] flex-1">
                <div className="flex justify-between items-center">
                   <span className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">{m.label}</span>
                   <span className="text-[9px] font-black text-neutral-900">{m.value}%</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-200/50 rounded-full overflow-hidden shadow-inner">
                   <motion.div 
                     initial={{ width: 0 }} 
                     animate={{ width: `${m.value}%` }} 
                     className={`h-full ${m.color} ${m.glow} rounded-full`} 
                   />
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Intelligence Orbs (Metric Gems) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
        {stats.map((gem, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 100 }}
            className="glass-card p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border border-white shadow-xl relative overflow-hidden group hover:scale-[1.01] transition-all duration-700 bg-white/60 backdrop-blur-xl"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${gem.color} opacity-[0.03] rounded-full -mr-12 -mt-12 blur-2xl`} />
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 rounded-[20px] ${gem.color} ${gem.text} flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform duration-500`}>
                <gem.icon size={28} />
              </div>
              <div className="h-10 w-24 opacity-30 group-hover:opacity-100 transition-opacity duration-700">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sparklineData}>
                       <Bar dataKey="value" fill="currentColor" radius={[3, 3, 0, 0]} className={gem.color.replace('bg-', 'text-')} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-1">
               <h3 className="text-4xl font-display font-black text-neutral-900 tracking-tighter leading-none">{gem.value}</h3>
               <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">{gem.label}</span>
                  <span className="text-[10px] font-bold text-emerald-500">{gem.sub}</span>
               </div>
            </div>
          </motion.div>
        ))}
      </div>      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Tactical Ledger + Global Velocity */}
        <div className="lg:col-span-8 flex flex-col gap-8">
           {/* Global Pipeline Velocity Chart */}
           <div className="glass-card p-6 sm:p-8 rounded-[32px] sm:rounded-[48px] border border-white shadow-[0_32px_64px_rgba(0,0,0,0.04)] bg-white/60 backdrop-blur-3xl flex flex-col gap-8">
              <div className="flex justify-between items-center">
                 <div className="space-y-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Financial Audit</h3>
                    <h2 className="text-2xl font-display font-bold text-neutral-900">Revenue — Last 6 Months</h2>
                 </div>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-neutral-900">Live Stream</span>
                    </div>
                 </div>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 900, fill: '#A3A3A3', letterSpacing: '0.1em' }} 
                      dy={15}
                    />
                    <YAxis hide />
                    <Tooltip 
                      content={<CustomTooltip />} 
                      cursor={{ stroke: '#2563eb', strokeWidth: 2, strokeDasharray: '4 4' }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#2563eb" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorRev)" 
                      animationDuration={2500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Intelligence Ledger */}
           <div className="glass-card p-6 sm:p-8 rounded-[32px] sm:rounded-[48px] border border-white shadow-[0_32px_64px_rgba(0,0,0,0.04)] flex flex-col gap-8 bg-white/60 backdrop-blur-2xl">
              <div className="flex justify-between items-center">
                 <div className="space-y-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Tactical Queue</h3>
                    <h2 className="text-2xl font-display font-bold text-neutral-900">Recent Requirements</h2>
                 </div>
                 <Link href="/admin/requirements" className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.05] transition-all shadow-xl">Full Audit</Link>
              </div>

              <div className="flex flex-col gap-4">
                 {state.requirements.slice(0, 5).map((req, i) => (
                    <motion.div 
                      key={req.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="p-5 sm:p-6 rounded-[24px] sm:rounded-[32px] bg-neutral-50/50 border border-neutral-100 hover:bg-white hover:shadow-2xl hover:border-neutral-200 transition-all duration-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group/req"
                    >
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-[18px] flex items-center justify-center shadow-xl transition-all duration-500 group-hover/req:scale-110 shrink-0 ${req.priority === 'urgent' ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-neutral-900 text-white shadow-neutral-900/20'}`}>
                             <ClipboardList size={20} />
                          </div>
                          <div className="space-y-1 min-w-0">
                             <h4 className="text-base font-bold text-neutral-900 truncate">{req.title}</h4>
                             <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] truncate">{req.clientId === 'u-1' ? 'Apex Corp' : 'Nova Tech'} • {new Date(req.submittedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                          </div>
                       </div>
                       <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                          <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${req.priority === 'urgent' ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-white text-neutral-400 border-neutral-100'}`}>
                             {req.priority}
                          </span>
                          <div className="w-10 h-10 rounded-xl bg-white border border-neutral-100 flex items-center justify-center group-hover/req:bg-neutral-900 group-hover/req:text-white transition-all duration-500">
                             <ArrowRight className="w-4 h-4 group-hover/req:translate-x-1 transition-transform" />
                          </div>
                       </div>
                    </motion.div>
                 ))}
              </div>
           </div>
        </div>

        {/* Executive Action Queue Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           {/* Campaign Status (Legacy Reintegration) */}
           <div className="glass-card p-6 sm:p-8 rounded-[32px] sm:rounded-[48px] border border-white shadow-xl bg-white/60 backdrop-blur-2xl flex flex-col gap-6">
              <div className="space-y-1">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Node Allocation</h3>
                 <h2 className="text-xl font-display font-bold text-neutral-900">Campaign Status</h2>
              </div>
              <div className="h-[200px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie 
                         data={[
                           { name: 'In Progress', value: state.projects.length },
                           { name: 'Pending', value: state.proposals.length },
                           { name: 'Resolved', value: state.requirements.filter(r => r.status === 'closed').length + 5 }
                         ]} 
                         cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={8} dataKey="value"
                       >
                          {COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                       </Pie>
                       <Tooltip />
                       <Legend wrapperStyle={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="glass-gold exec-node-gradient p-6 sm:p-8 rounded-[32px] sm:rounded-[48px] flex flex-col gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-[80px] -mr-32 -mt-32" />
              
              <div className="space-y-2 relative z-10">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500/80">Executive Queue</h3>
                 <h2 className="text-3xl font-display font-black text-neutral-900 tracking-tight">Proposals Needing Action</h2>
              </div>

              <div className="flex flex-col gap-4 relative z-10">
                 {state.proposals.filter(p => p.status === 'awaiting_approval').slice(0, 4).map((prop, i) => (
                    <motion.div 
                      key={prop.id} 
                      whileHover={{ x: 8, scale: 1.02 }}
                      className="p-6 rounded-[32px] bg-white/40 backdrop-blur-md border border-white/60 hover:bg-white/60 transition-all duration-500 group/prop shadow-sm hover:shadow-xl"
                    >
                       <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-black text-neutral-900 tracking-tight">v{prop.version} Project Strategy</span>
                          <div className="w-10 h-10 rounded-full bg-white border border-neutral-100 flex items-center justify-center group-hover/prop:bg-neutral-900 group-hover/prop:text-white transition-all duration-500 shadow-sm">
                             <ArrowRight size={16} className="-rotate-45 group-hover/prop:rotate-0 transition-transform" />
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-neutral-900 animate-pulse" />
                          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.25em] leading-relaxed">Strategy validation node awaiting audit</p>
                       </div>
                    </motion.div>
                 ))}
              </div>

              <motion.button 
                 whileHover={{ scale: 1.02, y: -2 }}
                 whileTap={{ scale: 0.98 }}
                 className="relative z-10 w-full py-6 bg-neutral-900 text-white rounded-[28px] font-black text-[12px] uppercase tracking-[0.4em] shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all"
              >
                 Launch Proposal Center
              </motion.button>
           </div>
        </div>
      </div>
    </div>
  );
}

