import { useState } from 'react';
import { useClientStore } from '@/modules/client/data/store';
import { X, Send, Plus, Phone, Mail, MessageCircle, AlertCircle, Shield, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

const priorityStyle: Record<string, string> = {
  low: 'text-[var(--info)]', medium: 'text-[var(--warning)]', high: 'text-[var(--danger)]',
};
const statusStyle: Record<string, string> = {
  open: 'bg-[var(--warning-dim)] text-[var(--warning)] border-[var(--warning-dim)]',
  in_progress: 'bg-[var(--info-dim)] text-[var(--info)] border-[var(--info-dim)]',
  resolved: 'bg-[var(--success-dim)] text-[var(--success)] border-[var(--success-dim)]',
};

export function Support() {
  const { state, dispatch } = useClientStore();
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [reply, setReply] = useState('');
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [newPriority, setNewPriority] = useState('Medium');

  const handleReply = () => {
    if (!reply.trim() || !selectedTicket) return;
    const msg = { id: `tm-${Date.now()}`, senderId: 'u-1', senderRole: 'client', content: reply, timestamp: new Date().toISOString() };
    dispatch({ type: 'REPLY_TICKET', payload: { ticketId: selectedTicket.id, message: msg } });
    setSelectedTicket((prev: any) => prev ? { ...prev, thread: [...prev.thread, msg] } : null);
    setReply('');
    toast.success('Reply sent!');
  };

  const handleNewTicket = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const ticket: any = {
      id: `tic-${Date.now()}`,
      clientId: 'u-1',
      subject: data.get('subject') as string,
      description: data.get('description') as string,
      priority: newPriority.toLowerCase() as any,
      status: 'open',
      createdAt: new Date().toISOString(),
      thread: [{
        id: `tm-${Date.now()}`, senderId: 'u-1', senderRole: 'client',
        content: data.get('description') as string, timestamp: new Date().toISOString()
      }]
    };
    dispatch({ type: 'ADD_TICKET', payload: ticket });
    setNewTicketOpen(false);
    form.reset();
    toast.success('Support ticket submitted!');
  };

  const ticket = selectedTicket ? state.tickets.find(t => t.id === selectedTicket.id) : null;

  const accountManager = {
    name: "Sarah Mitchell",
    role: "Senior Account Manager",
    email: "sarah.mitchell@vlocal.com",
    phone: "+1 (555) 123-4567",
    avatar: "SM",
    availability: "Mon-Fri, 9AM-6PM EST",
  };

  const escalationContacts = [
    {
      level: "Level 1",
      title: "Campaign Support",
      name: "David Chen",
      role: "Campaign Coordinator",
      email: "david.chen@vlocal.com",
      phone: "+1 (555) 234-5678",
      avatar: "DC",
      responseTime: "Within 2 hours",
      forIssues: ["Campaign queries", "Asset requests", "General questions"],
      color: "from-[#3b82f6]/10 to-[#2dd4bf]/10",
      iconColor: "text-[#3b82f6]"
    },
    {
      level: "Level 2",
      title: "Account Management",
      name: "Sarah Mitchell",
      role: "Senior Account Manager",
      email: "sarah.mitchell@vlocal.com",
      phone: "+1 (555) 123-4567",
      avatar: "SM",
      responseTime: "Within 4 hours",
      forIssues: ["Budget concerns", "Strategy discussions", "Timeline changes"],
      color: "from-[#f59e0b]/10 to-[#fbbf24]/10",
      iconColor: "text-[#f59e0b]"
    },
    {
      level: "Level 3",
      title: "Director Level",
      name: "Michael Torres",
      role: "Director of Client Success",
      email: "michael.torres@vlocal.com",
      phone: "+1 (555) 345-6789",
      avatar: "MT",
      responseTime: "Within 8 hours",
      forIssues: ["Critical issues", "Contract matters", "Executive decisions"],
      color: "from-[#ef4444]/10 to-[#f87171]/10",
      iconColor: "text-[#ef4444]"
    },
  ];

  return (
    <div className="flex flex-col gap-10 md:gap-14 relative pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-neutral-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <Shield className="h-5 w-5" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-neutral-900 uppercase">Support Hub</h1>
          </div>
          <p className="text-sm font-bold text-neutral-400 max-w-md leading-relaxed">Structured escalation matrix and priority issue tracking system for campaign excellence.</p>
        </div>
        <button 
          onClick={() => setNewTicketOpen(true)}
          className="group relative px-8 py-4 bg-neutral-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <div className="flex items-center gap-3">
             <Plus size={16} />
             <span>Raise Priority Ticket</span>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Account Manager Card */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           <div className="glass-card p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-[var(--border-subtle)] shadow-2xl relative overflow-hidden flex flex-col gap-8 group">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-neutral-900/5 rounded-full blur-3xl group-hover:bg-neutral-900/10 transition-colors" />
              
              <div className="space-y-1">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Primary Contact</h3>
                <h2 className="text-2xl font-display font-bold text-neutral-900 leading-tight">Account Manager</h2>
              </div>

              <div className="flex flex-col items-center text-center gap-4 py-4">
                 <div className="relative">
                    <div className="absolute inset-0 bg-neutral-900 rounded-[32px] rotate-6 scale-95 opacity-10 group-hover:rotate-12 transition-transform duration-500" />
                    <div className="w-24 h-24 bg-neutral-900 rounded-[32px] flex items-center justify-center text-white font-display font-black text-3xl shadow-2xl relative z-10">
                       {accountManager.avatar}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full z-20" />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-xl font-bold text-neutral-900 tracking-tight">{accountManager.name}</h4>
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{accountManager.role}</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 group/item hover:bg-white hover:shadow-lg transition-all duration-300">
                    <Mail className="h-4 w-4 text-neutral-400 group-hover/item:text-neutral-900 transition-colors" />
                    <span className="text-xs font-bold text-neutral-600 truncate">{accountManager.email}</span>
                 </div>
                 <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 group/item hover:bg-white hover:shadow-lg transition-all duration-300">
                    <Phone className="h-4 w-4 text-neutral-400 group-hover/item:text-neutral-900 transition-colors" />
                    <span className="text-xs font-bold text-neutral-600">{accountManager.phone}</span>
                 </div>
                 <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 group/item hover:bg-white hover:shadow-lg transition-all duration-300">
                    <Clock className="h-4 w-4 text-neutral-400 group-hover/item:text-neutral-900 transition-colors" />
                    <span className="text-xs font-bold text-neutral-600">{accountManager.availability}</span>
                 </div>
              </div>

              <button className="w-full py-4 bg-neutral-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 mt-4">
                 <MessageCircle size={14} />
                 <span>Direct Message</span>
              </button>
           </div>
        </div>

        {/* Right: Escalation Levels */}
        <div className="lg:col-span-8 flex flex-col gap-8">
           <div className="glass-card p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-[var(--border-subtle)] shadow-xl flex flex-col gap-10">
              <div className="flex justify-between items-center">
                 <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Response Hierarchy</h3>
                    <h2 className="text-2xl font-display font-bold text-neutral-900 leading-tight">Escalation Matrix</h2>
                 </div>
                 <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-neutral-50 rounded-xl border border-neutral-100">
                    <AlertCircle size={14} className="text-neutral-400" />
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">SLA Compliant</span>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {escalationContacts.map((contact, index) => (
                   <motion.div
                     key={contact.level}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: index * 0.1 }}
                     className="flex flex-col gap-6 p-6 rounded-[32px] border border-neutral-100 bg-white shadow-sm hover:shadow-2xl hover:border-neutral-200 transition-all duration-500 group/card"
                   >
                     <div className="flex items-start justify-between">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${contact.color} flex items-center justify-center font-display font-black text-xl ${contact.iconColor} shadow-inner`}>
                           {contact.avatar}
                        </div>
                        <div className="px-2.5 py-1 bg-neutral-50 rounded-lg border border-neutral-100 text-[9px] font-black text-neutral-400 tracking-widest uppercase">
                           {contact.level}
                        </div>
                     </div>

                     <div className="space-y-1">
                        <h4 className="text-base font-bold text-neutral-900 tracking-tight leading-tight">{contact.title}</h4>
                        <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">{contact.name}</p>
                     </div>

                     <div className="space-y-3 pt-2 border-t border-neutral-50">
                        <p className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">Response Time</p>
                        <p className={`text-sm font-bold ${contact.iconColor}`}>{contact.responseTime}</p>
                     </div>

                     <div className="mt-auto flex flex-col gap-2">
                        <a href={`mailto:${contact.email}`} className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors flex items-center gap-2">
                           <Mail size={12} />
                           <span>Email Contact</span>
                        </a>
                     </div>
                   </motion.div>
                 ))}
              </div>

              <div className="p-6 md:p-8 rounded-[32px] bg-neutral-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group/cta">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover/cta:translate-x-[100%] transition-transform duration-[1500ms]" />
                 <div className="relative z-10 flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                       <Shield size={20} className="text-white" />
                    </div>
                    <div className="space-y-2 p-5 rounded-[24px] bg-white/5 border border-white/5 backdrop-blur-sm">
                       <h4 className="text-xl font-display font-bold tracking-tight text-white">Need <span className="text-[var(--accent)] font-black">immediate</span> technical help?</h4>
                       <p className="text-sm font-medium text-neutral-200">Our support engineers are available 24/7 for critical issues.</p>
                    </div>
                 </div>
                 <button className="relative z-10 px-8 py-3 bg-white text-neutral-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.05] active:scale-95 transition-all shadow-xl">
                    Live Tech Support
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Support Tickets Section */}
      <div className="glass-card p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-[var(--border-subtle)] shadow-2xl flex flex-col gap-10">
         <div className="flex justify-between items-center">
            <div className="space-y-1">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Active Issues</h3>
               <h2 className="text-2xl font-display font-bold text-neutral-900 leading-tight">Support Tickets</h2>
            </div>
            <span className="px-4 py-1.5 bg-neutral-900 text-white rounded-full text-[10px] font-black tracking-widest uppercase">
               {state.tickets.length} Active
            </span>
         </div>

         <div className="overflow-x-auto w-full">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="border-b border-neutral-100">
                 <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Ticket ID</th>
                 <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Subject</th>
                 <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Priority</th>
                 <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Status</th>
                 <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 text-right pr-6">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-neutral-50">
               {state.tickets.map((t, i) => (
                 <tr key={t.id} className="group/row hover:bg-neutral-50/50 transition-all">
                   <td className="py-6 text-xs font-black text-neutral-400 group-hover/row:text-neutral-900 transition-colors">TCK-{1024 + i}</td>
                   <td className="py-6">
                      <div className="flex flex-col gap-1">
                         <span className="text-[13px] font-bold text-neutral-900 tracking-tight">{t.subject}</span>
                         <span className="text-[10px] font-medium text-neutral-400">{new Date(t.createdAt).toLocaleDateString()}</span>
                      </div>
                   </td>
                   <td className="py-6">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        t.priority === 'high' ? 'bg-red-50 text-red-500 border-red-100' : 
                        t.priority === 'medium' ? 'bg-amber-50 text-amber-500 border-amber-100' : 
                        'bg-blue-50 text-blue-500 border-blue-100'
                      }`}>
                         {t.priority}
                      </span>
                   </td>
                   <td className="py-6">
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${t.status === 'open' ? 'bg-amber-400 animate-pulse' : 'bg-green-400'}`} />
                         <span className="text-xs font-bold text-neutral-600 capitalize">{t.status.replace('_', ' ')}</span>
                      </div>
                   </td>
                   <td className="py-6 text-right pr-6">
                      <button 
                        onClick={() => setSelectedTicket(t)}
                        className="px-6 py-2 bg-white border border-neutral-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all active:scale-95 shadow-sm"
                      >
                         View Thread
                      </button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
           {state.tickets.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center gap-4">
                 <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-neutral-200" />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-lg font-bold text-neutral-900">All Clear!</h4>
                    <p className="text-xs font-medium text-neutral-400">You don't have any active support tickets.</p>
                 </div>
              </div>
           )}
         </div>
      </div>

      {/* Slide-overs (Modals) remain functional but with updated UI wrappers */}

      {/* New Ticket Slide-over */}
      {newTicketOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]" onClick={() => setNewTicketOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] z-[9999] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
              <div><h3 className="font-display font-bold text-[16px]">Raise Support Ticket</h3></div>
              <button onClick={() => setNewTicketOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleNewTicket} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 custom-scrollbar">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Subject *</label>
                <input name="subject" className="w-full px-3 py-2.5 rounded-lg border border-[var(--border-default)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] bg-[var(--bg-base)] text-sm focus:outline-none" placeholder="Brief summary of the issue" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Priority</label>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High'].map(p => (
                    <button key={p} type="button" onClick={() => setNewPriority(p)}
                      className={`flex-1 py-2 rounded-lg border text-[12px] font-bold transition-colors cursor-pointer ${newPriority === p ? p === 'Low' ? 'bg-[var(--info)] border-[var(--info)] text-white' : p === 'Medium' ? 'bg-[var(--warning)] border-[var(--warning)] text-[var(--bg-base)]' : 'bg-[var(--danger)] border-[var(--danger)] text-white' : 'border-[var(--border-default)] text-[var(--text-secondary)] bg-[var(--bg-elevated)] hover:border-[var(--border-strong)]'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Description *</label>
                <textarea name="description" className="w-full px-3 py-2.5 rounded-lg border border-[var(--border-default)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] bg-[var(--bg-base)] text-sm focus:outline-none min-h-[140px] resize-none" placeholder="Describe the issue in detail..." required />
              </div>
              <div className="flex gap-3 mt-auto pt-4">
                <button type="button" onClick={() => setNewTicketOpen(false)} className="px-4 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] font-bold text-sm flex-1 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2.5 rounded-xl bg-[var(--accent)] hover:brightness-110 text-[var(--bg-base)] font-bold text-sm flex-1 cursor-pointer">Submit Ticket</button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Thread Slide-over */}
      {selectedTicket && ticket && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]" onClick={() => setSelectedTicket(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-[480px] bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] z-[9999] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
              <div>
                <h3 className="font-display font-bold text-[16px]">{ticket.subject}</h3>
                <p className="text-[11.5px] font-bold text-[var(--text-secondary)] mt-1">Priority: <span className={`uppercase ${priorityStyle[ticket.priority]}`}>{ticket.priority}</span></p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 cursor-pointer"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 custom-scrollbar">
              {ticket.thread.map(msg => (
                <div key={msg.id} className={`flex ${msg.senderRole === 'client' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-[12px] p-3.5 text-[13px] leading-relaxed ${msg.senderRole === 'client' ? 'bg-[var(--accent)] text-[var(--bg-base)] rounded-tr-none font-medium' : 'bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] rounded-tl-none font-medium'}`}>
                    <div className={`text-[11px] font-bold mb-1.5 ${msg.senderRole === 'client' ? 'text-[var(--bg-base)]/80' : 'text-[var(--text-muted)]'}`}>{msg.senderRole === 'client' ? 'You' : 'VLOCAL Support'} • {new Date(msg.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)] flex gap-2">
              <input className="w-full px-3 py-2.5 rounded-lg border border-[var(--border-default)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] bg-[var(--bg-base)] text-sm focus:outline-none flex-1" placeholder="Type a reply..." value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleReply(); }} />
              <button onClick={handleReply} className="px-4 rounded-lg bg-[var(--accent)] hover:brightness-110 text-[var(--bg-base)] flex items-center justify-center cursor-pointer transition-all"><Send size={16} /></button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

