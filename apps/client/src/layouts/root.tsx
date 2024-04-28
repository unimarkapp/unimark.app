import { Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <>
      <div className="flex min-h-screen">
        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
      </div>
    </>
  );
}
