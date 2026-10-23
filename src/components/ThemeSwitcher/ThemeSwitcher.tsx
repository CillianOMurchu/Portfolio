import { Moon, Sun } from "lucide-react";
import React, { useState } from "react";
import { IconButton } from "../ui/IconButton";
import { getStoredTheme, setTheme, type ThemeId } from "./theme";

// Sun/moon toggle in the navbar; shows the mode you'd switch to.
const ThemeSwitcher: React.FC = () => {
  const [theme, setActive] = useState<ThemeId>(getStoredTheme);
  const next: ThemeId = theme === "dark" ? "light" : "dark";
  const Icon = next === "dark" ? Moon : Sun;

  const toggle = () => {
    setTheme(next);
    setActive(next);
  };

  return (
    <IconButton
      variant="ghost"
      label={`Switch to ${next} mode`}
      icon={<Icon strokeWidth={1.5} strokeLinecap="square" />}
      onClick={toggle}
    />
  );
};

export default ThemeSwitcher;
