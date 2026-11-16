import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { EmptyState, PortalShell, portalCard } from "@/components/portal-shell";
import { PaymentDue } from "@/components/payment-due";
import { isAllowedSubject } from "@/data/curriculum";
import {
  evaluatePaymentStatus,
  fetchEnrollments,
  fetchProfile,
  fetchStudentByProfile,
  fetchStudentPayments,
  monthStart,
} from "@/lib/portal";
import { usePortalRole } from "@/lib/use-portal-role";

export const Route = createFileRoute("/student")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Student Dashboard — Path to Qur'anic Understanding" },
      {
        name: "description",
        content: "Your enrolled subjects, student record and live class schedule.",
      },
      { property: "og:title", content: "Student Dashboard — Path to Qur'anic Understanding" },
      { property: "og:description", content: "Your enrolled subjects and live classes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: StudentPage,
});

function StudentPage() {
  const { user, role, isLoading } = usePortalRole("student");

  const profileQuery = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => fetchProfile(user!.id),
    enabled: Boolean(user?.id),
  });

  const studentQuery = useQuery({
    queryKey: ["student-row", user?.id],
    queryFn: () => fetchStudentByProfile(user!.id),
    enabled: Boolean(user?.id) && role === "student",
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: (query) => (query.state.data ? false : 5000),
  });

  const studentRowId = studentQuery.data?.id;

  const enrollmentsQuery = useQuery({
    queryKey: ["enrollments", studentRowId],
    queryFn: () => fetchEnrollments(studentRowId!),
    enabled: Boolean(studentRowId),
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: (query) => ((query.state.data ?? []).length === 0 ? 5000 : false),
  });

  const month = monthStart();

  const paymentsQuery = useQuery({
    queryKey: ["student-payments", studentRowId, month],
    queryFn: () =>
      fetchStudentPayments(studentRowId!, studentQuery.data?.student_id ?? null, month),
    enabled: Boolean(studentRowId),
  });

  const profile = profileQuery.data;
  const student = studentQuery.data;
  const enrollments = (enrollmentsQuery.data ?? []).filter(
    (item) =>
      (!item.subjects?.name || isAllowedSubject(item.subjects.name)) &&
      (item.status === "active" || item.status === "completed"),
  );
  const payment = paymentsQuery.data ? evaluatePaymentStatus(paymentsQuery.data) : null;

  return (
    <PortalShell
      eyebrow="Student"
      role="student"
      title={
        payment?.blocked
          ? "Payment due"
          : profile?.full_name
            ? `Welcome, ${profile.full_name}`
            : "Student dashboard"
      }
      subtitle={profile?.email ?? user?.email ?? undefined}
    >
      {isLoading || studentQuery.isLoading || (Boolean(studentRowId) && paymentsQuery.isLoading) ? (
        <p className="text-sm text-muted-foreground">Loading your details…</p>
      ) : payment?.blocked ? (
        <PaymentDue
          amountOwed={payment.amountOwed}
          unpaid={payment.unpaid}
          studentCode={student?.student_id ?? null}
          month={month}
        />
      ) : (
        <div className="space-y-12">
          {!studentQuery.isLoading &&
            !enrollmentsQuery.isLoading &&
            (!student || enrollments.length === 0) && (
              <section
                aria-label="Enrollment status"
                className="rounded-xl border border-amber/50 bg-amber/10 p-6 sm:p-7"
              >
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber">
                  Enrollment status
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-headline">
                  Your account is pending enrollment
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/85">
                  Welcome to Path to Qur&apos;anic Understanding. Your student account is active,
                  and you will see your assigned subjects here as soon as an administrator enrols
                  you.
                </p>
              </section>
            )}

          <section aria-labelledby="my-record">
            <h2 id="my-record" className="font-display text-xl font-semibold">
              My record
            </h2>
            {studentQuery.error ? (
              <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {(studentQuery.error as Error).message}
              </p>
            ) : !student ? (
              <div className="mt-6">
                <EmptyState
                  title="Your account is pending enrollment"
                  body="Your student record and subject enrolments have not been linked yet. An administrator will enrol you shortly."
                />
              </div>
            ) : (
              <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Student ID", value: student.student_id },
                  { label: "Class", value: student.class_name },
                  { label: "Admitted", value: student.admission_date },
                  { label: "Status", value: student.status },
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

          <section aria-labelledby="my-subjects">
            <h2 id="my-subjects" className="font-display text-xl font-semibold">
              Enrolled subjects
            </h2>
            {enrollmentsQuery.error ? (
              <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {(enrollmentsQuery.error as Error).message}
              </p>
            ) : enrollmentsQuery.isLoading ? (
              <p className="mt-4 text-sm text-muted-foreground">Loading your subjects…</p>
            ) : enrollments.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  title="Your account is pending enrollment"
                  body="Once the administration enrols you in subjects, they will be listed here."
                />
              </div>
            ) : (
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {enrollments.map((enrollment) => (
                  <li key={enrollment.id} className={portalCard}>
                    <p className="font-display text-lg font-semibold text-headline">
                      {enrollment.subjects?.name ?? "Subject"}
                    </p>
                    {enrollment.subjects?.code && (
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-amber">
                        {enrollment.subjects.code}
                      </p>
                    )}
                    {enrollment.subjects?.description && (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {enrollment.subjects.description}
                      </p>
                    )}
                    <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {enrollment.status ?? "active"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="live">
            <h2 id="live" className="font-display text-xl font-semibold">
              Live classes
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The recurring live class timetable with join links.
            </p>
            <Link
              to="/live-classes"
              className="mt-4 inline-block text-sm font-semibold text-amber underline underline-offset-4"
            >
              View live classes →
            </Link>
          </section>

          <section aria-labelledby="live-quiz">
            <h2 id="live-quiz" className="font-display text-xl font-semibold">
              Live quiz
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Got a 6-digit PIN from your teacher? Join the live quiz and play along.
            </p>
            <Link
              to="/quiz/join"
              className="mt-4 inline-block text-sm font-semibold text-amber underline underline-offset-4"
            >
              Join a quiz →
            </Link>
          </section>

          <section aria-labelledby="my-results">
            <h2 id="my-results" className="font-display text-xl font-semibold">
              Results
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              View your completed live quiz scores, ranks, and recorded assessment results.
            </p>
            <Link
              to="/results"
              className="mt-4 inline-block text-sm font-semibold text-amber underline underline-offset-4"
            >
              View my results →
            </Link>
          </section>
        </div>
      )}
    </PortalShell>
  );
}
