import { Separator } from "@/shared/ui/separator";
import { BookmarkModalAdd } from "@/features/bookmark/bookmark-modal-add";
import { ProfileMenu, useLogout, useProfile } from "@/entities/profile";
import { useSidebar } from "@/shared/hooks";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui/button";
import {
  Bookmark,
  Loader2,
  LucideIcon,
  PanelRightOpen,
  Trash2,
} from "lucide-react";
import { useEffect } from "react";
import { NavLink, To, useLocation } from "react-router-dom";
import { BookmarkModalImport } from "@/features/bookmark/bookmark-modal-import";
import { TagsList } from "@/features/tags/tags-list";
import { trpc } from "@/shared/trpc";

export function Sidebar() {
  const location = useLocation();
  const { data: profile } = useProfile();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const logout = useLogout();

  const { data: stats } = trpc.stats.all.useQuery();

  useEffect(() => {
    closeSidebar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <aside
      className={cn([
        "w-64 flex flex-col fixed transition-transform z-20 bg-background p-4 inset-y-0 left-0 border-r",
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

      <div className="flex-1 flex flex-col gap-y-4 max-h-full">
        <ProfileMenu onLogout={() => logout.mutate()} profile={profile} />
        <Separator />
        <div className="flex items-center gap-1">
          <BookmarkModalAdd />
          <BookmarkModalImport />
        </div>
        <ul className="space-y-1 text-sm border-b pb-1">
          <SidebarCategory
            icon={Bookmark}
            name="All Bookmarks"
            to="/"
            count={stats?.bookmarks}
          />
          <SidebarCategory
            icon={Trash2}
            name="Trash"
            to="/trash"
            count={stats?.deleted}
          />
        </ul>
        <TagsList />
      </div>
    </aside>
  );
}

interface SidebarCategoryProps {
  name: string;
  count?: number;
  to: To;
  icon: LucideIcon;
}

export function SidebarCategory({
  count,
  to,
  name,
  icon,
}: SidebarCategoryProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  const Icon = icon;

  return (
    <li>
      <NavLink
        to={to}
        className={cn([
          "inline-flex items-center justify-between rounded-md w-full h-[30px] px-3 gap-2",
          isActive ? "bg-muted" : "hover:bg-muted/50",
        ])}
      >
        <div className="flex items-center gap-2">
          <Icon className="size-4" />

          {name}
        </div>
        <div className="text-xs text-muted-foreground">
          {count ?? <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        </div>
      </NavLink>
    </li>
  );
}
