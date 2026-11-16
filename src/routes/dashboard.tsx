import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { SignOutButton } from "@/components/portal-shell";
import { ensureStudentOnboarding, useAuth } from "@/lib/auth";
import { fetchUserRole, roleHome } from "@/lib/portal";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Dashboard — Path to Qur'anic Understanding" },
      {
        name: "description",
        content:
          "Your Path to Qur'anic Understanding portal dashboard — you'll be taken to the right view for your role.",
      },
      { property: "og:title", content: "Dashboard — Path to Qur'anic Understanding" },
      {
        property: "og:description",
        content: "Your Path to Qur'anic Understanding portal dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const attemptedOnboardingRef = useRef<string | null>(null);

  const roleQuery = useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: () => fetchUserRole(user!.id),
    enabled: Boolean(user?.id),
  });

  useEffect(() => {
    if (!isLoading && !user) void navigate({ to: "/login", replace: true });
  }, [isLoading, user, navigate]);

  const role = roleQuery.data ?? null;

  useEffect(() => {
    if (!user?.id || !roleQuery.isSuccess || role !== null) return;
    if (attemptedOnboardingRef.current === user.id) return;
    attemptedOnboardingRef.current = user.id;

    void ensureStudentOnboarding(user.id, user.fullName, user.email).then(() => {
      void queryClient.invalidateQueries({ queryKey: ["user-role", user.id] });
    });
  }, [user, roleQuery.isSuccess, role, queryClient]);

  useEffect(() => {
    if (!role) return;
    void navigate({ to: roleHome[role], replace: true });
  }, [role, navigate]);

  const noRole = Boolean(user) && roleQuery.isSuccess && role === null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">
        {noRole ? "Your account is pending enrollment" : "Dashboard"}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
        {isLoading || roleQuery.isLoading
          ? "Loading your session…"
          : roleQuery.error
            ? (roleQuery.error as Error).message
            : noRole
              ? "Your account has been created and is waiting for an administrator to complete your student enrollment and assign your subjects."
              : "Taking you to your dashboard…"}
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <SignOutButton />
        <Link
          to="/"
          className="inline-flex h-11 items-center justify-center rounded-md border border-border px-5 text-sm font-medium transition-colors hover:border-amber/70 hover:text-amber"
        >
          Back to site
        </Link>
      </div>
    </div>
  );
}
