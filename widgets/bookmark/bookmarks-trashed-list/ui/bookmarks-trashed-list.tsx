'use client';

import { api } from '@/trpc/react';
import { Button } from '@/shared/ui/button';
import { ArchiveRestore, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs';
import { ListItem } from './list-item';
import { toast } from 'sonner';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import { FetchingIndicator } from '@/shared/ui/fetching-indicator';
import { useParams } from 'next/navigation';

export function BookmarksTrashedList() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const utils = api.useUtils();
  const [searchParams] = useQueryStates({
    query: parseAsString,
    tags: parseAsArrayOf(parseAsString),
  });

  const [ref, entry] = useIntersectionObserver({
    threshold: 1,
    root: null,
    rootMargin: '0px',
  });

  const [data, bookmarksQuery] = api.bookmark.list.useSuspenseInfiniteQuery(
    {
      query: searchParams.query,
      tags: searchParams.tags,
      deleted: true,
      organizationId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const { isLoading, error, isFetchingNextPage, fetchNextPage, isRefetching, hasNextPage } =
    bookmarksQuery;

  const deleteForeverMutation = api.bookmark.deleteForever.useMutation({
    async onSuccess() {
      await onMutationSucces();
      toast.success('Bookmarks deleted forever');
    },
  });

  const emptyTrashMutation = api.bookmark.emptyTrash.useMutation({
    async onSuccess() {
      await onMutationSucces();
      toast.success('Trash is empty');
    },
  });

  const restoreMutation = api.bookmark.restore.useMutation({
    async onSuccess() {
      await onMutationSucces();
      toast.success('Bookmarks restored');
    },
  });

  const [selected, setSelected] = useState(new Set<string>());

  function deleteSelected() {
    deleteForeverMutation.mutate(Array.from(selected));
  }

  function emptyTrash() {
    emptyTrashMutation.mutate();
  }

  function restore() {
    restoreMutation.mutate(Array.from(selected));
  }

  async function onMutationSucces() {
    await utils.bookmark.list.invalidate({
      query: searchParams.query,
      tags: searchParams.tags,
      deleted: true,
    });
    setSelected(new Set());
  }

  const bookmarks = useMemo(() => data?.pages.flatMap((page) => page.bookmarks) ?? [], [data]);

  useEffect(() => {
    if (
      entry?.isIntersecting &&
      data?.pages.length &&
      data?.pages[data.pages.length - 1].nextCursor
    )
      fetchNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (data?.pages[0] && data?.pages[0].bookmarks.length === 0) {
    return <Empty />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="space-x-2 text-sm font-semibold text-muted-foreground">
          Bookmarks in trash will be deleted forever after 30 days
        </h2>
        {selected.size > 0 ? (
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold">Selected ({selected.size})</div>
            <Button
              onClick={() => restore()}
              variant="outline"
              disabled={restoreMutation.isPending}
              size="sm"
            >
              {restoreMutation.isPending ? (
                <span>Restoring...</span>
              ) : (
                <>
                  <ArchiveRestore className="mr-1 h-4 w-4" />
                  Restore
                </>
              )}
            </Button>
            <Button
              onClick={() => deleteSelected()}
              variant="destructive"
              disabled={deleteForeverMutation.isPending}
              size="sm"
            >
              {deleteForeverMutation.isPending ? (
                <span>Deleting...</span>
              ) : (
                <>
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete forever
                </>
              )}
            </Button>
          </div>
        ) : (
          <div>
            <Button
              onClick={() => emptyTrash()}
              variant="destructive"
              size="sm"
              disabled={emptyTrashMutation.isPending}
            >
              {emptyTrashMutation.isPending ? (
                <span>Emptying...</span>
              ) : (
                <>
                  <Trash2 className="mr-1 h-4 w-4" />
                  Empty trash
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      <ul className="space-y-2">
        {bookmarks?.map((bookmark) => (
          <ListItem
            ref={ref}
            id={bookmark.id}
            cover={bookmark.cover}
            title={bookmark.title}
            url={bookmark.url}
            key={bookmark.id}
            deletedAt={bookmark.deletedAt}
            selected={selected.has(bookmark.id)}
            onCheckedChange={(checked) => {
              setSelected((prev) => {
                if (checked) {
                  return new Set([...prev, bookmark.id]);
                }

                prev.delete(bookmark.id);
                return new Set(prev);
              });
            }}
            isRestoring={restoreMutation.isPending}
            isDeleting={deleteForeverMutation.isPending}
            onDelete={() => {
              deleteForeverMutation.mutate([bookmark.id]);
            }}
            onRestore={() => {
              restoreMutation.mutate([bookmark.id]);
            }}
          />
        ))}
      </ul>
      {!hasNextPage && bookmarks.length > 16 ? (
        <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          You reached the end of the list
        </p>
      ) : null}
      <FetchingIndicator isFetchingNextPage={isFetchingNextPage} isRefetching={isRefetching} />
    </div>
  );
}

function Loading() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 16 }).map((_, i) => (
        <div className="h-28 animate-pulse rounded-lg bg-muted" key={i}></div>
      ))}
    </div>
  );
}

function Empty() {
  return (
    <div className="">
      <h2 className="text-lg font-semibold">Your trash is empty.</h2>
      <p className="text-muted-foreground">Move bookmarks you don&apos;t need to trash.</p>
    </div>
  );
}
