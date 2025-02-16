'use client';

import { SearchIcon, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useState } from 'react';
import { cn } from '@/shared/lib';
import { TagsFilter } from './tags-filter';
import { api } from '@/trpc/react';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { Input } from '@/shared/ui/input';
import { useDebouncedCallback } from 'use-debounce';
import { useParams } from 'next/navigation';

export function SearchToolbar({ className }: { className?: string }) {
  const { organizationId } = useParams<{ organizationId: string }>();
  const [query, setQuery] = useQueryState('query', parseAsString);
  const [queryTags, setQueryTags] = useQueryState('tags', parseAsArrayOf(parseAsString));
  const [term, setTerm] = useState<string>(query ?? '');

  const { data: tags } = api.tag.list.useQuery({ organizationId });

  const debouncedSetSearchParams = useDebouncedCallback(setQuery, 500);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    debouncedSetSearchParams(event.target.value);

    setTerm(event.target.value);
  }

  function reset() {
    setTerm('');
    setQuery(null);
    setQueryTags(null);
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative w-full">
        <label htmlFor="global-search" hidden>
          search
        </label>
        <Input
          id="global-search"
          value={term}
          onChange={onChange}
          placeholder="Search..."
          className="h-8 border-transparent bg-muted pl-8 shadow-none focus:bg-transparent"
        />
        <SearchIcon className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
      </div>
      {(queryTags && queryTags?.length) || (query && query.length) ? (
        <Button variant="ghost" onClick={() => reset()} className="h-8 px-2 lg:px-3">
          Reset
          <X className="ml-2 h-4 w-4" />
        </Button>
      ) : null}
      <TagsFilter tags={tags ?? []} />
    </div>
  );
}
