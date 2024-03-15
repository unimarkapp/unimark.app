import { Separator } from "@/shared/ui/separator";
import { trpc } from "@/shared/trpc";
import { CollectionCreate } from "@/features/collection/collection-create";
import { CollectionHomeItem, CollectionItem } from "@/entities/collection";

export function CollectionsList() {
  const { data: collections } = trpc.collections.list.useQuery();
  const { data: stats } = trpc.stats.all.useQuery();

  return (
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
        />
      ))}
      <CollectionCreate />
    </ul>
  );
}
