import { bookmarksRouter } from './router/bookmarks';
import { profileRouter } from './router/profile';
import { statsRouter } from './router/stats';
import { tagsRouter } from './router/tags';
import { worksapceRouter } from './router/workspace';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  bookmark: bookmarksRouter,
  profile: profileRouter,
  stat: statsRouter,
  tag: tagsRouter,
  workspace: worksapceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
