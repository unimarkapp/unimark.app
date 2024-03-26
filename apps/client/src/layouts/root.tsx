import { Sidebar } from "@/widgets/sidebar/sidebar";
import { Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 md:ml-64 flex flex-col">
          <Outlet />
        </div>
      </div>
    </>
  );
}
