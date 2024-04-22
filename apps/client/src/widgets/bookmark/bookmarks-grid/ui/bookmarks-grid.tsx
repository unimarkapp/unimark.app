import { trpc } from "@/shared/trpc";
import { BookmarkCard } from "@/entities/bookmark";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useCopyToClipboard,
  useIntersectionObserver,
} from "@uidotdev/usehooks";
import { BookmarkModalEdit } from "@/features/bookmark/bookmark-modal-edit";
import { BookmarkModalDelete } from "@/features/bookmark/bookmark-modal-delete";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FetchingIndicator } from "@/shared/ui/fetching-indicator";

export function BookmarksGrid() {
  const [searchParams] = useSearchParams();
  const [selectedBookmarkId, setSelectedBookmarkId] = useState<string>();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [, copyToClipboard] = useCopyToClipboard();
  const [ref, entry] = useIntersectionObserver({
    threshold: 1,
    root: null,
    rootMargin: "0px",
  });

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    isFetchingNextPage,
    isRefetching,
    hasNextPage,
  } = trpc.bookmarks.list.useInfiniteQuery(
    {
      query: searchParams.get("query") ?? undefined,
      tags: searchParams.getAll("tags") ?? undefined,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const openModal = useCallback(
    (name: "edit" | "delete", bookmarkId: string) => {
      setSelectedBookmarkId(bookmarkId);
      switch (name) {
        case "edit":
          setEditModalOpen(true);
          break;
        case "delete":
          setDeleteModalOpen(true);
          break;
        default:
          break;
      }
    },
    []
  );

  const onCopyUrl = useCallback(
    async (url: string) => {
      await copyToClipboard(url);
      toast.success("URL copied to clipboard");
    },
    [copyToClipboard]
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

  const bookmarks = useMemo(
    () => data?.pages.flatMap((page) => page.bookmarks) ?? [],
    [data]
  );

  return (
    <div>
      {error && <div>{error.message}</div>}
      {isLoading && <Loading />}
      {data?.pages[0] && data?.pages[0].bookmarks.length === 0 && <Empty />}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            ref={ref}
            key={bookmark.id}
            id={bookmark.id}
            url={bookmark.url}
            title={bookmark.title}
            description={bookmark.description}
            cover={bookmark.cover}
            favicon={bookmark.favicon}
            openModal={openModal}
            tags={bookmark.tags}
            onCopyUrl={onCopyUrl}
          />
        ))}
      </ul>
      {!hasNextPage && bookmarks.length > 16 ? (
        <p className="flex justify-center py-4 items-center text-sm text-muted-foreground gap-1.5">
          You reached the end of the list
        </p>
      ) : null}
      <FetchingIndicator
        isFetchingNextPage={isFetchingNextPage}
        isRefetching={isRefetching}
      />
      <BookmarkModalEdit
        bookmarkId={selectedBookmarkId}
        open={editModalOpen}
        onCloseModal={() => setEditModalOpen(false)}
      />
      <BookmarkModalDelete
        bookmarkId={selectedBookmarkId}
        open={deleteModalOpen}
        onCloseModal={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}

function Loading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          className="[aspect-ratio:1.1/1] bg-muted animate-pulse rounded-lg"
          key={i}
        ></div>
      ))}
    </div>
  );
}

function Empty() {
  return (
    <div className="">
      <h2 className="text-lg font-medium">There is no bookmarks yet</h2>
      <p className="text-muted-foreground">Added bookmarks apper here.</p>
    </div>
  );
}
