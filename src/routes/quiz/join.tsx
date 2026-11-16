import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  EmptyState,
  PortalShell,
  portalCard,
  portalPrimaryButton,
} from "@/components/portal-shell";
import { QuizLeaderboard } from "@/components/quiz-leaderboard";
import { useAuth } from "@/lib/auth";
import { fetchProfile, fetchStudentByProfile } from "@/lib/portal";
import {
  computeRankedParticipants,
  fetchParticipants,
  fetchQuizQuestions,
  fetchSession,
  fetchSessionByPin,
  joinSession,
  optionKeys,
  optionText,
  submitAnswer,
  subscribeToSession,
  type OptionKey,
  type QuizSession,
  type StudentQuizIdentity,
} from "@/lib/quiz";

/** Fallback when a question has no timer stored in the database. */
const DEFAULT_TIMER_SECONDS = 30;

export const Route = createFileRoute("/quiz/join")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Join a Live Quiz — Path to Qur'anic Understanding" },
      {
        name: "description",
        content:
          "Enter the 6-digit quiz PIN from your teacher and a nickname to join the live quiz — no account needed.",
      },
      { property: "og:title", content: "Join a Live Quiz — Path to Qur'anic Understanding" },
      {
        property: "og:description",
        content: "Enter the quiz PIN from your teacher to join the live quiz.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuizJoinPage,
});

function QuizJoinPage() {
  const [joined, setJoined] = useState<{
    session: QuizSession;
    participantId: string;
  } | null>(null);

  return (
    <PortalShell
      eyebrow="Live quiz"
      showSignOut={false}
      title={joined ? "You're in" : "Join a live quiz"}
      subtitle={
        joined
          ? "Answer each question before the timer runs out. The leaderboard updates as everyone answers."
          : "Ask your teacher for the 6-digit PIN, pick a nickname, and you're in — no account needed."
      }
    >
      {joined ? (
        <QuizPlay session={joined.session} participantId={joined.participantId} />
      ) : (
        <JoinForm onJoined={(session, participantId) => setJoined({ session, participantId })} />
      )}
    </PortalShell>
  );
}

