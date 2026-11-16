import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as matchActiveSubjectOption, i as isAllowedSubject } from "./curriculum-rYiZvMsx.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { E as fetchTeacherSubjects, P as portalCard, n as PortalShell, t as EmptyState, v as fetchProfile, w as fetchTeacherByProfile } from "./portal-shell-DqU1YDlN.mjs";
import { t as usePortalRole } from "./use-portal-role-CHoMdNYj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/teacher-CegqqC2F.js
var import_jsx_runtime = require_jsx_runtime();
function TeacherPage() {
	const { user, role, isLoading } = usePortalRole("teacher");
	const profileQuery = useQuery({
		queryKey: ["profile", user?.id],
		queryFn: () => fetchProfile(user.id),
		enabled: Boolean(user?.id)
	});
	const teacherQuery = useQuery({
		queryKey: ["teacher-row", user?.id],
		queryFn: () => fetchTeacherByProfile(user.id),
		enabled: Boolean(user?.id) && role === "teacher",
		staleTime: 0,
		refetchOnMount: "always",
		refetchOnWindowFocus: true,
		refetchInterval: (query) => query.state.data ? false : 5e3
	});
	const teacherRowId = teacherQuery.data?.id;
	const teacherSubjectsQuery = useQuery({
		queryKey: ["teacher-subjects", teacherRowId],
		queryFn: () => fetchTeacherSubjects(teacherRowId),
		enabled: Boolean(teacherRowId),
		staleTime: 0,
		refetchOnMount: "always",
		refetchOnWindowFocus: true,
		refetchInterval: (query) => (query.state.data ?? []).length === 0 ? 5e3 : false
	});
	const profile = profileQuery.data;
	const teacher = teacherQuery.data;
	const assignedSubjects = (teacherSubjectsQuery.data ?? []).filter((item) => !item.subjects?.name || isAllowedSubject(item.subjects.name));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		eyebrow: "Teaching staff",
		role: "teacher",
		title: profile?.full_name ? `Welcome, ${profile.full_name}` : "Teacher dashboard",
		subtitle: profile?.email ?? user?.email ?? void 0,
		children: isLoading || teacherQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Loading your details…"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-labelledby": "my-details",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "my-details",
						className: "font-display text-xl font-semibold",
						children: "My details"
					}), teacherQuery.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
						children: teacherQuery.error.message
					}) : !teacher ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							title: "No teacher record found",
							body: "Your account is not yet linked to a teaching record. Please contact the school administration."
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
						children: [
							{
								label: "Employee ID",
								value: teacher.employee_id
							},
							{
								label: "Specialisation",
								value: teacher.specialization
							},
							{
								label: "Qualification",
								value: teacher.qualification
							},
							{
								label: "Status",
								value: teacher.status
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
					"aria-labelledby": "assignments",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "assignments",
						className: "font-display text-xl font-semibold",
						children: "My assigned subjects"
					}), teacherSubjectsQuery.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
						children: teacherSubjectsQuery.error.message
					}) : teacher && teacherSubjectsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted-foreground",
						children: "Loading your assigned subjects…"
					}) : assignedSubjects.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							title: "No subjects assigned yet",
							body: "Once the school administration assigns your subjects, they will be listed here."
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 grid gap-4 sm:grid-cols-2",
						children: assignedSubjects.map((assignment) => {
							const matched = matchActiveSubjectOption(assignment.subjects?.name) ?? matchActiveSubjectOption(assignment.subjects?.code);
							const subjectTitle = matched?.fullLabel ?? assignment.subjects?.name ?? "Assigned subject";
							const subjectDesc = assignment.subjects?.description ?? matched?.description ?? null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: portalCard,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-lg font-semibold text-headline",
										children: subjectTitle
									}),
									(assignment.subjects?.code ?? matched?.code) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs uppercase tracking-[0.2em] text-amber",
										children: assignment.subjects?.code ?? matched?.code
									}),
									subjectDesc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-sm leading-relaxed text-muted-foreground",
										children: subjectDesc
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground",
										children: "Assigned"
									})
								]
							}, `${assignment.teacher_id}-${assignment.subject_id}`);
						})
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
							children: "The recurring live class timetable, with join links for Google Meet and WhatsApp."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/quiz",
							className: "mt-4 mr-4 inline-block text-sm font-semibold text-amber underline underline-offset-4",
							children: "Host a live quiz →"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/live-classes",
							className: "mt-4 inline-block text-sm font-semibold text-amber underline underline-offset-4",
							children: "View live classes →"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { TeacherPage as component };
