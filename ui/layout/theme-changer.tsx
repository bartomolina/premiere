import { Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeChanger() {
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  return (
    <div className="flex gap-4">
      <label className="swap swap-rotate">
        <input type="checkbox" defaultChecked={true} />
        <Sun
          className="swap-on"
          size={25}
          onClick={() => setTheme("light")}
          alt="Light Mode"
        />
        <Moon
          className="swap-off"
          size={25}
          onClick={() => setTheme("dracula")}
          alt="Dark Mode"
        />
      </label>
    </div>
  );
}
