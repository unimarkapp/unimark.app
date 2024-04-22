import { Outlet } from "react-router-dom";
import { PanelRightClose } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useSidebar } from "@/shared/hooks";
import { SearchToolbar } from "@/shared/ui/search-toolbar";

export function BookmarkLayout() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="">
      <div className="border-b sticky z-10 right-0 md:left-64 left-0 top-0 bg-background flex md:items-center gap-2 py-[18px] px-4 md:px-8">
        <Button
          onClick={() => toggleSidebar()}
          size="icon"
          className="w-8 h-8 md:hidden text-muted-foreground"
          variant="secondary"
        >
          <PanelRightClose size={18} />
        </Button>
        <SearchToolbar />
      </div>
      <div className="md:p-8 p-4 space-y-8">
        <Outlet />
      </div>
    </div>
  );
}
