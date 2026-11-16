import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookCheck, Check, Search, Trash2, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";

import {
  EmptyState,
  PortalShell,
  portalCard,
  portalPrimaryButton,
} from "@/components/portal-shell";
import { isAllowedSubject, matchActiveSubjectOption } from "@/data/curriculum";
import {
  enrollStudentInSubjects,
  fetchAllEnrollments,
  fetchResolvedActiveSubjects,
  fetchStudentCandidates,
  removeEnrollment,
  type AdminEnrollmentRow,
  type StudentCandidate,
} from "@/lib/portal";
import { usePortalRole } from "@/lib/use-portal-role";

export const Route = createFileRoute("/admin/enrollments")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Enrollments — Admin — Path to Qur'anic Understanding" },
      {
        name: "description",
        content: "Enroll students in the 4 active subjects and manage current subject enrollments.",
      },
      { property: "og:title", content: "Enrollments — Admin" },
      {
        property: "og:description",
        content: "Enroll students in the 4 active subjects and manage current subject enrollments.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminEnrollmentsPage,
});

function AdminEnrollmentsPage() {
  const { role } = usePortalRole("admin");
  const queryClient = useQueryClient();

  const [selectedKey, setSelectedKey] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  const candidatesQuery = useQuery({
    queryKey: ["admin-student-candidates"],
    queryFn: fetchStudentCandidates,
    enabled: role === "admin",
  });

  const subjectsQuery = useQuery({
    queryKey: ["admin-active-subjects"],
    queryFn: fetchResolvedActiveSubjects,
    enabled: role === "admin",
  });

  const enrollmentsQuery = useQuery({
    queryKey: ["admin-enrollments"],
    queryFn: fetchAllEnrollments,
    enabled: role === "admin",
  });

  const candidates = useMemo(() => candidatesQuery.data ?? [], [candidatesQuery.data]);
  const activeSubjects = useMemo(() => subjectsQuery.data ?? [], [subjectsQuery.data]);
  const allEnrollments = useMemo(() => enrollmentsQuery.data ?? [], [enrollmentsQuery.data]);

  const enrollmentsByStudentId = useMemo(() => {
    const map = new Map<string, AdminEnrollmentRow[]>();
    for (const row of allEnrollments) {
      if (row.status === "inactive") continue;
      if (row.subjects?.name && !isAllowedSubject(row.subjects.name)) continue;
      const list = map.get(row.student_id) ?? [];
      list.push(row);
      map.set(row.student_id, list);
    }
    return map;
  }, [allEnrollments]);

  const selectedStudent: StudentCandidate | null = useMemo(() => {
    if (candidates.length === 0) return null;
    if (selectedKey) {
      return candidates.find((c) => c.selectionKey === selectedKey) ?? candidates[0] ?? null;
    }
    return candidates[0] ?? null;
  }, [candidates, selectedKey]);

  const selectedStudentEnrollments = useMemo(() => {
    if (!selectedStudent?.studentRowId) return [];
    return enrollmentsByStudentId.get(selectedStudent.studentRowId) ?? [];
  }, [selectedStudent, enrollmentsByStudentId]);

  const alreadyEnrolledOptionKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const row of selectedStudentEnrollments) {
      if (row.status === "inactive") continue;
      const matched =
        matchActiveSubjectOption(row.subjects?.name) ??
        matchActiveSubjectOption(row.subjects?.code);
      if (matched) keys.add(matched.key);
    }
    return keys;
  }, [selectedStudentEnrollments]);

  const filteredCandidates = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter((c) => {
      return (
        c.fullName.toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q) ||
        (c.studentCode ?? "").toLowerCase().includes(q)
      );
    });
  }, [candidates, searchTerm]);

  const invalidateAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-enrollments"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-student-candidates"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-students"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-counts"] }),
      queryClient.invalidateQueries({ queryKey: ["enrollments"] }),
      queryClient.invalidateQueries({ queryKey: ["student-row"] }),
    ]);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedStudent) throw new Error("Please select a student first.");
      const subjectIds = checkedKeys
        .map((key) => activeSubjects.find((item) => item.option.key === key)?.subjectRow?.id)
        .filter((id): id is string => Boolean(id));

      if (subjectIds.length === 0) {
        throw new Error("Tick at least one subject to enroll the student.");
      }

      return enrollStudentInSubjects({
        studentRowId: selectedStudent.studentRowId,
        profileId: selectedStudent.profileId,
        subjectIds,
      });
    },
    onMutate: () => setFeedback(null),
    onError: (err: Error) => setFeedback({ type: "error", text: err.message }),
    onSuccess: async (result) => {
      await invalidateAll();
      setSelectedKey(`student:${result.studentRowId}`);
      setCheckedKeys([]);
      setFeedback({
        type: "success",
        text:
          result.addedCount > 0
            ? `Enrolled ${selectedStudent?.fullName ?? "student"} in ${result.addedCount} ${
                result.addedCount === 1 ? "subject" : "subjects"
              }. Their dashboard will update immediately.`
            : "Selected subjects are already enrolled for this student.",
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (enrollmentId: string) => removeEnrollment(enrollmentId),
    onMutate: () => setFeedback(null),
    onError: (err: Error) => setFeedback({ type: "error", text: err.message }),
    onSuccess: async () => {
      await invalidateAll();
      setFeedback({ type: "success", text: "Subject enrollment removed." });
    },
  });

  function toggleSubjectKey(key: string) {
    setCheckedKeys((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  }

  function handleSelectStudent(key: string) {
    setSelectedKey(key);
    setCheckedKeys([]);
    setFeedback(null);
  }

  const loading =
    candidatesQuery.isLoading || subjectsQuery.isLoading || enrollmentsQuery.isLoading;
  const loadError =
    (candidatesQuery.error as Error | null) ??
    (subjectsQuery.error as Error | null) ??
    (enrollmentsQuery.error as Error | null);

  return (
    <PortalShell
      eyebrow="Administration"
      role="admin"
      title="Student enrollments"
      subtitle="Assign students to the 4 active subjects and manage their current enrollments."
    >
      <div className="space-y-10">
        <Link
          to="/admin"
          className="inline-block text-sm text-muted-foreground underline underline-offset-4 hover:text-amber"
        >
          ← Back to admin dashboard
        </Link>

        {feedback && (
          <p
            role="status"
            className={`rounded-lg border px-4 py-3 text-sm ${
              feedback.type === "error"
                ? "border-destructive/40 bg-destructive/10 text-destructive"
                : "border-amber/40 bg-amber/10 text-amber"
            }`}
          >
            {feedback.text}
          </p>
        )}

        {loadError ? (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {loadError.message}
          </p>
        ) : loading ? (
          <p className="text-sm text-muted-foreground">Loading students and subjects…</p>
        ) : candidates.length === 0 ? (
          <EmptyState
            title="No students found"
            body="Once students register or are added to the portal, you can enroll them in subjects here."
          />
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              {/* Enroll form */}
              <section aria-labelledby="enroll-form-heading" className={portalCard}>
                <div className="flex items-center gap-2.5">
                  <UserPlus className="size-5 text-amber" aria-hidden="true" />
                  <h2 id="enroll-form-heading" className="font-display text-xl font-semibold">
                    Enroll a student
                  </h2>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Choose a student, tick one or more of the 4 active subjects, and save.
                </p>

                <div className="mt-6 space-y-6">
                  <div>
                    <label
                      htmlFor="student-select"
                      className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
                    >
                      Select student
                    </label>
                    <select
                      id="student-select"
                      value={selectedStudent?.selectionKey ?? ""}
                      onChange={(e) => handleSelectStudent(e.target.value)}
                      className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3.5 text-sm text-headline outline-none transition-colors focus:border-amber"
                    >
                      {candidates.map((student) => {
                        const count = student.studentRowId
                          ? (enrollmentsByStudentId.get(student.studentRowId) ?? []).filter(
                              (r) => r.status !== "inactive",
                            ).length
                          : 0;
                        return (
                          <option key={student.selectionKey} value={student.selectionKey}>
                            {student.fullName}
                            {student.email ? ` (${student.email})` : ""}
                            {count === 0 ? " — Pending enrollment" : ` — ${count} enrolled`}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      Active subjects (4)
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {activeSubjects.map(({ option, subjectRow }) => {
                        const isEnrolled = alreadyEnrolledOptionKeys.has(option.key);
                        const isChecked = checkedKeys.includes(option.key);
                        const unavailable = !subjectRow;

                        return (
                          <label
                            key={option.key}
                            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 text-sm transition-colors ${
                              isEnrolled
                                ? "border-amber/30 bg-amber/5 opacity-80"
                                : isChecked
                                  ? "border-amber bg-amber/12"
                                  : "border-border bg-background/50 hover:border-amber/50"
                            } ${unavailable ? "cursor-not-allowed opacity-50" : ""}`}
                          >
                            <input
                              type="checkbox"
                              checked={isEnrolled || isChecked}
                              disabled={isEnrolled || unavailable || saveMutation.isPending}
                              onChange={() => toggleSubjectKey(option.key)}
                              className="mt-0.5 size-4 rounded border-border accent-amber"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block font-medium text-headline">
                                {option.fullLabel}
                              </span>
                              <span className="mt-1 block text-xs text-muted-foreground">
                                {unavailable
                                  ? "Subject record missing in database"
                                  : isEnrolled
                                    ? "Already enrolled"
                                    : option.code}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      disabled={
                        !selectedStudent || checkedKeys.length === 0 || saveMutation.isPending
                      }
                      onClick={() => saveMutation.mutate()}
                      className={`${portalPrimaryButton} disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      <Check className="size-4" aria-hidden="true" />
                      {saveMutation.isPending ? "Saving enrollments…" : "Save enrollments"}
                    </button>
                    {checkedKeys.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {checkedKeys.length} {checkedKeys.length === 1 ? "subject" : "subjects"}{" "}
                        selected
                      </span>
                    )}
                  </div>
                </div>
              </section>

              {/* Selected student's current subjects */}
              <section aria-labelledby="selected-student-subjects" className={portalCard}>
                <div className="flex items-center gap-2.5">
                  <BookCheck className="size-5 text-amber" aria-hidden="true" />
                  <h2 id="selected-student-subjects" className="font-display text-xl font-semibold">
                    Current subjects
                  </h2>
                </div>
                {selectedStudent && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Showing enrolled subjects for{" "}
                    <span className="font-medium text-headline">{selectedStudent.fullName}</span>
                    {selectedStudent.studentCode ? ` (${selectedStudent.studentCode})` : ""}.
                  </p>
                )}

                <div className="mt-5">
                  {selectedStudentEnrollments.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border bg-background/40 p-6 text-center">
                      <p className="text-sm font-medium text-headline">No subjects enrolled yet</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Tick subjects on the left and click Save enrollments to assign them.
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {selectedStudentEnrollments.map((enrollment) => {
                        const matched =
                          matchActiveSubjectOption(enrollment.subjects?.name) ??
                          matchActiveSubjectOption(enrollment.subjects?.code);
                        const label =
                          matched?.fullLabel ?? enrollment.subjects?.name ?? "Enrolled subject";

                        return (
                          <li
                            key={enrollment.id}
                            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/60 px-4 py-3"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-headline">{label}</p>
                              <p className="mt-0.5 text-xs uppercase tracking-[0.16em] text-amber">
                                {enrollment.status ?? "active"}
                              </p>
                            </div>
                            <button
                              type="button"
                              disabled={removeMutation.isPending}
                              onClick={() => removeMutation.mutate(enrollment.id)}
                              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-destructive/40 px-2.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                            >
                              <Trash2 className="size-3.5" aria-hidden="true" />
                              Remove
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </section>
            </div>

            {/* Directory of all students and their current enrolled subjects */}
            <section aria-labelledby="all-enrollments-heading" className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 id="all-enrollments-heading" className="font-display text-xl font-semibold">
                    All students &amp; current subjects
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Click any student to select them above, or remove an existing subject directly.
                  </p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search student name or email…"
                    className="h-10 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm text-headline outline-none transition-colors focus:border-amber"
                  />
                </div>
              </div>

              {filteredCandidates.length === 0 ? (
                <EmptyState
                  title="No matching students"
                  body="Try clearing the search filter to see all students."
                />
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border bg-card/70">
                  <table className="w-full min-w-[46rem] text-left text-sm">
                    <thead className="border-b border-border text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-medium">Student</th>
                        <th className="px-4 py-3 font-medium">Current subjects</th>
                        <th className="px-4 py-3 text-right font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCandidates.map((student) => {
                        const list = student.studentRowId
                          ? (enrollmentsByStudentId.get(student.studentRowId) ?? [])
                          : [];
                        const isSelected = selectedStudent?.selectionKey === student.selectionKey;

                        return (
                          <tr
                            key={student.selectionKey}
                            className={`border-b border-border/50 last:border-0 ${
                              isSelected ? "bg-amber/5" : ""
                            }`}
                          >
                            <td className="px-4 py-3.5 align-top">
                              <p className="font-medium text-headline">{student.fullName}</p>
                              {student.email && (
                                <p className="text-xs text-muted-foreground">{student.email}</p>
                              )}
                              {student.studentCode && (
                                <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-amber">
                                  {student.studentCode}
                                </p>
                              )}
                            </td>
                            <td className="px-4 py-3.5 align-top">
                              {list.length === 0 ? (
                                <span className="text-xs italic text-muted-foreground">
                                  Pending enrollment
                                </span>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  {list.map((enrollment) => {
                                    const matched =
                                      matchActiveSubjectOption(enrollment.subjects?.name) ??
                                      matchActiveSubjectOption(enrollment.subjects?.code);
                                    const label =
                                      matched?.fullLabel ?? enrollment.subjects?.name ?? "Subject";
                                    return (
                                      <span
                                        key={enrollment.id}
                                        className="inline-flex items-center gap-2 rounded-md border border-border bg-background/70 px-2.5 py-1 text-xs text-headline"
                                      >
                                        <span>{label}</span>
                                        <button
                                          type="button"
                                          aria-label={`Remove ${label} from ${student.fullName}`}
                                          disabled={removeMutation.isPending}
                                          onClick={() => removeMutation.mutate(enrollment.id)}
                                          className="text-muted-foreground transition-colors hover:text-destructive"
                                        >
                                          ×
                                        </button>
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-right align-top">
                              <button
                                type="button"
                                onClick={() => handleSelectStudent(student.selectionKey)}
                                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                                  isSelected
                                    ? "border-amber bg-amber/15 text-amber"
                                    : "border-border text-muted-foreground hover:border-amber/60 hover:text-amber"
                                }`}
                              >
                                {isSelected ? "Selected" : "Enroll"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
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
