import { a as supabase } from "./auth-xPULwznI.mjs";
import { a as matchActiveSubjectOption, i as isAllowedSubject } from "./curriculum-rYiZvMsx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quiz-Cmi0m9eU.js
var optionKeys = [
	"a",
	"b",
	"c",
	"d"
];
function clampTimerSeconds(value) {
	if (!Number.isFinite(value)) return 30;
	return Math.max(5, Math.min(300, Math.round(value)));
}
function optionText(question, key) {
	return question[`option_${key}`] ?? null;
}
/** correct_answer may be stored as "a"/"A"/"option_a" — normalise to a bare key. */
function normaliseAnswer(value) {
	if (!value) return null;
	const cleaned = value.trim().toLowerCase().replace(/^option[_\s-]*/, "");
	return optionKeys.includes(cleaned) ? cleaned : null;
}
/**
* Fetches quizzes restricted to the 4 programme subjects
* (Nahwu, Sarf, Hadith, As-Sarim Al-Battar).
*/
async function fetchQuizzes() {
	const [quizzes, questions] = await Promise.all([supabase.from("quizzes").select("id, subject, title, description, created_by, created_at").order("created_at", { ascending: false }), supabase.from("quiz_questions").select("id, quiz_id")]);
	const firstError = quizzes.error ?? questions.error;
	if (firstError) throw new Error(firstError.message);
	const counts = /* @__PURE__ */ new Map();
	for (const row of questions.data ?? []) counts.set(row.quiz_id, (counts.get(row.quiz_id) ?? 0) + 1);
	return (quizzes.data ?? []).filter((quiz) => isAllowedSubject(quiz.subject)).map((quiz) => ({
		...quiz,
		questionCount: counts.get(quiz.id) ?? 0
	}));
}
async function fetchQuizQuestions(quizId) {
	const { data, error } = await supabase.from("quiz_questions").select("id, quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer, timer_seconds, question_order").eq("quiz_id", quizId).order("question_order", { ascending: true });
	if (error) throw new Error(error.message);
	return data ?? [];
}
/** Admin action — creates a quiz with 1 to 50 questions and per-question timers. */
async function createQuizWithQuestions(payload) {
	if (!isAllowedSubject(payload.subject)) throw new Error("Subject must be one of: Nahwu, Sarf, Hadith, or As-Sarim Al-Battar.");
	if (payload.questions.length < 1 || payload.questions.length > 50) throw new Error(`A quiz must contain between 1 and 50 questions.`);
	const { data: quizRow, error: quizError } = await supabase.from("quizzes").insert({
		subject: payload.subject.trim(),
		title: payload.title.trim(),
		description: payload.description.trim() || null,
		created_by: payload.created_by ?? null
	}).select("id").single();
	if (quizError || !quizRow) throw new Error(quizError?.message ?? "Could not create quiz.");
	const quizId = quizRow.id;
	const rows = payload.questions.map((q, index) => ({
		quiz_id: quizId,
		question_text: q.question_text.trim(),
		option_a: q.option_a.trim(),
		option_b: q.option_b.trim(),
		option_c: q.option_c.trim(),
		option_d: q.option_d.trim(),
		correct_answer: q.correct_answer,
		timer_seconds: clampTimerSeconds(q.timer_seconds),
		question_order: index + 1
	}));
	const { error: questionsError } = await supabase.from("quiz_questions").insert(rows);
	if (questionsError) {
		await supabase.from("quizzes").delete().eq("id", quizId);
		throw new Error(questionsError.message);
	}
	return quizId;
}
/** Admin action — updates a quiz header and syncs its questions (preserving existing row IDs). */
async function updateQuizWithQuestions(quizId, payload) {
	if (!isAllowedSubject(payload.subject)) throw new Error("Subject must be one of: Nahwu, Sarf, Hadith, or As-Sarim Al-Battar.");
	if (payload.questions.length < 1 || payload.questions.length > 50) throw new Error(`A quiz must contain between 1 and 50 questions.`);
	const { error: quizError } = await supabase.from("quizzes").update({
		subject: payload.subject.trim(),
		title: payload.title.trim(),
		description: payload.description.trim() || null
	}).eq("id", quizId);
	if (quizError) throw new Error(quizError.message);
	const { data: existingRows, error: existingError } = await supabase.from("quiz_questions").select("id").eq("quiz_id", quizId);
	if (existingError) throw new Error(existingError.message);
	const existingIds = (existingRows ?? []).map((row) => row.id);
	const keptIds = new Set(payload.questions.map((q) => q.id).filter((id) => Boolean(id)));
	const toDeleteIds = existingIds.filter((id) => !keptIds.has(id));
	if (toDeleteIds.length > 0) {
		const { error: deleteError } = await supabase.from("quiz_questions").delete().in("id", toDeleteIds);
		if (deleteError) throw new Error(deleteError.message);
	}
	const updates = payload.questions.map((q, index) => ({
		q,
		order: index + 1
	})).filter((item) => Boolean(item.q.id));
	if (updates.length > 0) {
		const firstUpdateError = (await Promise.all(updates.map(({ q, order }) => supabase.from("quiz_questions").update({
			question_text: q.question_text.trim(),
			option_a: q.option_a.trim(),
			option_b: q.option_b.trim(),
			option_c: q.option_c.trim(),
			option_d: q.option_d.trim(),
			correct_answer: q.correct_answer,
			timer_seconds: clampTimerSeconds(q.timer_seconds),
			question_order: order
		}).eq("id", q.id).eq("quiz_id", quizId)))).find((res) => res.error)?.error;
		if (firstUpdateError) throw new Error(firstUpdateError.message);
	}
	const toInsert = payload.questions.map((q, index) => ({
		q,
		order: index + 1
	})).filter((item) => !item.q.id).map(({ q, order }) => ({
		quiz_id: quizId,
		question_text: q.question_text.trim(),
		option_a: q.option_a.trim(),
		option_b: q.option_b.trim(),
		option_c: q.option_c.trim(),
		option_d: q.option_d.trim(),
		correct_answer: q.correct_answer,
		timer_seconds: clampTimerSeconds(q.timer_seconds),
		question_order: order
	}));
	if (toInsert.length > 0) {
		const { error: insertError } = await supabase.from("quiz_questions").insert(toInsert);
		if (insertError) throw new Error(insertError.message);
	}
}
/** Admin action — deletes a quiz and its questions. */
async function deleteQuiz(quizId) {
	const { error: questionsError } = await supabase.from("quiz_questions").delete().eq("quiz_id", quizId);
	if (questionsError) throw new Error(questionsError.message);
	const { error: quizError } = await supabase.from("quizzes").delete().eq("id", quizId);
	if (quizError) throw new Error(quizError.message);
}
async function fetchSession(sessionId) {
	const { data, error } = await supabase.from("quiz_sessions").select("id, quiz_id, pin_code, status, current_question_index, started_at, created_at").eq("id", sessionId).maybeSingle();
	if (error) throw new Error(error.message);
	return data ?? null;
}
async function fetchSessionByPin(pin) {
	const { data, error } = await supabase.from("quiz_sessions").select("id, quiz_id, pin_code, status, current_question_index, started_at, created_at").eq("pin_code", pin).neq("status", "ended").order("created_at", { ascending: false }).limit(1);
	if (error) throw new Error(error.message);
	return (data ?? [])[0] ?? null;
}
async function fetchParticipants(sessionId) {
	const { data, error } = await supabase.from("quiz_participants").select("id, session_id, student_name, score, joined_at").eq("session_id", sessionId).order("score", { ascending: false }).order("joined_at", { ascending: true });
	if (error) throw new Error(error.message);
	return data ?? [];
}
async function fetchSessionAnswers(sessionId) {
	const { data, error } = await supabase.from("quiz_answers").select("id, session_id, participant_id, question_id, selected_answer, is_correct, answered_at").eq("session_id", sessionId);
	if (error) throw new Error(error.message);
	return data ?? [];
}
function generatePin() {
	return String(Math.floor(1e5 + Math.random() * 9e5));
}
/** Host action — creates a waiting session with a fresh 6-digit PIN. */
async function createSession(quizId) {
	let lastError = null;
	for (let attempt = 0; attempt < 5; attempt += 1) {
		const pin = generatePin();
		const { data, error } = await supabase.from("quiz_sessions").insert({
			quiz_id: quizId,
			pin_code: pin,
			status: "waiting",
			current_question_index: 0
		}).select("id, quiz_id, pin_code, status, current_question_index, started_at, created_at").single();
		if (!error && data) return data;
		lastError = error?.message ?? "Could not create the session.";
		if (!error?.message?.toLowerCase().includes("duplicate")) break;
	}
	throw new Error(lastError ?? "Could not create the session.");
}
async function startSession(sessionId) {
	const { error } = await supabase.from("quiz_sessions").update({
		status: "active",
		current_question_index: 0,
		started_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", sessionId);
	if (error) throw new Error(error.message);
}
async function setQuestionIndex(sessionId, index) {
	const { error } = await supabase.from("quiz_sessions").update({
		status: "active",
		current_question_index: index
	}).eq("id", sessionId);
	if (error) throw new Error(error.message);
}
/** Computes 1-based competition ranks (ties share the same rank, e.g. 1, 2, 2, 4). */
function computeRankedParticipants(participants) {
	const sorted = [...participants].sort((a, b) => {
		const scoreDiff = (b.score ?? 0) - (a.score ?? 0);
		if (scoreDiff !== 0) return scoreDiff;
		return (a.joined_at ?? "").localeCompare(b.joined_at ?? "");
	});
	let lastScore = null;
	let lastRank = 0;
	return sorted.map((participant, index) => {
		const finalScore = participant.score ?? 0;
		const rank = lastScore !== null && finalScore === lastScore ? lastRank : index + 1;
		lastScore = finalScore;
		lastRank = rank;
		return {
			...participant,
			finalScore,
			rank
		};
	});
}
var QUIZ_LINKS_STORAGE_KEY = "ptqu_quiz_links";
function recordLocalQuizParticipation(entry) {
	if (typeof window === "undefined") return;
	try {
		const raw = window.localStorage.getItem(QUIZ_LINKS_STORAGE_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		const filtered = (Array.isArray(parsed) ? parsed : []).filter((item) => !(item.sessionId === entry.sessionId && item.participantId === entry.participantId));
		filtered.push(entry);
		window.localStorage.setItem(QUIZ_LINKS_STORAGE_KEY, JSON.stringify(filtered.slice(-100)));
	} catch {}
}
function getLocalQuizParticipations(userId) {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(QUIZ_LINKS_STORAGE_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		if (!Array.isArray(parsed)) return [];
		return parsed.filter((item) => item.userId === userId);
	} catch {
		return [];
	}
}
/**
* Ends a live quiz session and persists final scores & ranks for signed-in students
* (best-effort across optional `rank` / `quiz_results` columns/tables, while always
* marking `quiz_sessions.status = 'ended'` so final scores & ranks are preserved).
*/
async function finalizeSessionResults(sessionId) {
	const ranked = computeRankedParticipants(await fetchParticipants(sessionId));
	if (ranked.length === 0) return ranked;
	await Promise.all(ranked.map((entry) => supabase.from("quiz_participants").update({ rank: entry.rank }).eq("id", entry.id).then(() => void 0, () => void 0)));
	try {
		const [sessionRow, studentsRes] = await Promise.all([fetchSession(sessionId), supabase.from("students").select("id, profile_id, student_id, profiles(id, full_name, email)")]);
		const studentsList = studentsRes.data ?? [];
		const byName = /* @__PURE__ */ new Map();
		for (const st of studentsList) {
			const prof = Array.isArray(st.profiles) ? st.profiles[0] ?? null : st.profiles;
			const target = {
				studentId: st.id,
				profileId: st.profile_id
			};
			if (prof?.full_name) byName.set(prof.full_name.trim().toLowerCase(), target);
			if (prof?.email) byName.set(prof.email.trim().toLowerCase(), target);
			if (st.student_id) byName.set(st.student_id.trim().toLowerCase(), target);
		}
		const resultRows = ranked.map((entry) => {
			const key = (entry.student_name ?? "").trim().toLowerCase();
			const matched = key ? byName.get(key) : void 0;
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
				recorded_at: (/* @__PURE__ */ new Date()).toISOString()
			};
		});
		await supabase.from("quiz_results").upsert(resultRows, { onConflict: "participant_id" });
	} catch {}
	return ranked;
}
async function endSession(sessionId) {
	const { error } = await supabase.from("quiz_sessions").update({ status: "ended" }).eq("id", sessionId);
	if (error) throw new Error(error.message);
	await finalizeSessionResults(sessionId);
}
async function joinSession(sessionId, studentName, identity) {
	let participant = null;
	if (identity?.userId) {
		const { data, error } = await supabase.from("quiz_participants").insert({
			session_id: sessionId,
			student_name: studentName,
			score: 0,
			user_id: identity.userId,
			...identity.studentRowId ? { student_id: identity.studentRowId } : {}
		}).select("id, session_id, student_name, score, joined_at").single();
		if (!error && data) participant = data;
	}
	if (!participant) {
		const { data, error } = await supabase.from("quiz_participants").insert({
			session_id: sessionId,
			student_name: studentName,
			score: 0
		}).select("id, session_id, student_name, score, joined_at").single();
		if (error) throw new Error(error.message);
		participant = data;
	}
	if (identity?.userId) recordLocalQuizParticipation({
		sessionId,
		participantId: participant.id,
		userId: identity.userId,
		studentId: identity.studentRowId ?? null,
		studentName,
		joinedAt: participant.joined_at ?? (/* @__PURE__ */ new Date()).toISOString()
	});
	return participant;
}
async function submitAnswer(input) {
	const correct = normaliseAnswer(input.question.correct_answer);
	const isCorrect = correct !== null && correct === input.selected;
	const { error } = await supabase.from("quiz_answers").insert({
		session_id: input.sessionId,
		participant_id: input.participantId,
		question_id: input.question.id,
		selected_answer: input.selected,
		is_correct: isCorrect
	});
	if (error) throw new Error(error.message);
	if (isCorrect) {
		const { data: latest } = await supabase.from("quiz_participants").select("score").eq("id", input.participantId).maybeSingle();
		const baseScore = latest?.score ?? input.currentScore;
		const { error: scoreError } = await supabase.from("quiz_participants").update({ score: baseScore + 10 }).eq("id", input.participantId);
		if (scoreError) throw new Error(scoreError.message);
	}
	return { isCorrect };
}
/**
* Realtime sync for one session. All postgres_changes listeners are registered
* BEFORE subscribe() — required by supabase-js.
*/
function subscribeToSession(sessionId, handlers) {
	const channel = supabase.channel(`quiz-session-${sessionId}`);
	channel.on("postgres_changes", {
		event: "*",
		schema: "public",
		table: "quiz_sessions",
		filter: `id=eq.${sessionId}`
	}, (payload) => {
		const row = payload.new;
		if (row?.id) handlers.onSession?.(row);
	});
	channel.on("postgres_changes", {
		event: "*",
		schema: "public",
		table: "quiz_participants",
		filter: `session_id=eq.${sessionId}`
	}, () => handlers.onParticipants?.());
	channel.on("postgres_changes", {
		event: "*",
		schema: "public",
		table: "quiz_answers",
		filter: `session_id=eq.${sessionId}`
	}, () => handlers.onAnswers?.());
	channel.subscribe();
	return () => {
		supabase.removeChannel(channel);
	};
}
async function fetchAllEndedQuizResults() {
	const [sessionsRes, quizzesRes, questionsRes, studentsRes] = await Promise.all([
		supabase.from("quiz_sessions").select("id, quiz_id, pin_code, status, started_at, created_at").eq("status", "ended").order("created_at", { ascending: false }),
		supabase.from("quizzes").select("id, subject, title, description, created_by, created_at"),
		supabase.from("quiz_questions").select("id, quiz_id"),
		supabase.from("students").select("id, profile_id, student_id, profiles(id, full_name, email)")
	]);
	if (sessionsRes.error) throw new Error(sessionsRes.error.message);
	if (quizzesRes.error) throw new Error(quizzesRes.error.message);
	const sessions = sessionsRes.data ?? [];
	if (sessions.length === 0) return [];
	const quizById = /* @__PURE__ */ new Map();
	for (const quiz of quizzesRes.data ?? []) if (isAllowedSubject(quiz.subject)) quizById.set(quiz.id, quiz);
	const questionCounts = /* @__PURE__ */ new Map();
	for (const q of questionsRes.data ?? []) questionCounts.set(q.quiz_id, (questionCounts.get(q.quiz_id) ?? 0) + 1);
	const sessionIds = sessions.filter((s) => quizById.has(s.quiz_id)).map((s) => s.id);
	if (sessionIds.length === 0) return [];
	const participantsRes = await supabase.from("quiz_participants").select("id, session_id, student_name, score, joined_at").in("session_id", sessionIds);
	if (participantsRes.error) throw new Error(participantsRes.error.message);
	const bySession = /* @__PURE__ */ new Map();
	for (const p of participantsRes.data ?? []) {
		const list = bySession.get(p.session_id) ?? [];
		list.push(p);
		bySession.set(p.session_id, list);
	}
	const studentTargetsByKey = /* @__PURE__ */ new Map();
	for (const st of studentsRes.data ?? []) {
		const prof = Array.isArray(st.profiles) ? st.profiles[0] ?? null : st.profiles;
		const target = {
			studentRowId: st.id,
			profileId: st.profile_id,
			studentCode: st.student_id,
			fullName: prof?.full_name ?? null,
			email: prof?.email ?? null
		};
		if (prof?.full_name) studentTargetsByKey.set(prof.full_name.trim().toLowerCase(), target);
		if (prof?.email) studentTargetsByKey.set(prof.email.trim().toLowerCase(), target);
		if (st.student_id) studentTargetsByKey.set(st.student_id.trim().toLowerCase(), target);
	}
	const results = [];
	for (const session of sessions) {
		const quiz = quizById.get(session.quiz_id);
		if (!quiz) continue;
		const ranked = computeRankedParticipants(bySession.get(session.id) ?? []);
		const totalQ = questionCounts.get(quiz.id) ?? 0;
		const maxPossibleScore = totalQ > 0 ? totalQ * 10 : null;
		const subjectLabel = matchActiveSubjectOption(quiz.subject)?.fullLabel ?? quiz.subject ?? "Quiz";
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
				completedAt: session.started_at ?? session.created_at ?? p.joined_at
			});
		}
	}
	return results;
}
async function fetchStudentQuizResults(input) {
	const all = await fetchAllEndedQuizResults();
	const localParticipantIds = new Set(getLocalQuizParticipations(input.userId).map((item) => item.participantId));
	const nameSet = new Set(input.candidateNames.filter((value) => Boolean(value && value.trim())).map((value) => value.trim().toLowerCase()));
	return all.filter((row) => {
		if (localParticipantIds.has(row.participantId)) return true;
		if (row.matchedProfileId && row.matchedProfileId === input.userId) return true;
		if (input.studentRowId && row.matchedStudentRowId === input.studentRowId) return true;
		if (nameSet.has(row.studentName.trim().toLowerCase())) return true;
		return false;
	});
}
//#endregion
export { updateQuizWithQuestions as S, optionText as _, endSession as a, submitAnswer as b, fetchQuizQuestions as c, fetchSessionAnswers as d, fetchSessionByPin as f, optionKeys as g, normaliseAnswer as h, deleteQuiz as i, fetchQuizzes as l, joinSession as m, createQuizWithQuestions as n, fetchAllEndedQuizResults as o, fetchStudentQuizResults as p, createSession as r, fetchParticipants as s, computeRankedParticipants as t, fetchSession as u, setQuestionIndex as v, subscribeToSession as x, startSession as y };
