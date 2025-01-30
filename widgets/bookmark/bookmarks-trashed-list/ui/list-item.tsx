import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { ImageOff, Loader2Icon } from "lucide-react";
import { forwardRef } from "react";

interface Props {
  id: string;
  cover: string | null;
  title: string;
  url: string;
  deletedAt: string | null;
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
    ref
  ) => {
    function formatDate(date: string) {
      const formatter = new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
      });

      return formatter.format(new Date(date));
    }
    return (
      <li key={id} ref={ref}>
        <label
          htmlFor={`checkbox-${id}`}
          className={cn(
            "flex hover:bg-muted/50 flex-col md:flex-row gap-4 md:items-center p-4 justify-between rounded-lg shadow-sm border",
            selected && "border-primary bg-muted/50"
          )}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
            <div className="flex items-center">
              <Checkbox
                id={`checkbox-${id}`}
                onCheckedChange={onCheckedChange}
              />
            </div>
            <a
              href={url}
              target="_blank"
              className="aspect-video md:w-32 flex items-center justify-center rounded bg-muted/25 border border-border/75"
            >
              {cover ? (
                <img
                  src={cover}
                  loading="lazy"
                  className="rounded w-full h-full object-cover"
                  alt={title}
                />
              ) : (
                <ImageOff className="text-muted-foreground" />
              )}
            </a>
            <div>
              <h3 className="font-medium">{title}</h3>
              {deletedAt ? (
                <p className="text-muted-foreground text-sm">
                  Deleted at {formatDate(deletedAt)}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex md:items-center gap-2">
            <Button
              onClick={() => onRestore()}
              variant="outline"
              className="w-full"
              size="sm"
              disabled={isRestoring}
            >
              {isRestoring ? (
                <Loader2Icon className="w-4 h-4 animate-spin" />
              ) : (
                "Restore"
              )}
            </Button>
            <Button
              onClick={() => onDelete()}
              variant="outline"
              className="w-full"
              size="sm"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2Icon className="w-4 h-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </label>
      </li>
    );
  }
);
