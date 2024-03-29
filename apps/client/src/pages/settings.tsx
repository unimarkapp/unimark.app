import { useProfile } from "@/entities/profile";
import { Input } from "@/shared/ui/input";
import { Separator } from "@/shared/ui/separator";
import { ThemeSwitcher } from "@/shared/ui/theme-switcher";
import { TagsManager } from "@/features/tags/manager";

export default function Settings() {
  const { data: profile } = useProfile();

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
            <TagsManager />
          </div>
        </div>
      </div>
    </div>
  );
}
