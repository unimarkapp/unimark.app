import cron from 'node-cron';
import { db } from '@/database';
import { bookmark } from '@/database/schema';
import { lt } from 'drizzle-orm';

// Run every hour
export const emptyTrashJob = cron.schedule('0 */1 * * *', async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  await db.delete(bookmark).where(lt(bookmark.deletedAt, thirtyDaysAgo));
});
