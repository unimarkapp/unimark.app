import { bookmarksRouter } from './router/bookmarks';
import { profileRouter } from './router/profile';
import { statsRouter } from './router/stats';
import { tagsRouter } from './router/tags';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  bookmark: bookmarksRouter,
  profile: profileRouter,
  stat: statsRouter,
  tag: tagsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
