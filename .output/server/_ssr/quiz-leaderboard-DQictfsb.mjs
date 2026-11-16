import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quiz-leaderboard-DQictfsb.js
var import_jsx_runtime = require_jsx_runtime();
function QuizLeaderboard({ participants, highlightId, emptyLabel = "No one has joined yet.", live = false }) {
	const ranked = [...participants].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
	if (ranked.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: emptyLabel
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-xl border border-border bg-card/80",
		children: [live && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-border/80 bg-background/40 px-4 py-2 text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-2 font-medium uppercase tracking-[0.18em] text-amber",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "size-2 animate-pulse rounded-full bg-amber",
					"aria-hidden": "true"
				}), "Live standings"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-muted-foreground",
				children: [
					ranked.length,
					" ",
					ranked.length === 1 ? "player" : "players"
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "divide-y divide-border",
			children: ranked.map((participant, index) => {
				const isMe = highlightId === participant.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: `flex items-center gap-4 px-4 py-3 text-sm transition-colors ${isMe ? "bg-amber/12" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `grid size-7 shrink-0 place-items-center rounded-full font-display text-sm font-semibold ${index === 0 ? "border border-amber/60 bg-amber/20 text-amber" : "border border-border bg-secondary text-muted-foreground"}`,
							children: index + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1 truncate text-headline",
							children: [participant.student_name ?? "Anonymous", isMe && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 text-xs uppercase tracking-[0.2em] text-amber",
								children: "You"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "shrink-0 font-display text-base font-semibold text-headline",
							children: [
								participant.score ?? 0,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-normal text-muted-foreground",
									children: "pts"
								})
							]
						})
					]
				}, participant.id);
			})
		})]
	});
}
//#endregion
export { QuizLeaderboard as t };
