import { cn } from "@/shared/lib";
import { Folder, FolderOpen } from "lucide-react";
import { NavLink, useParams } from "react-router-dom";

interface Props {
  id: string;
  name: string;
  count: number;
  isHome?: string;
}

export function CollectionItem({ id, name, count }: Props) {
  const params = useParams();
  const isActive = params.collection_id === id;
  const Icon = isActive ? FolderOpen : Folder;

  return (
    <li>
      <NavLink
        to={`/collections/${id}`}
        className={cn([
          "inline-flex items-center relative justify-between rounded-md w-full h-9 px-3 gap-2",
          isActive ? "bg-muted/75" : "hover:bg-muted/50",
        ])}
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {name}
        </div>
        <div className="text-xs text-muted-foreground">{count}</div>
      </NavLink>
    </li>
  );
}
