import { trpc } from "@/shared/trpc";
import { BookmarkCard } from "@/entities/bookmark";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { BookmarkModalEdit } from "@/features/bookmark/bookmark-modal-edit";
import { BookmarkModalDelete } from "@/features/bookmark/bookmark-modal-delete";
import { BookmarkTags } from "@/features/bookmark/bookmark-tags";

export function BookmarksGrid({ collectionId }: { collectionId?: string }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [, copyToClipboard] = useCopyToClipboard();

  const { data, isLoading, isError, error } = trpc.bookmarks.list.useQuery({
    collectionId,
    query: searchParams.get("query") ?? undefined,
    tags: searchParams.getAll("tags") ?? undefined,
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
            footer={<BookmarkTags id={bookmark.id} tags={bookmark.tags} />}
            onCopyUrl={async () => {
              await copyToClipboard(bookmark.url);
              toast.success("URL copied to clipboard");
            }}
            onEdit={() => openModal("edit", bookmark.id)}
            onDelete={() => openModal("delete", bookmark.id)}
          />
        ))}
      </ul>
      <BookmarkModalEdit
        open={searchParams.get("modal") === "edit"}
        onCloseModal={closeModal}
      />
      <BookmarkModalDelete
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
