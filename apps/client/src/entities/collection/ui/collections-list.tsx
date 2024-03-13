import { Separator } from "@/shared/ui/separator";
import CollectionItem from "./collection-item";
import { trpc } from "@/shared/trpc";
import { CreateCollection } from "@/features/collection/create-collection";
import CollectionHomeItem from "./collection-home-item";

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
      <CreateCollection />
    </ul>
  );
}
