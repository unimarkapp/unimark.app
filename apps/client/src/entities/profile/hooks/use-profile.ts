import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/entities/profile";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile().then((response) => response.profile),
    staleTime: Infinity,
    retry: false,
  });
}
