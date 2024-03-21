import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { appRouter } from "./routes/index.js";
import { createContext } from "./contexts/create-context.js";

createHTTPServer({
  router: appRouter,
  ...(process.env.NODE_ENV === "development"
    ? {
        middleware: cors({
          origin: true,
          credentials: true,
        }),
      }
    : {}),
  createContext,
}).listen(3000);

export type AppRouter = typeof appRouter;
