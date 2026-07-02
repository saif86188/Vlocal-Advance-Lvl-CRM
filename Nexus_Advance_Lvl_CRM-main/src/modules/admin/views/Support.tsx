import { useState } from 'react';
import { useAdminStore } from '@/modules/admin/data/store';
import { X, Send, AlertCircle, ShieldCheck, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

const priorityStyle: Record<string, string> = {
  low: 'text-[var(--info)]',
  medium: 'text-[var(--warning)]',
  high: 'text-[var(--danger)]',
};
const statusStyle: Record<string, string> = {
  open: 'bg-[var(--warning-dim)] text-[var(--warning)] border-[var(--warning-dim)]',
  in_progress: 'bg-[var(--info-dim)] text-[var(--info)] border-[var(--info-dim)]',
  resolved: 'bg-[var(--success-dim)] text-[var(--success)] border-[var(--success-dim)]',
};

export function Support() {
  const { state, dispatch } = useAdminStore();
  const [selected, setSelected] = useState<any>(null);
  const [reply, setReply] = useState('');

  const handleReply = () => {
    if (!reply.trim() || !selected) return;
    dispatch({
      type: 'REPLY_TICKET',
      payload: {
        ticketId: selected.id,
        message: {
          id: `tmsg-${Date.now()}`,
          senderId: 'a-1',
          senderRole: 'admin',
          content: reply,
          timestamp: new Date().toISOString(),
        },
      },
    });
    setReply('');
    toast.success('Reply sent!');
    setSelected((prev: any) => prev ? {
      ...prev,
      thread: [...prev.thread, {
        id: `tmsg-${Date.now()}`, senderId: 'a-1', senderRole: 'admin',
        content: reply, timestamp: new Date().toISOString()
      }]
    } : null);
  };

  const supportStats = [
    { label: "Active Tickets", value: state.tickets.filter(t => t.status !== 'resolved').length, icon: AlertCircle, color: "bg-neutral-900 text-white shadow-2xl" },
    { label: "SLA Health", value: "98%", icon: ShieldCheck, color: "bg-blue-600 text-white shadow-xl" },
    { label: "Avg Resolution", value: "4.2h", icon: Clock, color: "bg-emerald-600 text-white shadow-xl" },
    { label: "Satisaction", value: "4.9", icon: TrendingUp, color: "bg-amber-500 text-white shadow-xl" },
  ];

  const ticket = selected ? state.tickets.find(t => t.id === selected.id) : null;

  return (
    <div className="flex flex-col gap-8 md:gap-10 relative pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center text-white shadow-xl">
              <AlertCircle className="h-5 w-5" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter text-neutral-900 uppercase">Support Hub</h1>
          </div>
          <p className="text-[13px] font-bold text-neutral-400 max-w-md leading-relaxed uppercase tracking-widest">Escalation management. SLA health and resolution audit.</p>
        </div>
        <button className="px-6 py-3 bg-neutral-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center gap-2">
           <BarChart3 size={14} />
           <span>System Audit</span>
        </button>
      </div>

      {/* Support Gems */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {supportStats.map((stat, index) => (
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
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Escalation Ledger</h3>
           <h2 className="text-xl font-display font-bold text-neutral-900">Active Support Queue</h2>
        </div>

        <div className="overflow-x-auto w-full">
           <table className="w-full text-left border-separate border-spacing-y-3 min-w-[700px]">
              <thead>
                 <tr className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">
                    <th className="px-6 pb-2">Reference ID & Subject</th>
                    <th className="px-6 pb-2">Account Context</th>
                    <th className="px-6 pb-2">Priority Level</th>
                    <th className="px-6 pb-2 text-right pr-6">Operational Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y-0">
                 {state.tickets.map((t, i) => (
                   <tr key={i} className="group/row hover:translate-x-1 transition-transform">
                      <td className="px-6 py-4 bg-neutral-50/50 rounded-l-3xl border-y border-l border-neutral-100 group-hover/row:bg-white transition-colors">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-white shadow-lg font-black text-[10px]">
                               {1024 + i}
                            </div>
                            <div className="space-y-0.5">
                               <p className="text-[14px] font-bold text-neutral-900">{t.subject}</p>
                               <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">{new Date(t.createdAt).toLocaleDateString()}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4 bg-neutral-50/50 border-y border-neutral-100 group-hover/row:bg-white transition-colors">
                         <p className="text-xs font-bold text-neutral-600">{t.clientId === 'u-1' ? 'Apex Corp' : 'Nova Tech'}</p>
                      </td>
                      <td className="px-6 py-4 bg-neutral-50/50 border-y border-neutral-100 group-hover/row:bg-white transition-colors">
                         <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${t.priority === 'high' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-neutral-50 text-neutral-400 border-neutral-100'}`}>
                            {t.priority}
                         </span>
                      </td>
                      <td className="px-6 py-4 bg-neutral-50/50 rounded-r-3xl border-y border-r border-neutral-100 group-hover/row:bg-white transition-colors text-right pr-6">
                         <button onClick={() => setSelected(t)} className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:scale-[1.05] transition-all">Manage Thread</button>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

      {/* Thread Slide-over */}
      {selected && ticket && (
        <div className="fixed inset-0 z-[100] flex justify-end">
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
           <motion.div 
             initial={{ x: '100%' }} animate={{ x: 0 }}
             className="relative w-full max-w-lg bg-white shadow-[-32px_0_64px_rgba(0,0,0,0.1)] flex flex-col"
           >
              <div className="p-6 md:p-10 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                 <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">TCK-{ticket.id}</h3>
                    <h2 className="text-xl font-display font-bold text-neutral-900">{ticket.subject}</h2>
                 </div>
                 <button onClick={() => setSelected(null)} className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center hover:bg-neutral-900 hover:text-white transition-all shrink-0">
                    <X size={20} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 md:space-y-8 custom-scrollbar bg-neutral-50/20">
                 {ticket.thread.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}>
                       <div className={`max-w-[85%] p-5 md:p-6 rounded-[24px] md:rounded-[32px] shadow-sm relative ${msg.senderRole === 'admin' ? 'bg-neutral-900 text-white rounded-tr-none' : 'bg-white border border-neutral-100 text-neutral-900 rounded-tl-none'}`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <span className={`block mt-3 text-[9px] font-black uppercase tracking-widest ${msg.senderRole === 'admin' ? 'text-white/40' : 'text-neutral-400'}`}>
                             {msg.senderRole === 'admin' ? 'Vlocal Core Admin' : 'Client Personnel'} • {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="p-4 md:p-8 bg-white border-t border-neutral-100">
                 <div className="relative group">
                    <input
                      className="w-full h-16 pl-8 pr-20 rounded-[24px] bg-neutral-50 border border-neutral-100 text-[13px] font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all"
                      placeholder="Compose operational response..."
                      value={reply}
                      onChange={e => setReply(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleReply(); }}
                    />
                    <button onClick={handleReply} className="absolute right-3 top-3 w-10 h-10 bg-neutral-900 text-white rounded-xl flex items-center justify-center hover:scale-[1.05] active:scale-95 transition-all">
                       <Send size={16} />
                    </button>
                 </div>
              </div>
           </motion.div>
        </div>
      )}
    </div>
  );
}

