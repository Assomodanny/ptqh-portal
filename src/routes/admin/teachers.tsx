import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpenCheck, Check, Search, Trash2, UserCog } from "lucide-react";
import { useMemo, useState } from "react";

import {
  EmptyState,
  PortalShell,
  portalCard,
  portalPrimaryButton,
} from "@/components/portal-shell";
import { isAllowedSubject, matchActiveSubjectOption } from "@/data/curriculum";
import {
  assignSubjectsToTeacher,
  fetchAllTeacherSubjects,
  fetchResolvedActiveSubjects,
  fetchTeacherCandidates,
  removeTeacherSubject,
  type TeacherCandidate,
  type TeacherSubjectRow,
} from "@/lib/portal";
import { usePortalRole } from "@/lib/use-portal-role";

export const Route = createFileRoute("/admin/teachers")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Teachers — Admin — Path to Qur'anic Understanding" },
      {
        name: "description",
        content:
          "Manage teaching staff and assign which of the 4 active subjects each teacher teaches.",
      },
      { property: "og:title", content: "Teachers — Admin" },
      {
        property: "og:description",
        content: "Manage teaching staff and subject assignments.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminTeachersPage,
});

function AdminTeachersPage() {
  const { role } = usePortalRole("admin");
  const queryClient = useQueryClient();

  const [selectedKey, setSelectedKey] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  const candidatesQuery = useQuery({
    queryKey: ["admin-teacher-candidates"],
    queryFn: fetchTeacherCandidates,
    enabled: role === "admin",
  });

  const subjectsQuery = useQuery({
    queryKey: ["admin-active-subjects"],
    queryFn: fetchResolvedActiveSubjects,
    enabled: role === "admin",
  });

  const assignmentsQuery = useQuery({
    queryKey: ["admin-teacher-subjects"],
    queryFn: fetchAllTeacherSubjects,
    enabled: role === "admin",
  });

  const candidates = useMemo(() => candidatesQuery.data ?? [], [candidatesQuery.data]);
  const activeSubjects = useMemo(() => subjectsQuery.data ?? [], [subjectsQuery.data]);
  const allAssignments = useMemo(() => assignmentsQuery.data ?? [], [assignmentsQuery.data]);

  const subjectsByTeacherId = useMemo(() => {
    const map = new Map<string, TeacherSubjectRow[]>();
    for (const row of allAssignments) {
      if (row.subjects?.name && !isAllowedSubject(row.subjects.name)) continue;
      const list = map.get(row.teacher_id) ?? [];
      list.push(row);
      map.set(row.teacher_id, list);
    }
    return map;
  }, [allAssignments]);

  const selectedTeacher: TeacherCandidate | null = useMemo(() => {
    if (candidates.length === 0) return null;
    if (selectedKey) {
      return candidates.find((c) => c.selectionKey === selectedKey) ?? candidates[0] ?? null;
    }
    return candidates[0] ?? null;
  }, [candidates, selectedKey]);

  const selectedTeacherAssignments = useMemo(() => {
    if (!selectedTeacher?.teacherRowId) return [];
    return subjectsByTeacherId.get(selectedTeacher.teacherRowId) ?? [];
  }, [selectedTeacher, subjectsByTeacherId]);

  const alreadyAssignedOptionKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const row of selectedTeacherAssignments) {
      const matched =
        matchActiveSubjectOption(row.subjects?.name) ??
        matchActiveSubjectOption(row.subjects?.code);
      if (matched) keys.add(matched.key);
    }
    return keys;
  }, [selectedTeacherAssignments]);

  const filteredCandidates = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter((c) => {
      return (
        c.fullName.toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q) ||
        (c.employeeId ?? "").toLowerCase().includes(q)
      );
    });
  }, [candidates, searchTerm]);

  const invalidateAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-teacher-subjects"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-teacher-candidates"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-teachers"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-counts"] }),
      queryClient.invalidateQueries({ queryKey: ["teacher-subjects"] }),
      queryClient.invalidateQueries({ queryKey: ["teacher-row"] }),
    ]);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedTeacher) throw new Error("Please select a teacher first.");
      const subjectIds = checkedKeys
        .map((key) => activeSubjects.find((item) => item.option.key === key)?.subjectRow?.id)
        .filter((id): id is string => Boolean(id));

      if (subjectIds.length === 0) {
        throw new Error("Tick at least one subject to assign to this teacher.");
      }

      return assignSubjectsToTeacher({
        teacherRowId: selectedTeacher.teacherRowId,
        profileId: selectedTeacher.profileId,
        subjectIds,
      });
    },
    onMutate: () => setFeedback(null),
    onError: (err: Error) => setFeedback({ type: "error", text: err.message }),
    onSuccess: async (result) => {
      await invalidateAll();
      setSelectedKey(`teacher:${result.teacherRowId}`);
      setCheckedKeys([]);
      setFeedback({
        type: "success",
        text:
          result.addedCount > 0
            ? `Assigned ${result.addedCount} ${result.addedCount === 1 ? "subject" : "subjects"} to ${
                selectedTeacher?.fullName ?? "teacher"
              }. Their dashboard will list these subjects right away.`
            : "Selected subjects are already assigned to this teacher.",
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: ({ teacherId, subjectId }: { teacherId: string; subjectId: string }) =>
      removeTeacherSubject(teacherId, subjectId),
    onMutate: () => setFeedback(null),
    onError: (err: Error) => setFeedback({ type: "error", text: err.message }),
    onSuccess: async () => {
      await invalidateAll();
      setFeedback({ type: "success", text: "Subject removed from teacher." });
    },
  });

  function toggleSubjectKey(key: string) {
    setCheckedKeys((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  }

  function handleSelectTeacher(key: string) {
    setSelectedKey(key);
    setCheckedKeys([]);
    setFeedback(null);
  }

  const loading =
    candidatesQuery.isLoading || subjectsQuery.isLoading || assignmentsQuery.isLoading;
  const loadError =
    (candidatesQuery.error as Error | null) ??
    (subjectsQuery.error as Error | null) ??
    (assignmentsQuery.error as Error | null);

  return (
    <PortalShell
      eyebrow="Administration"
      role="admin"
      title="Teachers"
      subtitle="Manage teaching staff and assign which of the 4 active subjects each teacher teaches."
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
          <p className="text-sm text-muted-foreground">Loading teachers and subjects…</p>
        ) : candidates.length === 0 ? (
          <EmptyState
            title="No teachers yet"
            body="Teaching staff records will appear here once the administration adds them."
          />
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              {/* Assign subjects form */}
              <section aria-labelledby="assign-teacher-heading" className={portalCard}>
                <div className="flex items-center gap-2.5">
                  <UserCog className="size-5 text-amber" aria-hidden="true" />
                  <h2 id="assign-teacher-heading" className="font-display text-xl font-semibold">
                    Assign subjects to teacher
                  </h2>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Pick a teacher, tick one or more of the 4 active subjects they teach, and save.
                </p>

                <div className="mt-6 space-y-6">
                  <div>
                    <label
                      htmlFor="teacher-select"
                      className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
                    >
                      Select teacher
                    </label>
                    <select
                      id="teacher-select"
                      value={selectedTeacher?.selectionKey ?? ""}
                      onChange={(e) => handleSelectTeacher(e.target.value)}
                      className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3.5 text-sm text-headline outline-none transition-colors focus:border-amber"
                    >
                      {candidates.map((teacher) => {
                        const count = teacher.teacherRowId
                          ? (subjectsByTeacherId.get(teacher.teacherRowId)?.length ?? 0)
                          : 0;
                        return (
                          <option key={teacher.selectionKey} value={teacher.selectionKey}>
                            {teacher.fullName}
                            {teacher.email ? ` (${teacher.email})` : ""}
                            {count === 0 ? " — No subjects assigned" : ` — ${count} assigned`}
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
                        const isAssigned = alreadyAssignedOptionKeys.has(option.key);
                        const isChecked = checkedKeys.includes(option.key);
                        const unavailable = !subjectRow;

                        return (
                          <label
                            key={option.key}
                            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 text-sm transition-colors ${
                              isAssigned
                                ? "border-amber/30 bg-amber/5 opacity-80"
                                : isChecked
                                  ? "border-amber bg-amber/12"
                                  : "border-border bg-background/50 hover:border-amber/50"
                            } ${unavailable ? "cursor-not-allowed opacity-50" : ""}`}
                          >
                            <input
                              type="checkbox"
                              checked={isAssigned || isChecked}
                              disabled={isAssigned || unavailable || saveMutation.isPending}
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
                                  : isAssigned
                                    ? "Already assigned"
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
                        !selectedTeacher || checkedKeys.length === 0 || saveMutation.isPending
                      }
                      onClick={() => saveMutation.mutate()}
                      className={`${portalPrimaryButton} disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      <Check className="size-4" aria-hidden="true" />
                      {saveMutation.isPending ? "Saving assignments…" : "Save assignments"}
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

              {/* Selected teacher's current subjects */}
              <section aria-labelledby="selected-teacher-subjects" className={portalCard}>
                <div className="flex items-center gap-2.5">
                  <BookOpenCheck className="size-5 text-amber" aria-hidden="true" />
                  <h2 id="selected-teacher-subjects" className="font-display text-xl font-semibold">
                    Current subjects
                  </h2>
                </div>
                {selectedTeacher && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Subjects taught by{" "}
                    <span className="font-medium text-headline">{selectedTeacher.fullName}</span>
                    {selectedTeacher.employeeId ? ` (${selectedTeacher.employeeId})` : ""}.
                  </p>
                )}

                <div className="mt-5">
                  {selectedTeacherAssignments.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border bg-background/40 p-6 text-center">
                      <p className="text-sm font-medium text-headline">No subjects assigned yet</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Tick subjects on the left and click Save assignments to assign them.
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {selectedTeacherAssignments.map((assignment) => {
                        const matched =
                          matchActiveSubjectOption(assignment.subjects?.name) ??
                          matchActiveSubjectOption(assignment.subjects?.code);
                        const label =
                          matched?.fullLabel ?? assignment.subjects?.name ?? "Assigned subject";

                        return (
                          <li
                            key={`${assignment.teacher_id}-${assignment.subject_id}`}
                            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/60 px-4 py-3"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-headline">{label}</p>
                              {assignment.subjects?.code && (
                                <p className="mt-0.5 text-xs uppercase tracking-[0.16em] text-amber">
                                  {assignment.subjects.code}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              disabled={removeMutation.isPending}
                              onClick={() =>
                                removeMutation.mutate({
                                  teacherId: assignment.teacher_id,
                                  subjectId: assignment.subject_id,
                                })
                              }
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

            {/* Teaching staff directory with current subjects & remove option */}
            <section aria-labelledby="teacher-directory-heading" className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 id="teacher-directory-heading" className="font-display text-xl font-semibold">
                    Teaching staff &amp; assigned subjects
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    View teacher records, manage assigned subjects, or remove an assignment.
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
                    placeholder="Search teacher name or email…"
                    className="h-10 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm text-headline outline-none transition-colors focus:border-amber"
                  />
                </div>
              </div>

              {filteredCandidates.length === 0 ? (
                <EmptyState
                  title="No matching teachers"
                  body="Try clearing the search filter to see all teaching staff."
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredCandidates.map((teacher) => {
                    const list = teacher.teacherRowId
                      ? (subjectsByTeacherId.get(teacher.teacherRowId) ?? [])
                      : [];
                    const isSelected = selectedTeacher?.selectionKey === teacher.selectionKey;

                    return (
                      <div
                        key={teacher.selectionKey}
                        className={`rounded-xl border bg-card/70 p-6 transition-colors ${
                          isSelected
                            ? "border-amber bg-amber/5"
                            : "border-border hover:border-amber/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-display text-lg font-semibold text-headline">
                              {teacher.fullName}
                            </p>
                            {teacher.email && (
                              <p className="mt-1 truncate text-xs text-muted-foreground">
                                {teacher.email}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSelectTeacher(teacher.selectionKey)}
                            className={`shrink-0 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                              isSelected
                                ? "border-amber bg-amber/15 text-amber"
                                : "border-border text-muted-foreground hover:border-amber/60 hover:text-amber"
                            }`}
                          >
                            {isSelected ? "Selected" : "Manage"}
                          </button>
                        </div>

                        <span className="mt-4 block h-px w-full bg-amber/30" aria-hidden="true" />

                        <dl className="mt-4 space-y-2 text-sm">
                          <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Employee ID</dt>
                            <dd className="text-foreground">{teacher.employeeId ?? "—"}</dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Specialisation</dt>
                            <dd className="text-foreground">{teacher.specialization ?? "—"}</dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Qualification</dt>
                            <dd className="text-foreground">{teacher.qualification ?? "—"}</dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Status</dt>
                            <dd className="text-amber">{teacher.status ?? "—"}</dd>
                          </div>
                        </dl>

                        <div className="mt-5 border-t border-border/70 pt-4">
                          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                            Assigned subjects
                          </p>
                          {list.length === 0 ? (
                            <p className="mt-2 text-xs italic text-muted-foreground">
                              No subjects assigned yet
                            </p>
                          ) : (
                            <div className="mt-2.5 flex flex-wrap gap-2">
                              {list.map((assignment) => {
                                const matched =
                                  matchActiveSubjectOption(assignment.subjects?.name) ??
                                  matchActiveSubjectOption(assignment.subjects?.code);
                                const label =
                                  matched?.fullLabel ?? assignment.subjects?.name ?? "Subject";

                                return (
                                  <span
                                    key={`${assignment.teacher_id}-${assignment.subject_id}`}
                                    className="inline-flex items-center gap-2 rounded-md border border-border bg-background/70 px-2.5 py-1 text-xs text-headline"
                                  >
                                    <span>{label}</span>
                                    <button
                                      type="button"
                                      aria-label={`Remove ${label} from ${teacher.fullName}`}
                                      disabled={removeMutation.isPending}
                                      onClick={() =>
                                        removeMutation.mutate({
                                          teacherId: assignment.teacher_id,
                                          subjectId: assignment.subject_id,
                                        })
                                      }
                                      className="text-muted-foreground transition-colors hover:text-destructive"
                                    >
                                      ×
                                    </button>
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </PortalShell>
  );
}
