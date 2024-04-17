import cron from "node-cron";
import { db } from "../db/index.js";
import { bookmarks } from "@/db/schema.js";
import { lt } from "drizzle-orm";

// Run every hour
export const emptyTrashJob = cron.schedule("0 */1 * * *", async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  await db.delete(bookmarks).where(lt(bookmarks.deletedAt, thirtyDaysAgo));
});
