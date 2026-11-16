import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Search, Sparkles, Trophy, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState, PortalShell, portalCard } from "@/components/portal-shell";
import { ACTIVE_SUBJECT_OPTIONS, matchActiveSubjectOption } from "@/data/curriculum";
import { fetchAssessmentResults } from "@/lib/portal";
import { fetchAllEndedQuizResults } from "@/lib/quiz";
import { usePortalRole } from "@/lib/use-portal-role";

export const Route = createFileRoute("/admin/results")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Results — Admin — Path to Qur'anic Understanding" },
      {
        name: "description",
        content: "All students' live quiz scores, ranks and recorded assessment results.",
      },
      { property: "og:title", content: "Results — Admin" },
      {
        property: "og:description",
        content: "All students' live quiz scores, ranks and recorded assessment results.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminResultsPage,
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

function AdminResultsPage() {
  const { role } = usePortalRole("admin");
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");

  const quizResultsQuery = useQuery({
    queryKey: ["admin-quiz-results"],
    queryFn: fetchAllEndedQuizResults,
    enabled: role === "admin",
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const assessmentResultsQuery = useQuery({
    queryKey: ["admin-assessment-results"],
    queryFn: () => fetchAssessmentResults(),
    enabled: role === "admin",
    staleTime: 0,
    refetchOnMount: "always",
  });

  const quizResults = useMemo(() => quizResultsQuery.data ?? [], [quizResultsQuery.data]);
  const assessments = useMemo(
    () => assessmentResultsQuery.data ?? [],
    [assessmentResultsQuery.data],
  );

  const uniqueSessionCount = useMemo(() => {
    return new Set(quizResults.map((row) => row.sessionId)).size;
  }, [quizResults]);

  const uniqueStudentCount = useMemo(() => {
    const keys = new Set<string>();
    for (const row of quizResults) {
      keys.add(row.matchedProfileId ?? row.studentName.toLowerCase());
    }
    for (const row of assessments) {
      keys.add(row.studentId ?? (row.studentName ?? row.id).toLowerCase());
    }
    return keys.size;
  }, [quizResults, assessments]);

  const filteredQuizzes = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return quizResults.filter((row) => {
      if (subjectFilter !== "all" && matchActiveSubjectOption(row.subject)?.key !== subjectFilter) {
        return false;
      }
      if (!q) return true;
      return (
        row.studentName.toLowerCase().includes(q) ||
        (row.matchedStudentCode ?? "").toLowerCase().includes(q) ||
        row.quizTitle.toLowerCase().includes(q) ||
        row.subject.toLowerCase().includes(q)
      );
    });
  }, [quizResults, subjectFilter, searchTerm]);

  const filteredAssessments = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return assessments.filter((row) => {
      if (
        subjectFilter !== "all" &&
        matchActiveSubjectOption(row.subjectName)?.key !== subjectFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        (row.studentName ?? "").toLowerCase().includes(q) ||
        row.title.toLowerCase().includes(q) ||
        (row.subjectName ?? "").toLowerCase().includes(q)
      );
    });
  }, [assessments, subjectFilter, searchTerm]);

  return (
    <PortalShell
      eyebrow="Administration"
      role="admin"
      title="Results"
      subtitle="Live quiz scores, final ranks, and assessment results recorded across all students."
    >
      <div className="space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/admin"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-amber"
          >
            ← Back to admin dashboard
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search student or quiz…"
                className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm text-headline outline-none focus:border-amber"
              />
            </div>

            <select
              aria-label="Filter by subject"
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

        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className={portalCard}>
            <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles className="size-3.5 text-amber" aria-hidden="true" />
              Completed quizzes
            </dt>
            <dd className="mt-3 font-display text-3xl font-semibold text-headline">
              {quizResultsQuery.isLoading ? "—" : uniqueSessionCount}
            </dd>
          </div>
          <div className={portalCard}>
            <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Trophy className="size-3.5 text-amber" aria-hidden="true" />
              Quiz entries
            </dt>
            <dd className="mt-3 font-display text-3xl font-semibold text-amber">
              {quizResultsQuery.isLoading ? "—" : quizResults.length}
            </dd>
          </div>
          <div className={portalCard}>
            <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Users className="size-3.5 text-amber" aria-hidden="true" />
              Students ranked
            </dt>
            <dd className="mt-3 font-display text-3xl font-semibold text-headline">
              {quizResultsQuery.isLoading ? "—" : uniqueStudentCount}
            </dd>
          </div>
          <div className={portalCard}>
            <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <ClipboardList className="size-3.5 text-amber" aria-hidden="true" />
              Assessments
            </dt>
            <dd className="mt-3 font-display text-3xl font-semibold text-headline">
              {assessmentResultsQuery.isLoading ? "—" : assessments.length}
            </dd>
          </div>
        </dl>

        {/* Live Quiz Scores & Ranks */}
        <section aria-labelledby="admin-quiz-results-heading" className="space-y-4">
          <div>
            <h2 id="admin-quiz-results-heading" className="font-display text-xl font-semibold">
              Live quiz results (all students)
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Final scores and ranks recorded whenever a live quiz session ends.
            </p>
          </div>

          {quizResultsQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading live quiz results…</p>
          ) : quizResultsQuery.error ? (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {(quizResultsQuery.error as Error).message}
            </p>
          ) : filteredQuizzes.length === 0 ? (
            <EmptyState
              title="No completed quiz results found"
              body={
                quizResults.length === 0
                  ? "Once a teacher or admin hosts a live quiz and ends the session, every student's final score and rank will appear here."
                  : "No quiz entries match your current search or subject filter."
              }
            />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border bg-card/70">
              <table className="w-full min-w-[48rem] text-left text-sm">
                <thead className="border-b border-border text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Student</th>
                    <th className="px-4 py-3 font-medium">Quiz</th>
                    <th className="px-4 py-3 font-medium">Subject</th>
                    <th className="px-4 py-3 font-medium">Score</th>
                    <th className="px-4 py-3 font-medium">Rank</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuizzes.map((row) => (
                    <tr key={row.participantId} className="border-b border-border/50 last:border-0">
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-headline">{row.studentName}</p>
                        {row.matchedStudentCode && (
                          <p className="text-xs text-amber">{row.matchedStudentCode}</p>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-headline">{row.quizTitle}</p>
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
        <section aria-labelledby="admin-assessment-results-heading" className="space-y-4">
          <div>
            <h2
              id="admin-assessment-results-heading"
              className="font-display text-xl font-semibold"
            >
              Assessment results (all students)
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Monthly and term assessment scores recorded across all students.
            </p>
          </div>

          {assessmentResultsQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading assessment records…</p>
          ) : assessmentResultsQuery.error ? (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {(assessmentResultsQuery.error as Error).message}
            </p>
          ) : filteredAssessments.length === 0 ? (
            <EmptyState
              title="No results recorded yet"
              body={
                assessments.length === 0
                  ? "No assessment results have been recorded yet. Once results are saved for students, they will appear here."
                  : "No assessment rows match your current filter."
              }
            />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border bg-card/70">
              <table className="w-full min-w-[52rem] text-left text-sm">
                <thead className="border-b border-border text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Student</th>
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
                        <p className="font-medium text-headline">{item.studentName ?? "Student"}</p>
                        {item.studentCode && (
                          <p className="text-xs text-amber">{item.studentCode}</p>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-headline">{item.title}</p>
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
                      <td className="px-4 py-3.5 font-semibold text-amber">{item.grade ?? "—"}</td>
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
      </div>
    </PortalShell>
  );
}
