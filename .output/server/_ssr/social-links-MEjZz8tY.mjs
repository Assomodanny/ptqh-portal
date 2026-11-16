import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { b as Facebook, v as Instagram } from "../_libs/lucide-react.mjs";
import { t as contact } from "./contact-DakOy8UC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/social-links-MEjZz8tY.js
var import_jsx_runtime = require_jsx_runtime();
/** Instagram / Facebook links, sourced from `src/data/contact.ts`. */
function SocialLinks({ className, size = "md" }) {
	const box = size === "sm" ? "size-9" : "size-11";
	const icon = size === "sm" ? "size-4" : "size-5";
	const items = [{
		label: "Instagram",
		href: contact.instagramUrl,
		Icon: Instagram
	}, {
		label: "Facebook",
		href: contact.facebookUrl,
		Icon: Facebook
	}];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: cn("flex items-center gap-3", className),
		children: items.map(({ label, href, Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href,
			target: "_blank",
			rel: "noreferrer noopener",
			"aria-label": `${label} (opens in a new tab)`,
			className: cn(box, "grid place-items-center rounded-full border border-border text-muted-foreground transition-colors duration-200 hover:border-amber/70 hover:text-amber"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				className: icon,
				"aria-hidden": "true"
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-label": `${label} — link coming soon`,
			title: "Link coming soon",
			className: cn(box, "grid cursor-not-allowed place-items-center rounded-full border border-border/70 text-muted-foreground/50"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				className: icon,
				"aria-hidden": "true"
			})
		}) }, label))
	});
}
//#endregion
export { SocialLinks as t };
