import { trpc } from "@/shared/trpc";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { ArchiveRestore, Trash2 } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ListItem } from "./list-item";
import { toast } from "sonner";

export function BookmarksTrashedList() {
  const utils = trpc.useUtils();
  const [searchParams] = useSearchParams();

  const { data, isLoading, error } = trpc.bookmarks.list.useQuery({
    query: searchParams.get("query") ?? undefined,
    tags: searchParams.getAll("tags") ?? undefined,
    deleted: true,
  });

  const deleteForeverMutation = trpc.bookmarks.deleteForever.useMutation({
    async onSuccess() {
      await onMutationSucces();
      toast.success("Bookmarks deleted forever");
    },
  });

  const emptyTrashMutation = trpc.bookmarks.emptyTrash.useMutation({
    async onSuccess() {
      await onMutationSucces();
      toast.success("Trash is empty");
    },
  });

  const restoreMutation = trpc.bookmarks.restore.useMutation({
    async onSuccess() {
      await onMutationSucces();
      toast.success("Bookmarks restored");
    },
  });

  const [selected, setSelected] = useState(new Set<string>());

  function deleteSelected() {
    deleteForeverMutation.mutate(Array.from(selected));
  }

  function emptyTrash() {
    emptyTrashMutation.mutate();
  }

  function restore() {
    restoreMutation.mutate(Array.from(selected));
  }

  async function onMutationSucces() {
    await utils.bookmarks.list.invalidate({
      query: searchParams.get("query") ?? undefined,
      tags: searchParams.getAll("tags") ?? undefined,
      deleted: true,
    });
    await utils.collections.list.invalidate();
    await utils.stats.all.invalidate();
    setSelected(new Set());
  }

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (data?.length === 0) {
    return <Empty />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
        <h2 className="space-x-2 font-medium">
          <span>Bookmarks in trash will be deleted forever after 30 days</span>
          <Badge variant="outline">Coming soon</Badge>
        </h2>
        {selected.size > 0 ? (
          <div className="flex items-center gap-2">
            <div className="font-medium text-sm">
              Selected ({selected.size})
            </div>
            <Button
              onClick={() => restore()}
              variant="outline"
              disabled={restoreMutation.isPending}
              size="sm"
            >
              {restoreMutation.isPending ? (
                <span>Restoring...</span>
              ) : (
                <>
                  <ArchiveRestore className="w-4 h-4 mr-1" />
                  Restore
                </>
              )}
            </Button>
            <Button
              onClick={() => deleteSelected()}
              variant="destructive"
              disabled={deleteForeverMutation.isPending}
              size="sm"
            >
              {deleteForeverMutation.isPending ? (
                <span>Deleting...</span>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete forever
                </>
              )}
            </Button>
          </div>
        ) : (
          <div>
            <Button
              onClick={() => emptyTrash()}
              variant="destructive"
              size="sm"
              disabled={emptyTrashMutation.isPending}
            >
              {emptyTrashMutation.isPending ? (
                <span>Emptying...</span>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Empty trash
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      <ul className="space-y-2">
        {data?.map((bookmark) => (
          <ListItem
            id={bookmark.id}
            cover={bookmark.cover}
            title={bookmark.title}
            url={bookmark.url}
            key={bookmark.id}
            selected={selected.has(bookmark.id)}
            onCheckedChange={(checked) => {
              setSelected((prev) => {
                if (checked) {
                  return new Set([...prev, bookmark.id]);
                }

                prev.delete(bookmark.id);
                return new Set(prev);
              });
            }}
            onDelete={() => {
              deleteForeverMutation.mutate([bookmark.id]);
            }}
            onRestore={() => {}}
          />
        ))}
      </ul>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div className="h-28 bg-muted animate-pulse rounded-lg" key={i}></div>
      ))}
    </div>
  );
}

function Empty() {
  return (
    <div className="">
      <h2 className="text-lg font-medium">Your trash is empty.</h2>
      <p className="text-muted-foreground">
        Move bookmarks you don't need to trash.
      </p>
    </div>
  );
}
