import { Link } from "react-router-dom";
import { UserMenu } from "./user-menu";
import { Bookmark } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 space-y-8 p-6 sticky inset-y-0 left-0 bg-secondary border-r">
      <UserMenu />
      <ul>
        <li>
          <Link to="/" className="inline-flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            Bookmarks
          </Link>
        </li>
      </ul>
    </aside>
  );
}
