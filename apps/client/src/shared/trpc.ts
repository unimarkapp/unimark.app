import type { AppRouter } from "@unimark/server/src";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
