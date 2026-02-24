'use client';

import { Sidebar } from './Sidebar';
import type { ReactNode } from 'react';

export function DashboardLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
