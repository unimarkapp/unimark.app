'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import {
  ChevronsUpDown,
  Github,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Trash2Icon,
  UserIcon,
} from 'lucide-react';
import { authClient } from '@/shared/auth/client';
import { useRouter } from 'next/navigation';
import type { User } from 'better-auth';

export function ProfileMenu({ user }: { user?: User }) {
  const router = useRouter();

  function signOut() {
    return authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login');
        },
      },
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-8 w-full gap-2" variant="outline">
          <span className="h-4 w-4 shrink-0 rounded-full bg-gradient-to-bl from-blue-500 to-blue-100"></span>
          <span className="hidden max-w-20 truncate md:inline-block">{user?.email}</span>
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/">
              <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Home</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/trash">
              <Trash2Icon className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Trash</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="https://github.com/unimarkapp/unimark.app" target="_blank">
            <Github className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>GitHub</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="mailto:hello@unimark.app">
            <LifeBuoy className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Support</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4 text-muted-foreground" />
          <div>Logout</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
