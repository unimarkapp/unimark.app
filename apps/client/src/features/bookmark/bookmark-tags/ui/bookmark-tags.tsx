import { cn } from "@/shared/lib";
import { trpc } from "@/shared/trpc";
import { Button } from "@/shared/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Tags, PlusCircle, Check } from "lucide-react";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

interface Props {
  id: string;
  tags: { id: string; name: string }[];
}

export function BookmarkTags({ id, tags: selected }: Props) {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const utils = trpc.useUtils();
  const collectionId = params.collection_id;
  const [query, setQuery] = useState("");

  const tags = trpc.tags.list.useQuery();

  const createAndTag = trpc.tags.createAndTag.useMutation({
    onSuccess(tag) {
      utils.tags.list.setData(undefined, (data) => {
        if (data) {
          return [...data, tag];
        }
      });

      utils.bookmarks.list.setData(
        {
          collectionId,
          query: searchParams.get("query") ?? undefined,
          tags: searchParams.getAll("tags") ?? undefined,
        },
        (data) => {
          if (data) {
            return data.map((bookmark) =>
              bookmark.id === id
                ? { ...bookmark, tags: [...bookmark.tags, tag] }
                : bookmark
            );
          }
        }
      );

      setQuery("");
    },
  });
  const assign = trpc.bookmarks.tag.useMutation();
  const unassign = trpc.bookmarks.untag.useMutation();

  function onSelect(tag: { id: string; name: string }) {
    const isChecked = selected.some((item) => item.id === tag.id);

    if (isChecked) {
      utils.bookmarks.list.setData(
        {
          collectionId,
          query: searchParams.get("query") ?? undefined,
          tags: searchParams.getAll("tags") ?? undefined,
        },
        (data) => {
          if (data) {
            return data.map((bookmark) =>
              bookmark.id === id
                ? {
                    ...bookmark,
                    tags: bookmark.tags.filter((item) => item.id !== tag.id),
                  }
                : bookmark
            );
          }
        }
      );
      unassign.mutate({ bookmarkId: id, tagId: tag.id });
      return;
    }

    utils.bookmarks.list.setData(
      {
        collectionId,
        query: searchParams.get("query") ?? undefined,
        tags: searchParams.getAll("tags") ?? undefined,
      },
      (data) => {
        if (data) {
          return data.map((bookmark) =>
            bookmark.id === id
              ? { ...bookmark, tags: [...bookmark.tags, tag] }
              : bookmark
          );
        }
      }
    );
    assign.mutate({ bookmarkId: id, tagId: tag.id });
  }

  function onCreate(tag: string) {
    createAndTag.mutate({ name: tag, bookmarkId: id });
  }

  return (
    <div className="flex items-center gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="w-[30px] shrink-0 h-[30px]"
          >
            <Tags size={14} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-56" align="start">
          <Command>
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="Create or search tags"
            />
            <CommandList className="max-h-56 overflow-y-auto">
              {tags.data?.length ? (
                <CommandGroup heading="All tags">
                  {tags.data.map((tag) => {
                    const isChecked = selected.some(
                      (item) => item.id === tag.id
                    );
                    return (
                      <CommandItem
                        className="gap-2"
                        key={tag.id}
                        onSelect={() => onSelect(tag)}
                        value={tag.name}
                      >
                        <div
                          className={cn([
                            "w-4 h-4 border rounded flex items-center border-primary/25 justify-center",
                            isChecked
                              ? "bg-foreground text-background border-foreground"
                              : "",
                          ])}
                        >
                          {isChecked ? <Check size={12} /> : null}
                        </div>
                        <span>{tag.name}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ) : (
                <div className="text-sm flex py-4 justify-center">No tags.</div>
              )}
            </CommandList>
            {query.length &&
            !tags.data?.find(({ name }) => name.includes(query)) ? (
              <CommandList>
                <CommandGroup heading="Click to create">
                  <CommandItem
                    className="flex justify-between cursor-pointer"
                    onSelect={() => onCreate(query)}
                    value={query}
                  >
                    <div className="flex items-center gap-2">
                      <PlusCircle className="w-4 h-4 -mb-px text-muted-foreground shrink-0" />
                      <span>{query}</span>
                    </div>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            ) : null}
          </Command>
        </PopoverContent>
      </Popover>
      <ul className="flex items-center overflow-x-auto gap-1">
        {selected.map((tag) => {
          const isSelected = searchParams.getAll("tags").includes(tag.id);

          return (
            <li key={tag.id} className="flex">
              <Button
                size="sm"
                onClick={() => {
                  setSearchParams((prev) => {
                    isSelected
                      ? prev.delete("tags", tag.id)
                      : prev.append("tags", tag.id);

                    return prev;
                  });
                }}
                variant={isSelected ? "default" : "outline"}
                className="shrink-0 h-[30px]"
              >
                {tag.name}
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
