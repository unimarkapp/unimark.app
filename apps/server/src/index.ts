import 'dotenv/config';
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { appRouter } from "./routes/index.js";
import { createContext } from "./contexts/create-context.js";
import { emptyTrashJob } from "./crons/empty-trash.js";

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

emptyTrashJob.start();

export type AppRouter = typeof appRouter;
