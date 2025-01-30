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
import { AtSignIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { LoginWithGithubButton, LoginWithGoogleButton } from '@/features/auth';

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
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);
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
      <div className="max-w-sm w-full space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-bold">Login</h1>
          <p className="text-muted-foreground">Welcome back! Login to your account</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <LoginWithGoogleButton />
          <LoginWithGithubButton />
        </div>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                {...register('email')}
                className="peer ps-9"
                placeholder="Email"
                type="email"
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                <AtSignIcon size={16} strokeWidth={2} aria-hidden="true" />
              </div>
            </div>
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
            <div className="relative">
              <Input
                id="password"
                className="pe-9"
                {...register('password')}
                placeholder="Password"
                type={isVisible ? 'text' : 'password'}
              />
              <button
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                onClick={toggleVisibility}
                aria-label={isVisible ? 'Hide password' : 'Show password'}
                aria-pressed={isVisible}
                aria-controls="password"
              >
                {isVisible ? (
                  <EyeOffIcon size={16} strokeWidth={2} aria-hidden="true" />
                ) : (
                  <EyeIcon size={16} strokeWidth={2} aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.password && <FormMessage>{errors.password.message}</FormMessage>}
          </div>
          <Button className="w-full" type="submit">
            Login
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Don&#39;t have an account?{' '}
          <Link className="text-foreground font-medium" href="/register">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
