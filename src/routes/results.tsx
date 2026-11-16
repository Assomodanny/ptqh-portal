import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Award, ClipboardList, Sparkles, Trophy } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState, PortalShell, portalCard } from "@/components/portal-shell";
import { ACTIVE_SUBJECT_OPTIONS, matchActiveSubjectOption } from "@/data/curriculum";
import { fetchAssessmentResults, fetchProfile, fetchStudentByProfile } from "@/lib/portal";
import { fetchStudentQuizResults } from "@/lib/quiz";
import { usePortalRole } from "@/lib/use-portal-role";

export const Route = createFileRoute("/results")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My Results — Path to Qur'anic Understanding" },
      {
        name: "description",
        content: "Your completed live quiz scores, ranks and recorded assessment results.",
      },
      { property: "og:title", content: "My Results — Path to Qur'anic Understanding" },
      {
        property: "og:description",
        content: "Your completed live quiz scores, ranks and assessment results.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: StudentResultsPage,
});

function formatDate(value: string | null): string {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StudentResultsPage() {
  const { user, role, isLoading } = usePortalRole("student");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");

  const profileQuery = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => fetchProfile(user!.id),
    enabled: Boolean(user?.id),
  });

  const studentQuery = useQuery({
    queryKey: ["student-row", user?.id],
    queryFn: () => fetchStudentByProfile(user!.id),
    enabled: Boolean(user?.id) && role === "student",
  });

  const profile = profileQuery.data;
  const student = studentQuery.data;
  const candidateNames = useMemo(
    () => [profile?.full_name, user?.fullName, profile?.email, user?.email, student?.student_id],
    [profile?.full_name, user?.fullName, profile?.email, user?.email, student?.student_id],
  );

  const quizResultsQuery = useQuery({
    queryKey: ["student-quiz-results", user?.id, student?.id, candidateNames],
    queryFn: () =>
      fetchStudentQuizResults({
        userId: user!.id,
        studentRowId: student?.id ?? null,
        candidateNames,
      }),
    enabled: Boolean(user?.id) && role === "student" && !studentQuery.isLoading,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const assessmentResultsQuery = useQuery({
    queryKey: ["student-assessment-results", student?.id],
    queryFn: () => fetchAssessmentResults({ studentRowId: student!.id }),
    enabled: Boolean(student?.id) && role === "student",
    staleTime: 0,
    refetchOnMount: "always",
  });

  const quizResults = useMemo(() => quizResultsQuery.data ?? [], [quizResultsQuery.data]);
  const assessments = useMemo(
    () => assessmentResultsQuery.data ?? [],
    [assessmentResultsQuery.data],
  );

  const filteredQuizzes = useMemo(() => {
    if (subjectFilter === "all") return quizResults;
    return quizResults.filter(
      (row) => matchActiveSubjectOption(row.subject)?.key === subjectFilter,
    );
  }, [quizResults, subjectFilter]);

  const filteredAssessments = useMemo(() => {
    if (subjectFilter === "all") return assessments;
    return assessments.filter(
      (row) => matchActiveSubjectOption(row.subjectName)?.key === subjectFilter,
    );
  }, [assessments, subjectFilter]);

  const bestRank = useMemo(() => {
    if (quizResults.length === 0) return null;
    return Math.min(...quizResults.map((r) => r.rank));
  }, [quizResults]);

  const totalQuizPoints = useMemo(() => {
    return quizResults.reduce((sum, r) => sum + r.score, 0);
  }, [quizResults]);

  const pageLoading = isLoading || studentQuery.isLoading || quizResultsQuery.isLoading;

  return (
    <PortalShell
      eyebrow="Student"
      role="student"
      title="My results"
      subtitle={
        profile?.full_name
          ? `Live quiz scores, final ranks, and recorded assessments for ${profile.full_name}.`
          : "Your completed live quiz scores, ranks, and recorded assessment results."
      }
    >
      <div className="space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/student"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-amber"
          >
            ← Back to student dashboard
          </Link>

          <div className="flex items-center gap-2">
            <label
              htmlFor="student-results-subject"
              className="text-xs uppercase tracking-[0.18em] text-muted-foreground"
            >
              Subject
            </label>
            <select
              id="student-results-subject"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="h-9 rounded-md border border-border bg-card px-3 text-sm text-headline outline-none focus:border-amber"
            >
              <option value="all">All subjects</option>
              {ACTIVE_SUBJECT_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.fullLabel}
                </option>
              ))}
            </select>
          </div>
        </div>

        {pageLoading ? (
          <p className="text-sm text-muted-foreground">Loading your results…</p>
        ) : (
          <>
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className={portalCard}>
                <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <Sparkles className="size-3.5 text-amber" aria-hidden="true" />
                  Live quizzes
                </dt>
                <dd className="mt-3 font-display text-3xl font-semibold text-headline">
                  {quizResults.length}
                </dd>
              </div>
              <div className={portalCard}>
                <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <Trophy className="size-3.5 text-amber" aria-hidden="true" />
                  Best rank
                </dt>
                <dd className="mt-3 font-display text-3xl font-semibold text-amber">
                  {bestRank !== null ? `#${bestRank}` : "—"}
                </dd>
              </div>
              <div className={portalCard}>
                <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <Award className="size-3.5 text-amber" aria-hidden="true" />
                  Total quiz points
                </dt>
                <dd className="mt-3 font-display text-3xl font-semibold text-headline">
                  {totalQuizPoints}
                </dd>
              </div>
              <div className={portalCard}>
                <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <ClipboardList className="size-3.5 text-amber" aria-hidden="true" />
                  Assessments
                </dt>
                <dd className="mt-3 font-display text-3xl font-semibold text-headline">
                  {assessments.length}
                </dd>
              </div>
            </dl>

            {/* Live Quiz Scores & Ranks */}
            <section aria-labelledby="student-quiz-results-heading" className="space-y-4">
              <div>
                <h2
                  id="student-quiz-results-heading"
                  className="font-display text-xl font-semibold"
                >
                  Live quiz scores &amp; ranks
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Final scores and positions recorded when each live quiz session ends.
                </p>
              </div>

              {quizResultsQuery.error ? (
                <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {(quizResultsQuery.error as Error).message}
                </p>
              ) : filteredQuizzes.length === 0 ? (
                <EmptyState
                  title="No live quiz results yet"
                  body="Once you join a live quiz while signed in and your teacher ends the session, your final score and rank will appear here."
                />
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border bg-card/70">
                  <table className="w-full min-w-[42rem] text-left text-sm">
                    <thead className="border-b border-border text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-medium">Quiz</th>
                        <th className="px-4 py-3 font-medium">Subject</th>
                        <th className="px-4 py-3 font-medium">Score</th>
                        <th className="px-4 py-3 font-medium">Rank</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuizzes.map((row) => (
                        <tr
                          key={row.participantId}
                          className="border-b border-border/50 last:border-0"
                        >
                          <td className="px-4 py-3.5">
                            <p className="font-medium text-headline">{row.quizTitle}</p>
                            {row.pinCode && (
                              <p className="text-xs text-muted-foreground">PIN {row.pinCode}</p>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-muted-foreground">{row.subject}</td>
                          <td className="px-4 py-3.5 font-display text-base font-semibold text-headline">
                            {row.score}
                            {row.maxPossibleScore !== null ? ` / ${row.maxPossibleScore}` : ""} pts
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${
                                row.rank === 1
                                  ? "border-amber/60 bg-amber/15 text-amber"
                                  : "border-border bg-background/60 text-headline"
                              }`}
                            >
                              #{row.rank} of {row.totalParticipants}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-muted-foreground">
                            {formatDate(row.completedAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Recorded Assessment Results (`student_results` joined to `assessments`) */}
            <section aria-labelledby="student-assessment-results-heading" className="space-y-4">
              <div>
                <h2
                  id="student-assessment-results-heading"
                  className="font-display text-xl font-semibold"
                >
                  Assessment results
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Monthly and term assessments recorded for your account.
                </p>
              </div>

              {assessmentResultsQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">Loading assessment results…</p>
              ) : assessmentResultsQuery.error ? (
                <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {(assessmentResultsQuery.error as Error).message}
                </p>
              ) : filteredAssessments.length === 0 ? (
                <EmptyState
                  title="No results recorded yet"
                  body="Once your teachers or administrators record assessment results for you, your score, total marks, percentage, grade, and date will appear here."
                />
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border bg-card/70">
                  <table className="w-full min-w-[46rem] text-left text-sm">
                    <thead className="border-b border-border text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-medium">Assessment</th>
                        <th className="px-4 py-3 font-medium">Subject</th>
                        <th className="px-4 py-3 font-medium">Score</th>
                        <th className="px-4 py-3 font-medium">Total marks</th>
                        <th className="px-4 py-3 font-medium">Percentage</th>
                        <th className="px-4 py-3 font-medium">Grade</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssessments.map((item) => (
                        <tr key={item.id} className="border-b border-border/50 last:border-0">
                          <td className="px-4 py-3.5">
                            <p className="font-medium text-headline">{item.title}</p>
                            {item.assessmentType && (
                              <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                                {item.assessmentType.replace(/_/g, " ")}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-muted-foreground">
                            {item.subjectName ?? "—"}
                          </td>
                          <td className="px-4 py-3.5 font-display text-base font-semibold text-headline">
                            {item.score !== null ? item.score : "—"}
                          </td>
                          <td className="px-4 py-3.5 text-muted-foreground">
                            {item.totalMarks !== null ? item.totalMarks : "—"}
                          </td>
                          <td className="px-4 py-3.5 text-headline">
                            {item.percentage !== null ? `${item.percentage}%` : "—"}
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-amber">
                            {item.grade ?? "—"}
                          </td>
                          <td className="px-4 py-3.5 text-muted-foreground">
                            {formatDate(item.recordedAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </PortalShell>
  );
}
