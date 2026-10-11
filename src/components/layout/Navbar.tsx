import { Button } from "@/components/ui/button";
import { MenuToggleIcon } from "@/components/ui/MenuToggleIcon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { House, Radio } from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Name } from "../name/Name";

const NAV_LINKS = [
  { href: "/", icon: House, label: "Home" },
  { href: "/streaming", icon: Radio, label: "Streaming" },
];

// NavLink sets aria-current="page" on the active route.
const LINK_CLASSES =
  "text-muted-foreground hover:text-foreground aria-[current=page]:text-primary aria-[current=page]:pointer-events-none";

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-60 flex h-16 items-center justify-between border-b bg-black/90 px-6 backdrop-blur-sm">
      <Name />

      <div className="flex items-center gap-2">
        <nav className="hidden items-center gap-2 md:flex">
          {NAV_LINKS.map(({ href, icon: Icon, label }) => (
            <Button key={href} asChild variant="ghost" className={LINK_CLASSES}>
              <NavLink to={href} end>
                <Icon />
                {label}
              </NavLink>
            </Button>
          ))}
        </nav>

        {/* <ThemeSwitcher /> */}

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon-lg"
              className="md:hidden aria-expanded:bg-transparent"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <MenuToggleIcon isOpen={mobileOpen} />
            </Button>
          </SheetTrigger>
          {/* Opens below the navbar so the toggle stays visible; clicking it while
            open counts as an outside click, which closes the Sheet. */}
          <SheetContent
            side="right"
            showCloseButton={false}
            className="data-[side=right]:top-16 data-[side=right]:h-[calc(100dvh-4rem)]"
          >
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-2">
              {NAV_LINKS.map(({ href, icon: Icon, label }) => (
                <SheetClose key={href} asChild>
                  <Button
                    asChild
                    variant="ghost"
                    size="lg"
                    className={`justify-start ${LINK_CLASSES}`}
                  >
                    <NavLink to={href} end>
                      <Icon />
                      {label}
                    </NavLink>
                  </Button>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
