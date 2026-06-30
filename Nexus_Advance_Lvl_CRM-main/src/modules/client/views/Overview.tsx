import { useState } from 'react';
import { useClientStore } from '@/modules/client/data/store';
import Link from 'next/link';
import { FileText, CreditCard, Briefcase, Headphones, ArrowRight, Play, Pause, Clock, Calendar, MoreVertical, CheckCircle2, MessageSquare, ChevronDown, ChevronUp, ClipboardList } from 'lucide-react';

export function Overview() {
  const [expandedSection, setExpandedSection] = useState<string | null>('campaigns');
  const { state } = useClientStore();

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const pendingPayments = state.payments.filter(p => p.status === 'pending');
  const paidTotal = state.payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.total, 0);
  const openTickets = state.tickets.filter(t => t.status !== 'resolved').length;
  const activeProposal = state.proposals.find(p => p.status === 'awaiting_approval');
  const activeProject = state.projects[0];
  const activePhase = activeProject?.phases[activeProject.currentPhaseIndex];

  // Dynamic Live Calendar Calculation
  const now = new Date();
  const currentMonthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toLocaleString('default', { month: 'long' });
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toLocaleString('default', { month: 'long' });

  const todayIndex = now.getDay();
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(now);
    const diff = i + 1 - (todayIndex === 0 ? 7 : todayIndex);
    d.setDate(now.getDate() + diff);
    const dayName = d.toLocaleDateString('default', { weekday: 'short' });
    const dayNum = d.getDate();
    const isToday = diff === 0;
    return { dayName, dayNum, isToday };
  });

  const fmt = (n: number) => `₹${new Intl.NumberFormat('en-IN').format(n)}`;

  const ChevronDownIcon = () => <ChevronDown size={16} className="text-[var(--text-muted)]" />;
  const ChevronUpIcon = () => <ChevronUp size={16} className="text-[var(--text-muted)]" />;

  return (
    <div className="flex flex-col gap-8 md:gap-10 h-full pb-10 container-responsive">
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="w-full lg:w-auto text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-medium tracking-tight text-[var(--text-primary)]">
            Welcome in, <span className="text-[var(--accent)]">Nixtio</span>
          </h1>
        </div>
        
        {/* Right side metrics - Scrollable on mobile */}
        <div className="flex gap-8 md:gap-16 items-center w-full lg:w-auto overflow-x-auto pb-4 lg:pb-0 custom-scrollbar justify-center lg:justify-end">
          <div className="flex flex-col shrink-0">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-6 h-6 bg-[var(--text-primary)] rounded-lg flex items-center justify-center text-[var(--bg-base)] shadow-lg">
                <Briefcase size={12} />
              </div>
              <span className="text-3xl md:text-5xl font-display font-medium text-[var(--text-primary)]">{state.projects.length}</span>
            </div>
            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Campaigns</span>
          </div>
          <div className="flex flex-col shrink-0">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-6 h-6 bg-[var(--text-primary)] rounded-lg flex items-center justify-center text-[var(--bg-base)] shadow-lg">
                <FileText size={12} />
              </div>
              <span className="text-3xl md:text-5xl font-display font-medium text-[var(--text-primary)]">{state.proposals.length}</span>
            </div>
            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Proposals</span>
          </div>
          <div className="flex flex-col shrink-0">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-6 h-6 bg-[var(--text-primary)] rounded-lg flex items-center justify-center text-[var(--bg-base)] shadow-lg">
                <Headphones size={12} />
              </div>
              <span className="text-3xl md:text-5xl font-display font-medium text-[var(--text-primary)]">{openTickets}</span>
            </div>
            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Tickets</span>
          </div>
        </div>
      </div>

      {/* Horizontal Progress Bars Row */}
      <div className="flex flex-wrap gap-6 items-start">
        {/* Active Phase */}
        <div className="flex flex-col gap-2 flex-1 min-w-[160px]">
          <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.15em]">Active Phase</span>
          <div className="h-12 rounded-full bg-white/60 border border-[var(--border-subtle)] relative overflow-hidden flex items-center shadow-inner">
            <div className="h-full bg-[var(--text-primary)] rounded-full transition-all duration-1000" style={{ width: `${activePhase?.progressPercent || 15}%` }}></div>
            <span className="absolute left-4 text-[11px] font-black text-white mix-blend-difference">{activePhase?.progressPercent || 15}%</span>
          </div>
        </div>

        {/* Budget Used */}
        <div className="flex flex-col gap-2 flex-1 min-w-[160px]">
          <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.15em]">Budget Used</span>
          <div className="h-12 rounded-full bg-white/60 border border-[var(--border-subtle)] relative overflow-hidden flex items-center shadow-inner">
            <div className="h-full bg-[var(--accent)] rounded-full transition-all duration-1000 w-[45%]"></div>
            <span className="absolute left-4 text-[11px] font-black text-[var(--text-primary)]">45%</span>
          </div>
        </div>

        {/* Project Time - striped */}
        <div className="flex flex-col gap-2 flex-[2] min-w-[200px]">
          <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.15em]">Project time</span>
          <div className="h-12 rounded-full bg-white/60 border border-[var(--border-subtle)] relative overflow-hidden flex items-center shadow-inner">
            <div 
              className="h-full rounded-full w-[60%]"
              style={{ backgroundImage: 'repeating-linear-gradient(-45deg, rgba(0,0,0,0.12), rgba(0,0,0,0.12) 3px, transparent 3px, transparent 8px)', backgroundColor: 'rgba(0,0,0,0.06)' }}
            ></div>
            <span className="absolute left-4 text-[11px] font-black text-[var(--text-secondary)]">60%</span>
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2 flex-1 min-w-[120px]">
          <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.15em]">Output</span>
          <div className="h-12 rounded-full bg-white/60 border border-[var(--border-subtle)] relative overflow-hidden flex items-center shadow-inner">
            <div className="h-full bg-[var(--bg-hover)] rounded-full w-[10%]"></div>
            <span className="absolute left-4 text-[11px] font-black text-[var(--text-secondary)]">10%</span>
          </div>
        </div>
      </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 auto-rows-min">
          
          {/* Left Column: Profile & Sidebar Lists */}
          <div className="col-span-1 lg:col-span-3 flex flex-col gap-6 md:gap-8">
            <div className="relative h-[280px] md:h-[480px] overflow-hidden rounded-[32px] md:rounded-[64px] shadow-2xl group cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              alt="Profile"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            
            <div className="absolute bottom-8 md:bottom-12 left-8 md:left-10 right-8 md:right-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
                <div>
                  <h3 className="text-white text-2xl md:text-3xl font-display font-medium mb-1">Nixtio Corp.</h3>
                  <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.25em]">Premium Client</p>
                </div>
                <div className="flex flex-col items-start md:items-end">
                  <div className="bg-white/10 backdrop-blur-2xl rounded-2xl px-4 py-2 border border-white/20 text-white text-base md:text-lg font-display font-bold shadow-2xl group-hover:bg-white/20 transition-all">
                    {fmt(paidTotal)}
                  </div>
                  <span className="text-white/40 text-[9px] font-black uppercase tracking-widest mt-1">Total Invested</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card flex-1 flex flex-col p-6 md:p-10 gap-8 md:gap-10 rounded-[32px] md:rounded-[64px] border border-[var(--border-subtle)] shadow-xl">
             {/* My Projects */}
             <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center cursor-pointer group" onClick={() => setExpandedSection(expandedSection === 'proposals' ? null : 'proposals')}>
                   <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">My Projects</span>
                   {expandedSection === 'proposals' ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </div>
                {expandedSection === 'proposals' && (
                  <div className="flex flex-col gap-2">
                    {state.proposals.slice(0, 2).map(proposal => {
                      const req = state.requirements.find(r => r.id === proposal.requirementId);
                      return (
                        <div key={proposal.id} className="bg-[var(--bg-elevated)] p-3 rounded-2xl border border-[var(--border-subtle)] hover:border-[var(--accent)]/30 transition-all group/item flex items-center gap-3">
                          <div className="w-9 h-9 bg-[var(--accent)]/10 rounded-xl flex items-center justify-center text-[var(--accent)] group-hover/item:bg-[var(--accent)] group-hover/item:text-white transition-all shrink-0">
                            <Briefcase size={14} />
                          </div>
                          <div className="flex flex-col truncate">
                            <span className="text-xs font-bold text-[var(--text-primary)] truncate">{req?.title || 'Active Project'}</span>
                            <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest mt-0.5">{proposal.status.replace('_', ' ')}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
             </div>

             {/* Payment Summary */}
             <div className="flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-6">
                <div className="flex justify-between items-center cursor-pointer group" onClick={() => setExpandedSection(expandedSection === 'payments' ? null : 'payments')}>
                   <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">Payment Summary</span>
                   {expandedSection === 'payments' ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </div>
                {expandedSection === 'payments' && (
                  <div className="flex flex-col gap-2">
                    {state.payments.slice(0, 2).map(p => (
                      <div key={p.id} className="flex items-center justify-between bg-[var(--bg-elevated)] p-3 rounded-2xl border border-[var(--border-subtle)]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[var(--success)]/10 rounded-lg flex items-center justify-center text-[var(--success)]"><CreditCard size={13}/></div>
                          <div>
                            <div className="text-xs font-bold text-[var(--text-primary)]">{fmt(p.total)}</div>
                            <div className="text-[9px] text-[var(--text-muted)] uppercase">{p.status}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>

             {/* Support Tickets */}
             <div className="flex flex-col gap-2 border-t border-[var(--border-subtle)] pt-6">
                <div className="flex justify-between items-center cursor-pointer group" onClick={() => setExpandedSection(expandedSection === 'tickets' ? null : 'tickets')}>
                   <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">Support Tickets</span>
                   <div className="flex items-center gap-2">
                     {openTickets > 0 && <span className="w-5 h-5 bg-[var(--accent)] rounded-full text-[9px] font-black flex items-center justify-center text-[var(--text-primary)]">{openTickets}</span>}
                     {expandedSection === 'tickets' ? <ChevronUpIcon /> : <ChevronDownIcon />}
                   </div>
                </div>
             </div>

             {/* My Services */}
             <div className="flex flex-col gap-2 border-t border-[var(--border-subtle)] pt-6">
                <div className="flex justify-between items-center cursor-pointer group">
                   <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">My Services</span>
                   <ChevronDownIcon />
                </div>
             </div>
          </div>
        </div>

        {/* Middle Column: Progress & Timeline */}
        <div className="col-span-1 lg:col-span-6 flex flex-col gap-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              {/* Progress Stats */}
              <div className="glass-card p-6 md:p-8 flex flex-col relative group overflow-hidden rounded-[32px] border border-[var(--border-subtle)] shadow-xl min-h-[280px] md:min-h-[320px]">
                 {/* Header row: label left, arrow right */}
                 <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Campaign Progress</h3>
                    <button className="w-8 h-8 rounded-full border border-[var(--border-subtle)] flex items-center justify-center hover:bg-[var(--bg-hover)] transition-all">
                       <ArrowRight size={14} className="-rotate-45" />
                    </button>
                 </div>
                 <div className="flex flex-col flex-1 justify-between">
                     <div className="flex items-baseline gap-2">
                         <span className="text-4xl md:text-5xl font-display font-black text-[var(--text-primary)] tracking-tighter leading-none">{activePhase?.progressPercent ?? 72}%</span>
                         <div className="flex flex-col ml-1">
                           <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest leading-tight">Phase</span>
                           <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest leading-tight">Complete</span>
                         </div>
                     </div>
                     
                     {/* Bar chart */}
                     <div className="flex items-end gap-2 mt-4 md:mt-6" style={{ height: '100px' }}>
                        {[
                          { h: 45, active: false },
                          { h: 75, active: false },
                          { h: 55, active: false },
                          { h: 90, active: false },
                          { h: 100, active: true, label: 'Phase 4' },
                          { h: 35, active: false },
                          { h: 22, active: false },
                        ].map((bar, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-2 relative">
                            {bar.active && (
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-[9px] font-black px-2 py-1 rounded-lg text-[var(--text-primary)] whitespace-nowrap shadow-lg shadow-[var(--accent)]/30">
                                {bar.label}
                              </div>
                            )}
                            <div 
                              className={`w-full rounded-full transition-all duration-700 ${bar.active ? 'bg-[var(--accent)]' : 'bg-[var(--text-primary)]'}`}
                              style={{ height: `${bar.h}%`, minHeight: '8px' }}
                            ></div>
                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${bar.active ? 'bg-[var(--accent)]' : 'bg-[var(--text-primary)]'} opacity-40`}></div>
                            <span className="text-[9px] font-black text-[var(--text-muted)] uppercase">{['S','M','T','W','T','F','S'][i]}</span>
                          </div>
                        ))}
                    </div>
                </div>
             </div>

             {/* Delivery Timeline */}
             <div className="glass-card p-8 relative flex flex-col group rounded-[32px] border border-[var(--border-subtle)] shadow-xl">
                {/* Header row: label left, arrow right */}
                <div className="flex items-center justify-between mb-auto">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Delivery Timeline</h3>
                   <button className="w-8 h-8 rounded-full border border-[var(--border-subtle)] flex items-center justify-center hover:bg-[var(--bg-hover)] transition-all">
                      <ArrowRight size={14} className="-rotate-45" />
                   </button>
                </div>
                
                {/* Ring centered */}
                <div className="flex flex-col items-center justify-center flex-1">
                  <div className="relative w-44 h-44">
                     <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                       <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" />
                       <circle cx="60" cy="60" r="48" fill="none" stroke="var(--accent)" strokeWidth="8" 
                         strokeDasharray="301.6" strokeDashoffset="90" 
                         strokeLinecap="round"
                         style={{ filter: 'drop-shadow(0 0 8px rgba(251,193,58,0.5))' }}
                       />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-display font-black text-[var(--text-primary)] tracking-tighter">14</span>
                        <span className="text-[9px] text-[var(--text-muted)] font-black uppercase tracking-widest mt-1">Days Left</span>
                     </div>
                  </div>

                  <div className="flex gap-6 mt-8 items-center">
                     <button className="w-11 h-11 rounded-full border border-[var(--border-default)] bg-white/60 flex items-center justify-center hover:bg-[var(--bg-hover)] transition-all shadow-sm hover:scale-110">
                        <Play size={16} className="ml-0.5" />
                     </button>
                     <button className="w-14 h-14 rounded-[20px] bg-[var(--text-primary)] text-[var(--bg-base)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl">
                        <Pause size={20} fill="currentColor" />
                     </button>
                     <button className="w-11 h-11 rounded-full border border-[var(--border-default)] bg-white/60 flex items-center justify-center hover:bg-[var(--bg-hover)] transition-all shadow-sm hover:scale-110">
                        <Clock size={16} />
                     </button>
                  </div>
                </div>
             </div>
           </div>

           {/* Calendar Grid */}
           <div className="glass-card flex-1 p-6 md:p-10 rounded-[32px] md:rounded-[64px] border border-[var(--border-subtle)] shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-8 md:mb-12">
                 <div className="flex items-center gap-6">
                    <span className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer hover:text-[var(--text-primary)]">{prevMonth}</span>
                    <h3 className="text-xl md:text-2xl font-display font-medium text-[var(--text-primary)]">{currentMonthName}</h3>
                    <span className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer hover:text-[var(--text-primary)]">{nextMonth}</span>
                 </div>
              </div>

              <div className="grid grid-cols-7 gap-2 md:gap-8 mb-8 border-b border-[var(--border-subtle)] pb-8">
                 {weekDays.map((day, i) => (
                    <div key={i} className="text-center group cursor-pointer">
                       <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${day.isToday ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'}`}>{day.dayName}</span>
                       <div className={`mt-3 text-2xl font-display font-medium transition-colors ${day.isToday ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>{day.dayNum}</div>
                    </div>
                 ))}
              </div>

              <div className="relative h-64 mt-8">
                 {/* Hour labels */}
                 <div className="absolute left-0 top-0 bottom-0 w-24 flex flex-col justify-between py-6 text-[11px] font-black text-[var(--text-muted)] uppercase tracking-tighter">
                    <span>8:00 am</span>
                    <span>9:00 am</span>
                    <span>10:00 am</span>
                    <span>11:00 am</span>
                 </div>
                 
              {/* Events */}
                 <div className="ml-24 h-full relative">
                    {/* Dark pill event — Team Sync */}
                    <div className="absolute top-[8%] left-[8%] right-[20%] bg-[#222] p-4 rounded-[24px] shadow-2xl flex items-center gap-4 cursor-pointer hover:bg-[#2a2a2a] transition-all group">
                       <div className="flex -space-x-2 shrink-0">
                          <div className="w-9 h-9 rounded-full border-2 border-[#222] bg-gradient-to-br from-gray-400 to-gray-600 shadow"></div>
                          <div className="w-9 h-9 rounded-full border-2 border-[#222] bg-gradient-to-br from-gray-500 to-gray-700 shadow"></div>
                          <div className="w-9 h-9 rounded-full border-2 border-[#222] bg-gradient-to-br from-gray-300 to-gray-500 shadow"></div>
                       </div>
                       <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-white text-sm font-bold truncate">Weekly Team Sync</span>
                          <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.15em] mt-0.5">Campaign Strategy</span>
                       </div>
                       <ArrowRight size={14} className="text-white/30 group-hover:text-white/70 transition-colors shrink-0" />
                    </div>

                    {/* Light frosted event — Onboarding */}
                    <div className="absolute top-[60%] left-[35%] right-[2%] glass-card p-4 rounded-[24px] border border-[var(--border-subtle)] bg-white/70 backdrop-blur-xl flex items-center gap-4 shadow-lg cursor-pointer hover:bg-white/90 transition-all group">
                       <div className="flex -space-x-2 shrink-0">
                          <div className="w-9 h-9 rounded-full border-2 border-white bg-gradient-to-br from-indigo-300 to-purple-400 shadow"></div>
                          <div className="w-9 h-9 rounded-full border-2 border-white bg-gradient-to-br from-pink-200 to-rose-300 shadow"></div>
                       </div>
                       <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-[var(--text-primary)] text-sm font-bold">Onboarding Session</span>
                          <span className="text-[var(--text-muted)] text-[9px] font-black uppercase tracking-[0.15em] mt-0.5">New hires introduction</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Column: Next Steps & Tasks */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-10">
           
           {/* Status & Quick Actions */}
           <div className="flex flex-col gap-4">
              <div className="glass-card p-6 flex flex-col justify-center relative overflow-hidden rounded-[24px] border border-[var(--border-subtle)] group shadow-lg min-h-[90px]">
                 <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] mb-2">Project Status</span>
                 <div className="flex items-center gap-3 z-10">
                    <div className="w-3 h-3 rounded-full bg-[var(--success)] animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]"></div>
                    <span className="text-3xl font-display font-black text-[var(--text-primary)] tracking-tighter">On Track</span>
                 </div>
                 <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--success)]/5 to-transparent group-hover:from-[var(--success)]/10 transition-all"></div>
              </div>
              
              <button className="h-14 w-full bg-[var(--accent)] text-[var(--text-primary)] rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[var(--accent)]/30 hover:brightness-105 active:scale-[0.98] transition-all">Submit Request</button>
              <button className="h-14 w-full bg-white/80 text-[var(--text-primary)] rounded-full text-[11px] font-black uppercase tracking-[0.2em] border border-[var(--border-subtle)] shadow-md hover:bg-white active:scale-[0.98] transition-all">View Invoice</button>
           </div>

           {/* Pending Actions */}
           <div className="bg-[#1c1c1c] rounded-[32px] p-5 md:p-7 flex flex-col shadow-2xl relative overflow-hidden">
              {/* Header: title + done counter */}
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <span className="text-lg font-display font-semibold text-white leading-tight block">Pending Actions</span>
                    <span className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-0.5 block">
                      {!activeProposal && pendingPayments.length === 0 ? 'All clear 🎉' : `${(activeProposal ? 1 : 0) + pendingPayments.length} require attention`}
                    </span>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-4xl font-display font-light text-white/25 tracking-tighter leading-none">
                      {[!activeProposal, pendingPayments.length === 0, false, false, false].filter(Boolean).length}
                      <span className="text-2xl">/5</span>
                    </span>
                    <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">done</span>
                 </div>
              </div>

              <div className="flex flex-col gap-1">
                 {[
                   { label: 'Approve Proposal', time: activeProposal ? 'Awaiting your review' : 'Up to date', done: !activeProposal, icon: FileText },
                   { label: 'Process Milestone Payment', time: pendingPayments.length > 0 ? `${pendingPayments.length} pending` : 'All paid', done: pendingPayments.length === 0, icon: CreditCard },
                   { label: 'Review Design Mockups', time: `Delivered ${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}`, done: false, icon: ClipboardList },
                   { label: 'Schedule Strategy Call', time: 'Book via calendar', done: false, icon: MessageSquare },
                   { label: 'Sign-off Phase 1', time: 'Pending delivery', done: false, icon: Briefcase },
                 ].map((task, i) => (
                   <div key={i} className="flex items-center gap-4 py-3 px-2 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group/task border-b border-white/5 last:border-0">
                      {/* Icon badge */}
                      <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 transition-all ${
                        task.done ? 'bg-white/[0.06] text-white/25' : 'bg-white/10 text-white/70 group-hover/task:bg-white/15'
                      }`}>
                         <task.icon size={16} />
                      </div>
                      {/* Text */}
                      <div className="flex flex-col flex-1 min-w-0">
                         <span className={`text-[13px] font-semibold leading-tight ${task.done ? 'text-white/30 line-through decoration-white/20' : 'text-white/85'}`}>
                           {task.label}
                         </span>
                         <span className="text-[10px] text-white/25 mt-0.5">{task.time}</span>
                      </div>
                      {/* Checkbox */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                        task.done 
                          ? 'bg-[var(--accent)] shadow-[0_0_12px_rgba(251,193,58,0.4)]' 
                          : 'border-2 border-white/15 group-hover/task:border-white/30'
                      }`}>
                         {task.done && (
                           <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                             <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#1c1c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                           </svg>
                         )}
                      </div>
                   </div>
                 ))}
              </div>
              
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[var(--accent)]/[0.04] rounded-full blur-[80px] pointer-events-none"></div>
           </div>
        </div>

      </div>
    </div>
  );
}

// Simple icons for accordion
function ChevronDownIcon() {
   return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
         <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
   );
}

function ChevronUpIcon() {
   return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
         <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
   );
}

