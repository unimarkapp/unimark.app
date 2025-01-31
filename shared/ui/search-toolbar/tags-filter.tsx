import { CheckIcon, PlusCircle } from 'lucide-react';
import { cn } from '@/shared/lib';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/shared/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Separator } from '@/shared/ui/separator';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';

interface Props {
  tags: { id: string; name: string }[];
}

export function TagsFilter({ tags }: Props) {
  const [queryTags, setQueryTags] = useQueryState('tags', parseAsArrayOf(parseAsString));
  const selectedValues = new Set(queryTags);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          Tags
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  tags
                    .filter((tag) => selectedValues.has(tag.name))
                    .map((tag) => (
                      <Badge
                        variant="secondary"
                        key={tag.id}
                        className="rounded-sm px-1 font-normal"
                      >
                        {tag.name}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Tag name..." />
          <CommandList>
            <CommandEmpty>No tags found.</CommandEmpty>
            <CommandGroup>
              {tags.map((option) => {
                const isSelected = queryTags?.includes(option.name);
                return (
                  <CommandItem
                    key={option.id}
                    onSelect={() => {
                      setQueryTags((prev) => {
                        const prevState = prev ?? [];
                        if (isSelected) {
                          return prevState.length > 1
                            ? prevState.filter((item) => item !== option.name)
                            : null;
                        } else {
                          return [...prevState, option.name];
                        }
                      });
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <CheckIcon className={cn('h-4 w-4')} />
                    </div>
                    <span>{option.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setQueryTags(null)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
