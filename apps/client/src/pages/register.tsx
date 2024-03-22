import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { trpc } from "@/shared/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/shared/ui/label";
import { Link } from "react-router-dom";
import { FormMessage } from "@/shared/ui/form-message";

const schema = z.object({
  email: z.string().min(1, "Email is required.").email("Email is not valid."),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters."),
});

type Form = z.infer<typeof schema>;

export default function Register() {
  const utils = trpc.useUtils();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
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
        <div>
          <h1 className="text-xl font-bold">Welcome to Unimark</h1>
          <p className="text-muted-foreground">
            Let's get started! Register for an account
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            {...register("email")}
            placeholder="Enter your email"
          />
          {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="Enter your password"
          />
          {errors.password && (
            <FormMessage>{errors.password.message}</FormMessage>
          )}
        </div>
        <Button className="w-full" type="submit" disabled={mutation.isPending}>
          Register
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link className="text-foreground font-medium" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
