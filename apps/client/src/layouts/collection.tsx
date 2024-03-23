import { CollectionToolbar } from "@/features/collection/collection-toolbar";
import { trpc } from "@/shared/trpc";
import { Outlet, useParams } from "react-router-dom";

export function CollectionLayout() {
  const params = useParams();
  const { data: collections } = trpc.collections.list.useQuery();

  const collection = collections?.find((c) => c.id === params.collection_id);
  const title = params.collection_id ? collection?.name : "All Bookmarks";

  return (
    <div className="">
      <div className="border-b fixed z-10 right-0 left-64 top-0 bg-background flex items-center justify-between py-[22px] px-8">
        <h1 className="text-lg font-medium tracking-tight capitalize">
          {title ?? (
            <div className="h-4 w-40 rounded-md bg-muted/75 animate-pulse"></div>
          )}
        </h1>
        <CollectionToolbar />
      </div>
      <div className="p-8 mt-[77px] space-y-8">
        <Outlet />
      </div>
    </div>
  );
}
