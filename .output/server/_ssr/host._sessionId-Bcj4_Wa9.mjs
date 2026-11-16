import { n as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { P as portalCard, n as PortalShell, t as EmptyState } from "./portal-shell-DqU1YDlN.mjs";
import { t as usePortalRole } from "./use-portal-role-CHoMdNYj.mjs";
import { t as Route } from "./host._sessionId-B3-WJ6j4.mjs";
import { _ as optionText, a as endSession, c as fetchQuizQuestions, d as fetchSessionAnswers, g as optionKeys, h as normaliseAnswer, s as fetchParticipants, u as fetchSession, v as setQuestionIndex, x as subscribeToSession, y as startSession } from "./quiz-Cmi0m9eU.mjs";
import { t as QuizLeaderboard } from "./quiz-leaderboard-DQictfsb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/host._sessionId-Bcj4_Wa9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QuizHostPage() {
	const { sessionId } = Route.useParams();
	const { role, isLoading } = usePortalRole();
	const queryClient = useQueryClient();
	const [revealed, setRevealed] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const canHost = role === "admin" || role === "teacher";
	const sessionQuery = useQuery({
		queryKey: ["quiz-session", sessionId],
		queryFn: () => fetchSession(sessionId),
		refetchInterval: (query) => query.state.data?.status === "ended" ? false : 3e3
	});
	const session = sessionQuery.data ?? null;
	const questionsQuery = useQuery({
		queryKey: ["quiz-questions", session?.quiz_id],
		queryFn: () => fetchQuizQuestions(session.quiz_id),
		enabled: Boolean(session?.quiz_id)
	});
	const participantsQuery = useQuery({
		queryKey: ["quiz-participants", sessionId],
		queryFn: () => fetchParticipants(sessionId),
		refetchInterval: session?.status === "ended" ? false : 3e3
	});
	const answersQuery = useQuery({
		queryKey: ["quiz-answers", sessionId],
		queryFn: () => fetchSessionAnswers(sessionId),
		refetchInterval: session?.status === "ended" ? false : 3e3
	});
	(0, import_react.useEffect)(() => subscribeToSession(sessionId, {
		onSession: (row) => queryClient.setQueryData(["quiz-session", sessionId], row),
		onParticipants: () => void queryClient.invalidateQueries({ queryKey: ["quiz-participants", sessionId] }),
		onAnswers: () => {
			queryClient.invalidateQueries({ queryKey: ["quiz-answers", sessionId] });
			queryClient.invalidateQueries({ queryKey: ["quiz-participants", sessionId] });
		}
	}), [sessionId, queryClient]);
	const questions = questionsQuery.data ?? [];
	const index = session?.current_question_index ?? 0;
	const current = questions[index] ?? null;
	const participants = participantsQuery.data ?? [];
	const answers = answersQuery.data ?? [];
	const answeredCurrent = current ? answers.filter((a) => a.question_id === current.id).length : 0;
	async function run(action) {
		setError(null);
		try {
			await action();
			await sessionQuery.refetch();
			await Promise.all([queryClient.invalidateQueries({ queryKey: ["admin-quiz-results"] }), queryClient.invalidateQueries({ queryKey: ["student-quiz-results"] })]);
		} catch (err) {
			setError(err.message);
		}
	}
	if (isLoading || sessionQuery.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		eyebrow: "Live quiz",
		title: "Host console",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Loading the session…"
		})
	});
	if (!canHost) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		eyebrow: "Live quiz",
		title: "Host console",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Hosting is for teachers and administrators",
			body: "Students join a live quiz with the PIN their teacher shares."
		})
	});
	if (!session) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		eyebrow: "Live quiz",
		title: "Host console",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Session not found",
			body: "This quiz session no longer exists. Start a new one from the live quiz page."
		})
	});
	const status = session.status ?? "waiting";
	const correct = current ? normaliseAnswer(current.correct_answer) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		eyebrow: "Live quiz — host",
		title: "Host console",
		subtitle: "Share the PIN below. Students join instantly with a nickname — no account needed.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
								children: "Game PIN"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-display text-3xl font-semibold tracking-[0.25em] text-amber",
								children: session.pin_code ?? "——————"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: portalCard,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
								children: "Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-display text-xl text-headline capitalize",
								children: status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: portalCard,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
								children: "Joined"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-display text-xl text-headline",
								children: participants.length
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-labelledby": "host-question",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "host-question",
							className: "font-display text-xl font-semibold",
							children: status === "waiting" ? "Waiting room" : `Question ${Math.min(index + 1, questions.length)} of ${questions.length}`
						}),
						status === "ended" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "This session has ended. Final scores and ranks have been saved, and the final leaderboard is below."
							}), role === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin/results",
								className: "inline-block text-sm font-semibold text-amber underline underline-offset-4",
								children: "Open Results overview →"
							})]
						}) : status === "waiting" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-sm text-muted-foreground",
							children: [
								participants.length === 0 ? "No students have joined yet." : `${participants.length} ${participants.length === 1 ? "student" : "students"} ready.`,
								" ",
								"Press “Start quiz” when everyone is in."
							]
						}) : !current ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted-foreground",
							children: "All questions have been shown. End the session to publish the final leaderboard."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `${portalCard} mt-6`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-lg text-headline",
									children: current.question_text ?? "Question text missing"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-5 grid gap-3 sm:grid-cols-2",
									children: optionKeys.map((key) => {
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: `rounded-md border px-4 py-3 text-sm ${revealed && correct === key ? "border-amber bg-amber/15 text-headline" : "border-border text-foreground/90"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mr-2 uppercase text-amber",
												children: key
											}), optionText(current, key) ?? "—"]
										}, key);
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-4 text-sm text-muted-foreground",
									children: [
										answeredCurrent,
										" of ",
										participants.length,
										" answered",
										current.timer_seconds ? ` · ${current.timer_seconds}s timer` : ""
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap gap-3",
							children: [
								status === "waiting" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => void run(() => startSession(sessionId)),
									disabled: questions.length === 0,
									className: `inline-flex h-11 items-center justify-center gap-2 rounded-md bg-amber px-5 text-sm font-semibold tracking-wide text-primary-foreground shadow-sm transition-colors duration-200 hover:bg-amber-soft disabled:cursor-not-allowed disabled:opacity-50`,
									children: "Start quiz"
								}),
								status === "active" && current && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setRevealed(true),
									disabled: revealed,
									className: `inline-flex h-11 items-center justify-center gap-2 rounded-md border border-amber/50 px-5 text-sm font-medium text-amber transition-colors duration-200 hover:border-amber hover:bg-amber/10 disabled:cursor-not-allowed disabled:opacity-50`,
									children: "Reveal answer"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setRevealed(false);
										run(() => setQuestionIndex(sessionId, index + 1));
									},
									className: "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-amber px-5 text-sm font-semibold tracking-wide text-primary-foreground shadow-sm transition-colors duration-200 hover:bg-amber-soft",
									children: index + 1 >= questions.length ? "Finish questions" : "Next question"
								})] }),
								status !== "ended" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => void run(() => endSession(sessionId)),
									className: "inline-flex h-11 items-center justify-center rounded-md border border-destructive/50 px-5 text-sm font-medium text-destructive transition-colors duration-200 hover:bg-destructive/10",
									children: "End session"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-labelledby": "host-leaderboard",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "host-leaderboard",
						className: "font-display text-xl font-semibold",
						children: "Live leaderboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuizLeaderboard, {
							participants,
							live: status !== "ended"
						})
					})]
				})
			]
		})
	});
}
//#endregion
export { QuizHostPage as component };
