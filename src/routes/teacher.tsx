import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { EmptyState, PortalShell, portalCard } from "@/components/portal-shell";
import { isAllowedSubject, matchActiveSubjectOption } from "@/data/curriculum";
import { fetchProfile, fetchTeacherByProfile, fetchTeacherSubjects } from "@/lib/portal";
import { usePortalRole } from "@/lib/use-portal-role";

export const Route = createFileRoute("/teacher")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Teacher Dashboard — Path to Qur'anic Understanding" },
      {
        name: "description",
        content: "Your teaching profile, assigned subjects and live classes.",
      },
      { property: "og:title", content: "Teacher Dashboard — Path to Qur'anic Understanding" },
      { property: "og:description", content: "Your teaching profile and assigned subjects." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TeacherPage,
});

function TeacherPage() {
  const { user, role, isLoading } = usePortalRole("teacher");

  const profileQuery = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => fetchProfile(user!.id),
    enabled: Boolean(user?.id),
  });

  const teacherQuery = useQuery({
    queryKey: ["teacher-row", user?.id],
    queryFn: () => fetchTeacherByProfile(user!.id),
    enabled: Boolean(user?.id) && role === "teacher",
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: (query) => (query.state.data ? false : 5000),
  });

  const teacherRowId = teacherQuery.data?.id;

  const teacherSubjectsQuery = useQuery({
    queryKey: ["teacher-subjects", teacherRowId],
    queryFn: () => fetchTeacherSubjects(teacherRowId!),
    enabled: Boolean(teacherRowId),
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: (query) => ((query.state.data ?? []).length === 0 ? 5000 : false),
  });

  const profile = profileQuery.data;
  const teacher = teacherQuery.data;
  const assignedSubjects = (teacherSubjectsQuery.data ?? []).filter(
    (item) => !item.subjects?.name || isAllowedSubject(item.subjects.name),
  );

  return (
    <PortalShell
      eyebrow="Teaching staff"
      role="teacher"
      title={profile?.full_name ? `Welcome, ${profile.full_name}` : "Teacher dashboard"}
      subtitle={profile?.email ?? user?.email ?? undefined}
    >
      {isLoading || teacherQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading your details…</p>
      ) : (
        <div className="space-y-12">
          <section aria-labelledby="my-details">
            <h2 id="my-details" className="font-display text-xl font-semibold">
              My details
            </h2>
            {teacherQuery.error ? (
              <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {(teacherQuery.error as Error).message}
              </p>
            ) : !teacher ? (
              <div className="mt-6">
                <EmptyState
                  title="No teacher record found"
                  body="Your account is not yet linked to a teaching record. Please contact the school administration."
                />
              </div>
            ) : (
              <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Employee ID", value: teacher.employee_id },
                  { label: "Specialisation", value: teacher.specialization },
                  { label: "Qualification", value: teacher.qualification },
                  { label: "Status", value: teacher.status },
                ].map((item) => (
                  <div key={item.label} className={portalCard}>
                    <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {item.label}
                    </dt>
                    <dd className="mt-3 text-base text-headline">{item.value ?? "Not recorded"}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>

          <section aria-labelledby="assignments">
            <h2 id="assignments" className="font-display text-xl font-semibold">
              My assigned subjects
            </h2>
            {teacherSubjectsQuery.error ? (
              <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {(teacherSubjectsQuery.error as Error).message}
              </p>
            ) : teacher && teacherSubjectsQuery.isLoading ? (
              <p className="mt-4 text-sm text-muted-foreground">Loading your assigned subjects…</p>
            ) : assignedSubjects.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  title="No subjects assigned yet"
                  body="Once the school administration assigns your subjects, they will be listed here."
                />
              </div>
            ) : (
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {assignedSubjects.map((assignment) => {
                  const matched =
                    matchActiveSubjectOption(assignment.subjects?.name) ??
                    matchActiveSubjectOption(assignment.subjects?.code);
                  const subjectTitle =
                    matched?.fullLabel ?? assignment.subjects?.name ?? "Assigned subject";
                  const subjectDesc =
                    assignment.subjects?.description ?? matched?.description ?? null;

                  return (
                    <li
                      key={`${assignment.teacher_id}-${assignment.subject_id}`}
                      className={portalCard}
                    >
                      <p className="font-display text-lg font-semibold text-headline">
                        {subjectTitle}
                      </p>
                      {(assignment.subjects?.code ?? matched?.code) && (
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-amber">
                          {assignment.subjects?.code ?? matched?.code}
                        </p>
                      )}
                      {subjectDesc && (
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {subjectDesc}
                        </p>
                      )}
                      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Assigned
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section aria-labelledby="live">
            <h2 id="live" className="font-display text-xl font-semibold">
              Live classes
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The recurring live class timetable, with join links for Google Meet and WhatsApp.
            </p>
            <Link
              to="/quiz"
              className="mt-4 mr-4 inline-block text-sm font-semibold text-amber underline underline-offset-4"
            >
              Host a live quiz →
            </Link>
            <Link
              to="/live-classes"
              className="mt-4 inline-block text-sm font-semibold text-amber underline underline-offset-4"
            >
              View live classes →
            </Link>
          </section>
        </div>
      )}
    </PortalShell>
  );
}
