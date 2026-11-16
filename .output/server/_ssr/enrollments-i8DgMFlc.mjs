import { n as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as matchActiveSubjectOption, i as isAllowedSubject } from "./curriculum-rYiZvMsx.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { O as BookCheck, c as Search, o as Trash2, r as UserPlus, w as Check } from "../_libs/lucide-react.mjs";
import { I as portalPrimaryButton, P as portalCard, f as fetchAllEnrollments, l as enrollStudentInSubjects, n as PortalShell, t as EmptyState, x as fetchStudentCandidates, y as fetchResolvedActiveSubjects, z as removeEnrollment } from "./portal-shell-DqU1YDlN.mjs";
import { t as usePortalRole } from "./use-portal-role-CHoMdNYj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/enrollments-i8DgMFlc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminEnrollmentsPage() {
	const { role } = usePortalRole("admin");
	const queryClient = useQueryClient();
	const [selectedKey, setSelectedKey] = (0, import_react.useState)("");
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [checkedKeys, setCheckedKeys] = (0, import_react.useState)([]);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const candidatesQuery = useQuery({
		queryKey: ["admin-student-candidates"],
		queryFn: fetchStudentCandidates,
		enabled: role === "admin"
	});
	const subjectsQuery = useQuery({
		queryKey: ["admin-active-subjects"],
		queryFn: fetchResolvedActiveSubjects,
		enabled: role === "admin"
	});
	const enrollmentsQuery = useQuery({
		queryKey: ["admin-enrollments"],
		queryFn: fetchAllEnrollments,
		enabled: role === "admin"
	});
	const candidates = (0, import_react.useMemo)(() => candidatesQuery.data ?? [], [candidatesQuery.data]);
	const activeSubjects = (0, import_react.useMemo)(() => subjectsQuery.data ?? [], [subjectsQuery.data]);
	const allEnrollments = (0, import_react.useMemo)(() => enrollmentsQuery.data ?? [], [enrollmentsQuery.data]);
	const enrollmentsByStudentId = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const row of allEnrollments) {
			if (row.status === "inactive") continue;
			if (row.subjects?.name && !isAllowedSubject(row.subjects.name)) continue;
			const list = map.get(row.student_id) ?? [];
			list.push(row);
			map.set(row.student_id, list);
		}
		return map;
	}, [allEnrollments]);
	const selectedStudent = (0, import_react.useMemo)(() => {
		if (candidates.length === 0) return null;
		if (selectedKey) return candidates.find((c) => c.selectionKey === selectedKey) ?? candidates[0] ?? null;
		return candidates[0] ?? null;
	}, [candidates, selectedKey]);
	const selectedStudentEnrollments = (0, import_react.useMemo)(() => {
		if (!selectedStudent?.studentRowId) return [];
		return enrollmentsByStudentId.get(selectedStudent.studentRowId) ?? [];
	}, [selectedStudent, enrollmentsByStudentId]);
	const alreadyEnrolledOptionKeys = (0, import_react.useMemo)(() => {
		const keys = /* @__PURE__ */ new Set();
		for (const row of selectedStudentEnrollments) {
			if (row.status === "inactive") continue;
			const matched = matchActiveSubjectOption(row.subjects?.name) ?? matchActiveSubjectOption(row.subjects?.code);
			if (matched) keys.add(matched.key);
		}
		return keys;
	}, [selectedStudentEnrollments]);
	const filteredCandidates = (0, import_react.useMemo)(() => {
		const q = searchTerm.trim().toLowerCase();
		if (!q) return candidates;
		return candidates.filter((c) => {
			return c.fullName.toLowerCase().includes(q) || (c.email ?? "").toLowerCase().includes(q) || (c.studentCode ?? "").toLowerCase().includes(q);
		});
	}, [candidates, searchTerm]);
	const invalidateAll = async () => {
		await Promise.all([
			queryClient.invalidateQueries({ queryKey: ["admin-enrollments"] }),
			queryClient.invalidateQueries({ queryKey: ["admin-student-candidates"] }),
			queryClient.invalidateQueries({ queryKey: ["admin-students"] }),
			queryClient.invalidateQueries({ queryKey: ["admin-counts"] }),
			queryClient.invalidateQueries({ queryKey: ["enrollments"] }),
			queryClient.invalidateQueries({ queryKey: ["student-row"] })
		]);
	};
	const saveMutation = useMutation({
		mutationFn: async () => {
			if (!selectedStudent) throw new Error("Please select a student first.");
			const subjectIds = checkedKeys.map((key) => activeSubjects.find((item) => item.option.key === key)?.subjectRow?.id).filter((id) => Boolean(id));
			if (subjectIds.length === 0) throw new Error("Tick at least one subject to enroll the student.");
			return enrollStudentInSubjects({
				studentRowId: selectedStudent.studentRowId,
				profileId: selectedStudent.profileId,
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
			setSelectedKey(`student:${result.studentRowId}`);
			setCheckedKeys([]);
			setFeedback({
				type: "success",
				text: result.addedCount > 0 ? `Enrolled ${selectedStudent?.fullName ?? "student"} in ${result.addedCount} ${result.addedCount === 1 ? "subject" : "subjects"}. Their dashboard will update immediately.` : "Selected subjects are already enrolled for this student."
			});
		}
	});
	const removeMutation = useMutation({
		mutationFn: (enrollmentId) => removeEnrollment(enrollmentId),
		onMutate: () => setFeedback(null),
		onError: (err) => setFeedback({
			type: "error",
			text: err.message
		}),
		onSuccess: async () => {
			await invalidateAll();
			setFeedback({
				type: "success",
				text: "Subject enrollment removed."
			});
		}
	});
	function toggleSubjectKey(key) {
		setCheckedKeys((prev) => prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]);
	}
	function handleSelectStudent(key) {
		setSelectedKey(key);
		setCheckedKeys([]);
		setFeedback(null);
	}
	const loading = candidatesQuery.isLoading || subjectsQuery.isLoading || enrollmentsQuery.isLoading;
	const loadError = candidatesQuery.error ?? subjectsQuery.error ?? enrollmentsQuery.error;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
		eyebrow: "Administration",
		role: "admin",
		title: "Student enrollments",
		subtitle: "Assign students to the 4 active subjects and manage their current enrollments.",
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
					children: "Loading students and subjects…"
				}) : candidates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "No students found",
					body: "Once students register or are added to the portal, you can enroll them in subjects here."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-[1.15fr_0.85fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						"aria-labelledby": "enroll-form-heading",
						className: portalCard,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, {
									className: "size-5 text-amber",
									"aria-hidden": "true"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									id: "enroll-form-heading",
									className: "font-display text-xl font-semibold",
									children: "Enroll a student"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: "Choose a student, tick one or more of the 4 active subjects, and save."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 space-y-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "student-select",
										className: "text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground",
										children: "Select student"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										id: "student-select",
										value: selectedStudent?.selectionKey ?? "",
										onChange: (e) => handleSelectStudent(e.target.value),
										className: "mt-2 h-11 w-full rounded-md border border-border bg-background px-3.5 text-sm text-headline outline-none transition-colors focus:border-amber",
										children: candidates.map((student) => {
											const count = student.studentRowId ? (enrollmentsByStudentId.get(student.studentRowId) ?? []).filter((r) => r.status !== "inactive").length : 0;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
												value: student.selectionKey,
												children: [
													student.fullName,
													student.email ? ` (${student.email})` : "",
													count === 0 ? " — Pending enrollment" : ` — ${count} enrolled`
												]
											}, student.selectionKey);
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground",
										children: "Active subjects (4)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 grid gap-3 sm:grid-cols-2",
										children: activeSubjects.map(({ option, subjectRow }) => {
											const isEnrolled = alreadyEnrolledOptionKeys.has(option.key);
											const isChecked = checkedKeys.includes(option.key);
											const unavailable = !subjectRow;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: `flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 text-sm transition-colors ${isEnrolled ? "border-amber/30 bg-amber/5 opacity-80" : isChecked ? "border-amber bg-amber/12" : "border-border bg-background/50 hover:border-amber/50"} ${unavailable ? "cursor-not-allowed opacity-50" : ""}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													checked: isEnrolled || isChecked,
													disabled: isEnrolled || unavailable || saveMutation.isPending,
													onChange: () => toggleSubjectKey(option.key),
													className: "mt-0.5 size-4 rounded border-border accent-amber"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "min-w-0 flex-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "block font-medium text-headline",
														children: option.fullLabel
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "mt-1 block text-xs text-muted-foreground",
														children: unavailable ? "Subject record missing in database" : isEnrolled ? "Already enrolled" : option.code
													})]
												})]
											}, option.key);
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-3 pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											disabled: !selectedStudent || checkedKeys.length === 0 || saveMutation.isPending,
											onClick: () => saveMutation.mutate(),
											className: `${portalPrimaryButton} disabled:cursor-not-allowed disabled:opacity-50`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
												className: "size-4",
												"aria-hidden": "true"
											}), saveMutation.isPending ? "Saving enrollments…" : "Save enrollments"]
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
						"aria-labelledby": "selected-student-subjects",
						className: portalCard,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookCheck, {
									className: "size-5 text-amber",
									"aria-hidden": "true"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									id: "selected-student-subjects",
									className: "font-display text-xl font-semibold",
									children: "Current subjects"
								})]
							}),
							selectedStudent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: [
									"Showing enrolled subjects for",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-headline",
										children: selectedStudent.fullName
									}),
									selectedStudent.studentCode ? ` (${selectedStudent.studentCode})` : "",
									"."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5",
								children: selectedStudentEnrollments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-dashed border-border bg-background/40 p-6 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium text-headline",
										children: "No subjects enrolled yet"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: "Tick subjects on the left and click Save enrollments to assign them."
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-3",
									children: selectedStudentEnrollments.map((enrollment) => {
										const label = (matchActiveSubjectOption(enrollment.subjects?.name) ?? matchActiveSubjectOption(enrollment.subjects?.code))?.fullLabel ?? enrollment.subjects?.name ?? "Enrolled subject";
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-center justify-between gap-3 rounded-lg border border-border bg-background/60 px-4 py-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "truncate text-sm font-medium text-headline",
													children: label
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-0.5 text-xs uppercase tracking-[0.16em] text-amber",
													children: enrollment.status ?? "active"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												disabled: removeMutation.isPending,
												onClick: () => removeMutation.mutate(enrollment.id),
												className: "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-destructive/40 px-2.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
													className: "size-3.5",
													"aria-hidden": "true"
												}), "Remove"]
											})]
										}, enrollment.id);
									})
								})
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-labelledby": "all-enrollments-heading",
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "all-enrollments-heading",
							className: "font-display text-xl font-semibold",
							children: "All students & current subjects"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Click any student to select them above, or remove an existing subject directly."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full sm:w-72",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
								className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "search",
								value: searchTerm,
								onChange: (e) => setSearchTerm(e.target.value),
								placeholder: "Search student name or email…",
								className: "h-10 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm text-headline outline-none transition-colors focus:border-amber"
							})]
						})]
					}), filteredCandidates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "No matching students",
						body: "Try clearing the search filter to see all students."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto rounded-xl border border-border bg-card/70",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[46rem] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "border-b border-border text-xs uppercase tracking-[0.16em] text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 font-medium",
										children: "Student"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 font-medium",
										children: "Current subjects"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-right font-medium",
										children: "Action"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filteredCandidates.map((student) => {
								const list = student.studentRowId ? enrollmentsByStudentId.get(student.studentRowId) ?? [] : [];
								const isSelected = selectedStudent?.selectionKey === student.selectionKey;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: `border-b border-border/50 last:border-0 ${isSelected ? "bg-amber/5" : ""}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-4 py-3.5 align-top",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-medium text-headline",
													children: student.fullName
												}),
												student.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground",
													children: student.email
												}),
												student.studentCode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-0.5 text-[11px] uppercase tracking-[0.16em] text-amber",
													children: student.studentCode
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3.5 align-top",
											children: list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs italic text-muted-foreground",
												children: "Pending enrollment"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex flex-wrap gap-2",
												children: list.map((enrollment) => {
													const label = (matchActiveSubjectOption(enrollment.subjects?.name) ?? matchActiveSubjectOption(enrollment.subjects?.code))?.fullLabel ?? enrollment.subjects?.name ?? "Subject";
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "inline-flex items-center gap-2 rounded-md border border-border bg-background/70 px-2.5 py-1 text-xs text-headline",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															"aria-label": `Remove ${label} from ${student.fullName}`,
															disabled: removeMutation.isPending,
															onClick: () => removeMutation.mutate(enrollment.id),
															className: "text-muted-foreground transition-colors hover:text-destructive",
															children: "×"
														})]
													}, enrollment.id);
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3.5 text-right align-top",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => handleSelectStudent(student.selectionKey),
												className: `rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${isSelected ? "border-amber bg-amber/15 text-amber" : "border-border text-muted-foreground hover:border-amber/60 hover:text-amber"}`,
												children: isSelected ? "Selected" : "Enroll"
											})
										})
									]
								}, student.selectionKey);
							}) })]
						})
					})]
				})] })
			]
		})
	});
}
//#endregion
export { AdminEnrollmentsPage as component };
