import { getSession } from '@/shared/auth/sessions';
import { api, HydrateClient } from '@/trpc/server';
import { BookmarkGridSkeleton, BookmarksGrid } from '@/widgets/bookmark/bookmarks-grid';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function HomePage(props: { searchParams: SearchParams }) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const searchParams = await props.searchParams;
  const query = searchParams.query ?? null;
  const tags = searchParams.tags ?? null;

  api.bookmark.list.prefetchInfinite({
    query: Array.isArray(query) ? query.join(',') : query,
    tags: typeof tags === 'string' ? [tags] : tags,
  });

  return (
    <HydrateClient>
      <Suspense fallback={<BookmarkGridSkeleton />}>
        <BookmarksGrid />
      </Suspense>
    </HydrateClient>
  );
}
