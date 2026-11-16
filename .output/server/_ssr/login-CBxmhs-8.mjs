import { n as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as signInWithEmail } from "./auth-xPULwznI.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as whatsappHref, n as emailHref, t as contact } from "./contact-DakOy8UC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CBxmhs-8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	async function handleSubmit(event) {
		event.preventDefault();
		setFeedback(null);
		if (!email.trim() || !email.includes("@")) {
			setFeedback("Please enter a valid email address.");
			return;
		}
		if (!password) {
			setFeedback("Please enter your password.");
			return;
		}
		setIsSubmitting(true);
		const result = await signInWithEmail(email, password);
		setIsSubmitting(false);
		if (result.error) {
			setFeedback(result.error);
			return;
		}
		navigate({ to: "/dashboard" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "hero-gradient min-h-[calc(100vh-8rem)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto flex max-w-6xl flex-col items-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "inline-flex items-center rounded-full border border-amber/40 bg-amber/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-amber",
								children: "Portal access"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-6 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl",
								children: "Sign in to the portal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm leading-relaxed text-foreground/85",
								children: "Enter your email address and password, or create a new student account."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid grid-cols-2 rounded-lg border border-border bg-card/70 p-1 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-md bg-amber py-2 text-center font-semibold text-primary-foreground",
							children: "Sign in"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/signup",
							className: "rounded-md py-2 text-center font-medium text-muted-foreground transition-colors hover:text-headline",
							children: "Sign up"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 rounded-xl border border-border bg-card/90 p-6 backdrop-blur-sm sm:p-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							className: "space-y-5",
							noValidate: true,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "email",
										className: "block text-sm font-medium text-headline",
										children: "Email address"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "email",
										name: "email",
										type: "email",
										autoComplete: "email",
										required: true,
										placeholder: "you@school.edu",
										value: email,
										onChange: (e) => setEmail(e.target.value),
										className: "h-12 w-full rounded-md border border-input bg-secondary px-4 text-base text-foreground transition-colors duration-200 placeholder:text-muted-foreground hover:border-amber/50 focus:border-amber focus:outline-none"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "password",
										className: "block text-sm font-medium text-headline",
										children: "Password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "password",
										name: "password",
										type: "password",
										autoComplete: "current-password",
										required: true,
										placeholder: "••••••••",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										className: "h-12 w-full rounded-md border border-input bg-secondary px-4 text-base text-foreground transition-colors duration-200 placeholder:text-muted-foreground hover:border-amber/50 focus:border-amber focus:outline-none"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: isSubmitting,
									className: "inline-flex h-12 w-full items-center justify-center rounded-md bg-amber text-sm font-semibold tracking-wide text-primary-foreground transition-colors duration-200 hover:bg-amber-soft disabled:cursor-not-allowed disabled:opacity-60",
									children: isSubmitting ? "Signing in…" : "Sign in"
								}),
								feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									role: "alert",
									className: "rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-center text-sm text-destructive",
									children: feedback
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-center text-sm text-muted-foreground",
									children: [
										"New here?",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/signup",
											className: "font-medium text-amber underline underline-offset-4 transition-colors hover:text-amber-soft",
											children: "Create an account"
										})
									]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 rounded-xl border border-border bg-card/70 p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm leading-relaxed text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "font-semibold text-headline",
									children: "Need assistance?"
								}),
								" Teacher and administrator accounts are issued by the school. For support, message us on",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: whatsappHref,
									target: "_blank",
									rel: "noreferrer noopener",
									className: "text-amber underline underline-offset-4 transition-colors hover:text-amber-soft",
									children: "WhatsApp"
								}),
								" ",
								"or email",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: emailHref,
									className: "break-all text-amber underline underline-offset-4 transition-colors hover:text-amber-soft",
									children: contact.email
								}),
								"."
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 text-center text-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "text-muted-foreground underline underline-offset-4 transition-colors hover:text-amber",
							children: "← Back to the landing page"
						})
					})
				]
			})
		})
	});
}
//#endregion
export { LoginPage as component };
