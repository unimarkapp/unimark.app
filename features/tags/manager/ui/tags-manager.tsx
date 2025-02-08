'use client';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { api } from '@/trpc/react';
import { ScrollArea } from '@/shared/ui/scroll-area';

export function TagsManager() {
  const utils = api.useUtils();
  const { data: tags } = api.tag.list.useQuery();
  const mutation = api.tag.delete.useMutation({
    onSuccess: () => {
      utils.tag.list.invalidate();
    },
  });

  return tags?.length ? (
    <ScrollArea className="h-48 max-w-md rounded-lg border p-4">
      <ul className="space-y-2">
        {tags?.map((tag) => (
          <li key={tag.id} className="flex items-center justify-between gap-1">
            <Badge variant="secondary">{tag.name}</Badge>
            <Button size="sm" className="h-5 px-3" onClick={() => mutation.mutate(tag.id)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </ScrollArea>
  ) : (
    <p className="text-muted-foreground">You don&apos;t have any tags.</p>
  );
}
