import { trpc } from "@/shared/trpc";
import { useQueryClient } from "@tanstack/react-query";

export function useLogout() {
  const queryClient = useQueryClient();
  const utils = trpc.useUtils();

  return trpc.auth.logout.useMutation({
    async onSuccess() {
      await utils.profile.invalidate();
      queryClient.clear();
    },
  });
}
