import { n as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { o as useAuth } from "./auth-xPULwznI.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { m as Menu, t as X } from "../_libs/lucide-react.mjs";
import { t as Route$17 } from "./host._sessionId-B3-WJ6j4.mjs";
import { i as whatsappHref, n as emailHref, r as phoneHref, t as contact } from "./contact-DakOy8UC.mjs";
import { t as SocialLinks } from "./social-links-MEjZz8tY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-B3OSJsDf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-xA5l98We.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
/**
* Single guarded service-worker registration point.
* Never registers in dev, inside an iframe, in Lovable preview hosts, or with ?sw=off.
*/
var SW_URL = "/sw.js";
async function unregisterAppServiceWorkers() {
	if (!("serviceWorker" in navigator)) return;
	const registrations = await navigator.serviceWorker.getRegistrations();
	await Promise.allSettled(registrations.filter((registration) => (registration.active?.scriptURL ?? "").includes(SW_URL)).map((registration) => registration.unregister()));
}
function isBlockedContext() {
	if (window.self !== window.top) return true;
	if (new URL(window.location.href).searchParams.get("sw") === "off") return true;
	const host = window.location.hostname;
	if (host.startsWith("id-preview--") || host.startsWith("preview--")) return true;
	return [
		"lovableproject.com",
		"lovableproject-dev.com",
		"beta.lovable.dev"
	].some((root) => host === root || host.endsWith(`.${root}`));
}
function registerServiceWorker() {
	if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
	if (isBlockedContext()) {
		unregisterAppServiceWorkers();
		return;
	}
	navigator.serviceWorker.register(SW_URL, { scope: "/" }).catch(() => {});
}
var navLinks = [
	{
		label: "Curriculum",
		href: "/#curriculum"
	},
	{
		label: "Live classes",
		href: "/live-classes"
	},
	{
		label: "About",
		href: "/#about"
	},
	{
		label: "FAQ",
		href: "/#faq"
	},
	{
		label: "Contact",
		href: "/#contact"
	}
];
function SiteHeader() {
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const { user } = useAuth();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3.5 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "group flex min-w-0 items-center gap-3.5 rounded-sm transition-opacity hover:opacity-90",
				onClick: () => setIsOpen(false),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/favicon.png",
					alt: "PTQU Crest",
					width: 40,
					height: 40,
					className: "size-10 shrink-0 rounded-lg border border-amber/40 bg-[#151210] object-cover shadow-sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 flex-col leading-tight",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "truncate font-display text-base font-semibold tracking-tight text-amber sm:text-xl lg:text-[1.45rem]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sm:hidden",
								children: "PTQU"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Path to Qur'anic Understanding"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 h-px w-full max-w-[12rem] bg-amber/40",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 text-[10px] uppercase tracking-[0.24em] text-muted-foreground sm:text-[11px]",
							children: "School Portal"
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 sm:gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						"aria-label": "Primary",
						className: "hidden lg:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "flex items-center gap-6",
							children: navLinks.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: link.href,
								className: "border-b border-transparent pb-1 text-sm text-muted-foreground transition-colors duration-200 hover:border-amber hover:text-headline",
								children: link.label
							}) }, link.href))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/quiz/join",
						className: "hidden text-sm text-muted-foreground transition-colors duration-200 hover:text-headline md:inline-block",
						children: "Join quiz"
					}),
					user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden items-center gap-2 sm:flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard",
							className: "inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-amber px-5 text-sm font-semibold tracking-wide text-primary-foreground shadow-sm transition-colors duration-200 hover:bg-amber-soft",
							children: "Portal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/signup",
							className: "inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-amber/60 px-4 text-sm font-semibold tracking-wide text-amber transition-colors duration-200 hover:border-amber hover:bg-amber/10",
							children: "Sign up"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden items-center gap-2 sm:flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-amber px-4 text-sm font-semibold tracking-wide text-primary-foreground shadow-sm transition-colors duration-200 hover:bg-amber-soft",
							children: "Sign in"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/signup",
							className: "inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-amber/60 px-4 text-sm font-semibold tracking-wide text-amber transition-colors duration-200 hover:border-amber hover:bg-amber/10",
							children: "Sign up"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": isOpen ? "Close menu" : "Open menu",
						"aria-expanded": isOpen,
						"aria-controls": "mobile-nav",
						onClick: () => setIsOpen((v) => !v),
						className: "grid size-10 shrink-0 place-items-center rounded-md border border-border text-foreground transition-colors duration-200 hover:border-amber/70 hover:text-amber lg:hidden",
						children: isOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
							className: "size-5",
							"aria-hidden": "true"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
							className: "size-5",
							"aria-hidden": "true"
						})
					})
				]
			})]
		}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			id: "mobile-nav",
			"aria-label": "Mobile",
			className: "border-t border-border bg-background lg:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mx-auto max-w-6xl px-4 py-3 sm:px-6",
				children: [
					navLinks.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: link.href,
						onClick: () => setIsOpen(false),
						className: "block border-b border-border/60 py-3.5 text-base text-foreground transition-colors duration-200 hover:text-amber",
						children: link.label
					}) }, link.href)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/quiz/join",
						onClick: () => setIsOpen(false),
						className: "block border-b border-border/60 py-3.5 text-base text-foreground transition-colors duration-200 hover:text-amber",
						children: "Join quiz"
					}) }),
					user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "grid grid-cols-2 gap-3 pt-3 sm:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard",
							onClick: () => setIsOpen(false),
							className: "inline-flex h-11 items-center justify-center rounded-md bg-amber px-4 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-amber-soft",
							children: "Portal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/signup",
							onClick: () => setIsOpen(false),
							className: "inline-flex h-11 items-center justify-center rounded-md border border-amber/60 px-4 text-sm font-semibold text-amber transition-colors duration-200 hover:border-amber hover:bg-amber/10",
							children: "Sign up"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "grid grid-cols-2 gap-3 pt-3 sm:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							onClick: () => setIsOpen(false),
							className: "inline-flex h-11 items-center justify-center rounded-md bg-amber px-4 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-amber-soft",
							children: "Sign in"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/signup",
							onClick: () => setIsOpen(false),
							className: "inline-flex h-11 items-center justify-center rounded-md border border-amber/60 px-4 text-sm font-semibold text-amber transition-colors duration-200 hover:border-amber hover:bg-amber/10",
							children: "Sign up"
						})]
					})
				]
			})
		})]
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "w-full border-t border-border bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "inline-flex items-center gap-3 transition-opacity hover:opacity-85",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/favicon.png",
								alt: "PTQU Crest",
								width: 32,
								height: 32,
								className: "size-8 rounded-md border border-amber/40 bg-[#151210] object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-base font-semibold text-headline",
								children: "Path to Qur'anic Understanding"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground",
							children: "A school-managed learning environment for the classical Islamic sciences."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xs font-medium uppercase tracking-[0.2em] text-amber",
							children: "Contact"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: phoneHref,
									className: "text-muted-foreground transition-colors duration-200 hover:text-amber",
									children: ["Call ", contact.phoneNumber]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: whatsappHref,
									target: "_blank",
									rel: "noreferrer noopener",
									className: "text-muted-foreground transition-colors duration-200 hover:text-amber",
									children: ["WhatsApp ", contact.whatsappNumber]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: emailHref,
									className: "break-all text-muted-foreground transition-colors duration-200 hover:text-amber",
									children: contact.email
								}) })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xs font-medium uppercase tracking-[0.2em] text-amber",
						children: "Follow"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialLinks, {
						className: "mt-4",
						size: "sm"
					})] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 border-t border-border pt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Path to Qur'anic Understanding. All rights reserved."
					]
				})
			})]
		})
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$16 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Path to Qur'anic Understanding" },
			{
				name: "description",
				content: "A structured programme in the classical Islamic sciences: Nahwu, Sarf, Hadith, and As-Sarim Al-Battar."
			},
			{
				property: "og:title",
				content: "Path to Qur'anic Understanding"
			},
			{
				property: "og:description",
				content: "A structured programme in the classical Islamic sciences: Nahwu, Sarf, Hadith, and As-Sarim Al-Battar."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "theme-color",
				content: "#151210"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.png",
				type: "image/png"
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png"
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$16.useRouteContext();
	(0, import_react.useEffect)(() => {
		registerServiceWorker();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-screen flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
			]
		})
	});
}
var $$splitComponentImporter$15 = () => import("./routes-C_vp6bUy.mjs");
var Route$15 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Path to Qur'anic Understanding — School Portal" },
		{
			name: "description",
			content: "A structured programme in the classical Islamic sciences: Nahwu, Sarf, Hadith, and As-Sarim Al-Battar. Accounts are issued by the school administration."
		},
		{
			property: "og:title",
			content: "Path to Qur'anic Understanding — School Portal"
		},
		{
			property: "og:description",
			content: "A structured programme in the classical Islamic sciences (Nahwu, Sarf, Hadith, and As-Sarim Al-Battar), taught as one integrated curriculum."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./dashboard-B4QriyXq.mjs");
var Route$14 = createFileRoute("/dashboard")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Dashboard — Path to Qur'anic Understanding" },
		{
			name: "description",
			content: "Your Path to Qur'anic Understanding portal dashboard — you'll be taken to the right view for your role."
		},
		{
			property: "og:title",
			content: "Dashboard — Path to Qur'anic Understanding"
		},
		{
			property: "og:description",
			content: "Your Path to Qur'anic Understanding portal dashboard."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./live-classes-CLQP3l4-.mjs");
var Route$13 = createFileRoute("/live-classes")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Live Classes — Path to Qur'anic Understanding" },
		{
			name: "description",
			content: "The recurring live class timetable for Path to Qur'anic Understanding, with join links for each session."
		},
		{
			property: "og:title",
			content: "Live Classes — Path to Qur'anic Understanding"
		},
		{
			property: "og:description",
			content: "Day, time, subject and join link for every live session."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./login-CBxmhs-8.mjs");
var Route$12 = createFileRoute("/login")({
	head: () => ({ meta: [
		{ title: "Sign In — Path to Qur'anic Understanding" },
		{
			name: "description",
			content: "Sign in to the Path to Qur'anic Understanding school portal or create a new student account."
		},
		{
			property: "og:title",
			content: "Sign In — Path to Qur'anic Understanding"
		},
		{
			property: "og:description",
			content: "Sign in to the Path to Qur'anic Understanding school portal."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./results-Cb2_gjZI.mjs");
var Route$11 = createFileRoute("/results")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "My Results — Path to Qur'anic Understanding" },
		{
			name: "description",
			content: "Your completed live quiz scores, ranks and recorded assessment results."
		},
		{
			property: "og:title",
			content: "My Results — Path to Qur'anic Understanding"
		},
		{
			property: "og:description",
			content: "Your completed live quiz scores, ranks and assessment results."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./signup-CZMOPtgp.mjs");
var Route$10 = createFileRoute("/signup")({
	head: () => ({ meta: [
		{ title: "Sign Up — Path to Qur'anic Understanding" },
		{
			name: "description",
			content: "Create a new student account for the Path to Qur'anic Understanding school portal."
		},
		{
			property: "og:title",
			content: "Sign Up — Path to Qur'anic Understanding"
		},
		{
			property: "og:description",
			content: "Register for a student account on Path to Qur'anic Understanding."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./student-qpRijOHM.mjs");
var Route$9 = createFileRoute("/student")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Student Dashboard — Path to Qur'anic Understanding" },
		{
			name: "description",
			content: "Your enrolled subjects, student record and live class schedule."
		},
		{
			property: "og:title",
			content: "Student Dashboard — Path to Qur'anic Understanding"
		},
		{
			property: "og:description",
			content: "Your enrolled subjects and live classes."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./teacher-CegqqC2F.mjs");
var Route$8 = createFileRoute("/teacher")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Teacher Dashboard — Path to Qur'anic Understanding" },
		{
			name: "description",
			content: "Your teaching profile, assigned subjects and live classes."
		},
		{
			property: "og:title",
			content: "Teacher Dashboard — Path to Qur'anic Understanding"
		},
		{
			property: "og:description",
			content: "Your teaching profile and assigned subjects."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./admin-DO3-t1TV.mjs");
var Route$7 = createFileRoute("/admin/")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Admin Dashboard — Path to Qur'anic Understanding" },
		{
			name: "description",
			content: "School administration overview: students, teachers and subjects."
		},
		{
			property: "og:title",
			content: "Admin Dashboard — Path to Qur'anic Understanding"
		},
		{
			property: "og:description",
			content: "School administration overview."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./enrollments-i8DgMFlc.mjs");
var Route$6 = createFileRoute("/admin/enrollments")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Enrollments — Admin — Path to Qur'anic Understanding" },
		{
			name: "description",
			content: "Enroll students in the 4 active subjects and manage current subject enrollments."
		},
		{
			property: "og:title",
			content: "Enrollments — Admin"
		},
		{
			property: "og:description",
			content: "Enroll students in the 4 active subjects and manage current subject enrollments."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./payments-C3MbjoOw.mjs");
var Route$5 = createFileRoute("/admin/payments")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Payments — Admin — Path to Qur'anic Understanding" },
		{
			name: "description",
			content: "Manage monthly fee rates, student payment amounts, grace periods and status."
		},
		{
			property: "og:title",
			content: "Payments — Admin"
		},
		{
			property: "og:description",
			content: "Manage monthly student fees and payment status."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./results-citrONCj.mjs");
var Route$4 = createFileRoute("/admin/results")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Results — Admin — Path to Qur'anic Understanding" },
		{
			name: "description",
			content: "All students' live quiz scores, ranks and recorded assessment results."
		},
		{
			property: "og:title",
			content: "Results — Admin"
		},
		{
			property: "og:description",
			content: "All students' live quiz scores, ranks and recorded assessment results."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./students-Cb-x-6No.mjs");
var Route$3 = createFileRoute("/admin/students")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Students — Admin — Path to Qur'anic Understanding" },
		{
			name: "description",
			content: "Enrolled students, class names and status."
		},
		{
			property: "og:title",
			content: "Students — Admin"
		},
		{
			property: "og:description",
			content: "Enrolled students, class names and status."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./teachers-DZXaGy1e.mjs");
var Route$2 = createFileRoute("/admin/teachers")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Teachers — Admin — Path to Qur'anic Understanding" },
		{
			name: "description",
			content: "Manage teaching staff and assign which of the 4 active subjects each teacher teaches."
		},
		{
			property: "og:title",
			content: "Teachers — Admin"
		},
		{
			property: "og:description",
			content: "Manage teaching staff and subject assignments."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./quiz-DqTFkV-O.mjs");
var Route$1 = createFileRoute("/quiz/")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Live Quiz — Path to Qur'anic Understanding" },
		{
			name: "description",
			content: "Create, edit and host live quiz sessions across the 4 programme subjects."
		},
		{
			property: "og:title",
			content: "Live Quiz — Path to Qur'anic Understanding"
		},
		{
			property: "og:description",
			content: "Host and manage live quiz sessions."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./join-DmSNh8ri.mjs");
/** Fallback when a question has no timer stored in the database. */
var Route = createFileRoute("/quiz/join")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Join a Live Quiz — Path to Qur'anic Understanding" },
		{
			name: "description",
			content: "Enter the 6-digit quiz PIN from your teacher and a nickname to join the live quiz — no account needed."
		},
		{
			property: "og:title",
			content: "Join a Live Quiz — Path to Qur'anic Understanding"
		},
		{
			property: "og:description",
			content: "Enter the quiz PIN from your teacher to join the live quiz."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$15.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$16
});
var DashboardRoute = Route$14.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$16
});
var LiveClassesRoute = Route$13.update({
	id: "/live-classes",
	path: "/live-classes",
	getParentRoute: () => Route$16
});
var LoginRoute = Route$12.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$16
});
var ResultsRoute = Route$11.update({
	id: "/results",
	path: "/results",
	getParentRoute: () => Route$16
});
var SignupRoute = Route$10.update({
	id: "/signup",
	path: "/signup",
	getParentRoute: () => Route$16
});
var StudentRoute = Route$9.update({
	id: "/student",
	path: "/student",
	getParentRoute: () => Route$16
});
var TeacherRoute = Route$8.update({
	id: "/teacher",
	path: "/teacher",
	getParentRoute: () => Route$16
});
var AdminIndexRoute = Route$7.update({
	id: "/admin/",
	path: "/admin/",
	getParentRoute: () => Route$16
});
var AdminEnrollmentsRoute = Route$6.update({
	id: "/admin/enrollments",
	path: "/admin/enrollments",
	getParentRoute: () => Route$16
});
var AdminPaymentsRoute = Route$5.update({
	id: "/admin/payments",
	path: "/admin/payments",
	getParentRoute: () => Route$16
});
var AdminResultsRoute = Route$4.update({
	id: "/admin/results",
	path: "/admin/results",
	getParentRoute: () => Route$16
});
var AdminStudentsRoute = Route$3.update({
	id: "/admin/students",
	path: "/admin/students",
	getParentRoute: () => Route$16
});
var AdminTeachersRoute = Route$2.update({
	id: "/admin/teachers",
	path: "/admin/teachers",
	getParentRoute: () => Route$16
});
var QuizIndexRoute = Route$1.update({
	id: "/quiz/",
	path: "/quiz/",
	getParentRoute: () => Route$16
});
var rootRouteChildren = {
	IndexRoute,
	DashboardRoute,
	LiveClassesRoute,
	LoginRoute,
	ResultsRoute,
	SignupRoute,
	StudentRoute,
	TeacherRoute,
	AdminEnrollmentsRoute,
	AdminPaymentsRoute,
	AdminResultsRoute,
	AdminStudentsRoute,
	AdminTeachersRoute,
	QuizJoinRoute: Route.update({
		id: "/quiz/join",
		path: "/quiz/join",
		getParentRoute: () => Route$16
	}),
	AdminIndexRoute,
	QuizIndexRoute,
	QuizHostSessionIdRoute: Route$17.update({
		id: "/quiz/host/$sessionId",
		path: "/quiz/host/$sessionId",
		getParentRoute: () => Route$16
	})
};
var routeTree = Route$16._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
