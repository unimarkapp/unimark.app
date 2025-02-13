import { Separator } from '@/shared/ui/separator';
import { TagsManager } from '@/features/tags/manager';
import { getSession } from '@/shared/auth/sessions';
import { notFound, redirect } from 'next/navigation';
import { ThemeSwitcher } from '@/shared/ui/theme-switcher';
import { api } from '@/trpc/server';
import { WorkspaceMemberTable } from '@/features/workspace/workspace-member-table';

type Params = Promise<{ organizationId: string }>;

export default async function Settings(props: { params: Params }) {
  const session = await getSession();

  if (!session) redirect('/login');

  const { organizationId } = await props.params;

  const workspaces = await api.workspace.list();

  if (workspaces.length === 0) return notFound();
  if (workspaces.find((w) => w.id === organizationId) === undefined)
    return redirect(`/${workspaces.find((w) => w.default)?.id}`);

  return (
    <div className="">
      <div className="p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold capitalize tracking-tight">Settings</h1>
        </div>
        <Separator className="my-8" />
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h3 className="font-semibold">Theme Preferences</h3>
            <p className="text-sm text-muted-foreground">
              You can switch between light and dark mode.
            </p>
          </div>

          <div className="lg:col-span-8">
            <ThemeSwitcher />
          </div>
        </div>

        <Separator className="my-8" />

        <div className="grid gap-4">
          <div className="">
            <h3 className="font-semibold">Members</h3>
            <p className="text-sm text-muted-foreground">Manage members of your organization.</p>
          </div>

          <div className="">
            <WorkspaceMemberTable user={session.user} />
          </div>
        </div>

        <Separator className="my-8" />

        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h3 className="font-semibold">Tags</h3>
            <p className="text-sm text-muted-foreground">Manage your tags here.</p>
          </div>

          <div className="lg:col-span-8">
            <TagsManager />
          </div>
        </div>
      </div>
    </div>
  );
}
