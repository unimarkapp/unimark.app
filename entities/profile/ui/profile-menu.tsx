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
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import {
  ChevronDownIcon,
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
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image ?? undefined} alt={user?.name} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <ChevronDownIcon
            size={16}
            strokeWidth={2}
            className="ms-1 opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-foreground">{user?.name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">{user?.email}</span>
        </DropdownMenuLabel>
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
