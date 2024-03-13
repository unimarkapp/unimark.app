import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { trpc } from "@/shared/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  code: z.string(),
});

type Form = z.infer<typeof schema>;

export default function Confirm() {
  const utils = trpc.useUtils();

  const { register, handleSubmit } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const mutation = trpc.auth.confirm.useMutation({
    onSuccess() {
      utils.profile.get.invalidate();
    },
  });

  async function submit(data: Form) {
    mutation.mutate(data);
  }

  return (
    <div className="flex min-h-screen items-center justify-center flex-col">
      <form
        onSubmit={handleSubmit(submit)}
        className="max-w-sm w-full space-y-4"
      >
        <Input {...register("code")} placeholder="Enter your code" />
        <Button className="w-full" type="submit" disabled={mutation.isPending}>
          Confirm
        </Button>
      </form>
    </div>
  );
}
