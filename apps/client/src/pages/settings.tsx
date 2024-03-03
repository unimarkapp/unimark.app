import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function Settings() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-medium">Settings</h1>
      <Link className={cn(buttonVariants())} to="/">
        Home
      </Link>
    </div>
  );
}
