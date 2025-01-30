import type { ReactNode } from "react";
import { forwardRef, memo } from "react";
import {
  FilePenLine,
  Files,
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

const Card = forwardRef<HTMLLIElement, Props>(
  (
    { id, url, cover, favicon, title, description, openModal, tags, onCopyUrl },
    forwardRef
  ) => {
    return (
      <li key={id} ref={forwardRef}>
        <div className="border rounded-lg shadow-sm flex flex-col justify-between gap-2 p-4 relative h-full">
          <div className="space-y-2">
            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="w-7 h-7">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-36">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="gap-2"
                      onClick={() => onCopyUrl(url)}
                    >
                      <Files className="w-4 h-4 text-muted-foreground" />
                      Copy URL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="gap-2"
                      onClick={() => openModal("edit", id)}
                    >
                      <FilePenLine className="w-4 h-4 text-muted-foreground" />
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => openModal("delete", id)}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                    To trash
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
                  alt={`${title} favicon`}
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

export const BookmarkCard = memo(Card);
