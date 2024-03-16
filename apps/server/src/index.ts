import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { appRouter } from "./routes/index.js";
import { createContext } from "./contexts/create-context.js";

createHTTPServer({
  router: appRouter,
  middleware: cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      "http://localhost",
    ],
    credentials: true,
  }),
  createContext,
}).listen(3000);

export type AppRouter = typeof appRouter;
