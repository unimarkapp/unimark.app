import { auth } from '@/shared/auth/server';
import { toNextJsHandler } from 'better-auth/next-js';

export const config = { api: { bodyParser: false } };

export const { GET, POST } = toNextJsHandler(auth.handler);
