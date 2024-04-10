import { Loader2 } from "lucide-react";
import { cn } from "../lib";

interface Props {
  isFetchingNextPage: boolean;
  isRefetching: boolean;
}

export function FetchingIndicator({ isFetchingNextPage, isRefetching }: Props) {
  return (
    <div
      className={cn(
        "fixed left-[50%] flex items-center gap-2 -translate-x-[50%] bottom-4 rounded-full bg-background/50 p-2 pr-3 border backdrop-blur-sm transition-transform duration-200 shadow",
        isFetchingNextPage || isRefetching
          ? "translate-y-0"
          : "translate-y-[calc(100%_+_1rem)]"
      )}
    >
      <Loader2 className="w-5 h-5 animate-spin" />
      <span className="font-medium text-sm">
        {isRefetching ? "Refreshing..." : "Loading..."}
      </span>
    </div>
  );
}
