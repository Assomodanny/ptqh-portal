import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BookCheck,
  BookOpen,
  CalendarClock,
  ClipboardList,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ALLOWED_SUBJECTS } from "@/data/curriculum";
import { signOut, useAuth } from "@/lib/auth";
import { fetchUserRole, type RoleName } from "@/lib/portal";

export const portalCard =
  "rounded-xl border border-border/90 bg-card/85 p-6 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:border-amber/50";
export const portalPrimaryButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-amber px-5 text-sm font-semibold tracking-wide text-primary-foreground shadow-sm transition-colors duration-200 hover:bg-amber-soft";
export const portalGhostButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-amber/50 px-5 text-sm font-medium text-amber transition-colors duration-200 hover:border-amber hover:bg-amber/10";

export function SignOutButton({
  className,
  fullWidth = false,
}: {
  className?: string;
  fullWidth?: boolean;
}) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  async function handleConfirmSignOut() {
    setBusy(true);
    try {
      await signOut();
      void navigate({ to: "/login", replace: true });
    } finally {
      setBusy(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          disabled={busy}
          className={
            className ??
            `inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:border-amber/70 hover:text-amber ${
              fullWidth ? "w-full" : ""
            }`
          }
        >
          <LogOut className="size-4" aria-hidden="true" />
          {busy ? "Signing out…" : "Sign out"}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-border bg-card text-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-xl text-headline">
            Sign out of your account?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
            Are you sure you want to sign out? You will need your school email and password to sign
            back in.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-border bg-secondary text-foreground hover:bg-accent">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => void handleConfirmSignOut()}
            className="bg-amber font-semibold text-primary-foreground hover:bg-amber-soft"
          >
            Yes, sign out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  exact?: boolean;
};

const ROLE_NAV: Record<RoleName, { label: string; items: NavItem[] }> = {
  admin: {
    label: "Administration",
    items: [
      { label: "Overview", to: "/admin", icon: LayoutDashboard, exact: true },
      { label: "Students", to: "/admin/students", icon: GraduationCap },
      { label: "Enrollments", to: "/admin/enrollments", icon: BookCheck },
      { label: "Teachers", to: "/admin/teachers", icon: Users },
      { label: "Payments", to: "/admin/payments", icon: CreditCard },
      { label: "Results", to: "/admin/results", icon: ClipboardList },
      { label: "Live classes", to: "/live-classes", icon: CalendarClock },
      { label: "Live quizzes", to: "/quiz", icon: Sparkles },
    ],
  },
  teacher: {
    label: "Teaching Staff",
    items: [
      { label: "Dashboard", to: "/teacher", icon: LayoutDashboard, exact: true },
      { label: "Live classes", to: "/live-classes", icon: CalendarClock },
      { label: "Live quizzes", to: "/quiz", icon: Sparkles },
    ],
  },
  student: {
    label: "Student Portal",
    items: [
      { label: "Dashboard", to: "/student", icon: BookOpen, exact: true },
      { label: "Results", to: "/results", icon: ClipboardList },
      { label: "Live classes", to: "/live-classes", icon: CalendarClock },
      { label: "Join live quiz", to: "/quiz/join", icon: Sparkles },
    ],
  },
};

function isNavActive(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.to || pathname === `${item.to}/`;
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}

function SidebarNav({
  role,
  email,
  pathname,
  onNavigate,
  showCloseButton = false,
}: {
  role: RoleName;
  email?: string | undefined;
  pathname: string;
  onNavigate?: () => void;
  showCloseButton?: boolean;
}) {
  const config = ROLE_NAV[role];

  return (
    <div className="flex h-full flex-col justify-between gap-6">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border/80 bg-background/60 px-3.5 py-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-amber">
              {config.label}
            </p>
            {email && (
              <p className="mt-1 truncate text-xs text-muted-foreground" title={email}>
                {email}
              </p>
            )}
          </div>
          {showCloseButton && onNavigate && (
            <button
              type="button"
              onClick={onNavigate}
              aria-label="Close portal sidebar"
              className="grid size-9 shrink-0 place-items-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-amber/60 hover:text-amber"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Programmes section at top of sidebar for every role */}
        <section
          aria-label="Programmes"
          className="rounded-lg border border-border/80 bg-background/40 p-3"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber">
            Programmes
          </p>
          <ul className="mt-2.5 space-y-1">
            {ALLOWED_SUBJECTS.map((subject) => (
              <li key={subject}>
                <Link
                  to="/live-classes"
                  onClick={onNavigate}
                  className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-xs font-medium text-foreground/90 transition-colors hover:bg-card hover:text-amber"
                >
                  <span className="size-1.5 shrink-0 rounded-full bg-amber/80" aria-hidden="true" />
                  <span className="truncate">{subject}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <nav aria-label={`${config.label} navigation`}>
          <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Navigation
          </p>
          <ul className="space-y-1">
            {config.items.map((item) => {
              const Icon = item.icon;
              const active = isNavActive(pathname, item);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-colors duration-150 ${
                      active
                        ? "border border-amber/40 bg-amber/12 font-medium text-amber"
                        : "border border-transparent text-muted-foreground hover:bg-card hover:text-headline"
                    }`}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="border-t border-border/80 pt-4">
        <SignOutButton fullWidth />
      </div>
    </div>
  );
}

export function PortalShell({
  eyebrow,
  title,
  subtitle,
  showSignOut = true,
  role: explicitRole,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string | undefined;
  showSignOut?: boolean | undefined;
  role?: RoleName | null | undefined;
  children: ReactNode;
}) {
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const roleQuery = useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: () => fetchUserRole(user!.id),
    enabled: Boolean(user?.id) && explicitRole === undefined,
  });

  const activeRole = explicitRole !== undefined ? explicitRole : (roleQuery.data ?? null);
  const showSidebar = Boolean(activeRole);

  useEffect(() => {
    if (!mobileSidebarOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileSidebarOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileSidebarOpen]);

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Persistent top-left menu button on mobile for every portal page */}
      {showSidebar && activeRole && (
        <>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open portal sidebar"
            aria-expanded={mobileSidebarOpen}
            aria-controls="mobile-portal-sidebar"
            className="fixed left-3 top-[5.25rem] z-40 inline-flex h-10 items-center gap-2 rounded-lg border border-amber/50 bg-card/95 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-amber shadow-lg backdrop-blur-md transition-colors hover:bg-amber hover:text-primary-foreground md:hidden"
          >
            <Menu className="size-4" aria-hidden="true" />
            Menu
          </button>

          {/* Dark backdrop overlay */}
          <div
            aria-hidden="true"
            onClick={() => setMobileSidebarOpen(false)}
            className={`fixed inset-0 z-50 bg-black/75 backdrop-blur-xs transition-opacity duration-200 md:hidden ${
              mobileSidebarOpen
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          />

          {/* Slide-in left mobile drawer */}
          <aside
            id="mobile-portal-sidebar"
            aria-label="Mobile portal sidebar"
            aria-hidden={!mobileSidebarOpen}
            className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] overflow-y-auto border-r border-border bg-sidebar p-4 shadow-2xl transition-transform duration-200 ease-out md:hidden ${
              mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <SidebarNav
              role={activeRole}
              email={user?.email}
              pathname={pathname}
              showCloseButton
              onNavigate={() => setMobileSidebarOpen(false)}
            />
          </aside>
        </>
      )}

      <div className="hero-gradient border-b border-border">
        <div
          className={`mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-14 lg:px-8 ${
            showSidebar ? "pt-16 md:pt-12" : "pt-12 sm:pt-14"
          }`}
        >
          <p className="inline-flex items-center rounded-full border border-amber/40 bg-amber/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-amber">
            {eyebrow}
          </p>
          <h1 className="mt-5 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/85">{subtitle}</p>
          )}
          {!showSidebar && (
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/live-classes" className={portalGhostButton}>
                Live classes
              </Link>
              {showSignOut && user && <SignOutButton />}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        {showSidebar && activeRole ? (
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            {/* Tablet & Desktop: always-visible sidebar */}
            <aside
              aria-label="Portal sidebar"
              className="hidden w-64 shrink-0 rounded-xl border border-border bg-sidebar/95 p-4 md:sticky md:top-24 md:block"
            >
              <SidebarNav role={activeRole} email={user?.email} pathname={pathname} />
            </aside>

            <div className="min-w-0 flex-1">{children}</div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
      <p className="font-display text-lg font-semibold text-headline">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
