import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { EmptyState, PortalShell, portalCard } from "@/components/portal-shell";
import { fetchAdminCounts, fetchProfile } from "@/lib/portal";
import { usePortalRole } from "@/lib/use-portal-role";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Path to Qur'anic Understanding" },
      {
        name: "description",
        content: "School administration overview: students, teachers and subjects.",
      },
      { property: "og:title", content: "Admin Dashboard — Path to Qur'anic Understanding" },
      { property: "og:description", content: "School administration overview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user, role, isLoading } = usePortalRole("admin");

  const profileQuery = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => fetchProfile(user!.id),
    enabled: Boolean(user?.id),
  });

  const countsQuery = useQuery({
    queryKey: ["admin-counts"],
    queryFn: fetchAdminCounts,
    enabled: role === "admin",
  });

  const name = profileQuery.data?.full_name ?? user?.email ?? "";

  return (
    <PortalShell
      eyebrow="Administration"
      role="admin"
      title="Admin dashboard"
      subtitle={name ? `Signed in as ${name}.` : "Loading your session…"}
    >
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : role && role !== "admin" ? (
        <p className="text-sm text-muted-foreground">Redirecting…</p>
      ) : (
        <div className="space-y-12">
          <section aria-labelledby="totals">
            <h2 id="totals" className="font-display text-xl font-semibold">
              School totals
            </h2>
            {countsQuery.error ? (
              <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {(countsQuery.error as Error).message}
              </p>
            ) : (
              <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Students", value: countsQuery.data?.students },
                  { label: "Teachers", value: countsQuery.data?.teachers },
                  { label: "Subjects", value: countsQuery.data?.subjects },
                ].map((stat) => (
                  <div key={stat.label} className={portalCard}>
                    <dt className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {stat.label}
                    </dt>
                    <dd className="mt-3 font-display text-4xl font-semibold text-amber">
                      {countsQuery.isLoading ? "—" : (stat.value ?? 0)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </section>

          <section aria-labelledby="quick-links">
            <h2 id="quick-links" className="font-display text-xl font-semibold">
              Quick links
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                {
                  to: "/admin/students" as const,
                  title: "View students",
                  body: "Enrolled students, class names and status.",
                },
                {
                  to: "/admin/enrollments" as const,
                  title: "Manage enrollments",
                  body: "Assign students to active subjects or remove enrollments.",
                },
                {
                  to: "/admin/teachers" as const,
                  title: "Manage teachers",
                  body: "Teaching staff, profiles and assigned subjects.",
                },
                {
                  to: "/admin/results" as const,
                  title: "View results",
                  body: "Live quiz scores, ranks and assessment results for all students.",
                },
                {
                  to: "/quiz" as const,
                  title: "Host a live quiz",
                  body: "Start a live quiz session and follow the leaderboard in real time.",
                },
                {
                  to: "/admin/payments" as const,
                  title: "Manage payments",
                  body: "Mark monthly fees as paid or unpaid for each student.",
                },
              ].map((link) => (
                <Link key={link.to} to={link.to} className={portalCard}>
                  <p className="font-display text-lg font-semibold text-headline">{link.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{link.body}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-amber">Open →</span>
                </Link>
              ))}
            </div>
          </section>

          <section aria-labelledby="live">
            <h2 id="live" className="font-display text-xl font-semibold">
              Live classes
            </h2>
            <div className="mt-6">
              <EmptyState
                title="Manage the live class schedule"
                body="Add, edit or remove recurring live classes from the Live Classes page."
              />
            </div>
            <Link
              to="/live-classes"
              className="mt-4 inline-block text-sm font-semibold text-amber underline underline-offset-4"
            >
              Go to live classes →
            </Link>
          </section>
        </div>
      )}
    </PortalShell>
  );
}