function JoinForm({
  onJoined,
}: {
  onJoined: (session: QuizSession, participantId: string) => void;
}) {
  const { user } = useAuth();
  const [pin, setPin] = useState("");
  const [nickname, setNickname] = useState("");
  const [nicknameEdited, setNicknameEdited] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const profileQuery = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => fetchProfile(user!.id),
    enabled: Boolean(user?.id),
  });

  const studentQuery = useQuery({
    queryKey: ["student-row", user?.id],
    queryFn: () => fetchStudentByProfile(user!.id),
    enabled: Boolean(user?.id),
  });

  const defaultSignedInName =
    profileQuery.data?.full_name ?? user?.fullName ?? profileQuery.data?.email ?? user?.email ?? "";

  useEffect(() => {
    if (!nicknameEdited && defaultSignedInName && nickname === "") {
      setNickname(defaultSignedInName);
    }
  }, [defaultSignedInName, nickname, nicknameEdited]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const session = await fetchSessionByPin(pin.trim());
      if (!session) {
        setError("No live quiz found for that PIN. Check the digits with your teacher.");
        return;
      }
      const identity: StudentQuizIdentity | null = user
        ? {
            userId: user.id,
            studentRowId: studentQuery.data?.id ?? null,
            studentCode: studentQuery.data?.student_id ?? null,
            fullName: profileQuery.data?.full_name ?? user.fullName ?? null,
            email: profileQuery.data?.email ?? user.email,
          }
        : null;

      const participant = await joinSession(session.id, nickname.trim(), identity);
      onJoined(session, participant.id);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`${portalCard} max-w-md space-y-5`}>
      <div>
        <label htmlFor="pin" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Quiz PIN
        </label>
        <input
          id="pin"
          inputMode="numeric"
          autoComplete="off"
          required
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          placeholder="123456"
          className="mt-2 h-12 w-full rounded-md border border-border bg-background px-4 font-display text-xl tracking-[0.3em] text-headline outline-none transition-colors focus:border-amber"
        />
      </div>
      <div>
        <label
          htmlFor="nickname"
          className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
        >
          Nickname
        </label>
        <input
          id="nickname"
          required
          maxLength={40}
          value={nickname}
          onChange={(e) => {
            setNicknameEdited(true);
            setNickname(e.target.value);
          }}
          placeholder="Your name"
          className="mt-2 h-12 w-full rounded-md border border-border bg-background px-4 text-base text-headline outline-none transition-colors focus:border-amber"
        />
        {user && (
          <p className="mt-2 text-xs text-muted-foreground">
            Signed in as {defaultSignedInName || user.email}. Your final score and rank will be
            saved to your Results page when the quiz ends.
          </p>
        )}
      </div>
      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy || pin.length !== 6 || nickname.trim() === ""}
        className={`${portalPrimaryButton} w-full disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {busy ? "Joining…" : "Join quiz"}
      </button>
    </form>
  );
}

function QuizPlay({
  session: initialSession,
  participantId,
}: {
  session: QuizSession;
  participantId: string;
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const sessionId = initialSession.id;
  const [answeredFor, setAnsweredFor] = useState<Record<string, OptionKey>>({});
  const [feedback, setFeedback] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const invalidatedOnEndRef = useRef(false);

  const sessionQuery = useQuery({
    queryKey: ["quiz-session", sessionId],
    queryFn: () => fetchSession(sessionId),
    initialData: initialSession,
    refetchInterval: (query) => (query.state.data?.status === "ended" ? false : 3000),
  });
  const session = sessionQuery.data ?? initialSession;

  const questionsQuery = useQuery({
    queryKey: ["quiz-questions", session.quiz_id],
    queryFn: () => fetchQuizQuestions(session.quiz_id),
  });

  const participantsQuery = useQuery({
    queryKey: ["quiz-participants", sessionId],
    queryFn: () => fetchParticipants(sessionId),
    refetchInterval: session.status === "ended" ? false : 3000,
  });

  useEffect(
    () =>
      subscribeToSession(sessionId, {
        onSession: (row) => queryClient.setQueryData(["quiz-session", sessionId], row),
        onParticipants: () =>
          void queryClient.invalidateQueries({ queryKey: ["quiz-participants", sessionId] }),
        onAnswers: () =>
          void queryClient.invalidateQueries({ queryKey: ["quiz-participants", sessionId] }),
      }),
    [sessionId, queryClient],
  );

  useEffect(() => {
    if (session.status === "ended" && !invalidatedOnEndRef.current) {
      invalidatedOnEndRef.current = true;
      void queryClient.invalidateQueries({ queryKey: ["student-quiz-results"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-quiz-results"] });
    }
  }, [session.status, queryClient]);

  const questions = questionsQuery.data ?? [];
  const index = session.current_question_index ?? 0;
  const current = questions[index] ?? null;
  const currentId = current?.id ?? null;
  const currentTimerSeconds = current?.timer_seconds ?? null;
  const participants = useMemo(() => participantsQuery.data ?? [], [participantsQuery.data]);
  const rankedParticipants = useMemo(() => computeRankedParticipants(participants), [participants]);
  const meRanked = useMemo(
    () => rankedParticipants.find((p) => p.id === participantId) ?? null,
    [rankedParticipants, participantId],
  );
  const me = useMemo(
    () => participants.find((p) => p.id === participantId) ?? null,
    [participants, participantId],
  );

  // Per-question countdown, reset whenever the host moves on.
  useEffect(() => {
    if (!currentId || session.status !== "active") {
      setSecondsLeft(null);
      return;
    }
    const total =
      currentTimerSeconds && currentTimerSeconds > 0 ? currentTimerSeconds : DEFAULT_TIMER_SECONDS;
    setSecondsLeft(total);
    const timer = setInterval(() => {
      setSecondsLeft((value) => {
        if (value === null) return null;
        if (value <= 1) {
          clearInterval(timer);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentId, currentTimerSeconds, index, session.status]);

  const mySelection = current ? answeredFor[current.id] : undefined;
  const timeUp = secondsLeft === 0;

  async function handleAnswer(key: OptionKey) {
    if (!current || mySelection) return;
    setError(null);
    setAnsweredFor((prev) => ({ ...prev, [current.id]: key }));
    try {
      const { isCorrect } = await submitAnswer({
        sessionId,
        participantId,
        question: current,
        selected: key,
        currentScore: me?.score ?? 0,
      });
      setFeedback((prev) => ({ ...prev, [current.id]: isCorrect }));
      await participantsQuery.refetch();
    } catch (err) {
      setError((err as Error).message);
      setAnsweredFor((prev) => {
        const next = { ...prev };
        delete next[current.id];
        return next;
      });
    }
  }

  return (
    <div className="space-y-10">
      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className={portalCard}>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Nickname</p>
          <p className="mt-3 font-display text-xl text-headline">{me?.student_name ?? "You"}</p>
        </div>
        <div className={portalCard}>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your score</p>
          <p className="mt-3 font-display text-xl text-amber">{me?.score ?? 0}</p>
        </div>
        <div className={portalCard}>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Time left</p>
          <p className="mt-3 font-display text-xl text-headline">
            {secondsLeft === null ? "—" : `${secondsLeft}s`}
          </p>
        </div>
      </div>

      <section aria-labelledby="play-question">
        <h2 id="play-question" className="font-display text-xl font-semibold">
          {session.status === "waiting"
            ? "Waiting for your teacher to start"
            : session.status === "ended"
              ? "Quiz finished"
              : `Question ${Math.min(index + 1, Math.max(questions.length, 1))}${
                  questions.length ? ` of ${questions.length}` : ""
                }`}
        </h2>

        {session.status === "waiting" ? (
          <p className="mt-4 text-sm text-muted-foreground">
            You&apos;re in the waiting room. The first question will appear here automatically.
          </p>
        ) : session.status === "ended" ? (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Thank you for taking part.
              {meRanked
                ? ` Your final score is ${meRanked.finalScore} pts (Rank #${meRanked.rank} of ${rankedParticipants.length}).`
                : " Your final position is on the leaderboard below."}
            </p>
            {user && (
              <Link
                to="/results"
                className="inline-block text-sm font-semibold text-amber underline underline-offset-4"
              >
                View saved score &amp; rank on My Results →
              </Link>
            )}
          </div>
        ) : !current ? (
          <div className="mt-6">
            <EmptyState
              title="No question on screen"
              body="Your teacher has shown every question. Hold on for the final leaderboard."
            />
          </div>
        ) : (
          <div className={`${portalCard} mt-6`}>
            <p className="font-display text-lg text-headline">
              {current.question_text ?? "Question text missing"}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {optionKeys.map((key) => {
                const selected = mySelection === key;
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={Boolean(mySelection) || timeUp}
                    onClick={() => void handleAnswer(key)}
                    className={`rounded-md border px-4 py-4 text-left text-sm transition-colors ${
                      selected
                        ? "border-amber bg-amber/15 text-headline"
                        : "border-border text-foreground/90 hover:border-amber/60"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <span className="mr-2 uppercase text-amber">{key}</span>
                    {optionText(current, key) ?? "—"}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {mySelection
                ? feedback[current.id]
                  ? "Correct — well done."
                  : "Answer recorded."
                : timeUp
                  ? "Time is up for this question."
                  : "Choose one answer."}
            </p>
          </div>
        )}
      </section>

      <section aria-labelledby="play-leaderboard">
        <h2 id="play-leaderboard" className="font-display text-xl font-semibold">
          Leaderboard
        </h2>
        <div className="mt-6">
          <QuizLeaderboard
            participants={participants}
            highlightId={participantId}
            live={session.status !== "ended"}
          />
        </div>
      </section>
    </div>
  );
}
