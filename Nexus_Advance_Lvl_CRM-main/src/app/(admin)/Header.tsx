'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, Briefcase, FileText, IndianRupee,
  Settings, ClipboardList, TrendingUp, BarChart3, MessageSquare, 
  ChevronDown, Bell, ShieldCheck, Database, Hammer,
  Megaphone, MapPin, CreditCard, MessagesSquare, Building2, FileCheck, Menu, X
} from 'lucide-react';
import { toast } from 'sonner';
import { useAdminStore } from '@/modules/admin/data/store';

const navGroups = [
  {
    label: 'Main',
    items: [
      { label: 'Overview', icon: LayoutDashboard, to: '/admin' },
      { label: 'Requirements', icon: ClipboardList, to: '/admin/requirements' },
      { label: 'Proposals', icon: FileCheck, to: '/admin/proposals' },
      { label: 'Projects', icon: Briefcase, to: '/admin/projects' },
      { label: 'Tasks', icon: ClipboardList, to: '/admin/tasks' },
    ]
  },
  {
    label: 'Operations',
    items: [
      { label: 'Campaigns', icon: Megaphone, to: '/admin/campaigns' },
      { label: 'Field Activity', icon: MapPin, to: '/admin/field-activity' },
      { label: 'Reports', icon: BarChart3, to: '/admin/reports' },
      { label: 'User Management', icon: Settings, to: '/admin/users' },
    ]
  },
  {
    label: 'Billing',
    items: [
      { label: 'Payments & Invoices', icon: CreditCard, to: '/admin/payments' },
    ]
  },
  {
    label: 'Workspace',
    items: [
      { label: 'Escalations', icon: MessageSquare, to: '/admin/support' },
      { label: 'Discussion Rooms', icon: MessagesSquare, to: '/admin/discussions' },
      { label: 'Team Members', icon: Users, to: '/admin/team' },
      { label: 'Client Accounts', icon: Building2, to: '/admin/clients' },
    ]
  }
];

