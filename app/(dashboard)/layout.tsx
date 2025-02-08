import type { ReactNode } from 'react';
import { Header } from '@/features/header';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <div className="space-y-8 p-4 md:p-8">{children}</div>
    </div>
  );
}
