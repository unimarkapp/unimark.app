import { Separator } from "@/shared/ui/separator";
import { CollectionsList } from "@/entities/collection/ui/collections-list";
import { BookmarkModalAdd } from "@/features/bookmark/bookmark-modal-add";
import { ProfileMenu, useLogout, useProfile } from "@/entities/profile";

export function Sidebar() {
  const { data: profile } = useProfile();
  const logout = useLogout();

  return (
    <aside className="w-64 space-y-4 p-6 sticky inset-y-0 left-0 border-r">
      <ProfileMenu onLogout={() => logout.mutate()} profile={profile} />
      <Separator />
      <BookmarkModalAdd />
      <CollectionsList />
    </aside>
  );
}
