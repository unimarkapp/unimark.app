import Home from "./home";
import Login from "./login";
import { RootLayout } from "@/layouts/root";
import { Navigate, Route, Routes } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/entities/profile";
import Settings from "./settings";

export function Routing() {
  const { isFetching, isError, error } = useProfile();

  if (isFetching)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );

  if (isError && error.message === "401") {
    return (
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
