import { HydrateClient, api } from '@/trpc/server';
import { BookmarksTrashedList } from '@/widgets/bookmark/bookmarks-trashed-list';
import { notFound, redirect } from 'next/navigation';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
type Params = Promise<{ organizationId: string }>;

export default async function Tash(props: { params: Params; searchParams: SearchParams }) {
  const { organizationId } = await props.params;
  const searchParams = await props.searchParams;
  const query = searchParams.query ?? null;
  const tags = searchParams.tags ?? null;

  const workspaces = await api.workspace.list();

  if (workspaces.length === 0) return notFound();
  if (workspaces.find((w) => w.id === organizationId) === undefined)
    return redirect(`/${workspaces.find((w) => w.default)?.id}`);

  await api.bookmark.list.prefetchInfinite({
    query: Array.isArray(query) ? query.join(',') : query,
    tags: typeof tags === 'string' ? [tags] : tags,
    organizationId,
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
