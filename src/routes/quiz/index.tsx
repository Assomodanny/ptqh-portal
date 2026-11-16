import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil, Play, Plus, Trash2, X } from "lucide-react";

import {
  EmptyState,
  PortalShell,
  portalCard,
  portalGhostButton,
  portalPrimaryButton,
} from "@/components/portal-shell";
import { ALLOWED_SUBJECTS, matchActiveSubjectOption } from "@/data/curriculum";
import {
  createQuizWithQuestions,
  createSession,
  DEFAULT_QUESTION_TIMER_SECONDS,
  deleteQuiz,
  fetchQuizQuestions,
  fetchQuizzes,
  MAX_QUESTION_TIMER_SECONDS,
  MAX_QUIZ_QUESTIONS,
  MIN_QUESTION_TIMER_SECONDS,
  normaliseAnswer,
  optionKeys,
  updateQuizWithQuestions,
  type OptionKey,
  type QuizQuestionDraft,
  type QuizWithCount,
} from "@/lib/quiz";
import { usePortalRole } from "@/lib/use-portal-role";

export const Route = createFileRoute("/quiz/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Live Quiz — Path to Qur'anic Understanding" },
      {
        name: "description",
        content: "Create, edit and host live quiz sessions across the 4 programme subjects.",
      },
      { property: "og:title", content: "Live Quiz — Path to Qur'anic Understanding" },
      { property: "og:description", content: "Host and manage live quiz sessions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: QuizHostListPage,
});

type BuilderQuestion = QuizQuestionDraft & {
  timerInput: string;
  timerError: string | null;
};

function validateTimerInput(
  raw: string,
): { ok: true; value: number } | { ok: false; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return {
      ok: false,
      error: `Enter a timer between ${MIN_QUESTION_TIMER_SECONDS} and ${MAX_QUESTION_TIMER_SECONDS} seconds.`,
    };
  }
  if (!/^\d+$/.test(trimmed)) {
    return {
      ok: false,
      error: `Enter a whole number between ${MIN_QUESTION_TIMER_SECONDS} and ${MAX_QUESTION_TIMER_SECONDS} seconds.`,
    };
  }
  const parsed = Number(trimmed);
  if (
    !Number.isFinite(parsed) ||
    parsed < MIN_QUESTION_TIMER_SECONDS ||
    parsed > MAX_QUESTION_TIMER_SECONDS
  ) {
    return {
      ok: false,
      error: `Timer must be between ${MIN_QUESTION_TIMER_SECONDS} and ${MAX_QUESTION_TIMER_SECONDS} seconds.`,
    };
  }
  return { ok: true, value: parsed };
}

function blankQuestion(timerSeconds: number): BuilderQuestion {
  return {
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "a",
    timer_seconds: timerSeconds,
    timerInput: String(timerSeconds),
    timerError: null,
  };
}

