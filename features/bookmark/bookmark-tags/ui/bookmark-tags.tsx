'use client';

import { cn } from '@/shared/lib';
import { api } from '@/trpc/react';
import { Button } from '@/shared/ui/button';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shared/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Tags, PlusCircle, Check } from 'lucide-react';
import { useState } from 'react';
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';

interface Props {
  id: string;
  tags: { id: string; name: string }[];
}

export function BookmarkTags({ id, tags: selected }: Props) {
  const [queryTags, setQueryTags] = useQueryState('tags', parseAsArrayOf(parseAsString));
  const [query, setQuery] = useQueryState('query', parseAsString);
  const utils = api.useUtils();
  const [term, setTerm] = useState('');

  const { data: tags } = api.tag.list.useQuery();

  const createAndTag = api.tag.createAndTag.useMutation({
    onSuccess(tag) {
      utils.tag.list.setData(undefined, (data) => {
        if (data) {
          return [...data, { ...tag, count: 1 }];
        }
      });

      utils.bookmark.list.setInfiniteData(
        {
          query,
          tags: queryTags,
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
          query,
          tags: queryTags,
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
        query,
        tags: queryTags,
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
          <Button size="icon" variant="outline" className="h-[30px] w-[30px] shrink-0">
            <Tags size={14} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0" align="start">
          <Command>
            <CommandInput
              value={term}
              onValueChange={setTerm}
              placeholder="Create or search tags"
            />
            <CommandList className="max-h-56 overflow-y-auto">
              {tags?.length ? (
                <CommandGroup heading="All tags">
                  {tags.map((tag) => {
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
                            'flex h-4 w-4 items-center justify-center rounded border border-primary/25',
                            isChecked ? 'border-foreground bg-foreground text-background' : '',
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
                <div className="flex justify-center py-4 text-sm">No tags.</div>
              )}
            </CommandList>
            {term.length && !tags?.find(({ name }) => name.includes(term)) ? (
              <CommandList>
                <CommandGroup heading="Click to create">
                  <CommandItem
                    className="flex cursor-pointer justify-between"
                    onSelect={() => onCreate(term)}
                    value={term}
                  >
                    <div className="flex items-center gap-2">
                      <PlusCircle className="-mb-px h-4 w-4 shrink-0 text-muted-foreground" />
                      <span>{query}</span>
                    </div>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            ) : null}
          </Command>
        </PopoverContent>
      </Popover>
      <ul className="flex items-center gap-1 overflow-x-auto">
        {selected.map((tag) => {
          const isSelected = queryTags?.includes(tag.name);

          return (
            <li key={tag.id} className="flex">
              <Button
                size="sm"
                onClick={() => {
                  setQueryTags((prev) => {
                    const prevState = prev ?? [];
                    if (isSelected) {
                      return prevState.length > 1
                        ? prevState.filter((item) => item !== tag.name)
                        : null;
                    } else {
                      return [...prevState, tag.name];
                    }
                  });
                }}
                variant={isSelected ? 'default' : 'outline'}
                className="h-[30px] shrink-0"
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
