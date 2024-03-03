import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

type Form = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  async function submit(data: Form) {
    const response = await fetch("http://localhost:3000/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    queryClient.setQueryData(["profile"], await response.json());

    navigate("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center flex-col">
      <form
        onSubmit={handleSubmit(submit)}
        className="max-w-sm w-full space-y-4"
      >
        <Input {...register("email")} placeholder="Enter your email" />
        <Button className="w-full" type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}
