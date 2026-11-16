/**
 * Live quiz queries & management against the school's Supabase quiz tables.
 */
import { isAllowedSubject, matchActiveSubjectOption } from "@/data/curriculum";
import { supabase } from "./supabase";

export type Quiz = {
  id: string;
  subject: string | null;
  title: string | null;
  description: string | null;
  created_by: string | null;
  created_at: string | null;
};

export type QuizQuestion = {
  id: string;
  quiz_id: string;
  question_text: string | null;
  option_a: string | null;
  option_b: string | null;
  option_c: string | null;
  option_d: string | null;
  correct_answer: string | null;
  timer_seconds: number | null;
  question_order: number | null;
};

export type QuizSession = {
  id: string;
  quiz_id: string;
  pin_code: string | null;
  status: string | null;
  current_question_index: number | null;
  started_at: string | null;
  created_at: string | null;
};

export type QuizParticipant = {
  id: string;
  session_id: string;
  student_name: string | null;
  score: number | null;
  joined_at: string | null;
  user_id?: string | null;
  student_id?: string | null;
  rank?: number | null;
};

export type QuizAnswer = {
  id: string;
  session_id: string;
  participant_id: string;
  question_id: string;
  selected_answer: string | null;
  is_correct: boolean | null;
  answered_at: string | null;
};

export type QuizWithCount = Quiz & { questionCount: number };

export const MAX_QUIZ_QUESTIONS = 50;
export const MIN_QUESTION_TIMER_SECONDS = 5;
export const MAX_QUESTION_TIMER_SECONDS = 300;
export const DEFAULT_QUESTION_TIMER_SECONDS = 30;
export const POINTS_PER_CORRECT = 10;
export const optionKeys = ["a", "b", "c", "d"] as const;
export type OptionKey = (typeof optionKeys)[number];

export type QuizQuestionDraft = {
  id?: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: OptionKey;
  timer_seconds: number;
};

export type QuizEditorPayload = {
  subject: string;
  title: string;
  description: string;
  created_by?: string | null;
  questions: QuizQuestionDraft[];
};

export function clampTimerSeconds(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_QUESTION_TIMER_SECONDS;
  return Math.max(
    MIN_QUESTION_TIMER_SECONDS,
    Math.min(MAX_QUESTION_TIMER_SECONDS, Math.round(value)),
  );
}

export function optionText(question: QuizQuestion, key: OptionKey): string | null {
  return question[`option_${key}` as const] ?? null;
}

/** correct_answer may be stored as "a"/"A"/"option_a" — normalise to a bare key. */
export function normaliseAnswer(value: string | null): OptionKey | null {
  if (!value) return null;
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/^option[_\s-]*/, "");
  return (optionKeys as readonly string[]).includes(cleaned) ? (cleaned as OptionKey) : null;
}

/**
 * Fetches quizzes restricted to the 4 programme subjects
 * (Nahwu, Sarf, Hadith, As-Sarim Al-Battar).
 */
