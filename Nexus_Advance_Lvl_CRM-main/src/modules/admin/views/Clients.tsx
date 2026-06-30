'use client';

import { useState, useMemo } from 'react';
import { useAdminStore } from '@/modules/admin/data/store';
import { 
  Users, Building2, Mail, ExternalLink, Search, 
  Filter, MoreHorizontal, TrendingUp, Briefcase, 
  ArrowUpRight, IndianRupee
} from 'lucide-react';
import { motion } from 'motion/react';

export function Clients() {
  const { state } = useAdminStore();
  const [search, setSearch] = useState('');

  const clients = useMemo(() => {
    // In a real app, this would come from a users table filtered by role='client'
    // For now, we'll derive it from unique clientId in requirements/projects
    const clientIds = Array.from(new Set([
      ...state.requirements.map(r => r.clientId),
      ...state.projects.map(p => p.clientId),
      ...state.payments.map(p => p.clientId)
    ]));

    return clientIds.map(id => {
      const name = id === 'u-1' ? 'Apex Corp' : id === 'u-2' ? 'Nova Technologies' : 'Unknown Client';
      const email = id === 'u-1' ? 'sarah@apex-corp.com' : 'michael@nova.io';
      const company = id === 'u-1' ? 'Apex Corp' : 'Nova Technologies';
      const activeProjects = state.projects.filter(p => p.clientId === id).length;
      const totalSpend = state.payments.filter(p => p.clientId === id && p.status === 'paid').reduce((s, p) => s + p.total, 0);
      const openReqs = state.requirements.filter(r => r.clientId === id && r.status !== 'closed').length;

      return { id, name, email, company, activeProjects, totalSpend, openReqs };
    }).filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.company.toLowerCase().includes(search.toLowerCase())
    );
  }, [state, search]);

  return (
    <div className="flex flex-col gap-8 md:gap-10 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-neutral-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <Building2 className="h-5 w-5" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-neutral-900 uppercase">Clients</h1>
          </div>
          <p className="text-sm font-bold text-neutral-400 max-w-md leading-relaxed uppercase tracking-widest">Global Account Management. Portfolio health and capital flow audit.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
            <input 
              className="h-12 pl-12 pr-6 rounded-2xl bg-white border border-neutral-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-neutral-900/10 w-full sm:w-64 transition-all"
              placeholder="Search companies..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors">
            <Filter size={18} className="text-neutral-600" />
          </button>
        </div>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {clients.map((client, i) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-8 rounded-[40px] border border-white shadow-xl group hover:scale-[1.02] transition-all duration-500 flex flex-col gap-8 bg-white/60 backdrop-blur-xl"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-neutral-900 rounded-[20px] flex items-center justify-center text-white font-display font-black text-xl shadow-lg group-hover:rotate-6 transition-transform">
                  {client.company.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 leading-tight">{client.company}</h3>
                  <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest mt-1">{client.name}</p>
                </div>
              </div>
              <button className="w-10 h-10 rounded-xl bg-white border border-neutral-100 flex items-center justify-center hover:bg-neutral-900 hover:text-white transition-all">
                <ExternalLink size={16} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
               {[
                 { label: 'Projects', value: client.activeProjects, icon: Briefcase, color: 'text-blue-500' },
                 { label: 'Requests', value: client.openReqs, icon: TrendingUp, color: 'text-amber-500' },
                 { label: 'Spend', value: `₹${(client.totalSpend / 1000).toFixed(0)}k`, icon: IndianRupee, color: 'text-emerald-500' }
               ].map((stat, idx) => (
                 <div key={idx} className="bg-neutral-50/50 p-4 rounded-2xl border border-neutral-100/50 text-center space-y-1">
                    <stat.icon size={14} className={`mx-auto ${stat.color}`} />
                    <div className="text-lg font-display font-black text-neutral-900">{stat.value}</div>
                    <div className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">{stat.label}</div>
                 </div>
               ))}
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-neutral-100">
               <div className="flex items-center justify-between text-[11px] font-bold text-neutral-600">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-neutral-400" />
                    <span>{client.email}</span>
                  </div>
                  <span className="text-[9px] px-2 py-1 bg-blue-50 text-blue-600 rounded-lg uppercase font-black">Active Account</span>
               </div>
            </div>

            <button className="w-full py-4 bg-neutral-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:scale-[1.02] active:scale-95 transition-all mt-2">
               Audit Full Portfolio
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

