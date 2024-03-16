import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "./label";

type Theme = "light" | "dark" | "system";

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>();

  useEffect(() => {
    const storage = localStorage.theme;

    if (storage) {
      setTheme(storage);
    } else {
      setTheme("system");
    }
  }, []);

  function onValueChange(theme: Theme) {
    if (theme === "system") {
      localStorage.removeItem("theme");
      if (!window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.remove("dark");
      }
      setTheme("system");
      return;
    }

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    }

    localStorage.theme = theme;
    setTheme(theme);
  }

  return (
    <RadioGroup
      value={theme}
      className="flex gap-4"
      onValueChange={onValueChange}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="light" id="light" />
        <Label htmlFor="light">Light</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="dark" id="dark" />
        <Label htmlFor="dark">Dark</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="system" id="system" />
        <Label htmlFor="system">System</Label>
      </div>
    </RadioGroup>
  );
}
