'use client';

import { Suspense } from 'react';
import { ProposalBuilder } from '@/modules/admin/views/ProposalBuilder';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Builder...</div>}>
      <ProposalBuilder />
    </Suspense>
  );
}
