import type { ReactNode } from 'react';
import { forwardRef, memo } from 'react';
import { FilePenLine, Files, ImageOff, MoreHorizontal, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Button } from '@/shared/ui/button';
import { BookmarkTags } from '@/features/bookmark/bookmark-tags';

interface Props {
  id: string;
  url: string;
  cover: string | null;
  favicon: string | null;
  title: string;
  description: string | null;
  tags: { id: string; name: string }[];
  openModal: (name: 'edit' | 'delete', bookmarkId: string) => void;
  onCopyUrl: (url: string) => void;
  footer?: ReactNode;
}

const Card = forwardRef<HTMLLIElement, Props>(
  ({ id, url, cover, favicon, title, description, openModal, tags, onCopyUrl }, forwardRef) => {
    return (
      <li key={id} ref={forwardRef}>
        <div className="relative flex h-full flex-col justify-between gap-2 rounded-lg border p-4 shadow-sm">
          <div className="space-y-2">
            <div className="absolute right-2 top-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-36">
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="gap-2" onClick={() => onCopyUrl(url)}>
                      <Files className="h-4 w-4 text-muted-foreground" />
                      Copy URL
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2" onClick={() => openModal('edit', id)}>
                      <FilePenLine className="h-4 w-4 text-muted-foreground" />
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => openModal('delete', id)} className="gap-2">
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                    To trash
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <a
              href={url}
              target="_blank"
              className="flex aspect-video items-center justify-center rounded-md border border-border/75 bg-muted/25"
            >
              {cover ? (
                <img
                  src={cover}
                  loading="lazy"
                  className="h-full w-full rounded-md object-cover"
                  alt={title}
                />
              ) : (
                <ImageOff className="text-muted-foreground" />
              )}
            </a>
            <p className="line-clamp-2 text-lg font-semibold tracking-tight">
              {favicon ? (
                <img
                  src={favicon}
                  alt={`${title} favicon`}
                  className="-mt-[3px] mr-2 inline-block h-4 w-4 rounded-sm"
                />
              ) : null}
              <span>{title}</span>
            </p>
            <p className="line-clamp-3 text-sm text-muted-foreground">{description}</p>
          </div>
          <BookmarkTags id={id} tags={tags} />
        </div>
      </li>
    );
  },
);

Card.displayName = 'BookmarkCard';

export const BookmarkCard = memo(Card);
