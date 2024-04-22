import { X } from "lucide-react";
import { SearchInput } from "./search-input";
import { Button } from "@/shared/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { TagsFilter } from "./tags-filter";
import { trpc } from "@/shared/trpc";

export function SearchToolbar() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState<string>(searchParams.get("query") ?? "");
  const navigate = useNavigate();

  const tags = trpc.tags.list.useQuery();

  function reset() {
    navigate({ search: "" });
    setQuery("");
  }

  return (
    <div className="flex items-center gap-2">
      <SearchInput value={query} onChangeValue={setQuery} />
      {searchParams.size > 0 ? (
        <Button
          variant="ghost"
          onClick={() => reset()}
          className="h-8 px-2 lg:px-3"
        >
          Reset
          <X className="ml-2 h-4 w-4" />
        </Button>
      ) : null}
      {tags.data ? <TagsFilter tags={tags.data} /> : null}
    </div>
  );
}
