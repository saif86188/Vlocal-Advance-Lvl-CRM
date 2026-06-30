'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { AdminStoreProvider } from '@/modules/admin/data/store';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const routeNames: Record<string, string> = {
    '/admin': 'Admin Overview',
    '/admin/clients': 'Client Accounts',
    '/admin/projects': 'Projects',
    '/admin/proposals': 'All Proposals',
    '/admin/payments': 'Payments & Invoices',
    '/admin/support': 'Escalations',
    '/admin/requirements': 'Requirements',
    '/admin/team': 'Team Members',
    '/admin/campaigns': 'Campaign Management',
    '/admin/reports': 'SIAF Reports & Metrics',
    '/admin/field-activity': 'Field Activity Map',
    '/admin/discussions': 'Discussion Rooms',
    '/admin/builder': 'Proposal Builder',
    '/admin/users': 'Super User Management',
    '/admin/tasks': 'Task Management',
  };

  const currentName = (pathname && routeNames[pathname]) || 'Admin Panel';

  return (
    <div className="dashboard-container admin-theme" style={{ '--accent': '#FBC13A', '--accent-foreground': '#1a1a1a' } as React.CSSProperties}>
      <AdminStoreProvider>
        <Header title={currentName} />
        
        <main className="flex-1 mt-[var(--header-height)] p-[var(--content-padding)] relative custom-scrollbar">
          <div className="max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </AdminStoreProvider>
    </div>
  );
}
