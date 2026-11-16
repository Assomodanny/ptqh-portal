import { n as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { o as useAuth } from "./auth-xPULwznI.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { I as portalPrimaryButton, P as portalCard, b as fetchStudentByProfile, n as PortalShell, t as EmptyState, v as fetchProfile } from "./portal-shell-DqU1YDlN.mjs";
import { _ as optionText, b as submitAnswer, c as fetchQuizQuestions, f as fetchSessionByPin, g as optionKeys, m as joinSession, s as fetchParticipants, t as computeRankedParticipants, u as fetchSession, x as subscribeToSession } from "./quiz-Cmi0m9eU.mjs";
import { t as QuizLeaderboard } from "./quiz-leaderboard-DQictfsb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/join-DmSNh8ri.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Fallback when a question has no timer stored in the database. */
var DEFAULT_TIMER_SECONDS = 30;
function QuizJoinPage() {
	const [joined, setJoined] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		eyebrow: "Live quiz",
		showSignOut: false,
		title: joined ? "You're in" : "Join a live quiz",
		subtitle: joined ? "Answer each question before the timer runs out. The leaderboard updates as everyone answers." : "Ask your teacher for the 6-digit PIN, pick a nickname, and you're in — no account needed.",
		children: joined ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuizPlay, {
			session: joined.session,
			participantId: joined.participantId
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JoinForm, { onJoined: (session, participantId) => setJoined({
			session,
			participantId
		}) })
	});
}
function JoinForm({ onJoined }) {
	const { user } = useAuth();
	const [pin, setPin] = (0, import_react.useState)("");
	const [nickname, setNickname] = (0, import_react.useState)("");
	const [nicknameEdited, setNicknameEdited] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const profileQuery = useQuery({
		queryKey: ["profile", user?.id],
		queryFn: () => fetchProfile(user.id),
		enabled: Boolean(user?.id)
	});
	const studentQuery = useQuery({
		queryKey: ["student-row", user?.id],
		queryFn: () => fetchStudentByProfile(user.id),
		enabled: Boolean(user?.id)
	});
	const defaultSignedInName = profileQuery.data?.full_name ?? user?.fullName ?? profileQuery.data?.email ?? user?.email ?? "";
	(0, import_react.useEffect)(() => {
		if (!nicknameEdited && defaultSignedInName && nickname === "") setNickname(defaultSignedInName);
	}, [
		defaultSignedInName,
		nickname,
		nicknameEdited
	]);
	async function handleSubmit(event) {
		event.preventDefault();
		setError(null);
		setBusy(true);
		try {
			const session = await fetchSessionByPin(pin.trim());
			if (!session) {
				setError("No live quiz found for that PIN. Check the digits with your teacher.");
				return;
			}
			const identity = user ? {
				userId: user.id,
				studentRowId: studentQuery.data?.id ?? null,
				studentCode: studentQuery.data?.student_id ?? null,
				fullName: profileQuery.data?.full_name ?? user.fullName ?? null,
				email: profileQuery.data?.email ?? user.email
			} : null;
			onJoined(session, (await joinSession(session.id, nickname.trim(), identity)).id);
		} catch (err) {
			setError(err.message);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: `${portalCard} max-w-md space-y-5`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: "pin",
				className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
				children: "Quiz PIN"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "pin",
				inputMode: "numeric",
				autoComplete: "off",
				required: true,
				maxLength: 6,
				value: pin,
				onChange: (e) => setPin(e.target.value.replace(/\D/g, "")),
				placeholder: "123456",
				className: "mt-2 h-12 w-full rounded-md border border-border bg-background px-4 font-display text-xl tracking-[0.3em] text-headline outline-none transition-colors focus:border-amber"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "nickname",
					className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
					children: "Nickname"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "nickname",
					required: true,
					maxLength: 40,
					value: nickname,
					onChange: (e) => {
						setNicknameEdited(true);
						setNickname(e.target.value);
					},
					placeholder: "Your name",
					className: "mt-2 h-12 w-full rounded-md border border-border bg-background px-4 text-base text-headline outline-none transition-colors focus:border-amber"
				}),
				user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs text-muted-foreground",
					children: [
						"Signed in as ",
						defaultSignedInName || user.email,
						". Your final score and rank will be saved to your Results page when the quiz ends."
					]
				})
			] }),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				disabled: busy || pin.length !== 6 || nickname.trim() === "",
				className: `${portalPrimaryButton} w-full disabled:cursor-not-allowed disabled:opacity-50`,
				children: busy ? "Joining…" : "Join quiz"
			})
		]
	});
}
function QuizPlay({ session: initialSession, participantId }) {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const sessionId = initialSession.id;
	const [answeredFor, setAnsweredFor] = (0, import_react.useState)({});
	const [feedback, setFeedback] = (0, import_react.useState)({});
	const [error, setError] = (0, import_react.useState)(null);
	const [secondsLeft, setSecondsLeft] = (0, import_react.useState)(null);
	const invalidatedOnEndRef = (0, import_react.useRef)(false);
	const session = useQuery({
		queryKey: ["quiz-session", sessionId],
		queryFn: () => fetchSession(sessionId),
		initialData: initialSession,
		refetchInterval: (query) => query.state.data?.status === "ended" ? false : 3e3
	}).data ?? initialSession;
	const questionsQuery = useQuery({
		queryKey: ["quiz-questions", session.quiz_id],
		queryFn: () => fetchQuizQuestions(session.quiz_id)
	});
	const participantsQuery = useQuery({
		queryKey: ["quiz-participants", sessionId],
		queryFn: () => fetchParticipants(sessionId),
		refetchInterval: session.status === "ended" ? false : 3e3
	});
	(0, import_react.useEffect)(() => subscribeToSession(sessionId, {
		onSession: (row) => queryClient.setQueryData(["quiz-session", sessionId], row),
		onParticipants: () => void queryClient.invalidateQueries({ queryKey: ["quiz-participants", sessionId] }),
		onAnswers: () => void queryClient.invalidateQueries({ queryKey: ["quiz-participants", sessionId] })
	}), [sessionId, queryClient]);
	(0, import_react.useEffect)(() => {
		if (session.status === "ended" && !invalidatedOnEndRef.current) {
			invalidatedOnEndRef.current = true;
			queryClient.invalidateQueries({ queryKey: ["student-quiz-results"] });
			queryClient.invalidateQueries({ queryKey: ["admin-quiz-results"] });
		}
	}, [session.status, queryClient]);
	const questions = questionsQuery.data ?? [];
	const index = session.current_question_index ?? 0;
	const current = questions[index] ?? null;
	const currentId = current?.id ?? null;
	const currentTimerSeconds = current?.timer_seconds ?? null;
	const participants = (0, import_react.useMemo)(() => participantsQuery.data ?? [], [participantsQuery.data]);
	const rankedParticipants = (0, import_react.useMemo)(() => computeRankedParticipants(participants), [participants]);
	const meRanked = (0, import_react.useMemo)(() => rankedParticipants.find((p) => p.id === participantId) ?? null, [rankedParticipants, participantId]);
	const me = (0, import_react.useMemo)(() => participants.find((p) => p.id === participantId) ?? null, [participants, participantId]);
	(0, import_react.useEffect)(() => {
		if (!currentId || session.status !== "active") {
			setSecondsLeft(null);
			return;
		}
		setSecondsLeft(currentTimerSeconds && currentTimerSeconds > 0 ? currentTimerSeconds : DEFAULT_TIMER_SECONDS);
		const timer = setInterval(() => {
			setSecondsLeft((value) => {
				if (value === null) return null;
				if (value <= 1) {
					clearInterval(timer);
					return 0;
				}
				return value - 1;
			});
		}, 1e3);
		return () => clearInterval(timer);
	}, [
		currentId,
		currentTimerSeconds,
		index,
		session.status
	]);
	const mySelection = current ? answeredFor[current.id] : void 0;
	const timeUp = secondsLeft === 0;
	async function handleAnswer(key) {
		if (!current || mySelection) return;
		setError(null);
		setAnsweredFor((prev) => ({
			...prev,
			[current.id]: key
		}));
		try {
			const { isCorrect } = await submitAnswer({
				sessionId,
				participantId,
				question: current,
				selected: key,
				currentScore: me?.score ?? 0
			});
			setFeedback((prev) => ({
				...prev,
				[current.id]: isCorrect
			}));
			await participantsQuery.refetch();
		} catch (err) {
			setError(err.message);
			setAnsweredFor((prev) => {
				const next = { ...prev };
				delete next[current.id];
				return next;
			});
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-10",
		children: [
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: portalCard,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
							children: "Nickname"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-display text-xl text-headline",
							children: me?.student_name ?? "You"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: portalCard,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
							children: "Your score"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-display text-xl text-amber",
							children: me?.score ?? 0
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: portalCard,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
							children: "Time left"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-display text-xl text-headline",
							children: secondsLeft === null ? "—" : `${secondsLeft}s`
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-labelledby": "play-question",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "play-question",
					className: "font-display text-xl font-semibold",
					children: session.status === "waiting" ? "Waiting for your teacher to start" : session.status === "ended" ? "Quiz finished" : `Question ${Math.min(index + 1, Math.max(questions.length, 1))}${questions.length ? ` of ${questions.length}` : ""}`
				}), session.status === "waiting" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: "You're in the waiting room. The first question will appear here automatically."
				}) : session.status === "ended" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: ["Thank you for taking part.", meRanked ? ` Your final score is ${meRanked.finalScore} pts (Rank #${meRanked.rank} of ${rankedParticipants.length}).` : " Your final position is on the leaderboard below."]
					}), user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/results",
						className: "inline-block text-sm font-semibold text-amber underline underline-offset-4",
						children: "View saved score & rank on My Results →"
					})]
				}) : !current ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "No question on screen",
						body: "Your teacher has shown every question. Hold on for the final leaderboard."
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `${portalCard} mt-6`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg text-headline",
							children: current.question_text ?? "Question text missing"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5 grid gap-3 sm:grid-cols-2",
							children: optionKeys.map((key) => {
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: Boolean(mySelection) || timeUp,
									onClick: () => void handleAnswer(key),
									className: `rounded-md border px-4 py-4 text-left text-sm transition-colors ${mySelection === key ? "border-amber bg-amber/15 text-headline" : "border-border text-foreground/90 hover:border-amber/60"} disabled:cursor-not-allowed disabled:opacity-60`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mr-2 uppercase text-amber",
										children: key
									}), optionText(current, key) ?? "—"]
								}, key);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted-foreground",
							children: mySelection ? feedback[current.id] ? "Correct — well done." : "Answer recorded." : timeUp ? "Time is up for this question." : "Choose one answer."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-labelledby": "play-leaderboard",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "play-leaderboard",
					className: "font-display text-xl font-semibold",
					children: "Leaderboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuizLeaderboard, {
						participants,
						highlightId: participantId,
						live: session.status !== "ended"
					})
				})]
			})
		]
	});
}
//#endregion
export { QuizJoinPage as component };
