import { n as __toESM } from "../_runtime.mjs";
import { v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { o as useAuth } from "./auth-xPULwznI.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { D as fetchUserRole, V as roleHome } from "./portal-shell-DqU1YDlN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-portal-role-CHoMdNYj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* Client-side role resolution for portal pages.
* Redirects signed-out visitors to /login and wrong-role users to their own home.
*/
function usePortalRole(expected) {
	const { user, isLoading } = useAuth();
	const navigate = useNavigate();
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
		if (!expected || isLoading || !user || !roleQuery.isSuccess) return;
		if (!role) {
			navigate({
				to: "/dashboard",
				replace: true
			});
			return;
		}
		if (role !== expected) navigate({
			to: roleHome[role],
			replace: true
		});
	}, [
		expected,
		isLoading,
		user,
		roleQuery.isSuccess,
		role,
		navigate
	]);
	return {
		user,
		role,
		isLoading: isLoading || Boolean(user) && roleQuery.isLoading,
		error: roleQuery.error
	};
}
//#endregion
export { usePortalRole as t };
