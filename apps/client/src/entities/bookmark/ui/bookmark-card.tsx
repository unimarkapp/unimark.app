import type { ReactNode } from "react";
import {
  FilePenLine,
  Files,
  FolderSync,
  ImageOff,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Button } from "@/shared/ui/button";

interface Props {
  id: string;
  url: string;
  cover: string | null;
  favicon: string | null;
  title: string;
  description: string | null;
  onCopyUrl: () => void;
  onEdit: () => void;
  onDelete: () => void;
  footer?: ReactNode;
}

export function BookmarkCard({
  id,
  url,
  cover,
  favicon,
  title,
  description,
  footer,
  onCopyUrl,
  onEdit,
  onDelete,
}: Props) {
  return (
    <li key={id}>
      <div className="border rounded-lg shadow-sm flex flex-col justify-between gap-2 p-4 relative h-full">
        <div className="space-y-2">
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="w-7 h-7">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-44">
                <DropdownMenuGroup>
                  <DropdownMenuItem className="gap-2" onClick={onCopyUrl}>
                    <Files className="w-4 h-4" />
                    Copy URL
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2" onClick={onEdit}>
                    <FilePenLine className="w-4 h-4" />
                    Edit
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={true} className="gap-2">
                    <FolderSync className="w-4 h-4" />
                    Move
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <a
            href={url}
            target="_blank"
            className="aspect-video flex items-center justify-center rounded-md bg-muted/25 border border-border/75"
          >
            {cover ? (
              <img
                src={cover}
                loading="lazy"
                className="rounded-md w-full h-full object-cover"
                alt={title}
              />
            ) : (
              <ImageOff className="text-muted-foreground" />
            )}
          </a>
          <p className="font-medium line-clamp-2 text-lg">
            {favicon ? (
              <img
                src={favicon}
                className="w-4 h-4 inline-block rounded-sm mr-2 -mt-[3px]"
              />
            ) : null}
            <span>{title}</span>
          </p>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {description}
          </p>
        </div>
        {footer}
      </div>
    </li>
  );
}
