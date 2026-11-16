import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { P as portalCard, d as fetchAdminCounts, n as PortalShell, t as EmptyState, v as fetchProfile } from "./portal-shell-DqU1YDlN.mjs";
import { t as usePortalRole } from "./use-portal-role-CHoMdNYj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DO3-t1TV.js
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const { user, role, isLoading } = usePortalRole("admin");
	const profileQuery = useQuery({
		queryKey: ["profile", user?.id],
		queryFn: () => fetchProfile(user.id),
		enabled: Boolean(user?.id)
	});
	const countsQuery = useQuery({
		queryKey: ["admin-counts"],
		queryFn: fetchAdminCounts,
		enabled: role === "admin"
	});
	const name = profileQuery.data?.full_name ?? user?.email ?? "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		eyebrow: "Administration",
		role: "admin",
		title: "Admin dashboard",
		subtitle: name ? `Signed in as ${name}.` : "Loading your session…",
		children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Loading…"
		}) : role && role !== "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Redirecting…"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-labelledby": "totals",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "totals",
						className: "font-display text-xl font-semibold",
						children: "School totals"
					}), countsQuery.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
						children: countsQuery.error.message
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "mt-6 grid gap-4 sm:grid-cols-3",
						children: [
							{
								label: "Students",
								value: countsQuery.data?.students
							},
							{
								label: "Teachers",
								value: countsQuery.data?.teachers
							},
							{
								label: "Subjects",
								value: countsQuery.data?.subjects
							}
						].map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: portalCard,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs uppercase tracking-[0.22em] text-muted-foreground",
								children: stat.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-3 font-display text-4xl font-semibold text-amber",
								children: countsQuery.isLoading ? "—" : stat.value ?? 0
							})]
						}, stat.label))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-labelledby": "quick-links",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "quick-links",
						className: "font-display text-xl font-semibold",
						children: "Quick links"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 grid gap-4 sm:grid-cols-3",
						children: [
							{
								to: "/admin/students",
								title: "View students",
								body: "Enrolled students, class names and status."
							},
							{
								to: "/admin/enrollments",
								title: "Manage enrollments",
								body: "Assign students to active subjects or remove enrollments."
							},
							{
								to: "/admin/teachers",
								title: "Manage teachers",
								body: "Teaching staff, profiles and assigned subjects."
							},
							{
								to: "/admin/results",
								title: "View results",
								body: "Live quiz scores, ranks and assessment results for all students."
							},
							{
								to: "/quiz",
								title: "Host a live quiz",
								body: "Start a live quiz session and follow the leaderboard in real time."
							},
							{
								to: "/admin/payments",
								title: "Manage payments",
								body: "Mark monthly fees as paid or unpaid for each student."
							}
						].map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: link.to,
							className: portalCard,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-lg font-semibold text-headline",
									children: link.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-muted-foreground",
									children: link.body
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-4 inline-block text-sm font-semibold text-amber",
									children: "Open →"
								})
							]
						}, link.to))
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
								title: "Manage the live class schedule",
								body: "Add, edit or remove recurring live classes from the Live Classes page."
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/live-classes",
							className: "mt-4 inline-block text-sm font-semibold text-amber underline underline-offset-4",
							children: "Go to live classes →"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { AdminPage as component };
