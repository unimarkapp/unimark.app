import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Separator } from "@/shared/ui/separator";
import { useSearchParams } from "react-router-dom";

export function Sorting() {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultValue = searchParams.get("sortBy") ?? "desc";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          Sort by date
          <Separator orientation="vertical" className="mx-2 h-4" />
          <div className="hidden space-x-1 lg:flex">
            <Badge variant="secondary" className="rounded-sm px-1 font-normal">
              {defaultValue}
            </Badge>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36" align="start">
        <DropdownMenuRadioGroup
          value={defaultValue}
          onValueChange={(value) => {
            setSearchParams((prev) => {
              prev.set("sortBy", value);

              return prev;
            });
          }}
        >
          <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
