import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as isAllowedSubject } from "./curriculum-rYiZvMsx.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as formatNaira, N as monthStart, P as portalCard, S as fetchStudentPayments, b as fetchStudentByProfile, h as fetchEnrollments, k as formatMonth, n as PortalShell, t as EmptyState, u as evaluatePaymentStatus, v as fetchProfile } from "./portal-shell-DqU1YDlN.mjs";
import { t as usePortalRole } from "./use-portal-role-CHoMdNYj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/student-qpRijOHM.js
var import_jsx_runtime = require_jsx_runtime();
var bankDetails = {
	bank: "Moniepoint",
	accountNumber: "9046914150",
	accountName: "Munirudeen Lekan Azeez"
};
/**
* Shown in place of the student dashboard while a current-month payment is
* outstanding and the 2-day grace period has passed.
*/
function PaymentDue({ amountOwed, unpaid, studentCode, month }) {
	const reference = studentCode ? `[${studentCode}] ${month}` : month;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-amber/50 bg-amber/10 p-6 sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.22em] text-amber",
						children: "Payment due"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mt-4 font-display text-2xl font-semibold text-headline sm:text-3xl",
						children: [
							"Your ",
							formatMonth(month),
							" fees are outstanding"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-2xl text-sm leading-relaxed text-foreground/85",
						children: "Your dashboard is on hold until this month's fees are received. The grace period of two days after the 1st has passed. Once payment is confirmed by the administration, your dashboard opens again immediately."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 font-display text-4xl font-semibold text-amber",
						children: formatNaira(amountOwed)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground",
						children: "Total amount owed"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-labelledby": "bank-transfer",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						id: "bank-transfer",
						className: "font-display text-xl font-semibold",
						children: "Bank transfer details"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "mt-6 grid gap-4 sm:grid-cols-3",
						children: [
							{
								label: "Bank",
								value: bankDetails.bank
							},
							{
								label: "Account number",
								value: bankDetails.accountNumber
							},
							{
								label: "Account name",
								value: bankDetails.accountName
							}
						].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: portalCard,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
								children: item.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-3 text-base text-headline",
								children: item.value
							})]
						}, item.label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm leading-relaxed text-muted-foreground",
						children: [
							"Please use ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-amber",
								children: reference
							}),
							" as your transfer narration or reference so your payment can be matched to your record, then send the receipt to the administration on WhatsApp."
						]
					})
				]
			}),
			unpaid.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-labelledby": "outstanding",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					id: "outstanding",
					className: "font-display text-xl font-semibold",
					children: "Outstanding items"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-6 space-y-3",
					children: unpaid.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/70 px-4 py-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-headline",
							children: formatMonth(row.month)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-amber",
							children: formatNaira(Math.max((row.amount_due ?? 0) - (row.amount_paid ?? 0), 0))
						})]
					}, row.id))
				})]
			})
		]
	});
}
function StudentPage() {
	const { user, role, isLoading } = usePortalRole("student");
	const profileQuery = useQuery({
		queryKey: ["profile", user?.id],
		queryFn: () => fetchProfile(user.id),
		enabled: Boolean(user?.id)
	});
	const studentQuery = useQuery({
		queryKey: ["student-row", user?.id],
		queryFn: () => fetchStudentByProfile(user.id),
		enabled: Boolean(user?.id) && role === "student",
		staleTime: 0,
		refetchOnMount: "always",
		refetchOnWindowFocus: true,
		refetchInterval: (query) => query.state.data ? false : 5e3
	});
	const studentRowId = studentQuery.data?.id;
	const enrollmentsQuery = useQuery({
		queryKey: ["enrollments", studentRowId],
		queryFn: () => fetchEnrollments(studentRowId),
		enabled: Boolean(studentRowId),
		staleTime: 0,
		refetchOnMount: "always",
		refetchOnWindowFocus: true,
		refetchInterval: (query) => (query.state.data ?? []).length === 0 ? 5e3 : false
	});
	const month = monthStart();
	const paymentsQuery = useQuery({
		queryKey: [
			"student-payments",
			studentRowId,
			month
		],
		queryFn: () => fetchStudentPayments(studentRowId, studentQuery.data?.student_id ?? null, month),
		enabled: Boolean(studentRowId)
	});
	const profile = profileQuery.data;
	const student = studentQuery.data;
	const enrollments = (enrollmentsQuery.data ?? []).filter((item) => (!item.subjects?.name || isAllowedSubject(item.subjects.name)) && (item.status === "active" || item.status === "completed"));
	const payment = paymentsQuery.data ? evaluatePaymentStatus(paymentsQuery.data) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		eyebrow: "Student",
		role: "student",
		title: payment?.blocked ? "Payment due" : profile?.full_name ? `Welcome, ${profile.full_name}` : "Student dashboard",
		subtitle: profile?.email ?? user?.email ?? void 0,
		children: isLoading || studentQuery.isLoading || Boolean(studentRowId) && paymentsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Loading your details…"
		}) : payment?.blocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentDue, {
			amountOwed: payment.amountOwed,
			unpaid: payment.unpaid,
			studentCode: student?.student_id ?? null,
			month
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-12",
			children: [
				!studentQuery.isLoading && !enrollmentsQuery.isLoading && (!student || enrollments.length === 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-label": "Enrollment status",
					className: "rounded-xl border border-amber/50 bg-amber/10 p-6 sm:p-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-[0.2em] text-amber",
							children: "Enrollment status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-2xl font-semibold text-headline",
							children: "Your account is pending enrollment"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-2xl text-sm leading-relaxed text-foreground/85",
							children: "Welcome to Path to Qur'anic Understanding. Your student account is active, and you will see your assigned subjects here as soon as an administrator enrols you."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-labelledby": "my-record",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "my-record",
						className: "font-display text-xl font-semibold",
						children: "My record"
					}), studentQuery.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
						children: studentQuery.error.message
					}) : !student ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							title: "Your account is pending enrollment",
							body: "Your student record and subject enrolments have not been linked yet. An administrator will enrol you shortly."
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
						children: [
							{
								label: "Student ID",
								value: student.student_id
							},
							{
								label: "Class",
								value: student.class_name
							},
							{
								label: "Admitted",
								value: student.admission_date
							},
							{
								label: "Status",
								value: student.status
							}
						].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: portalCard,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
								children: item.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-3 text-base text-headline",
								children: item.value ?? "Not recorded"
							})]
						}, item.label))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-labelledby": "my-subjects",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "my-subjects",
						className: "font-display text-xl font-semibold",
						children: "Enrolled subjects"
					}), enrollmentsQuery.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
						children: enrollmentsQuery.error.message
					}) : enrollmentsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted-foreground",
						children: "Loading your subjects…"
					}) : enrollments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							title: "Your account is pending enrollment",
							body: "Once the administration enrols you in subjects, they will be listed here."
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 grid gap-4 sm:grid-cols-2",
						children: enrollments.map((enrollment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: portalCard,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-lg font-semibold text-headline",
									children: enrollment.subjects?.name ?? "Subject"
								}),
								enrollment.subjects?.code && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs uppercase tracking-[0.2em] text-amber",
									children: enrollment.subjects.code
								}),
								enrollment.subjects?.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm leading-relaxed text-muted-foreground",
									children: enrollment.subjects.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground",
									children: enrollment.status ?? "active"
								})
							]
						}, enrollment.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-labelledby": "live",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "live",
							className: "font-display text-xl font-semibold",
							children: "Live classes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-muted-foreground",
							children: "The recurring live class timetable with join links."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/live-classes",
							className: "mt-4 inline-block text-sm font-semibold text-amber underline underline-offset-4",
							children: "View live classes →"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-labelledby": "live-quiz",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "live-quiz",
							className: "font-display text-xl font-semibold",
							children: "Live quiz"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-muted-foreground",
							children: "Got a 6-digit PIN from your teacher? Join the live quiz and play along."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/quiz/join",
							className: "mt-4 inline-block text-sm font-semibold text-amber underline underline-offset-4",
							children: "Join a quiz →"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-labelledby": "my-results",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "my-results",
							className: "font-display text-xl font-semibold",
							children: "Results"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-muted-foreground",
							children: "View your completed live quiz scores, ranks, and recorded assessment results."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/results",
							className: "mt-4 inline-block text-sm font-semibold text-amber underline underline-offset-4",
							children: "View my results →"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { StudentPage as component };
