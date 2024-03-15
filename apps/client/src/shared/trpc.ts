import type { AppRouter } from "@bookmark/server/src";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