export async function fetchQuizzes(): Promise<QuizWithCount[]> {
  const [quizzes, questions] = await Promise.all([
    supabase
      .from("quizzes")
      .select("id, subject, title, description, created_by, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("quiz_questions").select("id, quiz_id"),
  ]);
  const firstError = quizzes.error ?? questions.error;
  if (firstError) throw new Error(firstError.message);

  const counts = new Map<string, number>();
  for (const row of (questions.data ?? []) as { quiz_id: string }[]) {
    counts.set(row.quiz_id, (counts.get(row.quiz_id) ?? 0) + 1);
  }
  return ((quizzes.data ?? []) as Quiz[])
    .filter((quiz) => isAllowedSubject(quiz.subject))
    .map((quiz) => ({
      ...quiz,
      questionCount: counts.get(quiz.id) ?? 0,
    }));
}

export async function fetchQuizQuestions(quizId: string): Promise<QuizQuestion[]> {
  const { data, error } = await supabase
    .from("quiz_questions")
    .select(
      "id, quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer, timer_seconds, question_order",
    )
    .eq("quiz_id", quizId)
    .order("question_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as QuizQuestion[];
}

/** Admin action — creates a quiz with 1 to 50 questions and per-question timers. */
export async function createQuizWithQuestions(payload: QuizEditorPayload): Promise<string> {
  if (!isAllowedSubject(payload.subject)) {
    throw new Error("Subject must be one of: Nahwu, Sarf, Hadith, or As-Sarim Al-Battar.");
  }
  if (payload.questions.length < 1 || payload.questions.length > MAX_QUIZ_QUESTIONS) {
    throw new Error(`A quiz must contain between 1 and ${MAX_QUIZ_QUESTIONS} questions.`);
  }

  const { data: quizRow, error: quizError } = await supabase
    .from("quizzes")
    .insert({
      subject: payload.subject.trim(),
      title: payload.title.trim(),
      description: payload.description.trim() || null,
      created_by: payload.created_by ?? null,
    })
    .select("id")
    .single();

  if (quizError || !quizRow) {
    throw new Error(quizError?.message ?? "Could not create quiz.");
  }

  const quizId = (quizRow as { id: string }).id;
  const rows = payload.questions.map((q, index) => ({
    quiz_id: quizId,
    question_text: q.question_text.trim(),
    option_a: q.option_a.trim(),
    option_b: q.option_b.trim(),
    option_c: q.option_c.trim(),
    option_d: q.option_d.trim(),
    correct_answer: q.correct_answer,
    timer_seconds: clampTimerSeconds(q.timer_seconds),
    question_order: index + 1,
  }));

  const { error: questionsError } = await supabase.from("quiz_questions").insert(rows);
  if (questionsError) {
    // Attempt cleanup of orphaned quiz header if questions insert failed.
    await supabase.from("quizzes").delete().eq("id", quizId);
    throw new Error(questionsError.message);
  }

  return quizId;
}

/** Admin action — updates a quiz header and syncs its questions (preserving existing row IDs). */
export async function updateQuizWithQuestions(
  quizId: string,
  payload: QuizEditorPayload,
): Promise<void> {
  if (!isAllowedSubject(payload.subject)) {
    throw new Error("Subject must be one of: Nahwu, Sarf, Hadith, or As-Sarim Al-Battar.");
  }
  if (payload.questions.length < 1 || payload.questions.length > MAX_QUIZ_QUESTIONS) {
    throw new Error(`A quiz must contain between 1 and ${MAX_QUIZ_QUESTIONS} questions.`);
  }

  const { error: quizError } = await supabase
    .from("quizzes")
    .update({
      subject: payload.subject.trim(),
      title: payload.title.trim(),
      description: payload.description.trim() || null,
    })
    .eq("id", quizId);

  if (quizError) throw new Error(quizError.message);

  const { data: existingRows, error: existingError } = await supabase
    .from("quiz_questions")
    .select("id")
    .eq("quiz_id", quizId);
  if (existingError) throw new Error(existingError.message);

  const existingIds = ((existingRows ?? []) as { id: string }[]).map((row) => row.id);
  const keptIds = new Set(
    payload.questions.map((q) => q.id).filter((id): id is string => Boolean(id)),
  );
  const toDeleteIds = existingIds.filter((id) => !keptIds.has(id));

  if (toDeleteIds.length > 0) {
    const { error: deleteError } = await supabase
      .from("quiz_questions")
      .delete()
      .in("id", toDeleteIds);
    if (deleteError) throw new Error(deleteError.message);
  }

  const updates = payload.questions
    .map((q, index) => ({ q, order: index + 1 }))
    .filter((item): item is { q: QuizQuestionDraft & { id: string }; order: number } =>
      Boolean(item.q.id),
    );

  if (updates.length > 0) {
    const updateResults = await Promise.all(
      updates.map(({ q, order }) =>
        supabase
          .from("quiz_questions")
          .update({
            question_text: q.question_text.trim(),
            option_a: q.option_a.trim(),
            option_b: q.option_b.trim(),
            option_c: q.option_c.trim(),
            option_d: q.option_d.trim(),
            correct_answer: q.correct_answer,
            timer_seconds: clampTimerSeconds(q.timer_seconds),
            question_order: order,
          })
          .eq("id", q.id)
          .eq("quiz_id", quizId),
      ),
    );
    const firstUpdateError = updateResults.find((res) => res.error)?.error;
    if (firstUpdateError) throw new Error(firstUpdateError.message);
  }

  const toInsert = payload.questions
    .map((q, index) => ({ q, order: index + 1 }))
    .filter((item) => !item.q.id)
    .map(({ q, order }) => ({
      quiz_id: quizId,
      question_text: q.question_text.trim(),
      option_a: q.option_a.trim(),
      option_b: q.option_b.trim(),
      option_c: q.option_c.trim(),
      option_d: q.option_d.trim(),
      correct_answer: q.correct_answer,
      timer_seconds: clampTimerSeconds(q.timer_seconds),
      question_order: order,
    }));

  if (toInsert.length > 0) {
    const { error: insertError } = await supabase.from("quiz_questions").insert(toInsert);
    if (insertError) throw new Error(insertError.message);
  }
}

/** Admin action — deletes a quiz and its questions. */
export async function deleteQuiz(quizId: string): Promise<void> {
  const { error: questionsError } = await supabase
    .from("quiz_questions")
    .delete()
    .eq("quiz_id", quizId);
  if (questionsError) throw new Error(questionsError.message);

  const { error: quizError } = await supabase.from("quizzes").delete().eq("id", quizId);
  if (quizError) throw new Error(quizError.message);
}

export async function fetchSession(sessionId: string): Promise<QuizSession | null> {
  const { data, error } = await supabase
    .from("quiz_sessions")
    .select("id, quiz_id, pin_code, status, current_question_index, started_at, created_at")
    .eq("id", sessionId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as QuizSession | null) ?? null;
}

export async function fetchSessionByPin(pin: string): Promise<QuizSession | null> {
  const { data, error } = await supabase
    .from("quiz_sessions")
    .select("id, quiz_id, pin_code, status, current_question_index, started_at, created_at")
    .eq("pin_code", pin)
    .neq("status", "ended")
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) throw new Error(error.message);
  return ((data ?? [])[0] as QuizSession | undefined) ?? null;
}

export async function fetchParticipants(sessionId: string): Promise<QuizParticipant[]> {
  const { data, error } = await supabase
    .from("quiz_participants")
    .select("id, session_id, student_name, score, joined_at")
    .eq("session_id", sessionId)
    .order("score", { ascending: false })
    .order("joined_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as QuizParticipant[];
}

export async function fetchSessionAnswers(sessionId: string): Promise<QuizAnswer[]> {
  const { data, error } = await supabase
    .from("quiz_answers")
    .select("id, session_id, participant_id, question_id, selected_answer, is_correct, answered_at")
    .eq("session_id", sessionId);
  if (error) throw new Error(error.message);
  return (data ?? []) as QuizAnswer[];
}

function generatePin(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/** Host action — creates a waiting session with a fresh 6-digit PIN. */
export async function createSession(quizId: string): Promise<QuizSession> {
  let lastError: string | null = null;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const pin = generatePin();
    const { data, error } = await supabase
      .from("quiz_sessions")
      .insert({
        quiz_id: quizId,
        pin_code: pin,
        status: "waiting",
        current_question_index: 0,
      })
      .select("id, quiz_id, pin_code, status, current_question_index, started_at, created_at")
      .single();
    if (!error && data) return data as QuizSession;
    lastError = error?.message ?? "Could not create the session.";
    if (!error?.message?.toLowerCase().includes("duplicate")) break;
  }
  throw new Error(lastError ?? "Could not create the session.");
}

export async function startSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from("quiz_sessions")
    .update({ status: "active", current_question_index: 0, started_at: new Date().toISOString() })
    .eq("id", sessionId);
  if (error) throw new Error(error.message);
}

export async function setQuestionIndex(sessionId: string, index: number): Promise<void> {
  const { error } = await supabase
    .from("quiz_sessions")
    .update({ status: "active", current_question_index: index })
    .eq("id", sessionId);
  if (error) throw new Error(error.message);
}

export type RankedQuizParticipant = QuizParticipant & {
  rank: number;
  finalScore: number;
};

/** Computes 1-based competition ranks (ties share the same rank, e.g. 1, 2, 2, 4). */
export function computeRankedParticipants(
  participants: QuizParticipant[],
): RankedQuizParticipant[] {
  const sorted = [...participants].sort((a, b) => {
    const scoreDiff = (b.score ?? 0) - (a.score ?? 0);
    if (scoreDiff !== 0) return scoreDiff;
    return (a.joined_at ?? "").localeCompare(b.joined_at ?? "");
  });

  let lastScore: number | null = null;
  let lastRank = 0;

  return sorted.map((participant, index) => {
    const finalScore = participant.score ?? 0;
    const rank = lastScore !== null && finalScore === lastScore ? lastRank : index + 1;
    lastScore = finalScore;
    lastRank = rank;
    return {
      ...participant,
      finalScore,
      rank,
    };
  });
}

const QUIZ_LINKS_STORAGE_KEY = "ptqu_quiz_links";

export type LocalQuizParticipation = {
  sessionId: string;
  participantId: string;
  userId: string;
  studentId: string | null;
  studentName: string;
  joinedAt: string;
};

export function recordLocalQuizParticipation(entry: LocalQuizParticipation): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(QUIZ_LINKS_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as LocalQuizParticipation[]) : [];
    const list = Array.isArray(parsed) ? parsed : [];
    const filtered = list.filter(
      (item) => !(item.sessionId === entry.sessionId && item.participantId === entry.participantId),
    );
    filtered.push(entry);
    window.localStorage.setItem(QUIZ_LINKS_STORAGE_KEY, JSON.stringify(filtered.slice(-100)));
  } catch {
    // Ignore storage errors in private browsing.
  }
}

