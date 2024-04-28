import { Link, Outlet } from "react-router-dom";
import { SearchToolbar } from "@/shared/ui/search-toolbar";
import { ProfileMenu } from "@/entities/profile";
import { BookmarkModalAdd } from "@/features/bookmark/bookmark-modal-add";
import { BookmarkModalImport } from "@/features/bookmark/bookmark-modal-import";
import logo from "@/assets/unimark.svg";

export function BookmarkLayout() {
  return (
    <div className="">
      <div className="border-b justify-between sticky z-10 right-0 left-0 top-0 bg-background flex md:items-center gap-2 py-3 px-4 md:px-8">
        <Link to="/" className="inline-flex shrink-0 gap-2 items-center">
          <img src={logo} className="shrink-0 w-7 h-7" />
          <span className="hidden md:inline-block font-bold">unimark.</span>
        </Link>
        <SearchToolbar />
        <div className="flex items-center gap-2">
          <BookmarkModalAdd />
          <BookmarkModalImport />
          <ProfileMenu />
        </div>
      </div>
      <div className="md:p-8 p-4 space-y-8">
        <Outlet />
      </div>
    </div>
  );
}
