import React, { useState } from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { THEMES, getStoredTheme, isThemeId, setTheme, type ThemeId } from "./theme";

// Palette dropdown in the navbar. Themes are defined in src/index.css.
const ThemeSwitcher: React.FC = () => {
  const [active, setActive] = useState<ThemeId>(getStoredTheme);

  const choose = (value: string) => {
    if (!isThemeId(value)) return;
    setTheme(value);
    setActive(value);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label="Colour theme"
          className="text-muted-foreground hover:text-foreground aria-expanded:text-primary"
        >
          <Palette />
        </Button>
      </DropdownMenuTrigger>
      {/* z-70 sits above the navbar (z-60), whose bottom edge the menu overlaps. */}
      <DropdownMenuContent align="end" className="z-70 w-48">
        <DropdownMenuLabel>Colour theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={active} onValueChange={choose}>
          {THEMES.map(({ id, label, swatch }) => (
            <DropdownMenuRadioItem key={id} value={id} className="min-h-11 md:min-h-8">
              <span
                aria-hidden
                className="size-3 shrink-0 rounded-full"
                style={{ background: swatch, boxShadow: `0 0 6px ${swatch}` }}
              />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
