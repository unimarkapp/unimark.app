import { CollectionToolbar } from "@/features/collection/collection-toolbar";
import { trpc } from "@/shared/trpc";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { PanelRightClose } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useSidebar } from "@/shared/hooks";
import { CollectionSettings } from "@/features/collection/collection-settings";

export function CollectionLayout() {
  const params = useParams();
  const location = useLocation();
  const { toggleSidebar } = useSidebar();
  const { data: collections } = trpc.collections.list.useQuery();
  const collection = collections?.find((c) => c.id === params.collection_id);

  function getTitle() {
    if (params.collection_id) {
      return collection?.name;
    } else {
      if (location.pathname === "/trash") {
        return "Trash";
      }
      return "All Bookmarks";
    }
  }

  const title = getTitle();

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
          {title && params.collection_id && (
            <CollectionSettings id={params.collection_id} initialName={title} />
          )}
        </div>
        <CollectionToolbar />
      </div>
      <div className="md:p-8 p-4 space-y-8">
        <Outlet />
      </div>
    </div>
  );
}
