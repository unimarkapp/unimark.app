import { Button, buttonVariants } from "@/shared/ui/button";
import { useProfile } from "@/entities/profile";
import { cn } from "@/shared/lib";
import { Link } from "react-router-dom";

export default function Settings() {
  const { data, refetch } = useProfile();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-medium">Settings</h1>
      <Link className={cn(buttonVariants())} to="/">
        Home
      </Link>

      <div>{data?.email}</div>

      <Button onClick={() => refetch()}>Refresh profile</Button>
    </div>
  );
}
