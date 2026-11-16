import { n as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as matchActiveSubjectOption, i as isAllowedSubject } from "./curriculum-rYiZvMsx.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { D as BookOpenCheck, c as Search, i as UserCog, o as Trash2, w as Check } from "../_libs/lucide-react.mjs";
import { B as removeTeacherSubject, I as portalPrimaryButton, P as portalCard, T as fetchTeacherCandidates, a as assignSubjectsToTeacher, n as PortalShell, p as fetchAllTeacherSubjects, t as EmptyState, y as fetchResolvedActiveSubjects } from "./portal-shell-DqU1YDlN.mjs";
import { t as usePortalRole } from "./use-portal-role-CHoMdNYj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/teachers-DZXaGy1e.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminTeachersPage() {
	const { role } = usePortalRole("admin");
	const queryClient = useQueryClient();
	const [selectedKey, setSelectedKey] = (0, import_react.useState)("");
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [checkedKeys, setCheckedKeys] = (0, import_react.useState)([]);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const candidatesQuery = useQuery({
		queryKey: ["admin-teacher-candidates"],
		queryFn: fetchTeacherCandidates,
		enabled: role === "admin"
	});
	const subjectsQuery = useQuery({
		queryKey: ["admin-active-subjects"],
		queryFn: fetchResolvedActiveSubjects,
		enabled: role === "admin"
	});
	const assignmentsQuery = useQuery({
		queryKey: ["admin-teacher-subjects"],
		queryFn: fetchAllTeacherSubjects,
		enabled: role === "admin"
	});
	const candidates = (0, import_react.useMemo)(() => candidatesQuery.data ?? [], [candidatesQuery.data]);
	const activeSubjects = (0, import_react.useMemo)(() => subjectsQuery.data ?? [], [subjectsQuery.data]);
	const allAssignments = (0, import_react.useMemo)(() => assignmentsQuery.data ?? [], [assignmentsQuery.data]);
	const subjectsByTeacherId = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const row of allAssignments) {
			if (row.subjects?.name && !isAllowedSubject(row.subjects.name)) continue;
			const list = map.get(row.teacher_id) ?? [];
			list.push(row);
			map.set(row.teacher_id, list);
		}
		return map;
	}, [allAssignments]);
	const selectedTeacher = (0, import_react.useMemo)(() => {
		if (candidates.length === 0) return null;
		if (selectedKey) return candidates.find((c) => c.selectionKey === selectedKey) ?? candidates[0] ?? null;
		return candidates[0] ?? null;
	}, [candidates, selectedKey]);
	const selectedTeacherAssignments = (0, import_react.useMemo)(() => {
		if (!selectedTeacher?.teacherRowId) return [];
		return subjectsByTeacherId.get(selectedTeacher.teacherRowId) ?? [];
	}, [selectedTeacher, subjectsByTeacherId]);
	const alreadyAssignedOptionKeys = (0, import_react.useMemo)(() => {
		const keys = /* @__PURE__ */ new Set();
		for (const row of selectedTeacherAssignments) {
			const matched = matchActiveSubjectOption(row.subjects?.name) ?? matchActiveSubjectOption(row.subjects?.code);
			if (matched) keys.add(matched.key);
		}
		return keys;
	}, [selectedTeacherAssignments]);
	const filteredCandidates = (0, import_react.useMemo)(() => {
		const q = searchTerm.trim().toLowerCase();
		if (!q) return candidates;
		return candidates.filter((c) => {
			return c.fullName.toLowerCase().includes(q) || (c.email ?? "").toLowerCase().includes(q) || (c.employeeId ?? "").toLowerCase().includes(q);
		});
	}, [candidates, searchTerm]);
	const invalidateAll = async () => {
		await Promise.all([
			queryClient.invalidateQueries({ queryKey: ["admin-teacher-subjects"] }),
			queryClient.invalidateQueries({ queryKey: ["admin-teacher-candidates"] }),
			queryClient.invalidateQueries({ queryKey: ["admin-teachers"] }),
			queryClient.invalidateQueries({ queryKey: ["admin-counts"] }),
			queryClient.invalidateQueries({ queryKey: ["teacher-subjects"] }),
			queryClient.invalidateQueries({ queryKey: ["teacher-row"] })
		]);
	};
	const saveMutation = useMutation({
		mutationFn: async () => {
			if (!selectedTeacher) throw new Error("Please select a teacher first.");
			const subjectIds = checkedKeys.map((key) => activeSubjects.find((item) => item.option.key === key)?.subjectRow?.id).filter((id) => Boolean(id));
			if (subjectIds.length === 0) throw new Error("Tick at least one subject to assign to this teacher.");
			return assignSubjectsToTeacher({
				teacherRowId: selectedTeacher.teacherRowId,
				profileId: selectedTeacher.profileId,
				subjectIds
			});
		},
		onMutate: () => setFeedback(null),
		onError: (err) => setFeedback({
			type: "error",
			text: err.message
		}),
		onSuccess: async (result) => {
			await invalidateAll();
			setSelectedKey(`teacher:${result.teacherRowId}`);
			setCheckedKeys([]);
			setFeedback({
				type: "success",
				text: result.addedCount > 0 ? `Assigned ${result.addedCount} ${result.addedCount === 1 ? "subject" : "subjects"} to ${selectedTeacher?.fullName ?? "teacher"}. Their dashboard will list these subjects right away.` : "Selected subjects are already assigned to this teacher."
			});
		}
	});
	const removeMutation = useMutation({
		mutationFn: ({ teacherId, subjectId }) => removeTeacherSubject(teacherId, subjectId),
		onMutate: () => setFeedback(null),
		onError: (err) => setFeedback({
			type: "error",
			text: err.message
		}),
		onSuccess: async () => {
			await invalidateAll();
			setFeedback({
				type: "success",
				text: "Subject removed from teacher."
			});
		}
	});
	function toggleSubjectKey(key) {
		setCheckedKeys((prev) => prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]);
	}
	function handleSelectTeacher(key) {
		setSelectedKey(key);
		setCheckedKeys([]);
		setFeedback(null);
	}
	const loading = candidatesQuery.isLoading || subjectsQuery.isLoading || assignmentsQuery.isLoading;
	const loadError = candidatesQuery.error ?? subjectsQuery.error ?? assignmentsQuery.error;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		eyebrow: "Administration",
		role: "admin",
		title: "Teachers",
		subtitle: "Manage teaching staff and assign which of the 4 active subjects each teacher teaches.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin",
					className: "inline-block text-sm text-muted-foreground underline underline-offset-4 hover:text-amber",
					children: "← Back to admin dashboard"
				}),
				feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					className: `rounded-lg border px-4 py-3 text-sm ${feedback.type === "error" ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-amber/40 bg-amber/10 text-amber"}`,
					children: feedback.text
				}),
				loadError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
					children: loadError.message
				}) : loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Loading teachers and subjects…"
				}) : candidates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "No teachers yet",
					body: "Teaching staff records will appear here once the administration adds them."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-[1.15fr_0.85fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						"aria-labelledby": "assign-teacher-heading",
						className: portalCard,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, {
									className: "size-5 text-amber",
									"aria-hidden": "true"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									id: "assign-teacher-heading",
									className: "font-display text-xl font-semibold",
									children: "Assign subjects to teacher"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: "Pick a teacher, tick one or more of the 4 active subjects they teach, and save."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 space-y-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "teacher-select",
										className: "text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground",
										children: "Select teacher"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										id: "teacher-select",
										value: selectedTeacher?.selectionKey ?? "",
										onChange: (e) => handleSelectTeacher(e.target.value),
										className: "mt-2 h-11 w-full rounded-md border border-border bg-background px-3.5 text-sm text-headline outline-none transition-colors focus:border-amber",
										children: candidates.map((teacher) => {
											const count = teacher.teacherRowId ? subjectsByTeacherId.get(teacher.teacherRowId)?.length ?? 0 : 0;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
												value: teacher.selectionKey,
												children: [
													teacher.fullName,
													teacher.email ? ` (${teacher.email})` : "",
													count === 0 ? " — No subjects assigned" : ` — ${count} assigned`
												]
											}, teacher.selectionKey);
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground",
										children: "Active subjects (4)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 grid gap-3 sm:grid-cols-2",
										children: activeSubjects.map(({ option, subjectRow }) => {
											const isAssigned = alreadyAssignedOptionKeys.has(option.key);
											const isChecked = checkedKeys.includes(option.key);
											const unavailable = !subjectRow;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: `flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 text-sm transition-colors ${isAssigned ? "border-amber/30 bg-amber/5 opacity-80" : isChecked ? "border-amber bg-amber/12" : "border-border bg-background/50 hover:border-amber/50"} ${unavailable ? "cursor-not-allowed opacity-50" : ""}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													checked: isAssigned || isChecked,
													disabled: isAssigned || unavailable || saveMutation.isPending,
													onChange: () => toggleSubjectKey(option.key),
													className: "mt-0.5 size-4 rounded border-border accent-amber"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "min-w-0 flex-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "block font-medium text-headline",
														children: option.fullLabel
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "mt-1 block text-xs text-muted-foreground",
														children: unavailable ? "Subject record missing in database" : isAssigned ? "Already assigned" : option.code
													})]
												})]
											}, option.key);
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-3 pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											disabled: !selectedTeacher || checkedKeys.length === 0 || saveMutation.isPending,
											onClick: () => saveMutation.mutate(),
											className: `${portalPrimaryButton} disabled:cursor-not-allowed disabled:opacity-50`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
												className: "size-4",
												"aria-hidden": "true"
											}), saveMutation.isPending ? "Saving assignments…" : "Save assignments"]
										}), checkedKeys.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [
												checkedKeys.length,
												" ",
												checkedKeys.length === 1 ? "subject" : "subjects",
												" ",
												"selected"
											]
										})]
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						"aria-labelledby": "selected-teacher-subjects",
						className: portalCard,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpenCheck, {
									className: "size-5 text-amber",
									"aria-hidden": "true"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									id: "selected-teacher-subjects",
									className: "font-display text-xl font-semibold",
									children: "Current subjects"
								})]
							}),
							selectedTeacher && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: [
									"Subjects taught by",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-headline",
										children: selectedTeacher.fullName
									}),
									selectedTeacher.employeeId ? ` (${selectedTeacher.employeeId})` : "",
									"."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5",
								children: selectedTeacherAssignments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-dashed border-border bg-background/40 p-6 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium text-headline",
										children: "No subjects assigned yet"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: "Tick subjects on the left and click Save assignments to assign them."
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-3",
									children: selectedTeacherAssignments.map((assignment) => {
										const label = (matchActiveSubjectOption(assignment.subjects?.name) ?? matchActiveSubjectOption(assignment.subjects?.code))?.fullLabel ?? assignment.subjects?.name ?? "Assigned subject";
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-center justify-between gap-3 rounded-lg border border-border bg-background/60 px-4 py-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "truncate text-sm font-medium text-headline",
													children: label
												}), assignment.subjects?.code && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-0.5 text-xs uppercase tracking-[0.16em] text-amber",
													children: assignment.subjects.code
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												disabled: removeMutation.isPending,
												onClick: () => removeMutation.mutate({
													teacherId: assignment.teacher_id,
													subjectId: assignment.subject_id
												}),
												className: "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-destructive/40 px-2.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
													className: "size-3.5",
													"aria-hidden": "true"
												}), "Remove"]
											})]
										}, `${assignment.teacher_id}-${assignment.subject_id}`);
									})
								})
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-labelledby": "teacher-directory-heading",
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "teacher-directory-heading",
							className: "font-display text-xl font-semibold",
							children: "Teaching staff & assigned subjects"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "View teacher records, manage assigned subjects, or remove an assignment."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full sm:w-72",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
								className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "search",
								value: searchTerm,
								onChange: (e) => setSearchTerm(e.target.value),
								placeholder: "Search teacher name or email…",
								className: "h-10 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm text-headline outline-none transition-colors focus:border-amber"
							})]
						})]
					}), filteredCandidates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "No matching teachers",
						body: "Try clearing the search filter to see all teaching staff."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: filteredCandidates.map((teacher) => {
							const list = teacher.teacherRowId ? subjectsByTeacherId.get(teacher.teacherRowId) ?? [] : [];
							const isSelected = selectedTeacher?.selectionKey === teacher.selectionKey;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `rounded-xl border bg-card/70 p-6 transition-colors ${isSelected ? "border-amber bg-amber/5" : "border-border hover:border-amber/50"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-display text-lg font-semibold text-headline",
												children: teacher.fullName
											}), teacher.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 truncate text-xs text-muted-foreground",
												children: teacher.email
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => handleSelectTeacher(teacher.selectionKey),
											className: `shrink-0 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${isSelected ? "border-amber bg-amber/15 text-amber" : "border-border text-muted-foreground hover:border-amber/60 hover:text-amber"}`,
											children: isSelected ? "Selected" : "Manage"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-4 block h-px w-full bg-amber/30",
										"aria-hidden": "true"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
										className: "mt-4 space-y-2 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between gap-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
													className: "text-muted-foreground",
													children: "Employee ID"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
													className: "text-foreground",
													children: teacher.employeeId ?? "—"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between gap-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
													className: "text-muted-foreground",
													children: "Specialisation"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
													className: "text-foreground",
													children: teacher.specialization ?? "—"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between gap-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
													className: "text-muted-foreground",
													children: "Qualification"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
													className: "text-foreground",
													children: teacher.qualification ?? "—"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between gap-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
													className: "text-muted-foreground",
													children: "Status"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
													className: "text-amber",
													children: teacher.status ?? "—"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-5 border-t border-border/70 pt-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground",
											children: "Assigned subjects"
										}), list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-xs italic text-muted-foreground",
											children: "No subjects assigned yet"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2.5 flex flex-wrap gap-2",
											children: list.map((assignment) => {
												const label = (matchActiveSubjectOption(assignment.subjects?.name) ?? matchActiveSubjectOption(assignment.subjects?.code))?.fullLabel ?? assignment.subjects?.name ?? "Subject";
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-2 rounded-md border border-border bg-background/70 px-2.5 py-1 text-xs text-headline",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														"aria-label": `Remove ${label} from ${teacher.fullName}`,
														disabled: removeMutation.isPending,
														onClick: () => removeMutation.mutate({
															teacherId: assignment.teacher_id,
															subjectId: assignment.subject_id
														}),
														className: "text-muted-foreground transition-colors hover:text-destructive",
														children: "×"
													})]
												}, `${assignment.teacher_id}-${assignment.subject_id}`);
											})
										})]
									})
								]
							}, teacher.selectionKey);
						})
					})]
				})] })
			]
		})
	});
}
//#endregion
export { AdminTeachersPage as component };
