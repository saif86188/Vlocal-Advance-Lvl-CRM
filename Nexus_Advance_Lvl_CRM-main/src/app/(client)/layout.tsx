'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { ClientStoreProvider } from '@/modules/client/data/store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const routeNames: Record<string, string> = {
    '/client': 'Overview',
    '/client/requirements': 'Requirements',
    '/client/proposals': 'Proposals',
    '/client/projects': 'Projects',
    '/client/payments': 'Payments',
    '/client/support': 'Escalations & Support',
    '/client/campaign-dashboard': 'Campaign Dashboard',
    '/client/campaign-status': 'Campaign Status',
    '/client/campaign-budget': 'Budget & Finance',
    '/client/campaign-analytics': 'Campaign Analytics',
    '/client/campaign-escalation': 'Escalation Matrix',
    '/client/campaign-files': 'Files & Assets',
    '/client/campaign-communication': 'Communication',
    '/client/tasks': 'Tasks',
  };

  const currentName = (pathname && routeNames[pathname]) || 'Dashboard';

  return (
    <div className="dashboard-container">
      <ClientStoreProvider>
        <Header />
        
        <main className="flex-1 mt-[var(--header-height)] p-[var(--content-padding)] relative custom-scrollbar">
          <div className="max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </ClientStoreProvider>
    </div>
  );
}