export function getLocalQuizParticipations(userId: string): LocalQuizParticipation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(QUIZ_LINKS_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as LocalQuizParticipation[]) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item.userId === userId);
  } catch {
    return [];
  }
}

export type StudentQuizIdentity = {
  userId: string;
  studentRowId?: string | null;
  studentCode?: string | null;
  fullName?: string | null;
  email?: string | null;
};

/**
 * Ends a live quiz session and persists final scores & ranks for signed-in students
 * (best-effort across optional `rank` / `quiz_results` columns/tables, while always
 * marking `quiz_sessions.status = 'ended'` so final scores & ranks are preserved).
 */
export async function finalizeSessionResults(sessionId: string): Promise<RankedQuizParticipant[]> {
  const participants = await fetchParticipants(sessionId);
  const ranked = computeRankedParticipants(participants);
  if (ranked.length === 0) return ranked;

  // 1. Best-effort save rank onto `quiz_participants` if a `rank` column exists.
  await Promise.all(
    ranked.map((entry) =>
      supabase
        .from("quiz_participants")
        .update({ rank: entry.rank })
        .eq("id", entry.id)
        .then(
          () => undefined,
          () => undefined,
        ),
    ),
  );

  // 2. Best-effort save signed-in student records to `quiz_results` if present in Supabase.
  try {
    const [sessionRow, studentsRes] = await Promise.all([
      fetchSession(sessionId),
      supabase
        .from("students")
        .select("id, profile_id, student_id, profiles(id, full_name, email)"),
    ]);

    const studentsList = (studentsRes.data ?? []) as {
      id: string;
      profile_id: string;
      student_id: string | null;
      profiles:
        | { id: string; full_name: string | null; email: string | null }
        | { id: string; full_name: string | null; email: string | null }[]
        | null;
    }[];

    const byName = new Map<string, { studentId: string; profileId: string }>();
    for (const st of studentsList) {
      const prof = Array.isArray(st.profiles) ? (st.profiles[0] ?? null) : st.profiles;
      const target = { studentId: st.id, profileId: st.profile_id };
      if (prof?.full_name) byName.set(prof.full_name.trim().toLowerCase(), target);
      if (prof?.email) byName.set(prof.email.trim().toLowerCase(), target);
      if (st.student_id) byName.set(st.student_id.trim().toLowerCase(), target);
    }

    const resultRows = ranked.map((entry) => {
      const key = (entry.student_name ?? "").trim().toLowerCase();
      const matched = key ? byName.get(key) : undefined;
      return {
        session_id: sessionId,
        quiz_id: sessionRow?.quiz_id ?? null,
        participant_id: entry.id,
        student_id: matched?.studentId ?? null,
        user_id: matched?.profileId ?? null,
        student_name: entry.student_name,
        score: entry.finalScore,
        rank: entry.rank,
        total_participants: ranked.length,
        recorded_at: new Date().toISOString(),
      };
    });

    await supabase.from("quiz_results").upsert(resultRows, { onConflict: "participant_id" });
  } catch {
    // Non-fatal when `quiz_results` table is not provisioned in Supabase.
  }

  return ranked;
}

