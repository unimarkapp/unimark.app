import { Routing } from "@/pages";
import { BrowserRouter } from "react-router-dom";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { trpc } from "@/shared/trpc";
import { TRPCClientError, httpBatchLink } from "@trpc/client";
import { AppRouter } from "../../../server/src";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { toast } from "sonner";
import { Toaster } from "@/shared/ui/sonner";

export default function App() {
  const queryClient = new QueryClient({
    mutationCache: new MutationCache({
      onError: (cause) => {
        const { message } = cause as TRPCClientError<AppRouter>;
        toast.error(message || "Something went wrong.");
      },
    }),
  });
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: "http://localhost:3000",
        fetch: (input, init) =>
          fetch(input, { ...init, credentials: "include" }),
      }),
    ],
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routing />
          <Toaster position="top-center" />
          <ReactQueryDevtools client={queryClient} />
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
