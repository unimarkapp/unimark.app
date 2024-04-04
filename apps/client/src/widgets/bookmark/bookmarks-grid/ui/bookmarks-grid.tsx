import { trpc } from "@/shared/trpc";
import { BookmarkCard } from "@/entities/bookmark";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { BookmarkModalEdit } from "@/features/bookmark/bookmark-modal-edit";
import { BookmarkModalDelete } from "@/features/bookmark/bookmark-modal-delete";
import { useCallback, useState } from "react";

export function BookmarksGrid({ collectionId }: { collectionId?: string }) {
  const [searchParams] = useSearchParams();
  const [selectedBookmarkId, setSelectedBookmarkId] = useState<string>();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [, copyToClipboard] = useCopyToClipboard();

  const { data, isLoading, isError, error } = trpc.bookmarks.list.useQuery({
    collectionId,
    query: searchParams.get("query") ?? undefined,
    tags: searchParams.getAll("tags") ?? undefined,
  });

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

  return (
    <div>
      {isError && <div>{error.message}</div>}
      {isLoading && <Loading />}
      {data?.length === 0 && <Empty />}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {data?.map((bookmark) => (
          <BookmarkCard
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
    <div className="grid grid-cols-4 gap-4">
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
      <p className="text-muted-foreground">
        Added bookmark to this collection apper here.
      </p>
    </div>
  );
}