export async function endSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from("quiz_sessions")
    .update({ status: "ended" })
    .eq("id", sessionId);
  if (error) throw new Error(error.message);

  await finalizeSessionResults(sessionId);
}

export async function joinSession(
  sessionId: string,
  studentName: string,
  identity?: StudentQuizIdentity | null,
): Promise<QuizParticipant> {
  let participant: QuizParticipant | null = null;

  if (identity?.userId) {
    const { data, error } = await supabase
      .from("quiz_participants")
      .insert({
        session_id: sessionId,
        student_name: studentName,
        score: 0,
        user_id: identity.userId,
        ...(identity.studentRowId ? { student_id: identity.studentRowId } : {}),
      })
      .select("id, session_id, student_name, score, joined_at")
      .single();

    if (!error && data) {
      participant = data as QuizParticipant;
    }
  }

  if (!participant) {
    const { data, error } = await supabase
      .from("quiz_participants")
      .insert({ session_id: sessionId, student_name: studentName, score: 0 })
      .select("id, session_id, student_name, score, joined_at")
      .single();
    if (error) throw new Error(error.message);
    participant = data as QuizParticipant;
  }

  if (identity?.userId) {
    recordLocalQuizParticipation({
      sessionId,
      participantId: participant.id,
      userId: identity.userId,
      studentId: identity.studentRowId ?? null,
      studentName,
      joinedAt: participant.joined_at ?? new Date().toISOString(),
    });
  }

  return participant;
}

