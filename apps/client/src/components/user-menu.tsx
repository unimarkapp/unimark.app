import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import {
  Github,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  UserIcon,
} from "lucide-react";
import { useProfile } from "@/entities/profile";

export function UserMenu() {
  const { data } = useProfile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-full" variant="outline">
          {data?.profile.email}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Home</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/dashboard/profile">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <Github className="mr-2 h-4 w-4" />
          <span>GitHub</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <LifeBuoy className="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
        {/* <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button
            onClick={() => submit(null, { action: "/logout", method: "POST" })}
            className="flex items-center w-full p-0"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t.common.user_menu.logout}</span>
          </button>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
