import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { authContext } from "./auth-context.js";

export async function createContext(params: CreateHTTPContextOptions) {
  const auth = await authContext(params);

  return {
    ...auth,
    res: params.res,
  };
}

export type AuthContext = Awaited<ReturnType<typeof createContext>>;