function QuizHostListPage() {
  const { user, role, isLoading } = usePortalRole();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [startingId, setStartingId] = useState<string | null>(null);
  const [loadingEditId, setLoadingEditId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; text: string } | null>(
    null,
  );

  // Quiz Builder / Editor state (Admin)
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [subject, setSubject] = useState<string>(ALLOWED_SUBJECTS[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [defaultTimerInput, setDefaultTimerInput] = useState<string>(
    String(DEFAULT_QUESTION_TIMER_SECONDS),
  );
  const [defaultTimerError, setDefaultTimerError] = useState<string | null>(null);
  const [questionCountText, setQuestionCountText] = useState<string>("5");
  const [questions, setQuestions] = useState<BuilderQuestion[]>(() =>
    Array.from({ length: 5 }, () => blankQuestion(DEFAULT_QUESTION_TIMER_SECONDS)),
  );

  const quizzesQuery = useQuery({ queryKey: ["quizzes"], queryFn: fetchQuizzes });
  const canHost = role === "admin" || role === "teacher";
  const isAdmin = role === "admin";

  function openCreateEditor() {
    setFeedback(null);
    setEditingQuizId(null);
    setSubject(ALLOWED_SUBJECTS[0]);
    setTitle("");
    setDescription("");
    setDefaultTimerInput(String(DEFAULT_QUESTION_TIMER_SECONDS));
    setDefaultTimerError(null);
    setQuestionCountText("5");
    setQuestions(Array.from({ length: 5 }, () => blankQuestion(DEFAULT_QUESTION_TIMER_SECONDS)));
    setEditorOpen(true);
  }

  async function openEditEditor(quiz: QuizWithCount) {
    setFeedback(null);
    setLoadingEditId(quiz.id);
    try {
      const existing = await fetchQuizQuestions(quiz.id);
      const drafts: BuilderQuestion[] =
        existing.length > 0
          ? existing.slice(0, MAX_QUIZ_QUESTIONS).map((q) => {
              const savedTimer = q.timer_seconds ?? DEFAULT_QUESTION_TIMER_SECONDS;
              return {
                id: q.id,
                question_text: q.question_text ?? "",
                option_a: q.option_a ?? "",
                option_b: q.option_b ?? "",
                option_c: q.option_c ?? "",
                option_d: q.option_d ?? "",
                correct_answer: normaliseAnswer(q.correct_answer) ?? "a",
                timer_seconds: savedTimer,
                timerInput: String(savedTimer),
                timerError: null,
              };
            })
          : [blankQuestion(DEFAULT_QUESTION_TIMER_SECONDS)];

      setEditingQuizId(quiz.id);
      const matchedSubject = matchActiveSubjectOption(quiz.subject);
      setSubject(matchedSubject?.shortName ?? ALLOWED_SUBJECTS[0]);
      setTitle(quiz.title ?? "");
      setDescription(quiz.description ?? "");
      const initialDefault = drafts[0]?.timer_seconds ?? DEFAULT_QUESTION_TIMER_SECONDS;
      setDefaultTimerInput(String(initialDefault));
      setDefaultTimerError(null);
      setQuestionCountText(String(drafts.length));
      setQuestions(drafts);
      setEditorOpen(true);
    } catch (err) {
      setFeedback({ type: "error", text: (err as Error).message });
    } finally {
      setLoadingEditId(null);
    }
  }

  function resizeQuestions(nextCountRaw: number) {
    const clamped = Math.max(1, Math.min(MAX_QUIZ_QUESTIONS, Math.round(nextCountRaw || 1)));
    const validDefault = validateTimerInput(defaultTimerInput);
    const seedTimer = validDefault.ok ? validDefault.value : DEFAULT_QUESTION_TIMER_SECONDS;
    setQuestionCountText(String(clamped));
    setQuestions((prev) => {
      if (clamped === prev.length) return prev;
      if (clamped < prev.length) return prev.slice(0, clamped);
      return [
        ...prev,
        ...Array.from({ length: clamped - prev.length }, () => blankQuestion(seedTimer)),
      ];
    });
  }

  function commitQuestionCountText() {
    const parsed = Number(questionCountText.trim());
    if (!Number.isFinite(parsed) || parsed < 1) {
      setQuestionCountText(String(questions.length));
      return;
    }
    resizeQuestions(parsed);
  }

  function handleDefaultTimerBlur() {
    const check = validateTimerInput(defaultTimerInput);
    if (!check.ok) {
      setDefaultTimerError(check.error);
      return;
    }
    setDefaultTimerError(null);
    setDefaultTimerInput(String(check.value));
  }

  function applyTimerToAll() {
    const check = validateTimerInput(defaultTimerInput);
    if (!check.ok) {
      setDefaultTimerError(check.error);
      return;
    }
    setDefaultTimerError(null);
    setDefaultTimerInput(String(check.value));
    setQuestions((prev) =>
      prev.map((q) => ({
        ...q,
        timer_seconds: check.value,
        timerInput: String(check.value),
        timerError: null,
      })),
    );
  }

  function updateQuestion(index: number, patch: Partial<BuilderQuestion>) {
    setQuestions((prev) => prev.map((q, idx) => (idx === index ? { ...q, ...patch } : q)));
  }

  function handleQuestionTimerChange(index: number, nextValue: string) {
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === index ? { ...q, timerInput: nextValue, timerError: null } : q)),
    );
  }

  function handleQuestionTimerBlur(index: number) {
    setQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx !== index) return q;
        const check = validateTimerInput(q.timerInput);
        if (!check.ok) {
          return { ...q, timerError: check.error };
        }
        return {
          ...q,
          timer_seconds: check.value,
          timerInput: String(check.value),
          timerError: null,
        };
      }),
    );
  }

  function removeQuestionAt(index: number) {
    if (questions.length <= 1) return;
    setQuestions((prev) => {
      const next = prev.filter((_, idx) => idx !== index);
      setQuestionCountText(String(next.length));
      return next;
    });
  }

  const saveQuizMutation = useMutation({
    mutationFn: async () => {
      if (!title.trim()) throw new Error("Please enter a quiz title.");

      const validatedQuestions: QuizQuestionDraft[] = [];
      let firstTimerError: string | null = null;

      const updatedWithErrors = questions.map((q, i) => {
        const timerCheck = validateTimerInput(q.timerInput);
        if (!timerCheck.ok) {
          if (!firstTimerError) {
            firstTimerError = `Question ${i + 1}: ${timerCheck.error}`;
          }
          return { ...q, timerError: timerCheck.error };
        }
        return {
          ...q,
          timer_seconds: timerCheck.value,
          timerInput: String(timerCheck.value),
          timerError: null,
        };
      });

      if (firstTimerError) {
        setQuestions(updatedWithErrors);
        throw new Error(firstTimerError);
      }

      for (let i = 0; i < updatedWithErrors.length; i += 1) {
        const q = updatedWithErrors[i]!;
        if (!q.question_text.trim()) {
          throw new Error(`Question ${i + 1} is missing question text.`);
        }
        if (!q.option_a.trim() || !q.option_b.trim() || !q.option_c.trim() || !q.option_d.trim()) {
          throw new Error(`Question ${i + 1} needs all four options (A, B, C, D).`);
        }
        validatedQuestions.push({
          ...(q.id ? { id: q.id } : {}),
          question_text: q.question_text,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          correct_answer: q.correct_answer,
          timer_seconds: q.timer_seconds,
        });
      }

      if (editingQuizId) {
        await updateQuizWithQuestions(editingQuizId, {
          subject,
          title,
          description,
          questions: validatedQuestions,
        });
      } else {
        await createQuizWithQuestions({
          subject,
          title,
          description,
          created_by: user?.id ?? null,
          questions: validatedQuestions,
        });
      }
    },
    onMutate: () => setFeedback(null),
    onSuccess: async () => {
      const wasEditing = Boolean(editingQuizId);
      setEditorOpen(false);
      setEditingQuizId(null);
      await queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      setFeedback({
        type: "success",
        text: wasEditing ? "Quiz updated." : "Quiz created and ready to host.",
      });
    },
    onError: (err: Error) => setFeedback({ type: "error", text: err.message }),
  });

  const deleteQuizMutation = useMutation({
    mutationFn: (quizId: string) => deleteQuiz(quizId),
    onMutate: () => setFeedback(null),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      setFeedback({ type: "success", text: "Quiz deleted." });
    },
    onError: (err: Error) => setFeedback({ type: "error", text: err.message }),
  });

  async function handleStart(quizId: string) {
    setStartingId(quizId);
    setFeedback(null);
    try {
      const session = await createSession(quizId);
      void navigate({ to: "/quiz/host/$sessionId", params: { sessionId: session.id } });
    } catch (err) {
      setFeedback({ type: "error", text: (err as Error).message });
    } finally {
      setStartingId(null);
    }
  }

  return (
    <PortalShell
      eyebrow="Live quiz"
      title="Quizzes & live sessions"
      subtitle="Create and host live quizzes across the 4 programme subjects (Nahwu, Sarf, Hadith, As-Sarim Al-Battar) with up to 50 questions and custom timers."
    >
      {isLoading || quizzesQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading quizzes…</p>
      ) : !canHost ? (
        <EmptyState
          title="Hosting is for teachers and administrators"
          body="Students join a live quiz with the PIN their teacher shares. Use the Join quiz page instead."
        />
      ) : (
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => (editorOpen ? setEditorOpen(false) : openCreateEditor())}
                  className={portalPrimaryButton}
                >
                  {editorOpen ? (
                    <>
                      <X className="size-4" aria-hidden="true" />
                      Close quiz builder
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" aria-hidden="true" />
                      Create new quiz
                    </>
                  )}
                </button>
              )}
              <Link to="/quiz/join" className={portalGhostButton}>
                Open student join page
              </Link>
            </div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              4 allowed subjects · Max {MAX_QUIZ_QUESTIONS} questions
            </p>
          </div>

          {feedback && (
            <p
              role="status"
              className={`rounded-md border px-4 py-3 text-sm ${
                feedback.type === "error"
                  ? "border-destructive/40 bg-destructive/10 text-destructive"
                  : "border-amber/40 bg-amber/10 text-amber"
              }`}
            >
              {feedback.text}
            </p>
          )}

          {/* Admin Quiz Builder / Editor */}
          {isAdmin && editorOpen && (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                saveQuizMutation.mutate();
              }}
              className={`${portalCard} space-y-6 border-amber/50`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-amber">
                    {editingQuizId ? "Editing quiz" : "New quiz"}
                  </p>
                  <h2 className="mt-1 font-display text-xl font-semibold text-headline">
                    {editingQuizId ? "Update quiz & questions" : "Build quiz questions"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="text-xs text-muted-foreground hover:text-headline"
                >
                  Cancel
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <label className="text-sm">
                  <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Subject (4 allowed)
                  </span>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
                  >
                    {ALLOWED_SUBJECTS.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm lg:col-span-2">
                  <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Quiz title
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Week 4 — Al-I'rab Review"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
                  />
                </label>

                <label className="text-sm sm:col-span-2 lg:col-span-3">
                  <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Description (optional)
                  </span>
                  <input
                    type="text"
                    placeholder="Brief note on topics covered"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
                  />
                </label>
              </div>

              {/* Question Count (1-50) & Default Timer */}
              <div className="flex flex-wrap items-start gap-6 rounded-lg border border-border/80 bg-background/50 p-4">
                <div className="text-sm">
                  <label
                    htmlFor="quiz-question-count"
                    className="block text-xs uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    Number of questions (1–50)
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      id="quiz-question-count"
                      type="text"
                      inputMode="numeric"
                      value={questionCountText}
                      onChange={(e) => setQuestionCountText(e.target.value)}
                      onBlur={commitQuestionCountText}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          commitQuestionCountText();
                        }
                      }}
                      className="h-10 w-24 rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
                    />
                    <span className="text-xs text-muted-foreground">
                      / {MAX_QUIZ_QUESTIONS} max
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Updates question slots when leaving the field.
                  </p>
                </div>

                <div className="text-sm">
                  <label
                    htmlFor="quiz-default-timer"
                    className="block text-xs uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    Default timer (seconds)
                  </label>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <input
                      id="quiz-default-timer"
                      type="text"
                      inputMode="numeric"
                      value={defaultTimerInput}
                      onChange={(e) => {
                        setDefaultTimerInput(e.target.value);
                        if (defaultTimerError) setDefaultTimerError(null);
                      }}
                      onBlur={handleDefaultTimerBlur}
                      aria-invalid={Boolean(defaultTimerError)}
                      className={`h-10 w-24 rounded-md border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber ${
                        defaultTimerError ? "border-destructive" : "border-border"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={applyTimerToAll}
                      className="h-10 rounded-md border border-amber/50 px-3 text-xs font-medium text-amber transition-colors hover:bg-amber/10"
                    >
                      Apply to all questions
                    </button>
                  </div>
                  <p
                    className={`mt-1.5 text-xs ${
                      defaultTimerError ? "text-destructive" : "text-muted-foreground"
                    }`}
                  >
                    {defaultTimerError ??
                      `Allowed range: ${MIN_QUESTION_TIMER_SECONDS} to ${MAX_QUESTION_TIMER_SECONDS} seconds.`}
                  </p>
                </div>
              </div>

              {/* Questions list */}
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div
                    key={q.id ?? `draft-${index}`}
                    className="space-y-4 rounded-lg border border-border bg-background/40 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <p className="pt-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber">
                        Question {index + 1} of {questions.length}
                      </p>
                      <div className="flex flex-wrap items-start gap-3">
                        <div>
                          <label className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Timer (s)</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              aria-label={`Question ${index + 1} timer (seconds)`}
                              value={q.timerInput}
                              onChange={(e) => handleQuestionTimerChange(index, e.target.value)}
                              onBlur={() => handleQuestionTimerBlur(index)}
                              aria-invalid={Boolean(q.timerError)}
                              className={`h-8 w-20 rounded border bg-secondary px-2 text-xs text-foreground outline-none focus:border-amber ${
                                q.timerError ? "border-destructive" : "border-border"
                              }`}
                            />
                          </label>
                          <p
                            className={`mt-1 text-[11px] ${
                              q.timerError ? "text-destructive" : "text-muted-foreground"
                            }`}
                          >
                            {q.timerError ??
                              `Allowed: ${MIN_QUESTION_TIMER_SECONDS}–${MAX_QUESTION_TIMER_SECONDS} seconds`}
                          </p>
                        </div>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestionAt(index)}
                            className="inline-flex h-8 items-center gap-1 rounded border border-border px-2.5 text-xs text-muted-foreground hover:border-destructive/60 hover:text-destructive"
                          >
                            <Trash2 className="size-3" aria-hidden="true" />
                            Remove
                          </button>
                        )}
                      </div>
                    </div>

                    <input
                      type="text"
                      required
                      placeholder={`Enter question ${index + 1} text…`}
                      value={q.question_text}
                      onChange={(e) => updateQuestion(index, { question_text: e.target.value })}
                      className="h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
                    />

                    <div className="grid gap-3 sm:grid-cols-2">
                      {optionKeys.map((key) => {
                        const field = `option_${key}` as const;
                        return (
                          <label key={key} className="flex items-center gap-2 text-sm">
                            <span className="grid size-8 shrink-0 place-items-center rounded border border-border bg-card text-xs font-semibold uppercase text-amber">
                              {key}
                            </span>
                            <input
                              type="text"
                              required
                              placeholder={`Option ${key.toUpperCase()}`}
                              value={q[field]}
                              onChange={(e) => updateQuestion(index, { [field]: e.target.value })}
                              className="h-10 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
                            />
                          </label>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        Correct answer:
                      </span>
                      <div className="flex gap-2">
                        {optionKeys.map((key) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() =>
                              updateQuestion(index, { correct_answer: key as OptionKey })
                            }
                            className={`h-8 w-10 rounded border text-xs font-semibold uppercase transition-colors ${
                              q.correct_answer === key
                                ? "border-amber bg-amber text-primary-foreground"
                                : "border-border bg-secondary text-muted-foreground hover:border-amber/60"
                            }`}
                          >
                            {key}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
                {questions.length < MAX_QUIZ_QUESTIONS ? (
                  <button
                    type="button"
                    onClick={() => resizeQuestions(questions.length + 1)}
                    className={portalGhostButton}
                  >
                    <Plus className="size-4" aria-hidden="true" />
                    Add question ({questions.length}/{MAX_QUIZ_QUESTIONS})
                  </button>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Maximum of {MAX_QUIZ_QUESTIONS} questions reached.
                  </span>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditorOpen(false)}
                    className={portalGhostButton}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saveQuizMutation.isPending}
                    className={portalPrimaryButton}
                  >
                    {saveQuizMutation.isPending
                      ? "Saving quiz…"
                      : editingQuizId
                        ? "Save quiz changes"
                        : `Create quiz (${questions.length} Qs)`}
                  </button>
                </div>
              </div>
            </form>
          )}

          {quizzesQuery.error ? (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {(quizzesQuery.error as Error).message}
            </p>
          ) : (quizzesQuery.data ?? []).length === 0 ? (
            <EmptyState
              title="No quizzes yet"
              body="Create a quiz in Nahwu, Sarf, Hadith, or As-Sarim Al-Battar to host a live session."
            />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {(quizzesQuery.data ?? []).map((quiz) => (
                <li key={quiz.id} className={portalCard}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber">
                      {quiz.subject ?? "Subject pending"}
                    </p>
                    <span className="rounded-full border border-border bg-secondary/70 px-2.5 py-0.5 text-[11px] text-muted-foreground">
                      {quiz.questionCount} {quiz.questionCount === 1 ? "question" : "questions"}
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-lg font-semibold text-headline">
                    {quiz.title ?? "Untitled quiz"}
                  </h2>
                  {quiz.description && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {quiz.description}
                    </p>
                  )}
                  <div className="mt-5 flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      disabled={startingId === quiz.id || quiz.questionCount === 0}
                      onClick={() => void handleStart(quiz.id)}
                      className={`${portalPrimaryButton} h-10 px-4 text-xs disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      <Play className="size-3.5" aria-hidden="true" />
                      {startingId === quiz.id ? "Creating session…" : "Start live session"}
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          type="button"
                          disabled={loadingEditId === quiz.id}
                          onClick={() => void openEditEditor(quiz)}
                          className={`${portalGhostButton} h-10 px-3.5 text-xs`}
                        >
                          <Pencil className="size-3.5" aria-hidden="true" />
                          {loadingEditId === quiz.id ? "Loading…" : "Edit"}
                        </button>
                        <button
                          type="button"
                          disabled={deleteQuizMutation.isPending}
                          onClick={() => deleteQuizMutation.mutate(quiz.id)}
                          className="inline-flex h-10 items-center gap-1 rounded-md border border-border px-3 text-xs text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" aria-hidden="true" />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </PortalShell>
  );
}
