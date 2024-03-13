import { trpc } from "@/shared/trpc";
import { BookmarkCard } from "@/entities/bookmark";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { UpdateBookmarkModal } from "@/features/bookmark/update-bookmark-modal";
import { DeleteBookmarkModal } from "@/features/bookmark/delete-bookmark-modal";

export function BookmarksGrid({ collectionId }: { collectionId?: string }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [_, copyToClipboard] = useCopyToClipboard();

  const { data, isLoading, isError, error } = trpc.bookmarks.list.useQuery({
    collectionId,
  });

  function openModal(name: "edit" | "delete", bookmarkId: string) {
    setSearchParams((prev) => {
      if (prev.get("modal") === name) {
        prev.delete("modal");
        prev.delete("bookmarkId");
      } else {
        prev.set("modal", name);
        prev.set("bookmarkId", bookmarkId);
      }
      return prev;
    });
  }

  function closeModal() {
    setSearchParams((prev) => {
      prev.delete("modal");
      prev.delete("bookmarkId");
      return prev;
    });
  }

  return (
    <div>
      {isError && <div>{error.data?.code}</div>}
      {isLoading && <Loading />}
      {data?.length === 0 && <Empty />}
      <ul className="grid grid-cols-4 gap-4">
        {data?.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            id={bookmark.id}
            url={bookmark.url}
            title={bookmark.title}
            description={bookmark.description}
            cover={bookmark.cover}
            favicon={bookmark.favicon}
            tags={bookmark.tags}
            onCopyUrl={() => {
              copyToClipboard(bookmark.url);
              toast.success("URL copied to clipboard");
            }}
            onEdit={() => openModal("edit", bookmark.id)}
            onDelete={() => openModal("delete", bookmark.id)}
          />
        ))}
      </ul>
      <UpdateBookmarkModal
        open={searchParams.get("modal") === "edit"}
        onCloseModal={closeModal}
      />
      <DeleteBookmarkModal
        open={searchParams.get("modal") === "delete"}
        onCloseModal={closeModal}
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
