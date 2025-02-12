'use client';

import { CheckIcon, ChevronsUpDown, GalleryVerticalEndIcon, Plus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Button } from '@/shared/ui/button';
import { api } from '@/trpc/react';
import { WorkspaceModalAdd } from './workspace-modal-add';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authClient } from '@/shared/auth/client';

export function WorkspaceSwitcher() {
  const router = useRouter();
  const { organizationId } = useParams();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { data: workspaces } = api.workspace.list.useQuery();

  const active = workspaces?.find((workspace) => workspace.id === organizationId);

  async function switchWorkspace(id: string) {
    await authClient.organization.setActive({
      organizationId: id,
    });
    router.push(`/${id}`);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-40"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm leading-tight">
              <GalleryVerticalEndIcon className="size-4 shrink-0" />
              <span className="truncate font-semibold">{active?.name}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          align="start"
          side={'right'}
          sideOffset={4}
        >
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Workspaces
          </DropdownMenuLabel>
          {workspaces?.map((workspace, index) => (
            <DropdownMenuItem
              key={workspace.name}
              className="gap-2 p-2"
              onClick={() => switchWorkspace(workspace.id)}
            >
              <div className="flex size-6 items-center justify-center rounded-sm border">
                <GalleryVerticalEndIcon className="size-4 shrink-0" />
              </div>
              {workspace.name}
              {workspace.id === organizationId && <CheckIcon className="size-2.5" />}
              <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 p-2" onClick={() => setAddModalOpen(true)}>
            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
              <Plus className="size-4" />
            </div>
            <div className="font-medium text-muted-foreground">Add workspace</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <WorkspaceModalAdd open={addModalOpen} onCloseModal={() => setAddModalOpen(false)} />
    </>
  );
}
