'use client';

import { X } from 'lucide-react';
import { SearchInput } from './search-input';
import { Button } from '@/shared/ui/button';
import { useState } from 'react';
import { cn } from '@/shared/lib';
import { TagsFilter } from './tags-filter';
import { api } from '@/trpc/react';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';

export function SearchToolbar({ className }: { className?: string }) {
  const [query, setQuery] = useQueryState('query', parseAsString);
  const [queryTags, setQueryTags] = useQueryState('tags', parseAsArrayOf(parseAsString));
  const [term, setTerm] = useState<string>(query ?? '');

  const { data: tags } = api.tag.list.useQuery();

  function reset() {
    setTerm('');
    setQuery(null);
    setQueryTags(null);
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <SearchInput value={term} onChangeValue={setTerm} />
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
