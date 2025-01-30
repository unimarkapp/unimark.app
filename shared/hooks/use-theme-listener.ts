import { useEffect } from "react";

export function useThemeListener() {
  function update(e: MediaQueryListEvent) {
    if (!("theme" in localStorage)) {
      e.matches
        ? document.documentElement.classList.add("dark")
        : document.documentElement.classList.remove("dark");
    }
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);
}
