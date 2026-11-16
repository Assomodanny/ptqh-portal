import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";

const navLinks = [
  { label: "Curriculum", href: "/#curriculum" },
  { label: "Live classes", href: "/live-classes" },
  { label: "About", href: "/#about" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group flex min-w-0 items-center gap-3.5 rounded-sm transition-opacity hover:opacity-90"
          onClick={() => setIsOpen(false)}
        >
          <img
            src="/favicon.png"
            alt="PTQU Crest"
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-lg border border-amber/40 bg-[#151210] object-cover shadow-sm"
          />
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-display text-base font-semibold tracking-tight text-amber sm:text-xl lg:text-[1.45rem]">
              <span className="sm:hidden">PTQU</span>
              <span className="hidden sm:inline">Path to Qur&apos;anic Understanding</span>
            </span>
            <span className="mt-1 h-px w-full max-w-[12rem] bg-amber/40" aria-hidden="true" />
            <span className="mt-1 text-[10px] uppercase tracking-[0.24em] text-muted-foreground sm:text-[11px]">
              School Portal
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="border-b border-transparent pb-1 text-sm text-muted-foreground transition-colors duration-200 hover:border-amber hover:text-headline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            to="/quiz/join"
            className="hidden text-sm text-muted-foreground transition-colors duration-200 hover:text-headline md:inline-block"
          >
            Join quiz
          </Link>

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                to="/dashboard"
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-amber px-5 text-sm font-semibold tracking-wide text-primary-foreground shadow-sm transition-colors duration-200 hover:bg-amber-soft"
              >
                Portal
              </Link>
              <Link
                to="/signup"
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-amber/60 px-4 text-sm font-semibold tracking-wide text-amber transition-colors duration-200 hover:border-amber hover:bg-amber/10"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                to="/login"
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-amber px-4 text-sm font-semibold tracking-wide text-primary-foreground shadow-sm transition-colors duration-200 hover:bg-amber-soft"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-amber/60 px-4 text-sm font-semibold tracking-wide text-amber transition-colors duration-200 hover:border-amber hover:bg-amber/10"
              >
                Sign up
              </Link>
            </div>
          )}

          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsOpen((v) => !v)}
            className="grid size-10 shrink-0 place-items-center rounded-md border border-border text-foreground transition-colors duration-200 hover:border-amber/70 hover:text-amber lg:hidden"
          >
            {isOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-border bg-background lg:hidden"
        >
          <ul className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block border-b border-border/60 py-3.5 text-base text-foreground transition-colors duration-200 hover:text-amber"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/quiz/join"
                onClick={() => setIsOpen(false)}
                className="block border-b border-border/60 py-3.5 text-base text-foreground transition-colors duration-200 hover:text-amber"
              >
                Join quiz
              </Link>
            </li>
            {user ? (
              <li className="grid grid-cols-2 gap-3 pt-3 sm:hidden">
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-md bg-amber px-4 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-amber-soft"
                >
                  Portal
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-md border border-amber/60 px-4 text-sm font-semibold text-amber transition-colors duration-200 hover:border-amber hover:bg-amber/10"
                >
                  Sign up
                </Link>
              </li>
            ) : (
              <li className="grid grid-cols-2 gap-3 pt-3 sm:hidden">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-md bg-amber px-4 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-amber-soft"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-md border border-amber/60 px-4 text-sm font-semibold text-amber transition-colors duration-200 hover:border-amber hover:bg-amber/10"
                >
                  Sign up
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
