globalThis.__nitro_main__ = import.meta.url;
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/apple-touch-icon.png": {
		"type": "image/png",
		"etag": "\"4fdb-5gsWG7A5tI/z/cA7DgDdLy1qBU4\"",
		"mtime": "2026-11-16T18:48:04.000Z",
		"size": 20443,
		"path": "../public/apple-touch-icon.png"
	},
	"/favicon.png": {
		"type": "image/png",
		"etag": "\"4b38-/rYHUCMs1My7x8wRBq0JcROUhA8\"",
		"mtime": "2026-11-16T18:48:04.000Z",
		"size": 19256,
		"path": "../public/favicon.png"
	},
	"/manifest.webmanifest": {
		"type": "application/manifest+json",
		"etag": "\"26a-qlAScxbktMagHd4RajdnonSChlc\"",
		"mtime": "2026-11-16T18:48:04.000Z",
		"size": 618,
		"path": "../public/manifest.webmanifest"
	},
	"/pwa-192x192.png": {
		"type": "image/png",
		"etag": "\"1f8a-PuoW4v4xhtYf3c2StFPY/nEPVWg\"",
		"mtime": "2026-11-16T18:48:04.000Z",
		"size": 8074,
		"path": "../public/pwa-192x192.png"
	},
	"/pwa-512x512.png": {
		"type": "image/png",
		"etag": "\"2e38-r8Ci3vG2x4HILNDRrPxSuJjhEF4\"",
		"mtime": "2026-11-16T18:48:04.000Z",
		"size": 11832,
		"path": "../public/pwa-512x512.png"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-11-16T18:48:04.000Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/admin-BORd5o8a.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d26-VYIT8uwMuWtxjWR6BLFV0AEM36Q\"",
		"mtime": "2026-11-16T21:28:01.419Z",
		"size": 3366,
		"path": "../public/assets/admin-BORd5o8a.js"
	},
	"/assets/check-D-RmDy7O.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"71-pWIl0OYU/ssOLytVZBxfJ/rV40w\"",
		"mtime": "2026-11-16T21:28:01.419Z",
		"size": 113,
		"path": "../public/assets/check-D-RmDy7O.js"
	},
	"/assets/curriculum-BS0U3PWu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3278-vx2CM4iD02FRDkJdixffjUnBz8o\"",
		"mtime": "2026-11-16T21:28:01.419Z",
		"size": 12920,
		"path": "../public/assets/curriculum-BS0U3PWu.js"
	},
	"/assets/dashboard-CTEg4C8x.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"653-JAPk/I3PQOoKABskANRm2vzUuhg\"",
		"mtime": "2026-11-16T21:28:01.419Z",
		"size": 1619,
		"path": "../public/assets/dashboard-CTEg4C8x.js"
	},
	"/assets/enrollments-B-BKiGIL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"31a7-xi70ORhSPWbapvoMsNg+qRkDiV4\"",
		"mtime": "2026-11-16T21:28:01.419Z",
		"size": 12711,
		"path": "../public/assets/enrollments-B-BKiGIL.js"
	},
	"/assets/host._sessionId-D_Wut4fY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b18-8820CkcibYnY9WtNMLivCSl2YfI\"",
		"mtime": "2026-11-16T21:28:01.419Z",
		"size": 6936,
		"path": "../public/assets/host._sessionId-D_Wut4fY.js"
	},
	"/assets/join-BDA7ybo_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2044-8l0MgX9sVmpqARNdXkYObyW+QXc\"",
		"mtime": "2026-11-16T21:28:01.419Z",
		"size": 8260,
		"path": "../public/assets/join-BDA7ybo_.js"
	},
	"/assets/link-Zvhf9csD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c18-r0+W9oQxTRbUeuAY4qd10gF5LFg\"",
		"mtime": "2026-11-16T21:28:01.419Z",
		"size": 35864,
		"path": "../public/assets/link-Zvhf9csD.js"
	},
	"/assets/live-classes-Bp7dgRjm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2696-qCMKxhaS/bAWHbHsv0OWpdKWJKI\"",
		"mtime": "2026-11-16T21:28:01.419Z",
		"size": 9878,
		"path": "../public/assets/live-classes-Bp7dgRjm.js"
	},
	"/assets/login-kBllG3TV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12a7-CA3pChhiv4Yp5brUxp195qKsvWY\"",
		"mtime": "2026-11-16T21:28:01.440Z",
		"size": 4775,
		"path": "../public/assets/login-kBllG3TV.js"
	},
	"/assets/payments-CTmB2ZZK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f80-toSxW0otuxzBsEy0DWSmuDOoucE\"",
		"mtime": "2026-11-16T21:28:01.441Z",
		"size": 16256,
		"path": "../public/assets/payments-CTmB2ZZK.js"
	},
	"/assets/plus-D2Xlnz0N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16d-+Q4TsqZP7RbbCkd0su6MA9x6rYc\"",
		"mtime": "2026-11-16T21:28:01.442Z",
		"size": 365,
		"path": "../public/assets/plus-D2Xlnz0N.js"
	},
	"/assets/portal-shell-DUI93nhn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10276-ssFfbkmoZbLzKDsEM6JAKhD6zL0\"",
		"mtime": "2026-11-16T21:28:01.443Z",
		"size": 66166,
		"path": "../public/assets/portal-shell-DUI93nhn.js"
	},
	"/assets/quiz-BKpYos-n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2e47-n8vRwXcZeKT7jkMXj2unKIpuOCA\"",
		"mtime": "2026-11-16T21:28:01.445Z",
		"size": 11847,
		"path": "../public/assets/quiz-BKpYos-n.js"
	},
	"/assets/quiz-Cur6S9my.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"431b-QFkF1zN/Bf5kCXOd0KvnDo1VjP0\"",
		"mtime": "2026-11-16T21:28:01.446Z",
		"size": 17179,
		"path": "../public/assets/quiz-Cur6S9my.js"
	},
	"/assets/quiz-leaderboard-BEkd7AT4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6f9-GI1DHbMDr6fsOhm1y1EQFVXA40o\"",
		"mtime": "2026-11-16T21:28:01.454Z",
		"size": 1785,
		"path": "../public/assets/quiz-leaderboard-BEkd7AT4.js"
	},
	"/assets/results-CIm8ygOm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a0a-aY5mJKftrew/OG/2yZW7WSZi8bg\"",
		"mtime": "2026-11-16T21:28:01.469Z",
		"size": 10762,
		"path": "../public/assets/results-CIm8ygOm.js"
	},
	"/assets/results-CNf8TGIN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26cc-PjdPPe3Y2iZ5tmnx7DmI10fJcY8\"",
		"mtime": "2026-11-16T21:28:01.469Z",
		"size": 9932,
		"path": "../public/assets/results-CNf8TGIN.js"
	},
	"/assets/index-CgkbYKzX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"96ada-e0ejWjs1JbTYl/vUasJ6R0y4EZk\"",
		"mtime": "2026-11-16T21:28:01.419Z",
		"size": 617178,
		"path": "../public/assets/index-CgkbYKzX.js"
	},
	"/assets/routes-4HF8TP53.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"665d-FjMwsRSXcOmLn5pAgOSoPokilAM\"",
		"mtime": "2026-11-16T21:28:01.469Z",
		"size": 26205,
		"path": "../public/assets/routes-4HF8TP53.js"
	},
	"/assets/search-BrRK2G5p.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a3-0O95OssLzEwpY9kjvEatGNVUZbM\"",
		"mtime": "2026-11-16T21:28:01.469Z",
		"size": 163,
		"path": "../public/assets/search-BrRK2G5p.js"
	},
	"/assets/signup-Dpr79RBV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c55-HlsAltpt8+KhJqENeYYPvy8KFI8\"",
		"mtime": "2026-11-16T21:28:01.469Z",
		"size": 7253,
		"path": "../public/assets/signup-Dpr79RBV.js"
	},
	"/assets/student-CF5cH1cO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2179-Yl6nyfnUfg3SwwNjPscpbdWY1J0\"",
		"mtime": "2026-11-16T21:28:01.469Z",
		"size": 8569,
		"path": "../public/assets/student-CF5cH1cO.js"
	},
	"/assets/students-Bw-f2tx6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a6-oXDZID/g5r8SgKE/ddFnNW5P3rg\"",
		"mtime": "2026-11-16T21:28:01.486Z",
		"size": 2214,
		"path": "../public/assets/students-Bw-f2tx6.js"
	},
	"/assets/styles-xA5l98We.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"170db-8SVMybWOi4A/o96AZ7qFDxxpcmo\"",
		"mtime": "2026-11-16T21:28:01.503Z",
		"size": 94427,
		"path": "../public/assets/styles-xA5l98We.css"
	},
	"/assets/teacher-3jgba8cl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10b3-ObI0XKmuNNKj013W/A85g0TAysU\"",
		"mtime": "2026-11-16T21:28:01.486Z",
		"size": 4275,
		"path": "../public/assets/teacher-3jgba8cl.js"
	},
	"/assets/teachers-BuDT974E.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"36f9-W+jqsDlui1b8nsL/+6HId6dSNnU\"",
		"mtime": "2026-11-16T21:28:01.486Z",
		"size": 14073,
		"path": "../public/assets/teachers-BuDT974E.js"
	},
	"/assets/trash-2-D9AC__BZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13d-DequlNkpbEfVYZ4SLoo6F49Jz/I\"",
		"mtime": "2026-11-16T21:28:01.486Z",
		"size": 317,
		"path": "../public/assets/trash-2-D9AC__BZ.js"
	},
	"/assets/trophy-DI5Sn1nq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d1-bnWBfDAP7URNiLA5bH7OMz8K3lg\"",
		"mtime": "2026-11-16T21:28:01.503Z",
		"size": 465,
		"path": "../public/assets/trophy-DI5Sn1nq.js"
	},
	"/assets/use-portal-role-YPv6qpp1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"264-htGvJFIwR/Bw3ZA9lQGoeIaln40\"",
		"mtime": "2026-11-16T21:28:01.503Z",
		"size": 612,
		"path": "../public/assets/use-portal-role-YPv6qpp1.js"
	},
	"/assets/useMutation-22-sAU9B.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"910-HkinbVq+3skenhFXoi83rVsgvH8\"",
		"mtime": "2026-11-16T21:28:01.503Z",
		"size": 2320,
		"path": "../public/assets/useMutation-22-sAU9B.js"
	},
	"/assets/aistudio/quranic-path-portal-main__2__983bd672.zip": {
		"type": "application/zip",
		"etag": "\"3f6d0-Co+9jCsHJ+qmoF2/2fcZLZ/3gnk\"",
		"mtime": "2026-11-16T18:48:04.000Z",
		"size": 259792,
		"path": "../public/assets/aistudio/quranic-path-portal-main__2__983bd672.zip"
	},
	"/assets/aistudio/file_000000001f1c81f480c6e33a83b06779_df73c98b.png": {
		"type": "image/png",
		"etag": "\"1b0f19-9wd82F9aTkAiEunWZKLCu+q9VZk\"",
		"mtime": "2026-11-16T18:48:04.000Z",
		"size": 1773337,
		"path": "../public/assets/aistudio/file_000000001f1c81f480c6e33a83b06779_df73c98b.png"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_MoPGJc = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_MoPGJc
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
