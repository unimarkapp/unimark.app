import Home from "./home";
import Login from "./login";
// import Confirm from "./confirm";
import { RootLayout } from "@/layouts/root";
import { Navigate, Route, Routes } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/entities/profile";
import Settings from "./settings";
import Register from "./register";
import { BookmarkLayout } from "@/layouts/bookmark";
import { AuthLayout } from "@/layouts/auth";
import Trash from "./trash";

export function Routing() {
  const { data, error } = useProfile();

  if (!data && !error) return <Loading />;

  if (error) {
    if (error.data?.httpStatus === 401) {
      return (
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Route>
        </Routes>
      );
    } else {
      return (
        <Error
          message={
            error.message || "Something goes wrong. Please, try again later."
          }
        />
      );
    }
  }

  // TODO: Uncomment this when email verification is implemented
  // if (!data?.isEmailVerified) {
  //   return (
  //     <Routes>
  //       <Route path="/confirm" element={<Confirm />} />
  //       <Route path="*" element={<Navigate to="/confirm" />} />
  //     </Routes>
  //   );
  // }

  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route path="/" element={<BookmarkLayout />}>
          <Route path="" element={<Home />} />
          <Route path="/trash" element={<Trash />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin" />
    </div>
  );
}

function Error({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500">{message}</p>
    </div>
  );
}
