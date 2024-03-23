import { Separator } from "@/shared/ui/separator";
import { CollectionsList } from "@/features/collection/collection-list";
import { BookmarkModalAdd } from "@/features/bookmark/bookmark-modal-add";
import { ProfileMenu, useLogout, useProfile } from "@/entities/profile";

export function Sidebar() {
  const { data: profile } = useProfile();
  const logout = useLogout();

  return (
    <aside className="w-64 fixed bg-background space-y-4 p-6 inset-y-0 left-0 border-r">
      <ProfileMenu onLogout={() => logout.mutate()} profile={profile} />
      <Separator />
      <BookmarkModalAdd />
      <CollectionsList />
    </aside>
  );
}
