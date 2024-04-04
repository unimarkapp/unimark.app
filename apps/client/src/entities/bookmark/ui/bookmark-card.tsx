import type { ReactNode } from "react";
import { memo } from "react";
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
import { BookmarkTags } from "@/features/bookmark/bookmark-tags";

interface Props {
  id: string;
  url: string;
  cover: string | null;
  favicon: string | null;
  title: string;
  description: string | null;
  tags: { id: string; name: string }[];
  openModal: (name: "edit" | "delete", bookmarkId: string) => void;
  onCopyUrl: (url: string) => void;
  footer?: ReactNode;
}

export const BookmarkCard = memo(
  ({
    id,
    url,
    cover,
    favicon,
    title,
    description,
    openModal,
    tags,
    onCopyUrl,
  }: Props) => {
    console.log("BookmarkCard", id);

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
                    <DropdownMenuItem
                      className="gap-2"
                      onClick={() => onCopyUrl(url)}
                    >
                      <Files className="w-4 h-4" />
                      Copy URL
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="gap-2"
                      onClick={() => openModal("edit", id)}
                    >
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
                  <DropdownMenuItem
                    onClick={() => openModal("delete", id)}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    To trash
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
          <BookmarkTags id={id} tags={tags} />
        </div>
      </li>
    );
  }
);
