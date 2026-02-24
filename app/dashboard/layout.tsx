import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { DashboardLayoutWrapper } from '@/components/layout/DashboardLayout';
import type { ReactNode } from 'react';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <DashboardLayoutWrapper>
      {children}
    </DashboardLayoutWrapper>
  );
}
