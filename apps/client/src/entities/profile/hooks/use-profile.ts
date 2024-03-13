import { trpc } from "@/shared/trpc";

export function useProfile() {
  return trpc.profile.get.useQuery(undefined, {
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  });
}
