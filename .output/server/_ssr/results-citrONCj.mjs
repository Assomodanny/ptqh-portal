import { n as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as matchActiveSubjectOption, t as ACTIVE_SUBJECT_OPTIONS } from "./curriculum-rYiZvMsx.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { S as ClipboardList, a as Trophy, c as Search, n as Users, s as Sparkles } from "../_libs/lucide-react.mjs";
import { P as portalCard, m as fetchAssessmentResults, n as PortalShell, t as EmptyState } from "./portal-shell-DqU1YDlN.mjs";
import { t as usePortalRole } from "./use-portal-role-CHoMdNYj.mjs";
import { o as fetchAllEndedQuizResults } from "./quiz-Cmi0m9eU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/results-citrONCj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatDate(value) {
	if (!value) return "—";
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return value;
	return parsed.toLocaleDateString("en-NG", {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
}
function AdminResultsPage() {
	const { role } = usePortalRole("admin");
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [subjectFilter, setSubjectFilter] = (0, import_react.useState)("all");
	const quizResultsQuery = useQuery({
		queryKey: ["admin-quiz-results"],
		queryFn: fetchAllEndedQuizResults,
		enabled: role === "admin",
		staleTime: 0,
		refetchOnMount: "always",
		refetchOnWindowFocus: true
	});
	const assessmentResultsQuery = useQuery({
		queryKey: ["admin-assessment-results"],
		queryFn: () => fetchAssessmentResults(),
		enabled: role === "admin",
		staleTime: 0,
		refetchOnMount: "always"
	});
	const quizResults = (0, import_react.useMemo)(() => quizResultsQuery.data ?? [], [quizResultsQuery.data]);
	const assessments = (0, import_react.useMemo)(() => assessmentResultsQuery.data ?? [], [assessmentResultsQuery.data]);
	const uniqueSessionCount = (0, import_react.useMemo)(() => {
		return new Set(quizResults.map((row) => row.sessionId)).size;
	}, [quizResults]);
	const uniqueStudentCount = (0, import_react.useMemo)(() => {
		const keys = /* @__PURE__ */ new Set();
		for (const row of quizResults) keys.add(row.matchedProfileId ?? row.studentName.toLowerCase());
		for (const row of assessments) keys.add(row.studentId ?? (row.studentName ?? row.id).toLowerCase());
		return keys.size;
	}, [quizResults, assessments]);
	const filteredQuizzes = (0, import_react.useMemo)(() => {
		const q = searchTerm.trim().toLowerCase();
		return quizResults.filter((row) => {
			if (subjectFilter !== "all" && matchActiveSubjectOption(row.subject)?.key !== subjectFilter) return false;
			if (!q) return true;
			return row.studentName.toLowerCase().includes(q) || (row.matchedStudentCode ?? "").toLowerCase().includes(q) || row.quizTitle.toLowerCase().includes(q) || row.subject.toLowerCase().includes(q);
		});
	}, [
		quizResults,
		subjectFilter,
		searchTerm
	]);
	const filteredAssessments = (0, import_react.useMemo)(() => {
		const q = searchTerm.trim().toLowerCase();
		return assessments.filter((row) => {
			if (subjectFilter !== "all" && matchActiveSubjectOption(row.subjectName)?.key !== subjectFilter) return false;
			if (!q) return true;
			return (row.studentName ?? "").toLowerCase().includes(q) || row.title.toLowerCase().includes(q) || (row.subjectName ?? "").toLowerCase().includes(q);
		});
	}, [
		assessments,
		subjectFilter,
		searchTerm
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		eyebrow: "Administration",
		role: "admin",
		title: "Results",
		subtitle: "Live quiz scores, final ranks, and assessment results recorded across all students.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin",
						className: "text-sm text-muted-foreground underline underline-offset-4 hover:text-amber",
						children: "← Back to admin dashboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 sm:flex-row sm:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full sm:w-64",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
								className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "search",
								value: searchTerm,
								onChange: (e) => setSearchTerm(e.target.value),
								placeholder: "Search student or quiz…",
								className: "h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm text-headline outline-none focus:border-amber"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							"aria-label": "Filter by subject",
							value: subjectFilter,
							onChange: (e) => setSubjectFilter(e.target.value),
							className: "h-9 rounded-md border border-border bg-card px-3 text-sm text-headline outline-none focus:border-amber",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All subjects"
							}), ACTIVE_SUBJECT_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: opt.key,
								children: opt.fullLabel
							}, opt.key))]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: portalCard,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
								className: "flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
									className: "size-3.5 text-amber",
									"aria-hidden": "true"
								}), "Completed quizzes"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-3 font-display text-3xl font-semibold text-headline",
								children: quizResultsQuery.isLoading ? "—" : uniqueSessionCount
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: portalCard,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
								className: "flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, {
									className: "size-3.5 text-amber",
									"aria-hidden": "true"
								}), "Quiz entries"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-3 font-display text-3xl font-semibold text-amber",
								children: quizResultsQuery.isLoading ? "—" : quizResults.length
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: portalCard,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
								className: "flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
									className: "size-3.5 text-amber",
									"aria-hidden": "true"
								}), "Students ranked"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-3 font-display text-3xl font-semibold text-headline",
								children: quizResultsQuery.isLoading ? "—" : uniqueStudentCount
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: portalCard,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
								className: "flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, {
									className: "size-3.5 text-amber",
									"aria-hidden": "true"
								}), "Assessments"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-3 font-display text-3xl font-semibold text-headline",
								children: assessmentResultsQuery.isLoading ? "—" : assessments.length
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-labelledby": "admin-quiz-results-heading",
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "admin-quiz-results-heading",
						className: "font-display text-xl font-semibold",
						children: "Live quiz results (all students)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Final scores and ranks recorded whenever a live quiz session ends."
					})] }), quizResultsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Loading live quiz results…"
					}) : quizResultsQuery.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
						children: quizResultsQuery.error.message
					}) : filteredQuizzes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "No completed quiz results found",
						body: quizResults.length === 0 ? "Once a teacher or admin hosts a live quiz and ends the session, every student's final score and rank will appear here." : "No quiz entries match your current search or subject filter."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto rounded-xl border border-border bg-card/70",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[48rem] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "border-b border-border text-xs uppercase tracking-[0.16em] text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 font-medium",
										children: "Student"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 font-medium",
										children: "Quiz"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 font-medium",
										children: "Subject"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 font-medium",
										children: "Score"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 font-medium",
										children: "Rank"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 font-medium",
										children: "Date"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filteredQuizzes.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border/50 last:border-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium text-headline",
											children: row.studentName
										}), row.matchedStudentCode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-amber",
											children: row.matchedStudentCode
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-headline",
											children: row.quizTitle
										}), row.pinCode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: ["PIN ", row.pinCode]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5 text-muted-foreground",
										children: row.subject
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3.5 font-display text-base font-semibold text-headline",
										children: [
											row.score,
											row.maxPossibleScore !== null ? ` / ${row.maxPossibleScore}` : "",
											" pts"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${row.rank === 1 ? "border-amber/60 bg-amber/15 text-amber" : "border-border bg-background/60 text-headline"}`,
											children: [
												"#",
												row.rank,
												" of ",
												row.totalParticipants
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5 text-muted-foreground",
										children: formatDate(row.completedAt)
									})
								]
							}, row.participantId)) })]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-labelledby": "admin-assessment-results-heading",
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "admin-assessment-results-heading",
						className: "font-display text-xl font-semibold",
						children: "Assessment results (all students)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Monthly and term assessment scores recorded across all students."
					})] }), assessmentResultsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Loading assessment records…"
					}) : assessmentResultsQuery.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
						children: assessmentResultsQuery.error.message
					}) : filteredAssessments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "No results recorded yet",
						body: assessments.length === 0 ? "No assessment results have been recorded yet. Once results are saved for students, they will appear here." : "No assessment rows match your current filter."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto rounded-xl border border-border bg-card/70",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[52rem] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "border-b border-border text-xs uppercase tracking-[0.16em] text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 font-medium",
										children: "Student"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 font-medium",
										children: "Assessment"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 font-medium",
										children: "Subject"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 font-medium",
										children: "Score"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 font-medium",
										children: "Total marks"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 font-medium",
										children: "Percentage"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 font-medium",
										children: "Grade"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 font-medium",
										children: "Date"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filteredAssessments.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border/50 last:border-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium text-headline",
											children: item.studentName ?? "Student"
										}), item.studentCode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-amber",
											children: item.studentCode
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-headline",
											children: item.title
										}), item.assessmentType && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-0.5 text-xs capitalize text-muted-foreground",
											children: item.assessmentType.replace(/_/g, " ")
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5 text-muted-foreground",
										children: item.subjectName ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5 font-display text-base font-semibold text-headline",
										children: item.score !== null ? item.score : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5 text-muted-foreground",
										children: item.totalMarks !== null ? item.totalMarks : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5 text-headline",
										children: item.percentage !== null ? `${item.percentage}%` : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5 font-semibold text-amber",
										children: item.grade ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5 text-muted-foreground",
										children: formatDate(item.recordedAt)
									})
								]
							}, item.id)) })]
						})
					})]
				})
			]
		})
	});
}
//#endregion
export { AdminResultsPage as component };
