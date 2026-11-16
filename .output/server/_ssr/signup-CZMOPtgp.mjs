import { n as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as signUpWithEmail } from "./auth-xPULwznI.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as whatsappHref, n as emailHref, t as contact } from "./contact-DakOy8UC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signup-CZMOPtgp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SignUpPage() {
	const navigate = useNavigate();
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [confirmationEmail, setConfirmationEmail] = (0, import_react.useState)(null);
	async function handleSubmit(event) {
		event.preventDefault();
		setError(null);
		const trimmedName = fullName.trim();
		const trimmedEmail = email.trim();
		if (trimmedName.length < 2) {
			setError("Please enter your full name.");
			return;
		}
		if (!trimmedEmail || !trimmedEmail.includes("@")) {
			setError("Please enter a valid email address.");
			return;
		}
		if (password.length < 6) {
			setError("Password must be at least 6 characters long.");
			return;
		}
		if (password !== confirmPassword) {
			setError("Passwords do not match. Please re-enter your password.");
			return;
		}
		setIsSubmitting(true);
		const result = await signUpWithEmail({
			fullName: trimmedName,
			email: trimmedEmail,
			password
		});
		setIsSubmitting(false);
		if (result.error) {
			setError(result.error);
			return;
		}
		if (result.needsEmailConfirmation) {
			setConfirmationEmail(trimmedEmail);
			return;
		}
		navigate({
			to: "/student",
			replace: true
		});
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
								children: "Student registration"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-6 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl",
								children: "Create your account"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm leading-relaxed text-foreground/85",
								children: "New accounts receive student access. Once signed in, your account remains pending enrollment until an administrator assigns your subjects."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid grid-cols-2 rounded-lg border border-border bg-card/70 p-1 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "rounded-md py-2 text-center font-medium text-muted-foreground transition-colors hover:text-headline",
							children: "Sign in"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-md bg-amber py-2 text-center font-semibold text-primary-foreground",
							children: "Sign up"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 rounded-xl border border-border bg-card/90 p-6 backdrop-blur-sm sm:p-8",
						children: confirmationEmail ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase tracking-[0.2em] text-amber",
									children: "Check your inbox"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl font-semibold text-headline",
									children: "Confirm your email address"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm leading-relaxed text-muted-foreground",
									children: [
										"We sent a confirmation link to",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "font-medium text-headline",
											children: confirmationEmail
										}),
										". Open that link to verify your account, then sign in. Your account will show as pending enrollment until an administrator enrols you in subjects."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/login",
										className: "inline-flex h-11 w-full items-center justify-center rounded-md bg-amber px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-amber-soft",
										children: "Go to Sign in"
									})
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							className: "space-y-5",
							noValidate: true,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "full-name",
										className: "block text-sm font-medium text-headline",
										children: "Full name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "full-name",
										name: "fullName",
										type: "text",
										autoComplete: "name",
										required: true,
										placeholder: "e.g. Abdullah Yusuf",
										value: fullName,
										onChange: (e) => setFullName(e.target.value),
										className: "h-12 w-full rounded-md border border-input bg-secondary px-4 text-base text-foreground transition-colors duration-200 placeholder:text-muted-foreground hover:border-amber/50 focus:border-amber focus:outline-none"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "signup-email",
										className: "block text-sm font-medium text-headline",
										children: "Email address"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "signup-email",
										name: "email",
										type: "email",
										autoComplete: "email",
										required: true,
										placeholder: "you@example.com",
										value: email,
										onChange: (e) => setEmail(e.target.value),
										className: "h-12 w-full rounded-md border border-input bg-secondary px-4 text-base text-foreground transition-colors duration-200 placeholder:text-muted-foreground hover:border-amber/50 focus:border-amber focus:outline-none"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "signup-password",
										className: "block text-sm font-medium text-headline",
										children: "Password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "signup-password",
										name: "password",
										type: "password",
										autoComplete: "new-password",
										required: true,
										minLength: 6,
										placeholder: "At least 6 characters",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										className: "h-12 w-full rounded-md border border-input bg-secondary px-4 text-base text-foreground transition-colors duration-200 placeholder:text-muted-foreground hover:border-amber/50 focus:border-amber focus:outline-none"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "confirm-password",
										className: "block text-sm font-medium text-headline",
										children: "Confirm password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "confirm-password",
										name: "confirmPassword",
										type: "password",
										autoComplete: "new-password",
										required: true,
										minLength: 6,
										placeholder: "Re-enter your password",
										value: confirmPassword,
										onChange: (e) => setConfirmPassword(e.target.value),
										className: "h-12 w-full rounded-md border border-input bg-secondary px-4 text-base text-foreground transition-colors duration-200 placeholder:text-muted-foreground hover:border-amber/50 focus:border-amber focus:outline-none"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: isSubmitting,
									className: "inline-flex h-12 w-full items-center justify-center rounded-md bg-amber text-sm font-semibold tracking-wide text-primary-foreground transition-colors duration-200 hover:bg-amber-soft disabled:cursor-not-allowed disabled:opacity-60",
									children: isSubmitting ? "Creating account…" : "Create student account"
								}),
								error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									role: "alert",
									className: "rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-center text-sm text-destructive",
									children: error
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-center text-sm text-muted-foreground",
									children: [
										"Already have an account?",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/login",
											className: "font-medium text-amber underline underline-offset-4 transition-colors hover:text-amber-soft",
											children: "Sign in"
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
									children: "Need help enrolling?"
								}),
								" Message us on",
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
export { SignUpPage as component };
