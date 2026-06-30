import { motion } from "motion/react";
import { CheckCircle2, Clock, AlertTriangle, Play, Calendar, Users, Target, TrendingUp, AlertCircle, Search, Palette, Rocket, BarChart2 } from "lucide-react";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function CampaignStatus() {
  const campaigns = [
    {
      id: 1,
      name: "Q2 Product Launch Campaign",
      status: "active",
      progress: 75,
      tasks: { total: 24, completed: 18, pending: 4, delayed: 2 },
      team: [
        { name: "Sarah Chen", role: "Campaign Manager", avatar: "SC" },
        { name: "Mike Ross", role: "Creative Director", avatar: "MR" },
        { name: "Emma Watson", role: "Content Writer", avatar: "EW" },
      ],
      timeline: [
        { phase: "Planning", status: "completed", date: "Mar 1 - 15", icon: Search },
        { phase: "Creative Development", status: "completed", date: "Mar 16 - Apr 5", icon: Palette },
        { phase: "Execution", status: "in-progress", date: "Apr 6 - Jun 15", icon: Rocket },
        { phase: "Review & Optimization", status: "pending", date: "Jun 16 - 30", icon: BarChart2 },
      ],
      approvals: [
        { item: "Creative Assets Batch 1", status: "approved", date: "Apr 12" },
        { item: "Budget Revision", status: "pending", date: "May 10" },
        { item: "Final Report Template", status: "pending", date: "May 11" },
      ],
    },
    {
      id: 2,
      name: "Brand Awareness Initiative",
      status: "active",
      progress: 45,
      tasks: { total: 32, completed: 14, pending: 15, delayed: 3 },
      team: [
        { name: "David Lee", role: "Brand Strategist", avatar: "DL" },
        { name: "Anna Smith", role: "Designer", avatar: "AS" },
      ],
      timeline: [
        { phase: "Research & Strategy", status: "completed", date: "Apr 1 - 20", icon: Search },
        { phase: "Brand Positioning", status: "in-progress", date: "Apr 21 - May 30", icon: Target },
        { phase: "Campaign Rollout", status: "pending", date: "Jun 1 - Aug 15", icon: Rocket },
      ],
      approvals: [
        { item: "Brand Guidelines", status: "approved", date: "Apr 28" },
        { item: "Campaign Messaging", status: "in-review", date: "May 8" },
      ],
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-emerald-50 text-emerald-600 border-emerald-100",
      completed: "bg-blue-50 text-blue-600 border-blue-100",
      pending: "bg-amber-50 text-amber-600 border-amber-100",
      delayed: "bg-red-50 text-red-600 border-red-100",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <div className="flex flex-col gap-10 relative pb-20 pt-0">
      <div className="space-y-2 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-neutral-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
            <TrendingUp className="h-5 w-5" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-neutral-900 uppercase">Operational Pulse</h1>
        </div>
        <p className="text-sm font-bold text-neutral-500 max-w-md leading-relaxed">Real-time campaign trajectory, phase tracking, and multi-stage approval workflow.</p>
      </div>

      <div className="flex flex-col gap-8">
        {campaigns.map((campaign, index) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card pt-6 px-6 pb-6 md:pt-8 md:px-8 md:pb-8 rounded-[32px] md:rounded-[40px] border border-[var(--border-subtle)] shadow-2xl overflow-hidden relative group"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-neutral-900/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-colors group-hover:bg-neutral-900/10" />

            <div className="relative z-10 flex flex-col gap-6">
              {/* Campaign Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(campaign.status)}`}>
                       {campaign.status}
                    </span>
                    <h2 className="text-3xl font-display font-bold text-neutral-900 tracking-tight">{campaign.name}</h2>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       <Target size={14} className="text-neutral-400" />
                       <span className="text-[11px] font-black text-neutral-500 uppercase tracking-widest">{campaign.tasks.total} Tasks</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Calendar size={14} className="text-neutral-400" />
                       <span className="text-[11px] font-black text-neutral-500 uppercase tracking-widest">Active Phase</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                   <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Overall Velocity</span>
                      <span className="text-2xl font-display font-black text-neutral-900">{campaign.progress}%</span>
                   </div>
                   <div className="w-48 h-2.5 bg-neutral-100 rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${campaign.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-neutral-900 shadow-[0_0_15px_rgba(0,0,0,0.1)]" 
                      />
                   </div>
                </div>
              </div>

              {/* Grid: Tasks, Timeline, Team */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Visual Stepper Timeline */}
                <div className="lg:col-span-2 space-y-8">
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">Campaign Roadmap</h3>
                   <div className="relative flex flex-col md:flex-row justify-between items-start gap-8 px-4">
                      {/* Connection Lines */}
                      <div className="absolute top-6 left-10 right-10 h-[2px] bg-neutral-200 hidden md:block" />
                      <div className="absolute left-1/2 -translate-x-1/2 top-6 bottom-6 w-[2px] bg-neutral-200 md:hidden" />
                      
                      {campaign.timeline.map((phase, idx) => {
                        const isCompleted = phase.status === 'completed';
                        const isInProgress = phase.status === 'in-progress';
                        return (
                          <div key={idx} className="relative z-10 flex flex-col items-center text-center gap-4 group/phase flex-1">
                             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl border-4 border-white ${
                               isCompleted ? 'bg-neutral-900 text-white' : 
                               isInProgress ? 'bg-neutral-900 text-white animate-pulse' : 
                               'bg-white text-neutral-300 border-neutral-100'
                             }`}>
                                 {isCompleted ? <CheckCircle2 size={18} /> : phase.icon ? <phase.icon size={18} /> : <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                             </div>
                             <div className="space-y-1">
                                <h4 className={`text-sm font-bold tracking-tight ${isCompleted || isInProgress ? 'text-neutral-900' : 'text-neutral-500'}`}>
                                   {phase.phase}
                                </h4>
                                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{phase.date}</p>
                             </div>
                          </div>
                        );
                      })}
                   </div>
                </div>

                {/* Team Card */}
                <div className="space-y-8">
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500 mb-1">Execution Team</h3>
                   <div className="flex flex-col gap-4">
                      {campaign.team.map((member, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 rounded-3xl bg-neutral-50 border border-neutral-100 hover:bg-white hover:shadow-xl transition-all group/member">
                           <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-white font-display font-black text-[10px] group-hover/member:rotate-6 transition-transform">
                              {member.avatar}
                           </div>
                           <div className="space-y-0.5">
                              <h4 className="text-[13px] font-bold text-neutral-900">{member.name}</h4>
                               <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{member.role}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              {/* Approval Ledger */}
              <div className="p-6 md:p-8 rounded-[32px] bg-neutral-900 text-white flex flex-col gap-8 shadow-2xl relative overflow-hidden group/ledger">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
                 
                 <div className="flex justify-between items-center relative z-10">
                    <div className="space-y-1">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Action Queue</h3>
                       <h4 className="text-xl font-display font-bold">Pending Approvals</h4>
                    </div>
                    <AlertCircle size={20} className="text-amber-400" />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                    {campaign.approvals.map((approval, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group/item">
                         <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{approval.date}</span>
                            {approval.status === 'approved' ? (
                               <CheckCircle2 size={14} className="text-emerald-400" />
                            ) : (
                               <Clock size={14} className="text-amber-400" />
                            )}
                         </div>
                         <h5 className="text-[13px] font-bold text-white mb-4 line-clamp-1">{approval.item}</h5>
                         {approval.status === 'pending' && (
                            <button className="w-full py-2 bg-white text-neutral-900 rounded-lg font-black text-[9px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
                               Review Assets
                            </button>
                         )}
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
