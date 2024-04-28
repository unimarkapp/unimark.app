import { Input } from "@/shared/ui/input";
import { useDebouncedCallback } from "use-debounce";
import { useSearchParams } from "react-router-dom";
import { SearchIcon } from "lucide-react";

interface Props {
  value: string;
  onChangeValue: (value: string) => void;
}

export function SearchInput({ value, onChangeValue }: Props) {
  const [, setSearchParams] = useSearchParams();
  const debouncedSetSearchParams = useDebouncedCallback(setSearchParams, 450);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    debouncedSetSearchParams((prev) => {
      prev.set("query", event.target.value);
      return prev;
    });

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
        className="h-9 pl-8 lg:w-96 border-0 shadow-none bg-muted focus:bg-transparent"
      />
      <SearchIcon className="h-4 w-4 absolute top-2.5 text-muted-foreground left-2" />
    </div>
  );
}
