import { cn } from '@/shared/lib';
import { api } from '@/trpc/react';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Hash } from 'lucide-react';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';

export function TagsList() {
  const [queryTags, setQueryTags] = useQueryState('tags', parseAsArrayOf(parseAsString));
  const { data } = api.tag.list.useQuery();

  function handleClick(name: string) {
    setQueryTags((prev) => {
      const prevState = prev ?? [];
      const isSelected = prev?.includes(name);
      if (isSelected) {
        return prevState.length > 1 ? prevState.filter((state) => state !== name) : null;
      }
      return [...prevState, name];
    });
  }

  return (
    <ScrollArea>
      <ul className="space-y-1">
        {data?.map((tag) => {
          const isSelected = queryTags?.includes(tag.name);
          return (
            <li key={tag.id}>
              <button
                type="button"
                onClick={() => handleClick(tag.name)}
                className={cn([
                  'relative inline-flex h-[30px] w-full items-center justify-between gap-2 rounded-md pl-3 pr-4',
                  isSelected ? 'bg-muted/75' : 'text-muted-foreground hover:bg-muted/50',
                ])}
              >
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="size-4" />
                  {tag.name}
                </div>
                <div className="text-xs text-muted-foreground">{tag.count ?? 0}</div>
              </button>
            </li>
          );
        })}
      </ul>
    </ScrollArea>
  );
}
