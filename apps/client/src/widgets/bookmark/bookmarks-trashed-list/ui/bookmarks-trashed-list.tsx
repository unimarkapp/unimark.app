import { trpc } from "@/shared/trpc";
import { Button } from "@/shared/ui/button";
import { ArchiveRestore, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ListItem } from "./list-item";
import { toast } from "sonner";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { FetchingIndicator } from "@/shared/ui/fetching-indicator";

export function BookmarksTrashedList() {
  const utils = trpc.useUtils();
  const [searchParams] = useSearchParams();

  const [ref, entry] = useIntersectionObserver({
    threshold: 1,
    root: null,
    rootMargin: "0px",
  });

  const {
    data,
    isLoading,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isRefetching,
    hasNextPage,
  } = trpc.bookmarks.list.useInfiniteQuery(
    {
      query: searchParams.get("query") ?? undefined,
      tags: searchParams.getAll("tags") ?? undefined,
      deleted: true,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const deleteForeverMutation = trpc.bookmarks.deleteForever.useMutation({
    async onSuccess() {
      await onMutationSucces();
      toast.success("Bookmarks deleted forever");
    },
  });

  const emptyTrashMutation = trpc.bookmarks.emptyTrash.useMutation({
    async onSuccess() {
      await onMutationSucces();
      toast.success("Trash is empty");
    },
  });

  const restoreMutation = trpc.bookmarks.restore.useMutation({
    async onSuccess() {
      await onMutationSucces();
      toast.success("Bookmarks restored");
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
    await utils.bookmarks.list.invalidate({
      query: searchParams.get("query") ?? undefined,
      tags: searchParams.getAll("tags") ?? undefined,
      deleted: true,
    });
    await utils.stats.all.invalidate();
    setSelected(new Set());
  }

  const bookmarks = useMemo(
    () => data?.pages.flatMap((page) => page.bookmarks) ?? [],
    [data]
  );

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
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
        <h2 className="space-x-2 font-medium text-muted-foreground text-sm">
          Bookmarks in trash will be deleted forever after 30 days
        </h2>
        {selected.size > 0 ? (
          <div className="flex items-center gap-2">
            <div className="font-medium text-sm">
              Selected ({selected.size})
            </div>
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
                  <ArchiveRestore className="w-4 h-4 mr-1" />
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
                  <Trash2 className="w-4 h-4 mr-1" />
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
                  <Trash2 className="w-4 h-4 mr-1" />
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
        <p className="flex justify-center items-center text-sm text-muted-foreground gap-1.5">
          You reached the end of the list
        </p>
      ) : null}
      <FetchingIndicator
        isFetchingNextPage={isFetchingNextPage}
        isRefetching={isRefetching}
      />
    </div>
  );
}

function Loading() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div className="h-28 bg-muted animate-pulse rounded-lg" key={i}></div>
      ))}
    </div>
  );
}

function Empty() {
  return (
    <div className="">
      <h2 className="text-lg font-medium">Your trash is empty.</h2>
      <p className="text-muted-foreground">
        Move bookmarks you don't need to trash.
      </p>
    </div>
  );
}
