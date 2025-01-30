import { cn } from '@/shared/lib';
import { api } from '@/trpc/react';
import { Button } from '@/shared/ui/button';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shared/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Tags, PlusCircle, Check } from 'lucide-react';
import { useState } from 'react';
import { useQueryState, parseAsArrayOf } from 'nuqs';

interface Props {
  id: string;
  tags: { id: string; name: string }[];
}

export function BookmarkTags({ id, tags: selected }: Props) {
  const [queryTags, setQueryTags] = useQueryState('tags');
  const utils = api.useUtils();
  const [query, setQuery] = useState('');

  const tags = api.tag.list.useQuery();

  const createAndTag = api.tag.createAndTag.useMutation({
    onSuccess(tag) {
      utils.tag.list.setData(undefined, (data) => {
        if (data) {
          return [...data, { ...tag, count: 1 }];
        }
      });

      utils.bookmark.list.setInfiniteData(
        {
          query: searchParams.get('query') ?? undefined,
          tags: parseAsArrayOf(queryTags) ?? undefined,
        },
        (data) => {
          if (data?.pages) {
            return {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                bookmarks: page.bookmarks.map((bookmark) =>
                  bookmark.id === id ? { ...bookmark, tags: [...bookmark.tags, tag] } : bookmark,
                ),
              })),
            };
          }
        },
      );

      setQuery('');
    },
  });
  const assign = api.bookmark.tag.useMutation();
  const unassign = api.bookmark.untag.useMutation();

  function onSelect(tag: { id: string; name: string }) {
    const isChecked = selected.some((item) => item.id === tag.id);

    if (isChecked) {
      utils.bookmark.list.setInfiniteData(
        {
          query: searchParams.get('query') ?? undefined,
          tags: searchParams.getAll('tags') ?? undefined,
        },
        (data) => {
          if (data?.pages) {
            return {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                bookmarks: page.bookmarks.map((bookmark) =>
                  bookmark.id === id
                    ? {
                        ...bookmark,
                        tags: bookmark.tags.filter((item) => item.id !== tag.id),
                      }
                    : bookmark,
                ),
              })),
            };
          }
        },
      );
      unassign.mutate({ bookmarkId: id, tagId: tag.id });
      return;
    }

    utils.bookmark.list.setInfiniteData(
      {
        query: searchParams.get('query') ?? undefined,
        tags: searchParams.getAll('tags') ?? undefined,
      },
      (data) => {
        if (data) {
          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              bookmarks: page.bookmarks.map((bookmark) =>
                bookmark.id === id ? { ...bookmark, tags: [...bookmark.tags, tag] } : bookmark,
              ),
            })),
          };
        }
      },
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
          <Button size="icon" variant="outline" className="w-[30px] shrink-0 h-[30px]">
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
                    const isChecked = selected.some((item) => item.id === tag.id);
                    return (
                      <CommandItem
                        className="gap-2"
                        key={tag.id}
                        onSelect={() => onSelect(tag)}
                        value={tag.name}
                      >
                        <div
                          className={cn([
                            'w-4 h-4 border rounded flex items-center border-primary/25 justify-center',
                            isChecked ? 'bg-foreground text-background border-foreground' : '',
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
            {query.length && !tags.data?.find(({ name }) => name.includes(query)) ? (
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
          const isSelected = searchParams.getAll('tags').includes(tag.name);

          return (
            <li key={tag.id} className="flex">
              <Button
                size="sm"
                onClick={() => {
                  setSearchParams((prev) => {
                    isSelected ? prev.delete('tags', tag.name) : prev.append('tags', tag.name);

                    return prev;
                  });
                }}
                variant={isSelected ? 'default' : 'outline'}
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
