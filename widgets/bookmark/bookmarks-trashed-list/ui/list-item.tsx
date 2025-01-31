import { cn } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { ImageOff, Loader2Icon } from 'lucide-react';
import { forwardRef } from 'react';

interface Props {
  id: string;
  cover: string | null;
  title: string;
  url: string;
  deletedAt: Date | null;
  selected?: boolean;
  isRestoring?: boolean;
  isDeleting?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onDelete: () => void;
  onRestore: () => void;
}

export const ListItem = forwardRef<HTMLLIElement, Props>(
  (
    {
      id,
      cover,
      title,
      url,
      deletedAt,
      selected,
      isRestoring,
      isDeleting,
      onCheckedChange,
      onDelete,
      onRestore,
    },
    ref,
  ) => {
    function formatDate(date: Date) {
      const formatter = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
      });

      return formatter.format(date);
    }
    return (
      <li key={id} ref={ref}>
        <label
          htmlFor={`checkbox-${id}`}
          className={cn(
            'flex flex-col justify-between gap-4 rounded-lg border p-4 shadow-sm hover:bg-muted/50 md:flex-row md:items-center',
            selected && 'border-primary bg-muted/50',
          )}
        >
          <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center">
              <Checkbox id={`checkbox-${id}`} onCheckedChange={onCheckedChange} />
            </div>
            <a
              href={url}
              target="_blank"
              className="flex aspect-video items-center justify-center rounded border border-border/75 bg-muted/25 md:w-32"
            >
              {cover ? (
                <img
                  src={cover}
                  loading="lazy"
                  className="h-full w-full rounded object-cover"
                  alt={title}
                />
              ) : (
                <ImageOff className="text-muted-foreground" />
              )}
            </a>
            <div>
              <h3 className="font-semibold">{title}</h3>
              {deletedAt ? (
                <p className="text-sm text-muted-foreground">Deleted at {formatDate(deletedAt)}</p>
              ) : null}
            </div>
          </div>
          <div className="flex gap-2 md:items-center">
            <Button
              onClick={() => onRestore()}
              variant="outline"
              className="w-full"
              size="sm"
              disabled={isRestoring}
            >
              {isRestoring ? <Loader2Icon className="h-4 w-4 animate-spin" /> : 'Restore'}
            </Button>
            <Button
              onClick={() => onDelete()}
              variant="outline"
              className="w-full"
              size="sm"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2Icon className="h-4 w-4 animate-spin" /> : 'Delete'}
            </Button>
          </div>
        </label>
      </li>
    );
  },
);

ListItem.displayName = 'ListItem';
