import { cn } from "@/shared/lib";
import { Loader2, LucideIcon } from "lucide-react";
import { NavLink, To, useLocation } from "react-router-dom";

interface Props {
  name: string;
  count?: number;
  to: To;
  icon: LucideIcon;
}

export function CollectionStaticItem({ count, to, name, icon }: Props) {
  const location = useLocation();
  const isActive = location.pathname === to;

  const Icon = icon;

  return (
    <li>
      <NavLink
        to={to}
        className={cn([
          "inline-flex items-center justify-between rounded-md w-full h-9 px-3 gap-2",
          isActive ? "bg-muted" : "hover:bg-muted/50",
        ])}
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />

          {name}
        </div>
        <div className="text-xs text-muted-foreground">
          {count ?? <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        </div>
      </NavLink>
    </li>
  );
}
