import React from 'react';
import { CampaignStatus } from '@/components/shared/dashboard/CampaignStatus';
import { FileManagement } from '@/components/shared/dashboard/FileManagement';
import { DashboardOverview } from '@/components/shared/dashboard/DashboardOverview';
import { Communication } from '@/components/shared/dashboard/Communication';
import { BudgetTracking } from '@/components/shared/dashboard/BudgetTracking';
import { Analytics } from '@/components/shared/dashboard/Analytics';

function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1">
      {children}
    </div>
  );
}

export function CampaignStatusPage() {
  return (
    <WorkspaceLayout>
      <CampaignStatus />
    </WorkspaceLayout>
  );
}

export function CampaignFilesPage() {
  return (
    <WorkspaceLayout>
      <FileManagement />
    </WorkspaceLayout>
  );
}


export function CampaignDashboardPage() {
  return (
    <WorkspaceLayout>
      <DashboardOverview />
    </WorkspaceLayout>
  );
}

export function CampaignCommunicationPage() {
  return (
    <WorkspaceLayout>
      <Communication />
    </WorkspaceLayout>
  );
}

export function CampaignBudgetPage() {
  return (
    <WorkspaceLayout>
      <BudgetTracking />
    </WorkspaceLayout>
  );
}

export function CampaignAnalyticsPage() {
  return (
    <WorkspaceLayout>
      <Analytics />
    </WorkspaceLayout>
  );
}

