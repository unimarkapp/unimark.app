import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { trpc } from "@/shared/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
});

type Form = z.infer<typeof schema>;

export function CollectionCreate() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [isExpanded, setIsExpanded] = useState(false);

  const { handleSubmit, register, reset } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const create = trpc.collections.create.useMutation({
    onSuccess: async (data) => {
      await utils.collections.list.invalidate();

      setIsExpanded(false);

      reset();

      toast.success("Collection created");

      navigate(`/collections/${data.id}`);
    },
  });

  function submit(data: Form) {
    create.mutate(data);
  }

  return (
    <li>
      {isExpanded ? (
        <form className="space-y-2" onSubmit={handleSubmit(submit)}>
          <Input
            autoFocus
            {...register("name")}
            placeholder="Enter collection name"
          />
          <Button type="submit" className="w-full" size="sm" variant="outline">
            {create.isPending ? "Creating..." : "Create collection"}
          </Button>
        </form>
      ) : (
        <Button
          onClick={() => setIsExpanded(true)}
          className="w-full"
          size="sm"
          variant="outline"
        >
          Create collection
        </Button>
      )}
    </li>
  );
}
