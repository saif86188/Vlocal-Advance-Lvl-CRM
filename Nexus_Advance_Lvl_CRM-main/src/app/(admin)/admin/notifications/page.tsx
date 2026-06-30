'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, ShieldCheck, Zap, CreditCard, 
  Settings, Trash2, CheckCircle2, Filter, 
  Search, Archive, Info, AlertTriangle,
  Clock, ArrowRight, Share2, MoreHorizontal
} from 'lucide-react';
import { useAdminStore } from '@/modules/admin/data/store';
import { toast } from 'sonner';

const filterTabs = [
  { id: 'all', label: 'All Intelligence', icon: Bell },
  { id: 'system', label: 'System', icon: Settings },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'payment', label: 'Payments', icon: CreditCard },
  { id: 'business', label: 'Business', icon: Zap },
];

export default function NotificationsPage() {
  const { state, dispatch } = useAdminStore();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotifications = useMemo(() => {
    return state.notifications.filter(n => {
      const matchesFilter = activeFilter === 'all' || n.type === activeFilter;
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            n.message.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [state.notifications, activeFilter, searchQuery]);

  return (
    <div className="flex flex-col gap-8 md:gap-10 pb-20 relative overflow-hidden px-6 md:px-12">
      {/* Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center text-white shadow-2xl border border-white/10">
              <Bell className="h-6 w-6 text-rose-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-neutral-900 uppercase">Intelligence Feed</h1>
          </div>
          <p className="text-sm font-bold text-neutral-400 max-w-lg leading-relaxed uppercase tracking-widest">Real-time node telemetry & security alerts</p>
        </div>

        <div className="flex items-center gap-3">
           <button 
             onClick={() => dispatch({ type: 'MARK_ALL_READ' })}
             className="px-6 py-3 bg-white border border-neutral-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-50 transition-all flex items-center gap-2"
           >
              <CheckCircle2 size={14} className="text-emerald-500" />
              Mark All Read
           </button>
           <button 
             onClick={() => dispatch({ type: 'CLEAR_NOTIFICATIONS' })}
             className="px-6 py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center gap-2"
           >
              <Trash2 size={14} />
              Purge Feed
           </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-6 relative z-10">
         <div className="flex-1 flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeFilter === tab.id 
                    ? 'bg-neutral-900 text-white shadow-xl' 
                    : 'bg-white/60 hover:bg-white text-neutral-500 border border-neutral-100'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
         </div>

         <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input 
              type="text"
              placeholder="Search intelligence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="vlocal-input w-full pl-12 rounded-2xl bg-white/60 border-neutral-100 focus:bg-white"
            />
         </div>
      </div>

      {/* Notifications List */}
      <div className="relative z-10">
         <div className="flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
               {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notif, index) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                      className={`glass-card p-6 md:p-8 rounded-[40px] border border-white shadow-xl flex flex-col md:flex-row items-start md:items-center gap-6 group hover:scale-[1.01] transition-all duration-500 ${notif.read ? 'opacity-70 grayscale-[0.3]' : 'bg-white/80'}`}
                    >
                       <div className={`w-14 h-14 rounded-[24px] flex items-center justify-center shrink-0 shadow-lg ${
                           notif.type === 'system' ? 'bg-blue-500 text-white shadow-blue-500/20' :
                           notif.type === 'security' ? 'bg-rose-500 text-white shadow-rose-500/20' :
                           notif.type === 'payment' ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
                           'bg-amber-500 text-white shadow-amber-500/20'
                         }`}>
                          {notif.type === 'system' ? <Settings size={24} /> :
                           notif.type === 'security' ? <ShieldCheck size={24} /> :
                           notif.type === 'payment' ? <CreditCard size={24} /> :
                           <Zap size={24} />}
                       </div>

                       <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                             <h3 className="text-xl font-display font-black text-neutral-900 tracking-tight">{notif.title}</h3>
                             <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                               notif.priority === 'high' ? 'bg-rose-50 text-rose-500 border-rose-100' :
                               notif.priority === 'medium' ? 'bg-amber-50 text-amber-500 border-amber-100' :
                               'bg-neutral-50 text-neutral-400 border-neutral-100'
                             }`}>
                               {notif.priority} priority
                             </span>
                          </div>
                          <p className="text-[13px] font-medium text-neutral-500 leading-relaxed max-w-3xl">{notif.message}</p>
                          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-neutral-400 pt-1">
                             <span className="flex items-center gap-1.5"><Clock size={12} /> {new Date(notif.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                             <span>•</span>
                             <span className="text-[var(--accent)] font-bold">{notif.type} node</span>
                          </div>
                       </div>

                       <div className="flex items-center gap-3 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notif.read && (
                            <button 
                              onClick={() => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notif.id })}
                              className="w-12 h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center text-emerald-500 hover:bg-emerald-50 shadow-sm transition-all"
                              title="Mark as read"
                            >
                               <CheckCircle2 size={18} />
                            </button>
                          )}
                          <button className="w-12 h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center text-neutral-400 hover:bg-neutral-50 shadow-sm transition-all">
                             <Share2 size={18} />
                          </button>
                          <button className="w-12 h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center text-neutral-400 hover:bg-neutral-50 shadow-sm transition-all">
                             <MoreHorizontal size={18} />
                          </button>
                       </div>
                    </motion.div>
                  ))
               ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-32 text-center space-y-4 glass-card rounded-[48px] border-dashed border-2 border-neutral-200 bg-neutral-50/50"
                  >
                     <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl">
                        <Bell size={32} className="text-neutral-200" />
                     </div>
                     <div className="space-y-1">
                        <h3 className="text-xl font-display font-black text-neutral-900 uppercase">Intelligence Feed Empty</h3>
                        <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">No alerts matching your current filters</p>
                     </div>
                     <button 
                      onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}
                      className="text-xs font-black uppercase tracking-widest text-[var(--accent)] hover:underline"
                     >
                       Reset All Filters
                     </button>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
