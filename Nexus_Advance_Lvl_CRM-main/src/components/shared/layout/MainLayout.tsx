import { Outlet, useLocation } from 'react-router';
import { Sidebar } from './Sidebar';
import { Bell } from 'lucide-react';

export function MainLayout() {
  const location = useLocation();
  
  // simple breadcrumb mapping
  const routeNames: Record<string, string> = {
    '/': 'Overview',
    '/requirements': 'Requirements',
    '/proposals': 'Proposals',
    '/projects': 'Projects',
    '/payments': 'Payments',
    '/support': 'Escalations & Support',
    '/campaign-dashboard': 'Campaign Dashboard',
    '/campaign-status': 'Campaign Status',
    '/campaign-budget': 'Budget & Finance',
    '/campaign-analytics': 'Campaign Analytics',
    '/campaign-escalation': 'Escalation Matrix',
    '/campaign-files': 'Files & Assets',
    '/campaign-communication': 'Communication',
  };

  const currentName = routeNames[location.pathname] || 'Dashboard';

  return (
    <div className="min-h-[100dvh] bg-[var(--bg-base)] text-[var(--text-primary)] flex overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 ml-[var(--sidebar-width)] transition-all duration-300">
        
        <header className="h-[var(--header-height)] flex items-center justify-between px-6 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)] text-[var(--text-sm)] font-medium">Dashboard</span>
            <span className="text-[var(--text-muted)] text-[var(--text-sm)]">/</span>
            <span className="text-[var(--text-primary)] text-[var(--text-sm)] font-semibold">{currentName}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--bg-subtle)] rounded-full transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--accent)] rounded-full border-2 border-[var(--bg-surface)]"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-[var(--content-padding)] overflow-y-auto relative custom-scrollbar">
          <div className="max-w-[1400px] mx-auto w-full animate-in fade-in duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
