import { n as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { o as useAuth, t as ensureStudentOnboarding } from "./auth-xPULwznI.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { D as fetchUserRole, V as roleHome, r as SignOutButton } from "./portal-shell-DqU1YDlN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-B4QriyXq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DashboardPage() {
	const { user, isLoading } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const attemptedOnboardingRef = (0, import_react.useRef)(null);
	const roleQuery = useQuery({
		queryKey: ["user-role", user?.id],
		queryFn: () => fetchUserRole(user.id),
		enabled: Boolean(user?.id)
	});
	(0, import_react.useEffect)(() => {
		if (!isLoading && !user) navigate({
			to: "/login",
			replace: true
		});
	}, [
		isLoading,
		user,
		navigate
	]);
	const role = roleQuery.data ?? null;
	(0, import_react.useEffect)(() => {
		if (!user?.id || !roleQuery.isSuccess || role !== null) return;
		if (attemptedOnboardingRef.current === user.id) return;
		attemptedOnboardingRef.current = user.id;
		ensureStudentOnboarding(user.id, user.fullName, user.email).then(() => {
			queryClient.invalidateQueries({ queryKey: ["user-role", user.id] });
		});
	}, [
		user,
		roleQuery.isSuccess,
		role,
		queryClient
	]);
	(0, import_react.useEffect)(() => {
		if (!role) return;
		navigate({
			to: roleHome[role],
			replace: true
		});
	}, [role, navigate]);
	const noRole = Boolean(user) && roleQuery.isSuccess && role === null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold sm:text-4xl",
				children: noRole ? "Your account is pending enrollment" : "Dashboard"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground",
				children: isLoading || roleQuery.isLoading ? "Loading your session…" : roleQuery.error ? roleQuery.error.message : noRole ? "Your account has been created and is waiting for an administrator to complete your student enrollment and assign your subjects." : "Taking you to your dashboard…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignOutButton, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "inline-flex h-11 items-center justify-center rounded-md border border-border px-5 text-sm font-medium transition-colors hover:border-amber/70 hover:text-amber",
					children: "Back to site"
				})]
			})
		]
	});
}
//#endregion
export { DashboardPage as component };
