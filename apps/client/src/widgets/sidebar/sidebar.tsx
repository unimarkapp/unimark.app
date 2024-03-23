import { Separator } from "@/shared/ui/separator";
import { CollectionsList } from "@/features/collection/collection-list";
import { BookmarkModalAdd } from "@/features/bookmark/bookmark-modal-add";
import { ProfileMenu, useLogout, useProfile } from "@/entities/profile";
import { useSidebar } from "@/shared/hooks";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui/button";
import { PanelRightOpen } from "lucide-react";

export function Sidebar() {
  const { data: profile } = useProfile();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const logout = useLogout();

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
        <BookmarkModalAdd />
        <CollectionsList />
      </div>
    </aside>
  );
}
