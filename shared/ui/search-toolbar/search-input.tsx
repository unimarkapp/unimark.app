'use client';

import { Input } from '@/shared/ui/input';
import { useQueryState } from 'nuqs';
import { SearchIcon } from 'lucide-react';

interface Props {
  value: string;
  onChangeValue: (value: string) => void;
}

export function SearchInput({ value, onChangeValue }: Props) {
  const [, setQuery] = useQueryState('query', { throttleMs: 600 });

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);

    onChangeValue(event.target.value);
  }

  return (
    <div className="relative w-full">
      <label htmlFor="global-search" hidden>
        search
      </label>
      <Input
        id="global-search"
        value={value}
        onChange={(e) => onChange(e)}
        placeholder="Search..."
        className="h-8 border-0 bg-muted pl-8 shadow-none focus:bg-transparent lg:w-96"
      />
      <SearchIcon className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
    </div>
  );
}
