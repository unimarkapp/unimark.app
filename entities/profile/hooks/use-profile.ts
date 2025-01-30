import { api } from '@/trpc/react';

export function useProfile() {
  return api.profile.get.useQuery(undefined, {
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  });
}
