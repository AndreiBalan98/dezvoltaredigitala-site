"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";

// Below the desktop breakpoint the menu hides behind a button. Esc or a link click closes it.
// On desktop the button is hidden by CSS and the panel is always shown inline.
export default function MobileMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? "Închide meniul" : "Deschide meniul"}
        onClick={() => setOpen(!open)}
      >
        <Icon name={open ? "close" : "menu"} />
      </button>
      <div
        id="site-menu"
        className="menu-panel"
        data-open={open}
        onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}
      >
        {children}
      </div>
    </>
  );
}
