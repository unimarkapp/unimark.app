import { getSession } from '@/shared/auth/sessions';
import { api, HydrateClient } from '@/trpc/server';
import { BookmarkGridSkeleton, BookmarksGrid } from '@/widgets/bookmark/bookmarks-grid';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
type Params = Promise<{ organizationId: string }>;

export default async function HomePage(props: { params: Params; searchParams: SearchParams }) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const { organizationId } = await props.params;
  const searchParams = await props.searchParams;
  const query = searchParams.query ?? null;
  const tags = searchParams.tags ?? null;

  const workspaces = await api.workspace.list();

  if (workspaces.length === 0) return notFound();
  if (workspaces.find((w) => w.id === organizationId) === undefined)
    return redirect(`/${workspaces.find((w) => w.default)?.id}`);

  api.bookmark.list.prefetchInfinite({
    query: Array.isArray(query) ? query.join(',') : query,
    tags: typeof tags === 'string' ? [tags] : tags,
    organizationId,
  });

  return (
    <HydrateClient>
      <Suspense fallback={<BookmarkGridSkeleton />}>
        <BookmarksGrid />
      </Suspense>
    </HydrateClient>
  );
}
