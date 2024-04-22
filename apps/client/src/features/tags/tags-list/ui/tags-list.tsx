import { cn } from "@/shared/lib";
import { trpc } from "@/shared/trpc";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Hash } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export function TagsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data } = trpc.tags.list.useQuery();

  function handleClick(id: string) {
    setSearchParams((prev) => {
      const isSelected = prev.getAll("tags").includes(id);
      isSelected ? prev.delete("tags", id) : prev.append("tags", id);
      return prev;
    });
  }

  return (
    <ScrollArea>
      <ul className="space-y-1">
        {data?.map((tag) => {
          const isSelected = searchParams.getAll("tags").includes(tag.id);
          return (
            <li key={tag.id}>
              <button
                type="button"
                onClick={() => handleClick(tag.id)}
                className={cn([
                  "inline-flex items-center relative justify-between rounded-md w-full h-[30px] pl-3 pr-4 gap-2",
                  isSelected
                    ? "bg-muted/75"
                    : "text-muted-foreground hover:bg-muted/50",
                ])}
              >
                <div className="flex items-center text-sm gap-2">
                  <Hash className="size-4" />
                  {tag.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {tag.count ?? 0}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </ScrollArea>
  );
}
