import { useState } from 'react';
import { NavLink } from 'react-router';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  CreditCard, 
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  TrendingUp,
  Wallet,
  BarChart3,
  AlertCircle,
  FolderOpen
} from 'lucide-react';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const navGroups = [
    {
      label: 'MAIN',
      items: [
        { label: 'Overview', icon: LayoutDashboard, to: '/' },
        { label: 'Requirements', icon: ClipboardList, to: '/requirements' },
        { label: 'Proposals', icon: FileText, to: '/proposals' },
        { label: 'Projects', icon: Briefcase, to: '/projects' },
      ]
    },
    {
      label: 'CAMPAIGN HUB',
      items: [
        { label: 'Campaign Dashboard', icon: LayoutDashboard, to: '/campaign-dashboard' },
        { label: 'Campaign Status', icon: TrendingUp, to: '/campaign-status' },
        { label: 'Budget & Finance', icon: Wallet, to: '/campaign-budget' },
        { label: 'Analytics', icon: BarChart3, to: '/campaign-analytics' },
        { label: 'Escalation Matrix', icon: AlertCircle, to: '/campaign-escalation' },
        { label: 'Files & Assets', icon: FolderOpen, to: '/campaign-files' },
        { label: 'Communication', icon: MessageSquare, to: '/campaign-communication' },
      ]
    },
    {
      label: 'BILLING',
      items: [
        { label: 'Payments', icon: CreditCard, to: '/payments' },
      ]
    },
    {
      label: 'SUPPORT',
      items: [
        { label: 'Escalations', icon: MessageSquare, to: '/support' },
      ]
    }
  ];

  return (
    <div 
      className="fixed left-0 top-0 bottom-0 bg-[var(--sidebar-bg)] border-r border-[var(--border-subtle)] flex flex-col transition-all duration-300 z-50 overflow-hidden shadow-xl"
      style={{ width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)' }}
    >
      {/* Header */}
      <div className="h-[var(--header-height)] flex items-center justify-between px-6 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--accent)] to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">S</div>
            <div className="font-display font-bold text-[18px] text-white tracking-tight">SIAF <span className="text-[var(--accent)]">CLIENT</span></div>
          </div>
        )}
        {collapsed && <div className="w-full flex justify-center"><div className="w-8 h-8 bg-gradient-to-br from-[var(--accent)] to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">S</div></div>}
        
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="text-white/40 hover:text-white transition-colors absolute right-[-12px] top-[24px] bg-[var(--sidebar-bg)] border border-white/10 rounded-full p-1 shadow-lg z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* Identity Block */}
      <div className="px-4 my-6">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} p-2 rounded-xl bg-white/5 border border-white/5`}>
          <div className="w-9 h-9 rounded-full bg-[var(--accent)] border-2 border-white/10 flex items-center justify-center shrink-0 shadow-inner">
            <span className="text-white font-bold text-xs">SJ</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-[var(--text-sm)] font-semibold text-white leading-tight truncate">Sarah Jenkins</span>
              <span className="text-[11px] text-[var(--sidebar-text)] font-medium leading-tight">Client • Apex Corp</span>
            </div>
          )}
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            {!collapsed && (
              <div className="px-3 mb-2">
                <span className="text-[10px] font-bold text-white/30 tracking-[0.1em] uppercase">{group.label}</span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `
                    h-[40px] flex items-center px-3 rounded-xl transition-all group relative
                    ${isActive 
                      ? 'bg-[var(--accent)] text-white shadow-lg shadow-blue-900/20 font-semibold' 
                      : 'text-[var(--sidebar-text)] hover:bg-white/5 hover:text-white'}
                  `}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={18} className="shrink-0" />
                  {!collapsed && <span className="ml-3 text-[var(--text-sm)] whitespace-nowrap">{item.label}</span>}
                  {collapsed && (
                     <div className="absolute left-[calc(100%+16px)] bg-[var(--sidebar-bg)] text-white text-[12px] px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity border border-white/10 whitespace-nowrap shadow-xl">
                       {item.label}
                     </div>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Settings */}
      <div className="p-3 mt-auto border-t border-white/10 bg-black/10">
        <div className="flex flex-col gap-1">
          <button className="h-[40px] flex items-center px-3 rounded-xl text-[var(--sidebar-text)] hover:bg-white/5 hover:text-white transition-all group relative">
            <Settings size={18} className="shrink-0" />
            {!collapsed && <span className="ml-3 text-[var(--text-sm)] font-medium">Settings</span>}
          </button>
          <button className="h-[40px] flex items-center px-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all group relative">
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span className="ml-3 text-[var(--text-sm)] font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