export function Header({ title }: { title: string }) {
  const { state, dispatch } = useAdminStore();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll direction detection for floating header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowSticky(false);
      } else {
        setShowSticky(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[1000] h-[var(--header-height)] transition-all duration-300 flex items-center justify-between px-4 md:px-8 shrink-0 select-none backdrop-blur-xl ${
        showSticky || isMobileMenuOpen ? 'translate-y-0 bg-white/90 border-b border-neutral-200/50 shadow-sm' : '-translate-y-full bg-transparent'
      }`}>
        {/* Left: Brand/Logo Pill */}
        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            className="border-2 border-neutral-900 bg-neutral-900 hover:bg-black rounded-full px-4 md:px-6 py-2 flex items-center justify-center transition-all duration-200 shadow-xl hover:scale-[1.02]"
          >
            <span className="font-display font-black text-lg md:text-xl tracking-tighter text-white">Vlocal<span className="text-[var(--accent)] font-bold">Core</span></span>
          </Link>
        </div>

        {/* Center: Navigation Pill (Desktop Only) */}
        <nav className="hidden lg:flex items-center bg-white/80 backdrop-blur-md border border-neutral-200/60 shadow-sm rounded-full p-1.5 gap-1">
          {navGroups.map((group, idx) => {
            const isGroupActive = group.items.some((item) => pathname === item.to);
            return (
              <div key={idx} className="relative group">
                <button 
                  className={`flex items-center gap-1 px-4 py-1.5 text-[14px] font-medium rounded-full transition-all duration-200 cursor-pointer ${
                    isGroupActive 
                      ? 'bg-neutral-900 text-white font-semibold shadow-sm' 
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/40'
                  }`}
                >
                  {group.label} 
                  <ChevronDown 
                    size={12} 
                    className={`opacity-60 transition-transform duration-200 group-hover:rotate-180 ${
                      isGroupActive ? 'text-white' : 'text-neutral-500'
                    }`} 
                  />
                </button>
                
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-[9999]">
                  <div className="bg-white/95 backdrop-blur-md border border-neutral-200/60 shadow-xl rounded-2xl p-1.5 flex flex-col gap-0.5">
                    {group.items.map((item) => {
                      const isActive = pathname === item.to;
                      return (
                        <Link
                          key={item.to}
                          href={item.to}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                            isActive 
                              ? 'bg-[var(--accent)] text-neutral-900 font-semibold shadow-sm' 
                              : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                          }`}
                        >
                          <item.icon size={15} className="opacity-80" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Settings Pill (Hidden on Mobile) */}
          <Link 
            href="/admin/settings"
            className="hidden sm:flex items-center gap-1.5 bg-neutral-900 hover:bg-black border border-neutral-800 shadow-xl rounded-full px-4 py-2 text-[13px] font-semibold text-white transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          >
            <Settings size={14} className="text-white/70" />
            <span className="hidden md:inline">Core Settings</span>
          </Link>

          {/* Notification Dropdown */}
          <div className="relative group/notif">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white border border-neutral-200/60 shadow-sm rounded-full text-neutral-700 transition-all duration-200 hover:shadow hover:scale-[1.02] relative cursor-pointer group"
            >
              <Bell size={15} className="group-hover:rotate-12 transition-transform" />
              {state.notifications.filter((n: any) => !n.read).length > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
              )}
            </button>

            {/* Advanced Dropdown */}
            <div className={`absolute top-full right-0 -mr-12 sm:mr-0 pt-3 w-[300px] sm:w-[360px] transition-all duration-300 z-[9999] ${
              isNotifOpen 
                ? 'opacity-100 visible translate-y-0' 
                : 'opacity-0 invisible translate-y-4 group-hover/notif:opacity-100 group-hover/notif:visible group-hover/notif:translate-y-0'
            }`}>
              <div className="bg-white/95 backdrop-blur-3xl border border-neutral-200/60 shadow-2xl rounded-[32px] p-2 overflow-hidden">
                <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
                  <h4 className="text-[13px] font-black uppercase tracking-widest text-neutral-900">Intelligence Alerts</h4>
                  <button 
                    onClick={() => { dispatch({ type: 'MARK_ALL_READ' }); setIsNotifOpen(false); }}
                    className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="max-h-[400px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                  {state.notifications.length > 0 ? (
                    state.notifications.slice(0, 5).map((notif: any) => (
                      <div 
                        key={notif.id}
                        onClick={() => { dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notif.id }); setIsNotifOpen(false); }}
                        className={`p-4 rounded-2xl transition-all duration-300 cursor-pointer group/item flex gap-4 ${notif.read ? 'opacity-60 grayscale-[0.5]' : 'bg-neutral-50/80 hover:bg-white hover:shadow-xl hover:scale-[1.02]'}`}
                      >
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                           notif.type === 'system' ? 'bg-blue-500/10 text-blue-500' :
                           notif.type === 'security' ? 'bg-rose-500/10 text-rose-500' :
                           notif.type === 'payment' ? 'bg-emerald-500/10 text-emerald-500' :
                           'bg-amber-500/10 text-amber-500'
                         }`}>
                            <ShieldCheck size={18} />
                         </div>
                         <div className="flex-1 space-y-1 min-w-0">
                            <h5 className="text-[12px] font-black text-neutral-900 truncate tracking-tight">{notif.title}</h5>
                            <p className="text-[11px] font-medium text-neutral-500 line-clamp-2 leading-snug">{notif.message}</p>
                            <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 block mt-1">{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center space-y-2">
                       <Bell size={24} className="mx-auto text-neutral-200" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">No active alerts</p>
                    </div>
                  )}
                </div>

                <Link 
                  href="/admin/notifications"
                  onClick={() => setIsNotifOpen(false)}
                  className="block w-full py-4 bg-neutral-900 text-white text-center rounded-[24px] text-[10px] font-black uppercase tracking-[0.3em] mt-2 shadow-xl hover:bg-black transition-all"
                >
                  View All Intelligence
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 flex lg:hidden items-center justify-center bg-white/80 hover:bg-white border border-neutral-200/60 shadow-sm rounded-full text-neutral-700 transition-all duration-200 hover:shadow hover:scale-[1.02] cursor-pointer"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Profile Circle */}
          <Link 
            href="/admin/profile"
            className="w-10 h-10 rounded-full border border-neutral-900 bg-neutral-900 shadow-xl flex items-center justify-center text-xs font-bold text-white font-display transition-transform duration-200 hover:scale-105 cursor-pointer select-none"
          >
            AD
          </Link>
        </div>
      </header>

      {/* Mobile Navigation Dropdown (Matches Screenshot UI) */}
      <div 
        className={`fixed inset-x-0 bottom-0 top-[var(--header-height)] z-[999] lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsMobileMenuOpen(false)} />
        
        <div className={`absolute right-0 top-0 bottom-0 w-[85%] sm:w-[380px] bg-neutral-900 rounded-tl-[32px] sm:rounded-l-[32px] shadow-2xl border-l border-t border-white/10 transition-all duration-300 flex flex-col overflow-hidden ${
          isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}>
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {navGroups.map((group, idx) => (
              <div key={idx} className="space-y-3">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest px-2">{group.label}</p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.to;
                    return (
                      <Link
                        key={item.to}
                        href={item.to}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[14px] font-medium transition-all duration-200 ${
                          isActive 
                            ? 'bg-[var(--accent)] text-neutral-900 shadow-sm font-bold' 
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <item.icon size={18} />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-6 border-t border-white/5 bg-black/20 shrink-0">
            <button className="w-full py-4 rounded-2xl bg-[var(--accent)] hover:bg-[#e0a92b] text-neutral-900 font-bold text-xs uppercase tracking-widest shadow-md transition-all active:scale-95 cursor-pointer">
              Lock Console
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
