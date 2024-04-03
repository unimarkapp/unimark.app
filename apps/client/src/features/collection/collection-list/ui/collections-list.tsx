import { Separator } from "@/shared/ui/separator";
import { trpc } from "@/shared/trpc";
import { CollectionCreate } from "@/features/collection/collection-create";
import { CollectionStaticItem, CollectionItem } from "@/entities/collection";
import { Bookmark, Trash2 } from "lucide-react";

export function CollectionsList() {
  const { data: collections } = trpc.collections.list.useQuery();
  const { data: stats } = trpc.stats.all.useQuery();

  return (
    <ul className="space-y-1 text-sm">
      <CollectionStaticItem
        icon={Bookmark}
        name="All Bookmarks"
        to="/"
        count={stats?.bookmarks}
      />
      <CollectionStaticItem
        icon={Trash2}
        name="Trash"
        to="/trash"
        count={stats?.deleted}
      />
      <li>
        <Separator />
      </li>
      {collections?.map((collection) => (
        <CollectionItem
          id={collection.id}
          name={collection.name}
          key={collection.id}
          count={collection.bookmarksCount}
        />
      ))}
      <CollectionCreate />
    </ul>
  );
}
