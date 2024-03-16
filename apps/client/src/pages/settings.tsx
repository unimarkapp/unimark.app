import { Button } from "@/shared/ui/button";
import { useProfile } from "@/entities/profile";
import { trpc } from "@/shared/trpc";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { Separator } from "@/shared/ui/separator";
import { ThemeSwitcher } from "@/shared/ui/theme-switcher";

export default function Settings() {
  const utils = trpc.useUtils();
  const { data: profile } = useProfile();
  const { data: tags } = trpc.tags.list.useQuery();
  const mutation = trpc.tags.delete.useMutation({
    onSuccess: () => {
      utils.tags.list.invalidate();
    },
  });

  return (
    <div className="">
      <div className="border-b flex items-center justify-between h-[77px] px-8">
        <h1 className="text-lg font-medium tracking-tight capitalize">
          Settings
        </h1>
      </div>
      <div className="p-8">
        <div className="grid items-center grid-cols-12">
          <div className="col-span-4">
            <h3 className="font-medium">Email</h3>
            <p className="text-muted-foreground text-sm">
              Your email. Cannot be changed.
            </p>
          </div>

          <div className="col-span-8">
            <Input
              defaultValue={profile?.email}
              readOnly
              className="max-w-md"
            />
          </div>
        </div>

        <Separator className="my-8" />

        <div className="grid items-center grid-cols-12">
          <div className="col-span-4">
            <h3 className="font-medium">Theme Preferences</h3>
            <p className="text-muted-foreground text-sm">
              You can switch between light and dark mode.
            </p>
          </div>

          <div className="col-span-8">
            <ThemeSwitcher />
          </div>
        </div>

        <Separator className="my-8" />

        <div className="grid grid-cols-12">
          <div className="col-span-4">
            <h3 className="font-medium">Tags</h3>
            <p className="text-muted-foreground text-sm">
              Manage your tags here.
            </p>
          </div>

          <div className="col-span-8">
            {tags?.length ? (
              <ul className="space-y-2 max-w-[200px]">
                {tags?.map((tag) => (
                  <li
                    key={tag.id}
                    className="flex items-center justify-between gap-1"
                  >
                    <Badge variant="secondary">{tag.name}</Badge>
                    <Button
                      size="sm"
                      className="h-5 px-3"
                      onClick={() => mutation.mutate(tag.id)}
                    >
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">You don't have any tags.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