export async function submitAnswer(input: {
  sessionId: string;
  participantId: string;
  question: QuizQuestion;
  selected: OptionKey;
  currentScore: number;
}): Promise<{ isCorrect: boolean }> {
  const correct = normaliseAnswer(input.question.correct_answer);
  const isCorrect = correct !== null && correct === input.selected;

  const { error } = await supabase.from("quiz_answers").insert({
    session_id: input.sessionId,
    participant_id: input.participantId,
    question_id: input.question.id,
    selected_answer: input.selected,
    is_correct: isCorrect,
  });
  if (error) throw new Error(error.message);

  if (isCorrect) {
    const { data: latest } = await supabase
      .from("quiz_participants")
      .select("score")
      .eq("id", input.participantId)
      .maybeSingle();
    const baseScore = (latest as { score: number | null } | null)?.score ?? input.currentScore;
    const { error: scoreError } = await supabase
      .from("quiz_participants")
      .update({ score: baseScore + POINTS_PER_CORRECT })
      .eq("id", input.participantId);
    if (scoreError) throw new Error(scoreError.message);
  }

  return { isCorrect };
}

/**
 * Realtime sync for one session. All postgres_changes listeners are registered
 * BEFORE subscribe() — required by supabase-js.
 */
export function subscribeToSession(
  sessionId: string,
  handlers: {
    onSession?: (session: QuizSession) => void;
    onParticipants?: () => void;
    onAnswers?: () => void;
  },
): () => void {
  const channel = supabase.channel(`quiz-session-${sessionId}`);

  channel.on(
    "postgres_changes",
    { event: "*", schema: "public", table: "quiz_sessions", filter: `id=eq.${sessionId}` },
    (payload) => {
      const row = payload.new as QuizSession | null;
      if (row?.id) handlers.onSession?.(row);
    },
  );

  channel.on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "quiz_participants",
      filter: `session_id=eq.${sessionId}`,
    },
    () => handlers.onParticipants?.(),
  );

  channel.on(
    "postgres_changes",
    { event: "*", schema: "public", table: "quiz_answers", filter: `session_id=eq.${sessionId}` },
    () => handlers.onAnswers?.(),
  );

  channel.subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

/* ---------------------------------------------------------------------------
 * Ended Live Quiz Results (Student & Admin views)
 * ------------------------------------------------------------------------- */

export type EndedQuizResultRow = {
  participantId: string;
  sessionId: string;
  quizId: string;
  quizTitle: string;
  subject: string;
  pinCode: string | null;
  studentName: string;
  matchedStudentRowId: string | null;
  matchedProfileId: string | null;
  matchedStudentCode: string | null;
  score: number;
  rank: number;
  totalParticipants: number;
  maxPossibleScore: number | null;
  completedAt: string | null;
};

type StudentMatchTarget = {
  studentRowId: string;
  profileId: string;
  studentCode: string | null;
  fullName: string | null;
  email: string | null;
};

