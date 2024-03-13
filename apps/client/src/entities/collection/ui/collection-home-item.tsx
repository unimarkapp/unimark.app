import { cn } from "@/shared/lib";
import { Bookmark, Loader2 } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

export default function CollectionHomeItem({ count }: { count?: number }) {
  const location = useLocation();
  const isActive = location.pathname === "/";

  return (
    <li>
      <NavLink
        to="/"
        className={cn([
          "inline-flex items-center justify-between rounded-md w-full h-9 px-3 gap-2",
          isActive ? "bg-muted" : "hover:bg-muted/50",
        ])}
      >
        <div className="flex items-center gap-2">
          <Bookmark className="h-4 w-4" />
          All Bookmarks
        </div>
        <div className="text-xs text-muted-foreground">
          {count ?? <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        </div>
      </NavLink>
    </li>
  );
}
