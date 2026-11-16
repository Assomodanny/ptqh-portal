import { n as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as matchActiveSubjectOption, n as ALLOWED_SUBJECTS } from "./curriculum-rYiZvMsx.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { f as Pencil, l as Plus, o as Trash2, t as X, u as Play } from "../_libs/lucide-react.mjs";
import { F as portalGhostButton, I as portalPrimaryButton, P as portalCard, n as PortalShell, t as EmptyState } from "./portal-shell-DqU1YDlN.mjs";
import { t as usePortalRole } from "./use-portal-role-CHoMdNYj.mjs";
import { S as updateQuizWithQuestions, c as fetchQuizQuestions, g as optionKeys, h as normaliseAnswer, i as deleteQuiz, l as fetchQuizzes, n as createQuizWithQuestions, r as createSession } from "./quiz-Cmi0m9eU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quiz-DqTFkV-O.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function validateTimerInput(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return {
		ok: false,
		error: `Enter a timer between 5 and 300 seconds.`
	};
	if (!/^\d+$/.test(trimmed)) return {
		ok: false,
		error: `Enter a whole number between 5 and 300 seconds.`
	};
	const parsed = Number(trimmed);
	if (!Number.isFinite(parsed) || parsed < 5 || parsed > 300) return {
		ok: false,
		error: `Timer must be between 5 and 300 seconds.`
	};
	return {
		ok: true,
		value: parsed
	};
}
function blankQuestion(timerSeconds) {
	return {
		question_text: "",
		option_a: "",
		option_b: "",
		option_c: "",
		option_d: "",
		correct_answer: "a",
		timer_seconds: timerSeconds,
		timerInput: String(timerSeconds),
		timerError: null
	};
}
function QuizHostListPage() {
	const { user, role, isLoading } = usePortalRole();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [startingId, setStartingId] = (0, import_react.useState)(null);
	const [loadingEditId, setLoadingEditId] = (0, import_react.useState)(null);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const [editorOpen, setEditorOpen] = (0, import_react.useState)(false);
	const [editingQuizId, setEditingQuizId] = (0, import_react.useState)(null);
	const [subject, setSubject] = (0, import_react.useState)(ALLOWED_SUBJECTS[0]);
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [defaultTimerInput, setDefaultTimerInput] = (0, import_react.useState)(String(30));
	const [defaultTimerError, setDefaultTimerError] = (0, import_react.useState)(null);
	const [questionCountText, setQuestionCountText] = (0, import_react.useState)("5");
	const [questions, setQuestions] = (0, import_react.useState)(() => Array.from({ length: 5 }, () => blankQuestion(30)));
	const quizzesQuery = useQuery({
		queryKey: ["quizzes"],
		queryFn: fetchQuizzes
	});
	const canHost = role === "admin" || role === "teacher";
	const isAdmin = role === "admin";
	function openCreateEditor() {
		setFeedback(null);
		setEditingQuizId(null);
		setSubject(ALLOWED_SUBJECTS[0]);
		setTitle("");
		setDescription("");
		setDefaultTimerInput(String(30));
		setDefaultTimerError(null);
		setQuestionCountText("5");
		setQuestions(Array.from({ length: 5 }, () => blankQuestion(30)));
		setEditorOpen(true);
	}
	async function openEditEditor(quiz) {
		setFeedback(null);
		setLoadingEditId(quiz.id);
		try {
			const existing = await fetchQuizQuestions(quiz.id);
			const drafts = existing.length > 0 ? existing.slice(0, 50).map((q) => {
				const savedTimer = q.timer_seconds ?? 30;
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
					timerError: null
				};
			}) : [blankQuestion(30)];
			setEditingQuizId(quiz.id);
			const matchedSubject = matchActiveSubjectOption(quiz.subject);
			setSubject(matchedSubject?.shortName ?? ALLOWED_SUBJECTS[0]);
			setTitle(quiz.title ?? "");
			setDescription(quiz.description ?? "");
			const initialDefault = drafts[0]?.timer_seconds ?? 30;
			setDefaultTimerInput(String(initialDefault));
			setDefaultTimerError(null);
			setQuestionCountText(String(drafts.length));
			setQuestions(drafts);
			setEditorOpen(true);
		} catch (err) {
			setFeedback({
				type: "error",
				text: err.message
			});
		} finally {
			setLoadingEditId(null);
		}
	}
	function resizeQuestions(nextCountRaw) {
		const clamped = Math.max(1, Math.min(50, Math.round(nextCountRaw || 1)));
		const validDefault = validateTimerInput(defaultTimerInput);
		const seedTimer = validDefault.ok ? validDefault.value : 30;
		setQuestionCountText(String(clamped));
		setQuestions((prev) => {
			if (clamped === prev.length) return prev;
			if (clamped < prev.length) return prev.slice(0, clamped);
			return [...prev, ...Array.from({ length: clamped - prev.length }, () => blankQuestion(seedTimer))];
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
		setQuestions((prev) => prev.map((q) => ({
			...q,
			timer_seconds: check.value,
			timerInput: String(check.value),
			timerError: null
		})));
	}
	function updateQuestion(index, patch) {
		setQuestions((prev) => prev.map((q, idx) => idx === index ? {
			...q,
			...patch
		} : q));
	}
	function handleQuestionTimerChange(index, nextValue) {
		setQuestions((prev) => prev.map((q, idx) => idx === index ? {
			...q,
			timerInput: nextValue,
			timerError: null
		} : q));
	}
	function handleQuestionTimerBlur(index) {
		setQuestions((prev) => prev.map((q, idx) => {
			if (idx !== index) return q;
			const check = validateTimerInput(q.timerInput);
			if (!check.ok) return {
				...q,
				timerError: check.error
			};
			return {
				...q,
				timer_seconds: check.value,
				timerInput: String(check.value),
				timerError: null
			};
		}));
	}
	function removeQuestionAt(index) {
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
			const validatedQuestions = [];
			let firstTimerError = null;
			const updatedWithErrors = questions.map((q, i) => {
				const timerCheck = validateTimerInput(q.timerInput);
				if (!timerCheck.ok) {
					if (!firstTimerError) firstTimerError = `Question ${i + 1}: ${timerCheck.error}`;
					return {
						...q,
						timerError: timerCheck.error
					};
				}
				return {
					...q,
					timer_seconds: timerCheck.value,
					timerInput: String(timerCheck.value),
					timerError: null
				};
			});
			if (firstTimerError) {
				setQuestions(updatedWithErrors);
				throw new Error(firstTimerError);
			}
			for (let i = 0; i < updatedWithErrors.length; i += 1) {
				const q = updatedWithErrors[i];
				if (!q.question_text.trim()) throw new Error(`Question ${i + 1} is missing question text.`);
				if (!q.option_a.trim() || !q.option_b.trim() || !q.option_c.trim() || !q.option_d.trim()) throw new Error(`Question ${i + 1} needs all four options (A, B, C, D).`);
				validatedQuestions.push({
					...q.id ? { id: q.id } : {},
					question_text: q.question_text,
					option_a: q.option_a,
					option_b: q.option_b,
					option_c: q.option_c,
					option_d: q.option_d,
					correct_answer: q.correct_answer,
					timer_seconds: q.timer_seconds
				});
			}
			if (editingQuizId) await updateQuizWithQuestions(editingQuizId, {
				subject,
				title,
				description,
				questions: validatedQuestions
			});
			else await createQuizWithQuestions({
				subject,
				title,
				description,
				created_by: user?.id ?? null,
				questions: validatedQuestions
			});
		},
		onMutate: () => setFeedback(null),
		onSuccess: async () => {
			const wasEditing = Boolean(editingQuizId);
			setEditorOpen(false);
			setEditingQuizId(null);
			await queryClient.invalidateQueries({ queryKey: ["quizzes"] });
			setFeedback({
				type: "success",
				text: wasEditing ? "Quiz updated." : "Quiz created and ready to host."
			});
		},
		onError: (err) => setFeedback({
			type: "error",
			text: err.message
		})
	});
	const deleteQuizMutation = useMutation({
		mutationFn: (quizId) => deleteQuiz(quizId),
		onMutate: () => setFeedback(null),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["quizzes"] });
			setFeedback({
				type: "success",
				text: "Quiz deleted."
			});
		},
		onError: (err) => setFeedback({
			type: "error",
			text: err.message
		})
	});
	async function handleStart(quizId) {
		setStartingId(quizId);
		setFeedback(null);
		try {
			const session = await createSession(quizId);
			navigate({
				to: "/quiz/host/$sessionId",
				params: { sessionId: session.id }
			});
		} catch (err) {
			setFeedback({
				type: "error",
				text: err.message
			});
		} finally {
			setStartingId(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		eyebrow: "Live quiz",
		title: "Quizzes & live sessions",
		subtitle: "Create and host live quizzes across the 4 programme subjects (Nahwu, Sarf, Hadith, As-Sarim Al-Battar) with up to 50 questions and custom timers.",
		children: isLoading || quizzesQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Loading quizzes…"
		}) : !canHost ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Hosting is for teachers and administrators",
			body: "Students join a live quiz with the PIN their teacher shares. Use the Join quiz page instead."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-3",
						children: [isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => editorOpen ? setEditorOpen(false) : openCreateEditor(),
							className: "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-amber px-5 text-sm font-semibold tracking-wide text-primary-foreground shadow-sm transition-colors duration-200 hover:bg-amber-soft",
							children: editorOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
								className: "size-4",
								"aria-hidden": "true"
							}), "Close quiz builder"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
								className: "size-4",
								"aria-hidden": "true"
							}), "Create new quiz"] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/quiz/join",
							className: portalGhostButton,
							children: "Open student join page"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
						children: [
							"4 allowed subjects · Max ",
							50,
							" questions"
						]
					})]
				}),
				feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					className: `rounded-md border px-4 py-3 text-sm ${feedback.type === "error" ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-amber/40 bg-amber/10 text-amber"}`,
					children: feedback.text
				}),
				isAdmin && editorOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					noValidate: true,
					onSubmit: (e) => {
						e.preventDefault();
						saveQuizMutation.mutate();
					},
					className: `rounded-xl border border-border/90 bg-card/85 p-6 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:border-amber/50 space-y-6 border-amber/50`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-[0.2em] text-amber",
								children: editingQuizId ? "Editing quiz" : "New quiz"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 font-display text-xl font-semibold text-headline",
								children: editingQuizId ? "Update quiz & questions" : "Build quiz questions"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setEditorOpen(false),
								className: "text-xs text-muted-foreground hover:text-headline",
								children: "Cancel"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs uppercase tracking-[0.18em] text-muted-foreground",
										children: "Subject (4 allowed)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: subject,
										onChange: (e) => setSubject(e.target.value),
										className: "mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber",
										children: ALLOWED_SUBJECTS.map((subj) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: subj,
											children: subj
										}, subj))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-sm lg:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs uppercase tracking-[0.18em] text-muted-foreground",
										children: "Quiz title"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										required: true,
										placeholder: "e.g. Week 4 — Al-I'rab Review",
										value: title,
										onChange: (e) => setTitle(e.target.value),
										className: "mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-sm sm:col-span-2 lg:col-span-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs uppercase tracking-[0.18em] text-muted-foreground",
										children: "Description (optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "Brief note on topics covered",
										value: description,
										onChange: (e) => setDescription(e.target.value),
										className: "mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start gap-6 rounded-lg border border-border/80 bg-background/50 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "quiz-question-count",
										className: "block text-xs uppercase tracking-[0.18em] text-muted-foreground",
										children: "Number of questions (1–50)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "quiz-question-count",
											type: "text",
											inputMode: "numeric",
											value: questionCountText,
											onChange: (e) => setQuestionCountText(e.target.value),
											onBlur: commitQuestionCountText,
											onKeyDown: (e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													commitQuestionCountText();
												}
											},
											className: "h-10 w-24 rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [
												"/ ",
												50,
												" max"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1.5 text-xs text-muted-foreground",
										children: "Updates question slots when leaving the field."
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "quiz-default-timer",
										className: "block text-xs uppercase tracking-[0.18em] text-muted-foreground",
										children: "Default timer (seconds)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex flex-wrap items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "quiz-default-timer",
											type: "text",
											inputMode: "numeric",
											value: defaultTimerInput,
											onChange: (e) => {
												setDefaultTimerInput(e.target.value);
												if (defaultTimerError) setDefaultTimerError(null);
											},
											onBlur: handleDefaultTimerBlur,
											"aria-invalid": Boolean(defaultTimerError),
											className: `h-10 w-24 rounded-md border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber ${defaultTimerError ? "border-destructive" : "border-border"}`
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: applyTimerToAll,
											className: "h-10 rounded-md border border-amber/50 px-3 text-xs font-medium text-amber transition-colors hover:bg-amber/10",
											children: "Apply to all questions"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: `mt-1.5 text-xs ${defaultTimerError ? "text-destructive" : "text-muted-foreground"}`,
										children: defaultTimerError ?? `Allowed range: 5 to 300 seconds.`
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: questions.map((q, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4 rounded-lg border border-border bg-background/40 p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-start justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "pt-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber",
											children: [
												"Question ",
												index + 1,
												" of ",
												questions.length
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-start gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex items-center gap-2 text-xs text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Timer (s)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													inputMode: "numeric",
													"aria-label": `Question ${index + 1} timer (seconds)`,
													value: q.timerInput,
													onChange: (e) => handleQuestionTimerChange(index, e.target.value),
													onBlur: () => handleQuestionTimerBlur(index),
													"aria-invalid": Boolean(q.timerError),
													className: `h-8 w-20 rounded border bg-secondary px-2 text-xs text-foreground outline-none focus:border-amber ${q.timerError ? "border-destructive" : "border-border"}`
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: `mt-1 text-[11px] ${q.timerError ? "text-destructive" : "text-muted-foreground"}`,
												children: q.timerError ?? `Allowed: 5–300 seconds`
											})] }), questions.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => removeQuestionAt(index),
												className: "inline-flex h-8 items-center gap-1 rounded border border-border px-2.5 text-xs text-muted-foreground hover:border-destructive/60 hover:text-destructive",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
													className: "size-3",
													"aria-hidden": "true"
												}), "Remove"]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										required: true,
										placeholder: `Enter question ${index + 1} text…`,
										value: q.question_text,
										onChange: (e) => updateQuestion(index, { question_text: e.target.value }),
										className: "h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid gap-3 sm:grid-cols-2",
										children: optionKeys.map((key) => {
											const field = `option_${key}`;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex items-center gap-2 text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "grid size-8 shrink-0 place-items-center rounded border border-border bg-card text-xs font-semibold uppercase text-amber",
													children: key
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													required: true,
													placeholder: `Option ${key.toUpperCase()}`,
													value: q[field],
													onChange: (e) => updateQuestion(index, { [field]: e.target.value }),
													className: "h-10 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
												})]
											}, key);
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-3 pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs uppercase tracking-[0.16em] text-muted-foreground",
											children: "Correct answer:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex gap-2",
											children: optionKeys.map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => updateQuestion(index, { correct_answer: key }),
												className: `h-8 w-10 rounded border text-xs font-semibold uppercase transition-colors ${q.correct_answer === key ? "border-amber bg-amber text-primary-foreground" : "border-border bg-secondary text-muted-foreground hover:border-amber/60"}`,
												children: key
											}, key))
										})]
									})
								]
							}, q.id ?? `draft-${index}`))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4",
							children: [questions.length < 50 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => resizeQuestions(questions.length + 1),
								className: "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-amber/50 px-5 text-sm font-medium text-amber transition-colors duration-200 hover:border-amber hover:bg-amber/10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
										className: "size-4",
										"aria-hidden": "true"
									}),
									"Add question (",
									questions.length,
									"/",
									50,
									")"
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: [
									"Maximum of ",
									50,
									" questions reached."
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setEditorOpen(false),
									className: "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-amber/50 px-5 text-sm font-medium text-amber transition-colors duration-200 hover:border-amber hover:bg-amber/10",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: saveQuizMutation.isPending,
									className: "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-amber px-5 text-sm font-semibold tracking-wide text-primary-foreground shadow-sm transition-colors duration-200 hover:bg-amber-soft",
									children: saveQuizMutation.isPending ? "Saving quiz…" : editingQuizId ? "Save quiz changes" : `Create quiz (${questions.length} Qs)`
								})]
							})]
						})
					]
				}),
				quizzesQuery.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
					children: quizzesQuery.error.message
				}) : (quizzesQuery.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "No quizzes yet",
					body: "Create a quiz in Nahwu, Sarf, Hadith, or As-Sarim Al-Battar to host a live session."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-4 sm:grid-cols-2",
					children: (quizzesQuery.data ?? []).map((quiz) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: portalCard,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase tracking-[0.2em] text-amber",
									children: quiz.subject ?? "Subject pending"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full border border-border bg-secondary/70 px-2.5 py-0.5 text-[11px] text-muted-foreground",
									children: [
										quiz.questionCount,
										" ",
										quiz.questionCount === 1 ? "question" : "questions"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-lg font-semibold text-headline",
								children: quiz.title ?? "Untitled quiz"
							}),
							quiz.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted-foreground",
								children: quiz.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex flex-wrap items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: startingId === quiz.id || quiz.questionCount === 0,
									onClick: () => void handleStart(quiz.id),
									className: `${portalPrimaryButton} h-10 px-4 text-xs disabled:cursor-not-allowed disabled:opacity-50`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
										className: "size-3.5",
										"aria-hidden": "true"
									}), startingId === quiz.id ? "Creating session…" : "Start live session"]
								}), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: loadingEditId === quiz.id,
									onClick: () => void openEditEditor(quiz),
									className: `inline-flex h-11 items-center justify-center gap-2 rounded-md border border-amber/50 px-5 text-sm font-medium text-amber transition-colors duration-200 hover:border-amber hover:bg-amber/10 h-10 px-3.5 text-xs`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
										className: "size-3.5",
										"aria-hidden": "true"
									}), loadingEditId === quiz.id ? "Loading…" : "Edit"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: deleteQuizMutation.isPending,
									onClick: () => deleteQuizMutation.mutate(quiz.id),
									className: "inline-flex h-10 items-center gap-1 rounded-md border border-border px-3 text-xs text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
										className: "size-3.5",
										"aria-hidden": "true"
									}), "Delete"]
								})] })]
							})
						]
					}, quiz.id))
				})
			]
		})
	});
}
//#endregion
export { QuizHostListPage as component };
