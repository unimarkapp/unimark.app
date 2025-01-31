'use client';

import type { QueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink, httpLink, isNonJsonSerializable, splitLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import SuperJSON from 'superjson';

import type { AppRouter } from './index';

import { createQueryClient } from './query-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient();
  } else {
    // Browser: use singleton pattern to keep the same query client
    return (clientQueryClientSingleton ??= createQueryClient());
  }
};

export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        splitLink({
          condition: (op) => isNonJsonSerializable(op.input),
          // @ts-expect-error - (?)
          true: httpLink({
            // transformer: SuperJSON,
            url: getBaseUrl() + '/api/trpc',
            headers() {
              const headers = new Headers();
              headers.set('x-trpc-source', 'nextjs-react');
              return headers;
            },
          }),
          false: httpBatchLink({
            transformer: SuperJSON,
            url: getBaseUrl() + '/api/trpc',
            headers() {
              const headers = new Headers();
              headers.set('x-trpc-source', 'nextjs-react');
              return headers;
            },
          }),
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
        <ReactQueryDevtools client={queryClient} />
      </api.Provider>
    </QueryClientProvider>
  );
}

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return window.location.origin;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};
