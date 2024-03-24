import { trpc } from "@/shared/trpc";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormEvent } from "react";
import { toast } from "sonner";

export function CollectionUpdateForm({
  id,
  initialName,
}: {
  id: string;
  initialName: string;
}) {
  const utils = trpc.useUtils();

  const update = trpc.collections.rename.useMutation({
    onSuccess() {
      utils.collections.list.invalidate();

      toast.success("Collection updated");
    },
  });

  function handleUpdateForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem("name") as HTMLInputElement;

    update.mutate({ id, name: input.value });
  }

  return (
    <form onSubmit={handleUpdateForm} className="flex items-end gap-2">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          autoComplete="off"
          id="name"
          name="name"
          placeholder="Enter collection name"
          required
          defaultValue={initialName}
        />
      </div>
      <Button size="sm" variant="secondary">
        Update
      </Button>
    </form>
  );
}
