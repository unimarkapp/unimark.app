'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { TRPCReactProvider } from '@/trpc/react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <TRPCReactProvider>
        <NuqsAdapter>{children}</NuqsAdapter>
      </TRPCReactProvider>
    </ThemeProvider>
  );
}
