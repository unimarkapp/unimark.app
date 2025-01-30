'use client';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Label } from '@/shared/ui/label';
import Link from 'next/link';
import { FormMessage } from '@/shared/ui/form-message';
import { authClient } from '@/shared/auth/client';
import { useRouter } from 'next/navigation';

const schema = z.object({
  email: z.string().min(1, 'Email is required.').email('Email is not valid.'),
  password: z
    .string()
    .min(1, 'Password is required.')
    .min(8, 'Password must be at least 8 characters.'),
});

type Form = z.infer<typeof schema>;

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  async function submit(data: Form) {
    return authClient.signIn.email(data, {
      onSuccess: () => {
        router.push('/');
      },
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center flex-col">
      <form onSubmit={handleSubmit(submit)} className="max-w-sm w-full space-y-4">
        <div>
          <h1 className="text-xl font-bold">Login</h1>
          <p className="text-muted-foreground">Welcome back! Login to your account</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} placeholder="Enter your email" />
          {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
              href="/reset password"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            {...register('password')}
            placeholder="Enter your password"
          />
          {errors.password && <FormMessage>{errors.password.message}</FormMessage>}
        </div>
        <Button className="w-full" type="submit">
          Login
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Don&#39;t have an account?{' '}
          <Link className="text-foreground font-medium" href="/register">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
