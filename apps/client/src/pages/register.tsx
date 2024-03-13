import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { trpc } from "@/shared/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type Form = z.infer<typeof schema>;

export default function Register() {
  const utils = trpc.useUtils();

  const { register, handleSubmit } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const mutation = trpc.auth.register.useMutation({
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
        <Input {...register("email")} placeholder="Enter your email" />
        <Input
          {...register("password")}
          type="password"
          placeholder="Enter your password"
        />
        <Button className="w-full" type="submit" disabled={mutation.isPending}>
          Register
        </Button>
      </form>
    </div>
  );
}
