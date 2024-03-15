import { Input } from "@/shared/ui/input";
import { useDebouncedCallback } from "use-debounce";
import { useSearchParams } from "react-router-dom";

interface Props {
  value: string;
  onChangeValue: (value: string) => void;
}

export function SearchInput({ value, onChangeValue }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const debouncedSetSearchParams = useDebouncedCallback(setSearchParams, 450);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    debouncedSetSearchParams((prev) => {
      prev.set("query", event.target.value);
      return prev;
    });

    onChangeValue(event.target.value);
  }

  return (
    <form className="flex items-center gap-4">
      <Input
        value={value}
        onChange={(e) => onChange(e)}
        placeholder="Search..."
        className="max-w-sm h-8"
      />
    </form>
  );
}
