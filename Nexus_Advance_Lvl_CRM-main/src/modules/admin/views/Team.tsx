import { useState } from 'react';
import { useAdminStore, mockTeamMembers } from '@/modules/admin/data/store';
import { X, Users, TrendingUp, Briefcase, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

const roleBadge: Record<string, string> = {
  Lead: 'bg-[var(--accent-dim)] text-[var(--accent)] border-[var(--accent-dim)]',
  Designer: 'bg-[var(--info-dim)] text-[var(--info)] border-[var(--info-dim)]',
  Developer: 'bg-[var(--success-dim)] text-[var(--success)] border-[var(--success-dim)]',
  QA: 'bg-[var(--warning-dim)] text-[var(--warning)] border-[var(--warning-dim)]',
};

export function Team() {
  const { state } = useAdminStore();
  const [assignPanel, setAssignPanel] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState('Lead');
  const [selectedProject, setSelectedProject] = useState('proj-1');

  const handleAssign = () => {
    toast.success(`${assignPanel.name} assigned to project as ${selectedRole}!`);
    setAssignPanel(null);
  };

  const teamStats = [
    { label: "Active Talent", value: state.teamMembers.length + 1, icon: Users, color: "bg-neutral-900 text-white shadow-2xl" },
    { label: "Utilization Rate", value: "92%", icon: TrendingUp, color: "bg-blue-600 text-white shadow-xl" },
    { label: "Open Capacity", value: "8%", icon: Briefcase, color: "bg-emerald-600 text-white shadow-xl" },
    { label: "Project Velocity", value: "4.8/5", icon: ShieldCheck, color: "bg-amber-500 text-white shadow-xl" },
  ];

  return (
    <div className="flex flex-col gap-8 md:gap-10 relative pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center text-white shadow-xl">
              <Users className="h-5 w-5" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter text-neutral-900 uppercase">Talent Console</h1>
          </div>
          <p className="text-[13px] font-bold text-neutral-400 max-w-md leading-relaxed uppercase tracking-widest">Resource management. Capacity audit and role allocation.</p>
        </div>
        <button
          onClick={() => toast.info('Add Member form coming soon!')}
          className="px-6 py-3 bg-neutral-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center gap-2">
          <Users size={14} />
          <span>Onboard Member</span>
        </button>
      </div>

      {/* Talent Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {teamStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-6 rounded-[32px] border border-[var(--border-subtle)] shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500"
          >
            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-500`}>
              <stat.icon size={20} />
            </div>
            <div className="space-y-1">
               <h3 className="text-2xl font-display font-black text-neutral-900 tracking-tighter leading-none">{stat.value}</h3>
               <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-50">
                  <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">{stat.label}</span>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-8 rounded-[40px] border border-[var(--border-subtle)] shadow-2xl flex flex-col gap-8">
        <div className="space-y-1">
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Personnel Ledger</h3>
           <h2 className="text-xl font-display font-bold text-neutral-900">Resource Availability</h2>
        </div>

        <div className="overflow-x-auto -mx-8 px-8">
           <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                 <tr className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">
                    <th className="px-6 pb-2">Talent Identity</th>
                    <th className="px-6 pb-2">Operational Role</th>
                    <th className="px-6 pb-2">Utilization Audit</th>
                    <th className="px-6 pb-2 text-right pr-6">Management</th>
                 </tr>
              </thead>
              <tbody className="divide-y-0">
                 {state.teamMembers.map((member, idx) => (
                   <tr key={idx} className="group/row hover:translate-x-1 transition-transform">
                      <td className="px-6 py-3 bg-neutral-50/50 rounded-l-2xl border-y border-l border-neutral-100 group-hover/row:bg-white transition-colors">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg font-black text-xs" style={{ backgroundColor: member.color }}>
                               {member.avatar}
                            </div>
                            <div className="space-y-0.5">
                               <p className="text-[14px] font-bold text-neutral-900">{member.name}</p>
                               <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{member.email}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4 bg-neutral-50/50 border-y border-neutral-100 group-hover/row:bg-white transition-colors">
                         <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-neutral-200 bg-white text-neutral-600">
                            {member.role}
                         </span>
                      </td>
                      <td className="px-6 py-4 bg-neutral-50/50 border-y border-neutral-100 group-hover/row:bg-white transition-colors">
                         <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-neutral-200 rounded-full w-24 overflow-hidden">
                               <div className="h-full bg-neutral-900" style={{ width: `${(member.activeProjects / 5) * 100}%` }} />
                            </div>
                            <span className="text-[11px] font-bold text-neutral-900">{member.activeProjects} Proj</span>
                         </div>
                      </td>
                      <td className="px-6 py-4 bg-neutral-50/50 rounded-r-3xl border-y border-r border-neutral-100 group-hover/row:bg-white transition-colors text-right pr-6">
                         <div className="flex justify-end gap-2">
                            <button onClick={() => setAssignPanel(member)} className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.05] transition-all">Assign</button>
                            <button className="p-2 bg-neutral-50 border border-neutral-100 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"><X size={14} /></button>
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

      {/* Assignment Panel */}
      {assignPanel && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xl z-[9999] flex items-center justify-center p-4" onClick={() => setAssignPanel(null)}>
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[32px] sm:rounded-[48px] w-full max-w-lg shadow-[0_32px_64px_rgba(0,0,0,0.2)] overflow-hidden" 
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-10 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
               <div className="space-y-1">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Resource Control</h3>
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-neutral-900">Talent Assignment</h2>
               </div>
               <button onClick={() => setAssignPanel(null)} className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center hover:bg-neutral-900 hover:text-white transition-all">
                  <X size={20} />
               </button>
            </div>

            <div className="p-6 sm:p-10 space-y-6 sm:space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
               <div className="flex items-center gap-4 sm:gap-5 p-5 sm:p-6 bg-neutral-900 text-white rounded-[24px] sm:rounded-[32px] shadow-2xl">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner shrink-0" style={{ backgroundColor: assignPanel.color }}>
                     {assignPanel.avatar}
                  </div>
                  <div className="space-y-1 truncate">
                     <p className="text-base sm:text-lg font-bold truncate">{assignPanel.name}</p>
                     <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] truncate">{assignPanel.role}</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-1">Select Active Campaign</label>
                     <select className="w-full h-12 sm:h-14 px-4 sm:px-6 rounded-2xl bg-neutral-50 border border-neutral-100 text-[13px] font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all appearance-none" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
                        {state.projects.map(p => (
                          <option key={p.id} value={p.id}>Brand Identity + Web — Apex Corp</option>
                        ))}
                     </select>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-1">Assign Operational Role</label>
                     <div className="grid grid-cols-2 gap-3">
                        {['Lead', 'Creative', 'Tech', 'QA'].map(r => (
                          <button key={r} onClick={() => setSelectedRole(r)} className={`h-12 sm:h-14 rounded-2xl border transition-all font-black text-[10px] uppercase tracking-widest ${selectedRole === r ? 'bg-neutral-900 text-white border-neutral-900 shadow-xl' : 'bg-white text-neutral-400 border-neutral-100 hover:border-neutral-900 hover:text-neutral-900'}`}>
                             {r}
                          </button>
                        ))}
                     </div>
                  </div>
               </div>

               <button onClick={handleAssign} className="w-full py-4 sm:py-5 bg-neutral-900 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all mt-4">
                  Confirm talent allocation
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

