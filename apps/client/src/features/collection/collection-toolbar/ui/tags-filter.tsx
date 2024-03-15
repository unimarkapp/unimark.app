import { CheckIcon, PlusCircle } from "lucide-react";
import { cn } from "@/shared/lib";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Separator } from "@/shared/ui/separator";
import { useSearchParams } from "react-router-dom";

interface Props {
  tags: { id: string; name: string }[];
}

export function TagsFilter({ tags }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedValues = new Set(searchParams.getAll("tags"));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          Tags
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  tags
                    .filter((tag) => selectedValues.has(tag.id))
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
          <CommandInput placeholder={"title"} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {tags.map((option) => {
                const isSelected = searchParams
                  .getAll("tags")
                  .includes(option.id);
                return (
                  <CommandItem
                    key={option.id}
                    onSelect={() => {
                      setSearchParams((prev) => {
                        if (isSelected) {
                          prev.delete("tags", option.id);
                        } else {
                          prev.append("tags", option.id);
                        }

                        return prev;
                      });
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
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
                    onSelect={() =>
                      setSearchParams((prev) => {
                        prev.delete("tags");
                        return prev;
                      })
                    }
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
