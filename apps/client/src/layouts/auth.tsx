import { cn } from "@/shared/lib";
import { buttonVariants } from "@/shared/ui/button";
import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div>
        <Outlet />
      </div>
      <div className="bg-black dark:border-l hidden lg:flex items-center justify-center flex-col gap-4">
        <svg
          width="211"
          height="209"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="211" height="209" rx="40" fill="url(#a)" />
          <path
            d="M66.068 110.398V80.636h16.636V133H66.819v-9.75h-.545c-1.16 3.205-3.137 5.75-5.932 7.636-2.773 1.864-6.125 2.796-10.057 2.796-3.568 0-6.704-.818-9.409-2.455-2.705-1.636-4.807-3.92-6.307-6.852-1.5-2.955-2.261-6.409-2.284-10.364V80.636h16.67v30.103c.023 2.841.773 5.079 2.25 6.716 1.478 1.636 3.49 2.454 6.035 2.454 1.659 0 3.147-.364 4.466-1.091 1.34-.75 2.397-1.829 3.17-3.238.796-1.432 1.193-3.16 1.193-5.182ZM91.395 133V80.636h15.853v9.614h.579c1.091-3.182 2.932-5.693 5.523-7.534 2.591-1.841 5.682-2.761 9.273-2.761 3.636 0 6.75.931 9.341 2.795 2.59 1.864 4.238 4.364 4.943 7.5h.545c.977-3.114 2.887-5.602 5.727-7.466 2.841-1.886 6.194-2.83 10.057-2.83 4.955 0 8.978 1.592 12.068 4.773 3.091 3.16 4.637 7.5 4.637 13.023V133H153.27v-31.432c0-2.614-.67-4.602-2.011-5.966-1.341-1.386-3.08-2.08-5.216-2.08-2.295 0-4.102.75-5.42 2.25-1.296 1.478-1.944 3.467-1.944 5.967V133h-16.022v-31.602c0-2.432-.659-4.352-1.978-5.762-1.318-1.409-3.056-2.113-5.215-2.113-1.455 0-2.739.352-3.853 1.056-1.113.682-1.988 1.66-2.625 2.932-.613 1.273-.92 2.773-.92 4.5V133h-16.67Zm96.33.989c-2.454 0-4.556-.864-6.306-2.591-1.728-1.728-2.58-3.818-2.557-6.273-.023-2.409.829-4.466 2.557-6.17 1.75-1.728 3.852-2.591 6.306-2.591 2.319 0 4.364.863 6.137 2.591 1.795 1.704 2.704 3.761 2.727 6.17-.023 1.636-.455 3.125-1.295 4.466a9.302 9.302 0 0 1-3.239 3.204 8.219 8.219 0 0 1-4.33 1.194Z"
            fill="url(#b)"
          />
          <defs>
            <linearGradient
              id="a"
              x1="157.438"
              y1="48.794"
              x2="-.333"
              y2="208.672"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#00C2FF" />
              <stop offset="1" stop-color="red" />
            </linearGradient>
            <linearGradient
              id="b"
              x1="164.867"
              y1="86"
              x2="49.297"
              y2="147.813"
              gradientUnits="userSpaceOnUse"
            >
              <stop />
              <stop offset="1" stop-color="#742929" />
            </linearGradient>
          </defs>
        </svg>
        <h1 className="text-center text-5xl font-bold bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-500 text-transparent">
          unimark
        </h1>
        <p className="text-muted-foreground max-w-md text-center">
          Unimark makes it easy to manage all of your bookmarks. Use our cloud
          or as a self-hosted and own your data.
        </p>
        <a
          target="_blank"
          href="https://github.com/romanslonov/unimark.app"
          className={cn([buttonVariants(), "dark gap-2"])}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 0 16 16"
            width="20"
          >
            <path
              fill="currentColor"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
            ></path>
          </svg>
          Give a star
        </a>
      </div>
    </div>
  );
}
