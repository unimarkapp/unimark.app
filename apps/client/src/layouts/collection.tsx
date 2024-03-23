import { CollectionToolbar } from "@/features/collection/collection-toolbar";
import { trpc } from "@/shared/trpc";
import { Outlet, useParams } from "react-router-dom";
import { PanelRightClose } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useSidebar } from "@/shared/hooks";

export function CollectionLayout() {
  const params = useParams();
  const { toggleSidebar } = useSidebar();
  const { data: collections } = trpc.collections.list.useQuery();

  const collection = collections?.find((c) => c.id === params.collection_id);
  const title = params.collection_id ? collection?.name : "All Bookmarks";

  return (
    <div className="">
      <div className="border-b sticky z-10 right-0 md:left-64 left-0 top-0 bg-background flex flex-col md:flex-row md:items-center gap-4 md:justify-between py-[22px] px-4 md:px-8">
        <div className="flex items-center gap-1.5 min-w-0">
          <Button
            onClick={() => toggleSidebar()}
            size="icon"
            className="w-7 h-7 md:hidden text-muted-foreground"
            variant="secondary"
          >
            <PanelRightClose size={18} />
          </Button>
          <h1 className="text-lg truncate font-medium tracking-tight capitalize">
            {title ?? (
              <div className="h-4 w-40 rounded-md bg-muted/75 animate-pulse"></div>
            )}
          </h1>
        </div>
        <CollectionToolbar />
      </div>
      <div className="md:p-8 p-4 space-y-8">
        <Outlet />
      </div>
    </div>
  );
}
