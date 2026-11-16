import { n as __toESM } from "../_runtime.mjs";
import { v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-xPULwznI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var supabase = createClient("https://rupickfdkegwguhkdntz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1cGlja2Zka2Vnd2d1aGtkbnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NjgwNzQsImV4cCI6MjEwMzQ0NDA3NH0.2B15F4ocLWXJZ5ylHz0xLNAYYgZGrcv4j49FcmSUlCM", { auth: {
	persistSession: true,
	autoRefreshToken: true,
	detectSessionInUrl: true
} });
/**
* Auth integration point — backed by the school's existing Supabase project.
* All auth logic stays isolated in this module.
*/
function mapAuthUser(raw) {
	if (!raw) return null;
	const metaName = typeof raw.user_metadata?.["full_name"] === "string" ? raw.user_metadata["full_name"] : void 0;
	return {
		id: raw.id,
		email: raw.email ?? "",
		fullName: metaName
	};
}
function useAuth() {
	const [state, setState] = (0, import_react.useState)({
		user: null,
		isLoading: true
	});
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
			setState({
				user: mapAuthUser(session?.user),
				isLoading: false
			});
		});
		supabase.auth.getUser().then(({ data }) => {
			setState({
				user: mapAuthUser(data.user),
				isLoading: false
			});
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	return state;
}
function formatAuthError(message) {
	const lower = message.toLowerCase();
	if (lower.includes("invalid login credentials")) return "Incorrect email address or password. Please check your details and try again.";
	if (lower.includes("email not confirmed")) return "Your email address has not been confirmed yet. Please check your inbox for the confirmation link.";
	if (lower.includes("user already registered") || lower.includes("already exists")) return "An account with this email address already exists. Try signing in instead.";
	if (lower.includes("password") && lower.includes("least")) return "Password must be at least 6 characters long.";
	if (lower.includes("rate limit") || lower.includes("too many requests")) return "Too many attempts. Please wait a moment before trying again.";
	if (lower.includes("signups not allowed") || lower.includes("signup is disabled")) return "Public sign-up is currently disabled in authentication settings. Please contact the school administration.";
	return message;
}
/**
* Ensures a newly signed-up user has a profile row and ONLY the `student` role
* (never teacher/admin), if not already created by a database trigger.
*/
async function ensureStudentOnboarding(userId, fullName, email) {
	try {
		const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle();
		if (!existingProfile) await supabase.from("profiles").insert({
			id: userId,
			full_name: fullName?.trim() || null,
			email: email.trim(),
			is_active: true
		});
		const { data: existingRoles } = await supabase.from("user_roles").select("role_id").eq("user_id", userId);
		if (!existingRoles || existingRoles.length === 0) {
			const { data: studentRole } = await supabase.from("roles").select("id").ilike("name", "student").maybeSingle();
			if (studentRole && studentRole.id) await supabase.from("user_roles").insert({
				user_id: userId,
				role_id: studentRole.id
			});
		}
	} catch {}
}
async function signInWithEmail(email, password) {
	const { error } = await supabase.auth.signInWithPassword({
		email: email.trim(),
		password
	});
	if (error) return { error: formatAuthError(error.message) };
	return {};
}
async function signUpWithEmail(input) {
	const cleanName = input.fullName.trim();
	const cleanEmail = input.email.trim();
	const { data, error } = await supabase.auth.signUp({
		email: cleanEmail,
		password: input.password,
		options: {
			data: {
				full_name: cleanName,
				role: "student"
			},
			...typeof window !== "undefined" ? { emailRedirectTo: `${window.location.origin}/login` } : {}
		}
	});
	if (error) return { error: formatAuthError(error.message) };
	if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) return { error: "An account with this email address already exists. Try signing in instead." };
	if (data.session && data.user) {
		await ensureStudentOnboarding(data.user.id, cleanName, cleanEmail);
		return { needsEmailConfirmation: false };
	}
	return { needsEmailConfirmation: true };
}
async function signOut() {
	await supabase.auth.signOut();
}
//#endregion
export { supabase as a, signUpWithEmail as i, signInWithEmail as n, useAuth as o, signOut as r, ensureStudentOnboarding as t };
