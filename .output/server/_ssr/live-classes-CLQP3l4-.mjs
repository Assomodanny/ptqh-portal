import { n as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { o as useAuth } from "./auth-xPULwznI.mjs";
import { n as ALLOWED_SUBJECTS } from "./curriculum-rYiZvMsx.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { f as Pencil, l as Plus, o as Trash2, t as X } from "../_libs/lucide-react.mjs";
import { D as fetchUserRole, I as portalPrimaryButton, M as formatTimeRange, O as formatDay, P as portalCard, U as updateLiveClass, c as deleteLiveClass, g as fetchLiveClasses, j as formatPlatform, n as PortalShell, o as createLiveClass, t as EmptyState } from "./portal-shell-DqU1YDlN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/live-classes-CLQP3l4-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DAYS_OF_WEEK = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];
var PLATFORMS = [
	"Google Meet",
	"WhatsApp",
	"Zoom"
];
var emptyForm = {
	subject: ALLOWED_SUBJECTS[0],
	day_of_week: "Saturday",
	start_time: "09:00",
	end_time: "10:00",
	platform: "Google Meet",
	join_url: ""
};
function normaliseDayValue(day) {
	if (day === null || day === void 0) return "Saturday";
	if (typeof day === "number" && day >= 0 && day <= 6) return DAYS_OF_WEEK[day] ?? "Saturday";
	const str = String(day).trim();
	const numeric = Number(str);
	if (str !== "" && !Number.isNaN(numeric) && numeric >= 0 && numeric <= 6) return DAYS_OF_WEEK[numeric] ?? "Saturday";
	return DAYS_OF_WEEK.find((d) => d.toLowerCase() === str.toLowerCase()) ?? (str || "Saturday");
}
function normaliseTimeValue(time) {
	if (!time) return "";
	return time.slice(0, 5);
}
function LiveClassesPage() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [form, setForm] = (0, import_react.useState)(emptyForm);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const isAdmin = useQuery({
		queryKey: ["user-role", user?.id],
		queryFn: () => fetchUserRole(user.id),
		enabled: Boolean(user?.id)
	}).data === "admin";
	const classesQuery = useQuery({
		queryKey: ["live-classes"],
		queryFn: fetchLiveClasses
	});
	const saveMutation = useMutation({
		mutationFn: async (input) => {
			const payload = {
				subject: input.subject?.trim() || null,
				day_of_week: input.day_of_week?.trim() || null,
				start_time: input.start_time || null,
				end_time: input.end_time || null,
				platform: input.platform?.trim() || null,
				join_url: input.join_url?.trim() || null
			};
			if (editingId) await updateLiveClass(editingId, payload);
			else await createLiveClass(payload);
		},
		onSuccess: async () => {
			const wasEditing = Boolean(editingId);
			setEditingId(null);
			setForm(emptyForm);
			setFeedback({
				type: "success",
				text: wasEditing ? "Live class schedule updated." : "Live class added to timetable."
			});
			await queryClient.invalidateQueries({ queryKey: ["live-classes"] });
		},
		onError: (error) => setFeedback({
			type: "error",
			text: error.message
		})
	});
	const removeMutation = useMutation({
		mutationFn: (id) => deleteLiveClass(id),
		onSuccess: async (_data, deletedId) => {
			if (editingId === deletedId) {
				setEditingId(null);
				setForm(emptyForm);
			}
			setFeedback({
				type: "success",
				text: "Class removed."
			});
			await queryClient.invalidateQueries({ queryKey: ["live-classes"] });
		},
		onError: (error) => setFeedback({
			type: "error",
			text: error.message
		})
	});
	function startEditing(item) {
		setFeedback(null);
		setEditingId(item.id);
		setForm({
			subject: item.subject ?? ALLOWED_SUBJECTS[0],
			day_of_week: normaliseDayValue(item.day_of_week),
			start_time: normaliseTimeValue(item.start_time),
			end_time: normaliseTimeValue(item.end_time),
			platform: item.platform ?? "Google Meet",
			join_url: item.join_url ?? ""
		});
		document.getElementById("class-form-section")?.scrollIntoView({ behavior: "smooth" });
	}
	function cancelEditing() {
		setEditingId(null);
		setForm(emptyForm);
		setFeedback(null);
	}
	const classes = classesQuery.data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PortalShell, {
		eyebrow: "Timetable",
		title: "Live classes",
		subtitle: "Recurring live sessions with the day, time, subject and platform. Join links open in a new tab — sessions are held on Google Meet or WhatsApp.",
		children: [
			classesQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading the timetable…"
			}) : classesQuery.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
				children: classesQuery.error.message
			}) : classes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No live classes scheduled",
				body: "Once the school administration publishes the timetable, every session will appear here with its join link."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-4 sm:grid-cols-2",
				children: classes.map((item) => {
					const isBeingEdited = editingId === item.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: `${portalCard} ${isBeingEdited ? "border-amber bg-amber/5" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase tracking-[0.2em] text-amber",
									children: formatDay(item.day_of_week)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full border border-border bg-secondary/70 px-2.5 py-0.5 text-[11px] text-muted-foreground",
									children: formatPlatform(item.platform)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-display text-lg font-semibold text-headline",
								children: item.subject ?? "Subject to be confirmed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-sm text-muted-foreground",
								children: formatTimeRange(item.start_time, item.end_time)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex flex-wrap items-center gap-3",
								children: [item.join_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: item.join_url,
									target: "_blank",
									rel: "noreferrer noopener",
									className: portalPrimaryButton,
									children: "Join class"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-muted-foreground",
									children: "Join link pending"
								}), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => startEditing(item),
									className: `inline-flex h-11 items-center justify-center gap-2 rounded-md border border-amber/50 px-5 text-sm font-medium text-amber transition-colors duration-200 hover:border-amber hover:bg-amber/10 h-10 px-4 text-xs`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
										className: "size-3.5",
										"aria-hidden": "true"
									}), "Edit"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: removeMutation.isPending,
									onClick: () => removeMutation.mutate(item.id),
									className: "inline-flex h-10 items-center gap-1.5 rounded-md border border-border px-3 text-xs text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive disabled:opacity-50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
										className: "size-3.5",
										"aria-hidden": "true"
									}), "Remove"]
								})] })]
							})
						]
					}, item.id);
				})
			}),
			feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				className: `mt-6 rounded-md border px-4 py-3 text-sm ${feedback.type === "error" ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-amber/40 bg-amber/10 text-amber"}`,
				children: feedback.text
			}),
			isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "class-form-section",
				"aria-labelledby": "class-form-heading",
				className: `rounded-xl border border-border/90 bg-card/85 p-6 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:border-amber/50 mt-12`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.2em] text-amber",
						children: editingId ? "Editing scheduled class" : "Schedule management"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "class-form-heading",
						className: "mt-1 font-display text-xl font-semibold",
						children: editingId ? "Edit live class day & time" : "Add a live class"
					})] }), editingId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: cancelEditing,
						className: "inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-xs text-muted-foreground transition-colors hover:border-amber/60 hover:text-headline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
							className: "size-3.5",
							"aria-hidden": "true"
						}), "Cancel edit"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-6 grid gap-4 sm:grid-cols-2",
					onSubmit: (event) => {
						event.preventDefault();
						setFeedback(null);
						saveMutation.mutate(form);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
								children: "Subject"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: form.subject ?? ALLOWED_SUBJECTS[0],
								onChange: (event) => setForm((prev) => ({
									...prev,
									subject: event.target.value
								})),
								className: "mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none transition-colors focus:border-amber",
								children: [ALLOWED_SUBJECTS.map((subj) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: subj,
									children: subj
								}, subj)), form.subject && !ALLOWED_SUBJECTS.some((s) => s.toLowerCase() === form.subject?.toLowerCase()) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: form.subject,
									children: form.subject
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
								children: "Day of week"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: form.day_of_week ?? "Saturday",
								onChange: (event) => setForm((prev) => ({
									...prev,
									day_of_week: event.target.value
								})),
								className: "mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none transition-colors focus:border-amber",
								children: DAYS_OF_WEEK.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: day,
									children: day
								}, day))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
								children: "Start time"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "time",
								required: true,
								value: form.start_time ?? "",
								onChange: (event) => setForm((prev) => ({
									...prev,
									start_time: event.target.value
								})),
								className: "mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none transition-colors focus:border-amber"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
								children: "End time"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "time",
								required: true,
								value: form.end_time ?? "",
								onChange: (event) => setForm((prev) => ({
									...prev,
									end_time: event.target.value
								})),
								className: "mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none transition-colors focus:border-amber"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
								children: "Platform"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: form.platform ?? "Google Meet",
								onChange: (event) => setForm((prev) => ({
									...prev,
									platform: event.target.value
								})),
								className: "mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none transition-colors focus:border-amber",
								children: [PLATFORMS.map((platform) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: platform,
									children: platform
								}, platform)), form.platform && !PLATFORMS.some((p) => p.toLowerCase() === form.platform?.toLowerCase()) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: form.platform,
									children: form.platform
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
								children: "Join link"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "url",
								placeholder: "https://meet.google.com/...",
								value: form.join_url ?? "",
								onChange: (event) => setForm((prev) => ({
									...prev,
									join_url: event.target.value
								})),
								className: "mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none transition-colors focus:border-amber"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-3 pt-2 sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: saveMutation.isPending,
								className: "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-amber px-5 text-sm font-semibold tracking-wide text-primary-foreground shadow-sm transition-colors duration-200 hover:bg-amber-soft",
								children: [!editingId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
									className: "size-4",
									"aria-hidden": "true"
								}), saveMutation.isPending ? "Saving…" : editingId ? "Save schedule changes" : "Add class"]
							}), editingId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: cancelEditing,
								className: "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-amber/50 px-5 text-sm font-medium text-amber transition-colors duration-200 hover:border-amber hover:bg-amber/10",
								children: "Cancel"
							})]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { LiveClassesPage as component };
