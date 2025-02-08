import { headers } from 'next/headers';
import { cache } from 'react';
import { auth } from './server';

export const getSession = async () =>
  cache(auth.api.getSession)({
    headers: await headers(),
  });
