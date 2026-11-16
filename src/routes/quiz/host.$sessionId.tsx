import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import {
  EmptyState,
  PortalShell,
  portalCard,
  portalGhostButton,
  portalPrimaryButton,
} from "@/components/portal-shell";
import { QuizLeaderboard } from "@/components/quiz-leaderboard";
import {
  endSession,
  fetchParticipants,
  fetchQuizQuestions,
  fetchSession,
  fetchSessionAnswers,
  normaliseAnswer,
  optionKeys,
  optionText,
  setQuestionIndex,
  startSession,
  subscribeToSession,
} from "@/lib/quiz";
import { usePortalRole } from "@/lib/use-portal-role";

export const Route = createFileRoute("/quiz/host/$sessionId")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Hosting Live Quiz — Path to Qur'anic Understanding" },
      {
        name: "description",
        content: "Host controls for a live quiz session, with the PIN and a live leaderboard.",
      },
      { property: "og:title", content: "Hosting Live Quiz — Path to Qur'anic Understanding" },
      { property: "og:description", content: "Host controls for a live quiz session." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: QuizHostPage,
});

function QuizHostPage() {
  const { sessionId } = Route.useParams();
  const { role, isLoading } = usePortalRole();
  const queryClient = useQueryClient();
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canHost = role === "admin" || role === "teacher";

  const sessionQuery = useQuery({
    queryKey: ["quiz-session", sessionId],
    queryFn: () => fetchSession(sessionId),
    refetchInterval: (query) => (query.state.data?.status === "ended" ? false : 3000),
  });
  const session = sessionQuery.data ?? null;

  const questionsQuery = useQuery({
    queryKey: ["quiz-questions", session?.quiz_id],
    queryFn: () => fetchQuizQuestions(session!.quiz_id),
    enabled: Boolean(session?.quiz_id),
  });

  const participantsQuery = useQuery({
    queryKey: ["quiz-participants", sessionId],
    queryFn: () => fetchParticipants(sessionId),
    refetchInterval: session?.status === "ended" ? false : 3000,
  });

  const answersQuery = useQuery({
    queryKey: ["quiz-answers", sessionId],
    queryFn: () => fetchSessionAnswers(sessionId),
    refetchInterval: session?.status === "ended" ? false : 3000,
  });

  useEffect(
    () =>
      subscribeToSession(sessionId, {
        onSession: (row) => queryClient.setQueryData(["quiz-session", sessionId], row),
        onParticipants: () =>
          void queryClient.invalidateQueries({ queryKey: ["quiz-participants", sessionId] }),
        onAnswers: () => {
          void queryClient.invalidateQueries({ queryKey: ["quiz-answers", sessionId] });
          void queryClient.invalidateQueries({ queryKey: ["quiz-participants", sessionId] });
        },
      }),
    [sessionId, queryClient],
  );

  const questions = questionsQuery.data ?? [];
  const index = session?.current_question_index ?? 0;
  const current = questions[index] ?? null;
  const participants = participantsQuery.data ?? [];
  const answers = answersQuery.data ?? [];
  const answeredCurrent = current ? answers.filter((a) => a.question_id === current.id).length : 0;

  async function run(action: () => Promise<void>) {
    setError(null);
    try {
      await action();
      await sessionQuery.refetch();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-quiz-results"] }),
        queryClient.invalidateQueries({ queryKey: ["student-quiz-results"] }),
      ]);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (isLoading || sessionQuery.isLoading) {
    return (
      <PortalShell eyebrow="Live quiz" title="Host console">
        <p className="text-sm text-muted-foreground">Loading the session…</p>
      </PortalShell>
    );
  }

  if (!canHost) {
    return (
      <PortalShell eyebrow="Live quiz" title="Host console">
        <EmptyState
          title="Hosting is for teachers and administrators"
          body="Students join a live quiz with the PIN their teacher shares."
        />
      </PortalShell>
    );
  }

  if (!session) {
    return (
      <PortalShell eyebrow="Live quiz" title="Host console">
        <EmptyState
          title="Session not found"
          body="This quiz session no longer exists. Start a new one from the live quiz page."
        />
      </PortalShell>
    );
  }

  const status = session.status ?? "waiting";
  const correct = current ? normaliseAnswer(current.correct_answer) : null;

  return (
    <PortalShell
      eyebrow="Live quiz — host"
      title="Host console"
      subtitle="Share the PIN below. Students join instantly with a nickname — no account needed."
    >
      <div className="space-y-10">
        {error && (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <div className={portalCard}>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Game PIN</p>
            <p className="mt-3 font-display text-3xl font-semibold tracking-[0.25em] text-amber">
              {session.pin_code ?? "——————"}
            </p>
          </div>
          <div className={portalCard}>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Status</p>
            <p className="mt-3 font-display text-xl text-headline capitalize">{status}</p>
          </div>
          <div className={portalCard}>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Joined</p>
            <p className="mt-3 font-display text-xl text-headline">{participants.length}</p>
          </div>
        </div>

        <section aria-labelledby="host-question">
          <h2 id="host-question" className="font-display text-xl font-semibold">
            {status === "waiting"
              ? "Waiting room"
              : `Question ${Math.min(index + 1, questions.length)} of ${questions.length}`}
          </h2>

          {status === "ended" ? (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                This session has ended. Final scores and ranks have been saved, and the final
                leaderboard is below.
              </p>
              {role === "admin" && (
                <Link
                  to="/admin/results"
                  className="inline-block text-sm font-semibold text-amber underline underline-offset-4"
                >
                  Open Results overview →
                </Link>
              )}
            </div>
          ) : status === "waiting" ? (
            <p className="mt-4 text-sm text-muted-foreground">
              {participants.length === 0
                ? "No students have joined yet."
                : `${participants.length} ${participants.length === 1 ? "student" : "students"} ready.`}{" "}
              Press “Start quiz” when everyone is in.
            </p>
          ) : !current ? (
            <p className="mt-4 text-sm text-muted-foreground">
              All questions have been shown. End the session to publish the final leaderboard.
            </p>
          ) : (
            <div className={`${portalCard} mt-6`}>
              <p className="font-display text-lg text-headline">
                {current.question_text ?? "Question text missing"}
              </p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {optionKeys.map((key) => {
                  const isCorrect = revealed && correct === key;
                  return (
                    <li
                      key={key}
                      className={`rounded-md border px-4 py-3 text-sm ${
                        isCorrect
                          ? "border-amber bg-amber/15 text-headline"
                          : "border-border text-foreground/90"
                      }`}
                    >
                      <span className="mr-2 uppercase text-amber">{key}</span>
                      {optionText(current, key) ?? "—"}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                {answeredCurrent} of {participants.length} answered
                {current.timer_seconds ? ` · ${current.timer_seconds}s timer` : ""}
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {status === "waiting" && (
              <button
                type="button"
                onClick={() => void run(() => startSession(sessionId))}
                disabled={questions.length === 0}
                className={`${portalPrimaryButton} disabled:cursor-not-allowed disabled:opacity-50`}
              >
                Start quiz
              </button>
            )}
            {status === "active" && current && (
              <>
                <button
                  type="button"
                  onClick={() => setRevealed(true)}
                  disabled={revealed}
                  className={`${portalGhostButton} disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  Reveal answer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRevealed(false);
                    void run(() => setQuestionIndex(sessionId, index + 1));
                  }}
                  className={portalPrimaryButton}
                >
                  {index + 1 >= questions.length ? "Finish questions" : "Next question"}
                </button>
              </>
            )}
            {status !== "ended" && (
              <button
                type="button"
                onClick={() => void run(() => endSession(sessionId))}
                className="inline-flex h-11 items-center justify-center rounded-md border border-destructive/50 px-5 text-sm font-medium text-destructive transition-colors duration-200 hover:bg-destructive/10"
              >
                End session
              </button>
            )}
          </div>
        </section>

        <section aria-labelledby="host-leaderboard">
          <h2 id="host-leaderboard" className="font-display text-xl font-semibold">
            Live leaderboard
          </h2>
          <div className="mt-6">
            <QuizLeaderboard participants={participants} live={status !== "ended"} />
          </div>
        </section>
      </div>
    </PortalShell>
  );
}
