import { n as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, a as AccordionTrigger$1, i as AccordionItem$1, n as AccordionContent$1, r as AccordionHeader, t as Accordion$1, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { r as curriculum } from "./curriculum-rYiZvMsx.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as ChevronDown, d as Phone, h as Mail, p as MessageCircle } from "../_libs/lucide-react.mjs";
import { i as whatsappHref, n as emailHref, r as phoneHref, t as contact } from "./contact-DakOy8UC.mjs";
import { t as SocialLinks } from "./social-links-MEjZz8tY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C_vp6bUy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* A single curriculum card: ordinal, Arabic title, English title, description.
* Purely presentational — the course object may come from a backend later.
*/
function CurriculumEntry({ course, index }) {
	const ordinal = String(index + 1).padStart(2, "0");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group flex h-full flex-col rounded-lg border border-border bg-card p-6 transition-colors duration-300 hover:border-amber/60 focus-within:border-amber/60 sm:p-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					dir: "rtl",
					lang: "ar",
					className: "min-w-0 font-arabic text-2xl leading-[1.7] text-amber sm:text-[1.7rem]",
					children: course.arabicTitle
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 pt-1 font-display text-sm tabular-nums text-muted-foreground transition-colors duration-300 group-hover:text-amber",
					"aria-hidden": "true",
					children: ordinal
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 text-balance font-display text-lg font-semibold tracking-tight sm:text-xl",
				children: course.englishTitle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 h-px w-10 bg-amber/60",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm leading-relaxed text-muted-foreground",
				children: course.description
			})
		]
	});
}
var Accordion = Accordion$1;
var AccordionItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionItem$1, {
	ref,
	className: cn("border-b", className),
	...props
}));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionHeader, {
	className: "flex",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionTrigger$1, {
		ref,
		className: cn("flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })]
	})
}));
AccordionTrigger.displayName = AccordionTrigger$1.displayName;
var AccordionContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent$1, {
	ref,
	className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("pb-4 pt-0", className),
		children
	})
}));
AccordionContent.displayName = AccordionContent$1.displayName;
var faqs = [
	{
		id: "enrolment",
		question: "How are students enrolled?",
		answer: "Prospective students reach out via WhatsApp to express interest, followed by a brief interview before a place is confirmed."
	},
	{
		id: "assessments",
		question: "How often are assessments held?",
		answer: "Assessments are held monthly to track each student's progress across their enrolled subjects."
	},
	{
		id: "format",
		question: "Is the programme conducted in person or online?",
		answer: "The programme is conducted online — primarily via WhatsApp, with occasional live sessions on Google Meet."
	},
	{
		id: "contact",
		question: "Who do I contact for more information?",
		answer: "You can reach us via WhatsApp or email — see the Contact section below for details."
	}
];
var primaryButton = "inline-flex h-12 items-center justify-center rounded-md bg-amber px-7 text-sm font-semibold tracking-wide text-primary-foreground shadow-sm transition-colors duration-200 hover:bg-amber-soft";
var secondaryButton = "inline-flex h-12 items-center justify-center rounded-md border border-amber/60 px-7 text-sm font-semibold tracking-wide text-amber transition-colors duration-200 hover:border-amber hover:bg-amber/10";
function LandingPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "programme",
		"aria-labelledby": "hero-heading",
		className: "hero-gradient border-b border-border/60",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-3xl text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "inline-flex items-center gap-2 rounded-full border border-amber/40 bg-amber/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-amber",
						children: "Enrolling now"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						id: "hero-heading",
						className: "mt-8 text-balance font-display text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl",
						children: "Path to Qur'anic Understanding"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						dir: "rtl",
						lang: "ar",
						className: "mt-6 font-arabic text-3xl font-normal leading-[1.7] text-amber sm:text-4xl lg:text-5xl",
						children: "طريق فهم القرآن"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-8 max-w-2xl text-balance text-base leading-relaxed text-foreground/90 sm:text-lg",
						children: "A structured programme in the classical Islamic sciences — Arabic grammar (Nahwu), morphology (Sarf), prophetic tradition (Hadith), and As-Sarim Al-Battar — taught so that students read the Qur'an with understanding and act upon what they learn."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								className: primaryButton,
								children: "Sign in to the portal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/signup",
								className: secondaryButton,
								children: "Sign up"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#curriculum",
								className: secondaryButton,
								children: "Explore the curriculum"
							})
						]
					})
				]
			})
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "curriculum",
				"aria-labelledby": "curriculum-heading",
				className: "py-20 sm:py-24 lg:py-28",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-[0.2em] text-amber",
							children: "Curriculum"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "curriculum-heading",
							className: "mt-3 text-balance font-display text-3xl font-semibold sm:text-4xl",
							children: "The subjects we teach"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [curriculum.length, " core subjects, taught as one integrated programme"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid gap-5 sm:grid-cols-2",
					children: curriculum.map((course, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurriculumEntry, {
						course,
						index
					}, course.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "about",
				"aria-labelledby": "about-heading",
				className: "pb-20 sm:pb-24 lg:pb-28",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-border bg-card/90 p-6 shadow-sm sm:p-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-3xl text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-[0.2em] text-amber",
								children: "About"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								id: "about-heading",
								className: "mt-3 text-balance font-display text-3xl font-semibold sm:text-4xl",
								children: "Learning that leads to action"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
								className: "mt-8 border-l-2 border-amber/70 pl-5 text-left sm:pl-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									dir: "rtl",
									lang: "ar",
									className: "font-arabic text-2xl leading-[1.9] text-amber sm:text-3xl",
									children: "نتعلم لنفهم ونفهم لنعمل ونعمل لنرضي به الله"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
									className: "mt-4 text-base leading-relaxed text-foreground/90 sm:text-lg",
									children: "“We learn to understand, understand to act, and act to please Allah.”"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-8 leading-relaxed text-muted-foreground",
								children: "“I love teaching and enlightening people with what Allah has bestowed on me, by His blessing.”"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-10 flex flex-col items-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: "/assets/aistudio/file_000000001f1c81f480c6e33a83b06779_df73c98b.png",
										alt: "Munirudeen, founder and teacher",
										loading: "lazy",
										width: 160,
										height: 160,
										className: "size-32 rounded-full border-2 border-amber/50 object-cover object-top shadow-md sm:size-40"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-5 font-display text-2xl font-semibold",
										children: "Munirudeen"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm uppercase tracking-[0.16em] text-amber",
										children: "Founder & Teacher"
									})
								]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "faq",
				"aria-labelledby": "faq-heading",
				className: "pb-20 sm:pb-24 lg:pb-28",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.2em] text-amber",
						children: "Frequently asked"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "faq-heading",
						className: "mt-3 text-balance font-display text-3xl font-semibold sm:text-4xl",
						children: "Questions about the programme"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
					type: "single",
					collapsible: true,
					className: "mt-10 w-full",
					children: faqs.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
						value: item.id,
						className: "border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
							className: "py-6 text-left font-display text-lg font-medium hover:text-amber hover:no-underline sm:text-xl [&>svg]:size-5 [&>svg]:text-amber",
							children: item.question
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
							className: "pb-6 text-base leading-relaxed text-muted-foreground",
							children: item.answer
						})]
					}, item.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "contact",
				"aria-labelledby": "contact-heading",
				className: "pb-20 sm:pb-24 lg:pb-28",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-border bg-card/90 p-6 shadow-sm sm:p-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-10 lg:grid-cols-2 lg:gap-14",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-[0.2em] text-amber",
								children: "Contact"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								id: "contact-heading",
								className: "mt-3 text-balance font-display text-3xl font-semibold sm:text-4xl",
								children: "Speak with the school"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 leading-relaxed text-muted-foreground",
								children: "For enrolment enquiries or questions about the programme, reach us on WhatsApp or by email. Enrolment is handled by the school administration."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialLinks, { className: "mt-8" })
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: phoneHref,
									className: "group flex items-center gap-4 rounded-lg border border-border px-5 py-5 transition-colors duration-200 hover:border-amber/70 hover:bg-secondary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
										className: "size-5 shrink-0 text-amber",
										"aria-hidden": "true"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-sm font-semibold text-headline",
											children: "Call the school"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-sm text-muted-foreground",
											children: contact.phoneNumber
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: whatsappHref,
									target: "_blank",
									rel: "noreferrer noopener",
									className: "group flex items-center gap-4 rounded-lg border border-amber/50 bg-amber/10 px-5 py-5 transition-colors duration-200 hover:border-amber hover:bg-amber/20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
										className: "size-5 shrink-0 text-amber",
										"aria-hidden": "true"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-sm font-semibold text-headline",
											children: "Chat on WhatsApp"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-sm text-muted-foreground",
											children: contact.whatsappNumber
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: emailHref,
									className: "group flex items-center gap-4 rounded-lg border border-border px-5 py-5 transition-colors duration-200 hover:border-amber/70 hover:bg-secondary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
										className: "size-5 shrink-0 text-amber",
										"aria-hidden": "true"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-sm font-semibold text-headline",
											children: "Send an email"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-sm text-muted-foreground",
											children: contact.email
										})]
									})]
								})
							]
						})]
					})
				})
			})
		]
	})] });
}
//#endregion
export { LandingPage as component };