export async function fetchAllEndedQuizResults(): Promise<EndedQuizResultRow[]> {
  const [sessionsRes, quizzesRes, questionsRes, studentsRes] = await Promise.all([
    supabase
      .from("quiz_sessions")
      .select("id, quiz_id, pin_code, status, started_at, created_at")
      .eq("status", "ended")
      .order("created_at", { ascending: false }),
    supabase.from("quizzes").select("id, subject, title, description, created_by, created_at"),
    supabase.from("quiz_questions").select("id, quiz_id"),
    supabase.from("students").select("id, profile_id, student_id, profiles(id, full_name, email)"),
  ]);

  if (sessionsRes.error) throw new Error(sessionsRes.error.message);
  if (quizzesRes.error) throw new Error(quizzesRes.error.message);

  const sessions = (sessionsRes.data ?? []) as QuizSession[];
  if (sessions.length === 0) return [];

  const quizById = new Map<string, Quiz>();
  for (const quiz of (quizzesRes.data ?? []) as Quiz[]) {
    if (isAllowedSubject(quiz.subject)) {
      quizById.set(quiz.id, quiz);
    }
  }

  const questionCounts = new Map<string, number>();
  for (const q of (questionsRes.data ?? []) as { quiz_id: string }[]) {
    questionCounts.set(q.quiz_id, (questionCounts.get(q.quiz_id) ?? 0) + 1);
  }

  const sessionIds = sessions.filter((s) => quizById.has(s.quiz_id)).map((s) => s.id);
  if (sessionIds.length === 0) return [];

  const participantsRes = await supabase
    .from("quiz_participants")
    .select("id, session_id, student_name, score, joined_at")
    .in("session_id", sessionIds);
  if (participantsRes.error) throw new Error(participantsRes.error.message);

  const bySession = new Map<string, QuizParticipant[]>();
  for (const p of (participantsRes.data ?? []) as QuizParticipant[]) {
    const list = bySession.get(p.session_id) ?? [];
    list.push(p);
    bySession.set(p.session_id, list);
  }

  const studentTargetsByKey = new Map<string, StudentMatchTarget>();
  for (const st of (studentsRes.data ?? []) as {
    id: string;
    profile_id: string;
    student_id: string | null;
    profiles:
      | { id: string; full_name: string | null; email: string | null }
      | { id: string; full_name: string | null; email: string | null }[]
      | null;
  }[]) {
    const prof = Array.isArray(st.profiles) ? (st.profiles[0] ?? null) : st.profiles;
    const target: StudentMatchTarget = {
      studentRowId: st.id,
      profileId: st.profile_id,
      studentCode: st.student_id,
      fullName: prof?.full_name ?? null,
      email: prof?.email ?? null,
    };
    if (prof?.full_name) studentTargetsByKey.set(prof.full_name.trim().toLowerCase(), target);
    if (prof?.email) studentTargetsByKey.set(prof.email.trim().toLowerCase(), target);
    if (st.student_id) studentTargetsByKey.set(st.student_id.trim().toLowerCase(), target);
  }

  const results: EndedQuizResultRow[] = [];

  for (const session of sessions) {
    const quiz = quizById.get(session.quiz_id);
    if (!quiz) continue;

    const sessionParticipants = bySession.get(session.id) ?? [];
    const ranked = computeRankedParticipants(sessionParticipants);
    const totalQ = questionCounts.get(quiz.id) ?? 0;
    const maxPossibleScore = totalQ > 0 ? totalQ * POINTS_PER_CORRECT : null;
    const subjectOption = matchActiveSubjectOption(quiz.subject);
    const subjectLabel = subjectOption?.fullLabel ?? quiz.subject ?? "Quiz";

    for (const p of ranked) {
      const displayName = p.student_name?.trim() || "Student";
      const matched = studentTargetsByKey.get(displayName.toLowerCase()) ?? null;

      results.push({
        participantId: p.id,
        sessionId: session.id,
        quizId: quiz.id,
        quizTitle: quiz.title?.trim() || "Live Quiz",
        subject: subjectLabel,
        pinCode: session.pin_code,
        studentName: matched?.fullName ?? displayName,
        matchedStudentRowId: matched?.studentRowId ?? null,
        matchedProfileId: matched?.profileId ?? null,
        matchedStudentCode: matched?.studentCode ?? null,
        score: p.finalScore,
        rank: p.rank,
        totalParticipants: ranked.length,
        maxPossibleScore,
        completedAt: session.started_at ?? session.created_at ?? p.joined_at,
      });
    }
  }

  return results;
}

export async function fetchStudentQuizResults(input: {
  userId: string;
  studentRowId?: string | null | undefined;
  candidateNames: (string | null | undefined)[];
}): Promise<EndedQuizResultRow[]> {
  const all = await fetchAllEndedQuizResults();
  const localParticipantIds = new Set(
    getLocalQuizParticipations(input.userId).map((item) => item.participantId),
  );
  const nameSet = new Set(
    input.candidateNames
      .filter((value): value is string => Boolean(value && value.trim()))
      .map((value) => value.trim().toLowerCase()),
  );

  return all.filter((row) => {
    if (localParticipantIds.has(row.participantId)) return true;
    if (row.matchedProfileId && row.matchedProfileId === input.userId) return true;
    if (input.studentRowId && row.matchedStudentRowId === input.studentRowId) return true;
    if (nameSet.has(row.studentName.trim().toLowerCase())) return true;
    return false;
  });
}
