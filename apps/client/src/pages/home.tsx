import { buttonVariants } from "@/components/ui/button";
import { useProfile } from "@/entities/profile";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function Home() {
  const { data } = useProfile();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-medium">
        Welcome home, {data?.profile.email}
      </h1>
      <Link className={cn(buttonVariants())} to="/settings">
        Settings
      </Link>
    </div>
  );
}
