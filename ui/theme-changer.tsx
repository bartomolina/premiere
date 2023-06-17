import { Sun, Moon } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeChanger() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex gap-4">
      The current theme is: {theme}
      <label className="swap swap-rotate">
        <input type="checkbox" />
        <Sun
          className="swap-on"
          size={25}
          onClick={() => setTheme("light")}
          alt="Light Mode"
        />
        <Moon
          className="swap-off"
          size={25}
          onClick={() => setTheme("dark")}
          alt="Dark Mode"
        />
      </label>
    </div>
  );
}
