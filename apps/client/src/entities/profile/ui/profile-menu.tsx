import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Button } from "@/shared/ui/button";
import { Link } from "react-router-dom";
import {
  ChevronsUpDown,
  Github,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Trash2Icon,
  UserIcon,
} from "lucide-react";
import { useLogout, useProfile } from "../hooks";

export function ProfileMenu() {
  const { data: profile } = useProfile();
  const logout = useLogout();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-full gap-2" variant="outline">
          <span className="w-4 h-4 shrink-0 rounded-full bg-gradient-to-bl from-blue-500 to-blue-100"></span>
          <span className="hidden md:inline-block truncate max-w-20">
            {profile?.email}
          </span>
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
            <Link to="/settings">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/trash">
              <Trash2Icon className="mr-2 h-4 w-4" />
              <span>Trash</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="https://github.com/unimarkapp/unimark.app" target="_blank">
            <Github className="mr-2 h-4 w-4" />
            <span>GitHub</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="mailto:hello@unimark.app">
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Support</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout.mutate()}>
          <LogOut className="mr-2 h-4 w-4" />
          <div>Logout</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
