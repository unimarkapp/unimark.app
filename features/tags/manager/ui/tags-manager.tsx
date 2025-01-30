import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { trpc } from "@/shared/trpc";
import { ScrollArea } from "@/shared/ui/scroll-area";

export function TagsManager() {
  const utils = trpc.useUtils();
  const { data: tags } = trpc.tags.list.useQuery();
  const mutation = trpc.tags.delete.useMutation({
    onSuccess: () => {
      utils.tags.list.invalidate();
    },
  });

  return tags?.length ? (
    <ScrollArea className="h-48 max-w-md p-4 border rounded-lg">
      <ul className="space-y-2">
        {tags?.map((tag) => (
          <li key={tag.id} className="flex items-center justify-between gap-1">
            <Badge variant="secondary">{tag.name}</Badge>
            <Button
              size="sm"
              className="h-5 px-3"
              onClick={() => mutation.mutate(tag.id)}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </ScrollArea>
  ) : (
    <p className="text-muted-foreground">You don't have any tags.</p>
  );
}
