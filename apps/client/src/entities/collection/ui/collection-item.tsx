import type { MouseEvent } from "react";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui/button";
import {
  FilePenLine,
  Folder,
  FolderOpen,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { NavLink, useParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useState } from "react";

interface Props {
  id: string;
  name: string;
  count: number;
  isHome?: string;
  onDelete: (e: MouseEvent<HTMLDivElement>) => void;
}

export function CollectionItem({ id, name, count, onDelete }: Props) {
  const params = useParams();
  const isActive = params.collection_id === id;
  const Icon = isActive ? FolderOpen : Folder;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <NavLink
        to={`/collections/${id}`}
        className={cn([
          "inline-flex items-center relative justify-between rounded-md w-full h-9 px-3 gap-2 group",
          isActive ? "bg-muted/75" : "hover:bg-muted/50",
        ])}
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {name}
        </div>
        <div className="text-xs text-muted-foreground group-hover:hidden">
          {count}
        </div>
        <div
          className={cn([
            "opacity-0 absolute right-2 focus-within:opacity-100 top-[50%] -translate-y-[50%] group-hover:opacity-100",
            isOpen && "opacity-100",
          ])}
        >
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="w-6 h-6">
                <MoreHorizontal size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="right">
              <DropdownMenuItem disabled className="gap-2">
                <FilePenLine className="w-4 h-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => onDelete(e)} className="gap-2">
                <Trash2 className="w-4 h-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </NavLink>
    </li>
  );
}
