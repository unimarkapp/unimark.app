import { HydrateClient, api } from '@/trpc/server';
import { BookmarksTrashedList } from '@/widgets/bookmark/bookmarks-trashed-list';

export default async function Tash({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; tags?: string }>;
}) {
  const { query = null, tags = null } = await searchParams;

  await api.bookmark.list.prefetchInfinite({
    query,
    tags: tags?.split(',') ?? null,
    deleted: true,
  });

  return (
    <div className="space-y-8">
      <HydrateClient>
        <BookmarksTrashedList />
      </HydrateClient>
    </div>
  );
}
