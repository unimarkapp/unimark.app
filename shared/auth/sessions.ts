import { authClient } from '@/shared/auth/client';
import { headers } from 'next/headers';
import { cache } from 'react';

export const getSession = cache(async () => {
  return authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });
});
