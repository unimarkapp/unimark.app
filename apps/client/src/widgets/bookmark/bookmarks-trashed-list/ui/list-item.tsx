import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { ImageOff } from "lucide-react";

interface Props {
  id: string;
  cover: string | null;
  title: string;
  url: string;
  selected?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onDelete: () => void;
  onRestore: () => void;
}

export function ListItem({
  id,
  cover,
  title,
  url,
  selected,
  onCheckedChange,
  onDelete,
  onRestore,
}: Props) {
  return (
    <li key={id}>
      <label
        htmlFor={`checkbox-${id}`}
        className={cn(
          "flex hover:bg-muted/50 flex-col md:flex-row gap-4 md:items-center p-4 justify-between rounded-lg shadow-sm border",
          selected && "border-primary bg-muted/50"
        )}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
          <div className="flex items-center">
            <Checkbox id={`checkbox-${id}`} onCheckedChange={onCheckedChange} />
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
          </div>
        </div>
        <div className="flex md:items-center gap-2">
          <Button
            onClick={() => onRestore()}
            variant="outline"
            className="w-full"
            size="sm"
          >
            Restore
          </Button>
          <Button
            onClick={() => onDelete()}
            variant="outline"
            className="w-full"
            size="sm"
          >
            Delete
          </Button>
        </div>
      </label>
    </li>
  );
}
