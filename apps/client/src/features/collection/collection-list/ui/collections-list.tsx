import type { MouseEvent } from "react";
import { Separator } from "@/shared/ui/separator";
import { trpc } from "@/shared/trpc";
import { CollectionCreate } from "@/features/collection/collection-create";
import { CollectionHomeItem, CollectionItem } from "@/entities/collection";
import { useSearchParams } from "react-router-dom";
import { CollectionModalDelete } from "./collection-modal-delete";

export function CollectionsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: collections } = trpc.collections.list.useQuery();
  const { data: stats } = trpc.stats.all.useQuery();

  function onDelete(e: MouseEvent<HTMLDivElement>, id: string) {
    e.stopPropagation();
    openModal("collection-delete", id);
  }

  function openModal(name: "collection-delete", collectionId: string) {
    setSearchParams((prev) => {
      if (prev.get("modal") === name) {
        prev.delete("modal");
        prev.delete("collectionId");
      } else {
        prev.set("modal", name);
        prev.set("collectionId", collectionId);
      }
      return prev;
    });
  }

  function closeModal() {
    setSearchParams((prev) => {
      prev.delete("modal");
      prev.delete("collectionId");
      return prev;
    });
  }

  return (
    <>
      <ul className="space-y-1 text-sm">
        <CollectionHomeItem count={stats?.bookmarks} />
        <li>
          <Separator />
        </li>
        {collections?.map((collection) => (
          <CollectionItem
            id={collection.id}
            name={collection.name}
            key={collection.id}
            count={collection.bookmarksCount}
            onDelete={(e) => onDelete(e, collection.id)}
          />
        ))}
        <CollectionCreate />
      </ul>
      <CollectionModalDelete
        open={searchParams.get("modal") === "collection-delete"}
        onCloseModal={closeModal}
      />
    </>
  );
}
