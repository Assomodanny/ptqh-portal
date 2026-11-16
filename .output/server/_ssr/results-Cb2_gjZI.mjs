import { n as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as matchActiveSubjectOption, t as ACTIVE_SUBJECT_OPTIONS } from "./curriculum-rYiZvMsx.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { S as ClipboardList, a as Trophy, k as Award, s as Sparkles } from "../_libs/lucide-react.mjs";
import { P as portalCard, b as fetchStudentByProfile, m as fetchAssessmentResults, n as PortalShell, t as EmptyState, v as fetchProfile } from "./portal-shell-DqU1YDlN.mjs";
import { t as usePortalRole } from "./use-portal-role-CHoMdNYj.mjs";
import { p as fetchStudentQuizResults } from "./quiz-Cmi0m9eU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/results-Cb2_gjZI.js
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
function StudentResultsPage() {
	const { user, role, isLoading } = usePortalRole("student");
	const [subjectFilter, setSubjectFilter] = (0, import_react.useState)("all");
	const profileQuery = useQuery({
		queryKey: ["profile", user?.id],
		queryFn: () => fetchProfile(user.id),
		enabled: Boolean(user?.id)
	});
	const studentQuery = useQuery({
		queryKey: ["student-row", user?.id],
		queryFn: () => fetchStudentByProfile(user.id),
		enabled: Boolean(user?.id) && role === "student"
	});
	const profile = profileQuery.data;
	const student = studentQuery.data;
	const candidateNames = (0, import_react.useMemo)(() => [
		profile?.full_name,
		user?.fullName,
		profile?.email,
		user?.email,
		student?.student_id
	], [
		profile?.full_name,
		user?.fullName,
		profile?.email,
		user?.email,
		student?.student_id
	]);
	const quizResultsQuery = useQuery({
		queryKey: [
			"student-quiz-results",
			user?.id,
			student?.id,
			candidateNames
		],
		queryFn: () => fetchStudentQuizResults({
			userId: user.id,
			studentRowId: student?.id ?? null,
			candidateNames
		}),
		enabled: Boolean(user?.id) && role === "student" && !studentQuery.isLoading,
		staleTime: 0,
		refetchOnMount: "always",
		refetchOnWindowFocus: true
	});
	const assessmentResultsQuery = useQuery({
		queryKey: ["student-assessment-results", student?.id],
		queryFn: () => fetchAssessmentResults({ studentRowId: student.id }),
		enabled: Boolean(student?.id) && role === "student",
		staleTime: 0,
		refetchOnMount: "always"
	});
	const quizResults = (0, import_react.useMemo)(() => quizResultsQuery.data ?? [], [quizResultsQuery.data]);
	const assessments = (0, import_react.useMemo)(() => assessmentResultsQuery.data ?? [], [assessmentResultsQuery.data]);
	const filteredQuizzes = (0, import_react.useMemo)(() => {
		if (subjectFilter === "all") return quizResults;
		return quizResults.filter((row) => matchActiveSubjectOption(row.subject)?.key === subjectFilter);
	}, [quizResults, subjectFilter]);
	const filteredAssessments = (0, import_react.useMemo)(() => {
		if (subjectFilter === "all") return assessments;
		return assessments.filter((row) => matchActiveSubjectOption(row.subjectName)?.key === subjectFilter);
	}, [assessments, subjectFilter]);
	const bestRank = (0, import_react.useMemo)(() => {
		if (quizResults.length === 0) return null;
		return Math.min(...quizResults.map((r) => r.rank));
	}, [quizResults]);
	const totalQuizPoints = (0, import_react.useMemo)(() => {
		return quizResults.reduce((sum, r) => sum + r.score, 0);
	}, [quizResults]);
	const pageLoading = isLoading || studentQuery.isLoading || quizResultsQuery.isLoading;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		eyebrow: "Student",
		role: "student",
		title: "My results",
		subtitle: profile?.full_name ? `Live quiz scores, final ranks, and recorded assessments for ${profile.full_name}.` : "Your completed live quiz scores, ranks, and recorded assessment results.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/student",
					className: "text-sm text-muted-foreground underline underline-offset-4 hover:text-amber",
					children: "← Back to student dashboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "student-results-subject",
						className: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
						children: "Subject"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						id: "student-results-subject",
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
			}), pageLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading your results…"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
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
								}), "Live quizzes"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-3 font-display text-3xl font-semibold text-headline",
								children: quizResults.length
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: portalCard,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
								className: "flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, {
									className: "size-3.5 text-amber",
									"aria-hidden": "true"
								}), "Best rank"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-3 font-display text-3xl font-semibold text-amber",
								children: bestRank !== null ? `#${bestRank}` : "—"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: portalCard,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
								className: "flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, {
									className: "size-3.5 text-amber",
									"aria-hidden": "true"
								}), "Total quiz points"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-3 font-display text-3xl font-semibold text-headline",
								children: totalQuizPoints
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
								children: assessments.length
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-labelledby": "student-quiz-results-heading",
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "student-quiz-results-heading",
						className: "font-display text-xl font-semibold",
						children: "Live quiz scores & ranks"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Final scores and positions recorded when each live quiz session ends."
					})] }), quizResultsQuery.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
						children: quizResultsQuery.error.message
					}) : filteredQuizzes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "No live quiz results yet",
						body: "Once you join a live quiz while signed in and your teacher ends the session, your final score and rank will appear here."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto rounded-xl border border-border bg-card/70",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[42rem] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "border-b border-border text-xs uppercase tracking-[0.16em] text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
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
					"aria-labelledby": "student-assessment-results-heading",
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "student-assessment-results-heading",
						className: "font-display text-xl font-semibold",
						children: "Assessment results"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Monthly and term assessments recorded for your account."
					})] }), assessmentResultsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Loading assessment results…"
					}) : assessmentResultsQuery.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
						children: assessmentResultsQuery.error.message
					}) : filteredAssessments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "No results recorded yet",
						body: "Once your teachers or administrators record assessment results for you, your score, total marks, percentage, grade, and date will appear here."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto rounded-xl border border-border bg-card/70",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[46rem] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "border-b border-border text-xs uppercase tracking-[0.16em] text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
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
			] })]
		})
	});
}
//#endregion
export { StudentResultsPage as component };
