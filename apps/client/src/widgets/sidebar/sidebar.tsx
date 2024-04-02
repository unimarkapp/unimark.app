import { Separator } from "@/shared/ui/separator";
import { CollectionsList } from "@/features/collection/collection-list";
import { BookmarkModalAdd } from "@/features/bookmark/bookmark-modal-add";
import { ProfileMenu, useLogout, useProfile } from "@/entities/profile";
import { useSidebar } from "@/shared/hooks";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui/button";
import { PanelRightOpen } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BookmarkModalImport } from "@/features/bookmark/bookmark-modal-import";

export function Sidebar() {
  const location = useLocation();
  const { data: profile } = useProfile();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const logout = useLogout();

  useEffect(() => {
    closeSidebar();
    // TODO: Probably there is a better way
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <aside
      className={cn([
        "w-64 fixed transition-transform z-20 bg-background p-4 md:p-6 inset-y-0 left-0 border-r",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      ])}
    >
      <Button
        onClick={() => toggleSidebar()}
        size="icon"
        className={cn([
          "w-7 h-7 text-muted-foreground absolute md:pointer-events-none -right-10 transition-all top-5",
          isSidebarOpen
            ? "translate-x-0 opacity-100 md:-translate-x-12 md:opacity-0"
            : "-translate-x-12 opacity-0",
        ])}
        variant="secondary"
      >
        <PanelRightOpen size={18} />
      </Button>

      <div className="space-y-4">
        <ProfileMenu onLogout={() => logout.mutate()} profile={profile} />
        <Separator />
        <div className="flex gap-2">
          <BookmarkModalAdd />
          <BookmarkModalImport />
        </div>
        <CollectionsList />
      </div>
    </aside>
  );
}
