import { House } from "lucide-react";
import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useStreamAuth } from "../../context/StreamAuthContext";
import { Name } from "../name/Name";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import { IconButton } from "../ui/IconButton";
import { MenuToggleIcon } from "../ui/MenuToggleIcon";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/streaming", label: "Streaming", private: true }, // logged-in visitors only
];

// Mono labels; NavLink sets aria-current="page" on the active route, which gets the ink underline.
const LINK_CLASSES =
  "label py-2 no-underline decoration-1 underline-offset-[0.5em] transition-colors duration-(--dur-fast) ease-out hover:text-strong focus-visible:shadow-focus focus-visible:outline-none aria-[current=page]:pointer-events-none aria-[current=page]:text-strong aria-[current=page]:underline";

// The name links to About, so on About the corner becomes the way home.
const HomeIconLink: React.FC = () => (
  <Link
    to="/"
    aria-label="Home"
    title="Home"
    className="inline-grid size-10 place-items-center rounded-xs text-strong no-underline transition-colors duration-(--dur-base) ease-out hover:bg-sunken hover:text-strong focus-visible:shadow-focus focus-visible:outline-none"
  >
    <House strokeWidth={1.5} strokeLinecap="square" className="size-[1.125rem]" />
  </Link>
);

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { status } = useStreamAuth();
  const { pathname } = useLocation();
  const links = NAV_LINKS.filter((link) => !("private" in link) || status === "authed");

  return (
    <header className="fixed inset-x-0 top-0 z-60 flex h-16 items-center justify-between border-b bg-page/88 px-(--gutter) backdrop-blur-[10px]">
      {pathname === "/about" ? <HomeIconLink /> : <Name />}

      <div className="flex items-center gap-(--space-5)">
        <nav className="hidden items-center gap-(--space-5) md:flex">
          {links.map(({ href, label }) => (
            <NavLink key={href} to={href} end className={LINK_CLASSES}>
              {label}
            </NavLink>
          ))}
        </nav>

        <ThemeSwitcher />

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <IconButton
              variant="ghost"
              className="md:hidden"
              label={mobileOpen ? "Close menu" : "Open menu"}
              icon={<MenuToggleIcon isOpen={mobileOpen} />}
            />
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
            <nav className="flex flex-col px-(--space-4)">
              {links.map(({ href, label }) => (
                <SheetClose key={href} asChild>
                  <NavLink to={href} end className={`${LINK_CLASSES} border-b py-(--space-4)`}>
                    {label}
                  </NavLink>
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
