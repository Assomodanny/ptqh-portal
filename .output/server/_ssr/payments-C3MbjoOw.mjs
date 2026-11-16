import { n as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { f as Pencil, l as Plus, t as X } from "../_libs/lucide-react.mjs";
import { A as formatNaira, C as fetchStudents, F as portalGhostButton, H as setPaymentPaid, I as portalPrimaryButton, L as referenceStudentCode, N as monthStart, P as portalCard, R as referenceTag, W as updatePayment, _ as fetchPayments, i as applyRateToUnpaidMonth, k as formatMonth, n as PortalShell, s as createPayment, t as EmptyState } from "./portal-shell-DqU1YDlN.mjs";
import { t as usePortalRole } from "./use-portal-role-CHoMdNYj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments-C3MbjoOw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FEE_RATE_STORAGE_KEY = "ptqu_monthly_fee_rate";
var DEFAULT_FEE_RATE = 4e3;
function AdminPaymentsPage() {
	const { role } = usePortalRole("admin");
	const queryClient = useQueryClient();
	const [month, setMonth] = (0, import_react.useState)(() => monthStart().slice(0, 7));
	const monthKey = `${month}-01`;
	const [feeRate, setFeeRate] = (0, import_react.useState)(DEFAULT_FEE_RATE);
	const [showCreateForm, setShowCreateForm] = (0, import_react.useState)(false);
	const [editingRow, setEditingRow] = (0, import_react.useState)(null);
	const [newStudentId, setNewStudentId] = (0, import_react.useState)("");
	const [newAmountDue, setNewAmountDue] = (0, import_react.useState)(String(DEFAULT_FEE_RATE));
	const [newAmountPaid, setNewAmountPaid] = (0, import_react.useState)("0");
	const [newReference, setNewReference] = (0, import_react.useState)("");
	const [newIsPaid, setNewIsPaid] = (0, import_react.useState)(false);
	const [newGraceActive, setNewGraceActive] = (0, import_react.useState)(false);
	const [editAmountDue, setEditAmountDue] = (0, import_react.useState)("0");
	const [editAmountPaid, setEditAmountPaid] = (0, import_react.useState)("0");
	const [editReference, setEditReference] = (0, import_react.useState)("");
	const [editIsPaid, setEditIsPaid] = (0, import_react.useState)(false);
	const [editGraceActive, setEditGraceActive] = (0, import_react.useState)(false);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		try {
			const saved = window.localStorage.getItem(FEE_RATE_STORAGE_KEY);
			if (saved) {
				const parsed = Number(saved);
				if (!Number.isNaN(parsed) && parsed >= 0) {
					setFeeRate(parsed);
					setNewAmountDue(String(parsed));
				}
			}
		} catch {}
	}, []);
	const paymentsQuery = useQuery({
		queryKey: ["admin-payments", monthKey],
		queryFn: () => fetchPayments(monthKey),
		enabled: role === "admin"
	});
	const studentsQuery = useQuery({
		queryKey: ["admin-students"],
		queryFn: fetchStudents,
		enabled: role === "admin"
	});
	const students = (0, import_react.useMemo)(() => studentsQuery.data ?? [], [studentsQuery.data]);
	const nameFor = (0, import_react.useMemo)(() => {
		const byRowId = /* @__PURE__ */ new Map();
		const byCode = /* @__PURE__ */ new Map();
		for (const student of students) {
			const label = student.profiles?.full_name ?? student.student_id ?? "Student";
			byRowId.set(student.id, label);
			if (student.student_id) byCode.set(student.student_id, label);
		}
		return (row) => {
			if (row.student_id && byRowId.has(row.student_id)) return byRowId.get(row.student_id);
			const code = referenceStudentCode(row.receipt_reference);
			if (code && byCode.has(code)) return byCode.get(code);
			return code ?? "Unmatched record";
		};
	}, [students]);
	const rows = (0, import_react.useMemo)(() => paymentsQuery.data ?? [], [paymentsQuery.data]);
	const summary = (0, import_react.useMemo)(() => {
		let billed = 0;
		let collected = 0;
		let unpaidCount = 0;
		for (const row of rows) {
			billed += row.amount_due ?? 0;
			collected += row.amount_paid ?? 0;
			if (row.is_paid !== true) unpaidCount += 1;
		}
		return {
			billed,
			collected,
			outstanding: Math.max(billed - collected, 0),
			unpaidCount
		};
	}, [rows]);
	const invalidatePayments = async () => {
		await queryClient.invalidateQueries({ queryKey: ["admin-payments", monthKey] });
		await queryClient.invalidateQueries({ queryKey: ["student-payments"] });
	};
	const toggleMutation = useMutation({
		mutationFn: ({ row, isPaid }) => setPaymentPaid(row, isPaid),
		onMutate: () => setFeedback(null),
		onError: (mutationError) => setFeedback({
			type: "error",
			text: mutationError.message
		}),
		onSuccess: async () => {
			await invalidatePayments();
			setFeedback({
				type: "success",
				text: "Payment status updated."
			});
		}
	});
	const createMutation = useMutation({
		mutationFn: async () => {
			const amountDue = Number(newAmountDue);
			const amountPaid = Number(newAmountPaid);
			if (Number.isNaN(amountDue) || amountDue < 0) throw new Error("Enter a valid amount due.");
			if (Number.isNaN(amountPaid) || amountPaid < 0) throw new Error("Enter a valid amount paid.");
			await createPayment({
				student_id: newStudentId || null,
				month: monthKey,
				amount_due: amountDue,
				amount_paid: amountPaid,
				is_paid: newIsPaid,
				grace_period_active: newGraceActive,
				receipt_reference: newReference.trim() || null
			});
		},
		onMutate: () => setFeedback(null),
		onError: (mutationError) => setFeedback({
			type: "error",
			text: mutationError.message
		}),
		onSuccess: async () => {
			setShowCreateForm(false);
			setNewStudentId("");
			setNewAmountDue(String(feeRate));
			setNewAmountPaid("0");
			setNewReference("");
			setNewIsPaid(false);
			setNewGraceActive(false);
			await invalidatePayments();
			setFeedback({
				type: "success",
				text: "Payment record created."
			});
		}
	});
	const editMutation = useMutation({
		mutationFn: async () => {
			if (!editingRow) return;
			const amountDue = Number(editAmountDue);
			const amountPaid = Number(editAmountPaid);
			if (Number.isNaN(amountDue) || amountDue < 0) throw new Error("Enter a valid amount due.");
			if (Number.isNaN(amountPaid) || amountPaid < 0) throw new Error("Enter a valid amount paid.");
			await updatePayment(editingRow.id, {
				amount_due: amountDue,
				amount_paid: amountPaid,
				is_paid: editIsPaid,
				grace_period_active: editGraceActive,
				receipt_reference: editReference.trim() || null
			});
		},
		onMutate: () => setFeedback(null),
		onError: (mutationError) => setFeedback({
			type: "error",
			text: mutationError.message
		}),
		onSuccess: async () => {
			setEditingRow(null);
			await invalidatePayments();
			setFeedback({
				type: "success",
				text: "Payment record updated."
			});
		}
	});
	const applyRateMutation = useMutation({
		mutationFn: () => applyRateToUnpaidMonth(monthKey, feeRate),
		onMutate: () => setFeedback(null),
		onError: (mutationError) => setFeedback({
			type: "error",
			text: mutationError.message
		}),
		onSuccess: async () => {
			await invalidatePayments();
			setFeedback({
				type: "success",
				text: `Updated amount due to ${formatNaira(feeRate)} for unpaid records in ${formatMonth(monthKey)}.`
			});
		}
	});
	function saveDefaultRate(nextRate) {
		const clean = Math.max(0, Math.round(nextRate));
		setFeeRate(clean);
		setNewAmountDue(String(clean));
		try {
			window.localStorage.setItem(FEE_RATE_STORAGE_KEY, String(clean));
		} catch {}
	}
	function startEditing(row) {
		setFeedback(null);
		setEditingRow(row);
		setEditAmountDue(String(row.amount_due ?? feeRate));
		setEditAmountPaid(String(row.amount_paid ?? 0));
		setEditReference(row.receipt_reference ?? "");
		setEditIsPaid(row.is_paid === true);
		setEditGraceActive(row.grace_period_active === true);
	}
	function handleStudentChange(studentRowId) {
		setNewStudentId(studentRowId);
		const chosen = students.find((s) => s.id === studentRowId);
		if (chosen?.student_id) setNewReference(`${referenceTag(chosen.student_id)} ${month}`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PortalShell, {
		eyebrow: "Administration",
		title: "Payments",
		subtitle: "Control the monthly fee rate, edit payment amounts and grace periods, and mark student fees as paid or unpaid.",
		role: "admin",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin",
				className: "text-sm text-muted-foreground underline underline-offset-4 hover:text-amber",
				children: "← Back to admin dashboard"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					{
						label: "Total billed",
						value: formatNaira(summary.billed),
						accent: false
					},
					{
						label: "Collected",
						value: formatNaira(summary.collected),
						accent: true
					},
					{
						label: "Outstanding",
						value: formatNaira(summary.outstanding),
						accent: false
					},
					{
						label: "Unpaid records",
						value: String(summary.unpaidCount),
						accent: false
					}
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: portalCard,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
						children: item.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: `mt-3 font-display text-2xl font-semibold ${item.accent ? "text-amber" : "text-headline"}`,
						children: item.value
					})]
				}, item.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `${portalCard} mt-8`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs uppercase tracking-[0.18em] text-muted-foreground",
									children: "Month"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "month",
									value: month,
									onChange: (event) => setMonth(event.target.value),
									className: "mt-2 h-11 rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs uppercase tracking-[0.18em] text-muted-foreground",
									children: "Standard monthly rate (₦)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									step: 500,
									value: feeRate,
									onChange: (event) => saveDefaultRate(Number(event.target.value) || 0),
									className: "mt-2 h-11 w-40 rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: applyRateMutation.isPending || summary.unpaidCount === 0,
								onClick: () => applyRateMutation.mutate(),
								className: `${portalGhostButton} disabled:cursor-not-allowed disabled:opacity-50`,
								children: applyRateMutation.isPending ? "Applying…" : `Apply ${formatNaira(feeRate)} to unpaid`
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setFeedback(null);
							setShowCreateForm((v) => !v);
						},
						className: portalPrimaryButton,
						children: showCreateForm ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
							className: "size-4",
							"aria-hidden": "true"
						}), "Close form"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							className: "size-4",
							"aria-hidden": "true"
						}), "Add payment record"] })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-xs text-muted-foreground",
					children: [
						"Showing ",
						formatMonth(monthKey),
						". Unpaid students see the Payment Due screen automatically after the 2-day grace period (unless grace period is active)."
					]
				})]
			}),
			showCreateForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					createMutation.mutate();
				},
				className: `rounded-xl border border-border/90 bg-card/85 p-6 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:border-amber/50 mt-6 space-y-5 border-amber/40`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-lg font-semibold text-headline",
							children: [
								"New payment record (",
								formatMonth(monthKey),
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShowCreateForm(false),
							className: "text-xs text-muted-foreground hover:text-headline",
							children: "Cancel"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs uppercase tracking-[0.18em] text-muted-foreground",
									children: "Student"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: newStudentId,
									onChange: (e) => handleStudentChange(e.target.value),
									className: "mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Select student (or tag via reference)"
									}), students.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: s.id,
										children: [
											s.profiles?.full_name ?? "Student",
											" ",
											s.student_id ? `(${s.student_id})` : ""
										]
									}, s.id))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs uppercase tracking-[0.18em] text-muted-foreground",
									children: "Amount due (₦)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									required: true,
									value: newAmountDue,
									onChange: (e) => setNewAmountDue(e.target.value),
									className: "mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs uppercase tracking-[0.18em] text-muted-foreground",
									children: "Amount paid (₦)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									required: true,
									value: newAmountPaid,
									onChange: (e) => setNewAmountPaid(e.target.value),
									className: "mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs uppercase tracking-[0.18em] text-muted-foreground",
									children: "Reference / Narration"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "[STU001] MNP-TRF-...",
									value: newReference,
									onChange: (e) => setNewReference(e.target.value),
									className: "mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col justify-end gap-2.5 pb-1 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "inline-flex items-center gap-2.5 text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: newIsPaid,
										onChange: (e) => setNewIsPaid(e.target.checked),
										className: "size-4 accent-amber"
									}), "Mark as paid immediately"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "inline-flex items-center gap-2.5 text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: newGraceActive,
										onChange: (e) => setNewGraceActive(e.target.checked),
										className: "size-4 accent-amber"
									}), "Grace period active"]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: createMutation.isPending,
							className: "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-amber px-5 text-sm font-semibold tracking-wide text-primary-foreground shadow-sm transition-colors duration-200 hover:bg-amber-soft",
							children: createMutation.isPending ? "Creating…" : "Create payment"
						})
					})
				]
			}),
			editingRow && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					editMutation.mutate();
				},
				className: `rounded-xl border border-border/90 bg-card/85 p-6 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:border-amber/50 mt-6 space-y-5 border-amber`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.18em] text-amber",
							children: "Editing record"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-display text-lg font-semibold text-headline",
							children: nameFor(editingRow)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setEditingRow(null),
							className: "inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-headline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
								className: "size-4",
								"aria-hidden": "true"
							}), "Cancel"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs uppercase tracking-[0.18em] text-muted-foreground",
									children: "Amount due (₦)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									required: true,
									value: editAmountDue,
									onChange: (e) => setEditAmountDue(e.target.value),
									className: "mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs uppercase tracking-[0.18em] text-muted-foreground",
									children: "Amount paid (₦)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									required: true,
									value: editAmountPaid,
									onChange: (e) => setEditAmountPaid(e.target.value),
									className: "mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs uppercase tracking-[0.18em] text-muted-foreground",
									children: "Receipt / Reference"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: editReference,
									onChange: (e) => setEditReference(e.target.value),
									className: "mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-6 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "inline-flex items-center gap-2.5 text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: editIsPaid,
								onChange: (e) => setEditIsPaid(e.target.checked),
								className: "size-4 accent-amber"
							}), "Paid in full"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "inline-flex items-center gap-2.5 text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: editGraceActive,
								onChange: (e) => setEditGraceActive(e.target.checked),
								className: "size-4 accent-amber"
							}), "Grace period active (do not block student dashboard)"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: editMutation.isPending,
							className: "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-amber px-5 text-sm font-semibold tracking-wide text-primary-foreground shadow-sm transition-colors duration-200 hover:bg-amber-soft",
							children: editMutation.isPending ? "Saving…" : "Save payment changes"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setEditingRow(null),
							className: "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-amber/50 px-5 text-sm font-medium text-amber transition-colors duration-200 hover:border-amber hover:bg-amber/10",
							children: "Cancel"
						})]
					})
				]
			}),
			feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				className: `mt-6 rounded-md border px-4 py-3 text-sm ${feedback.type === "error" ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-amber/40 bg-amber/10 text-amber"}`,
				children: feedback.text
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: paymentsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Loading payments…"
				}) : paymentsQuery.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
					children: paymentsQuery.error.message
				}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "No payment records for this month",
					body: "Use 'Add payment record' above to create fee records for students this month."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-xl border border-border bg-card/80",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[54rem] text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "border-b border-border text-xs uppercase tracking-[0.16em] text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5 font-medium",
									children: "Student"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5 font-medium",
									children: "Reference"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5 font-medium",
									children: "Due"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5 font-medium",
									children: "Paid"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5 font-medium",
									children: "Grace"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5 font-medium",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5 font-medium",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border/50 last:border-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3.5 font-medium text-headline",
									children: nameFor(row)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3.5 text-muted-foreground",
									children: row.receipt_reference ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3.5 text-foreground",
									children: formatNaira(row.amount_due ?? 0)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3.5 text-muted-foreground",
									children: formatNaira(row.amount_paid ?? 0)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3.5 text-xs text-muted-foreground",
									children: row.grace_period_active ? "Active" : "Standard"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${row.is_paid ? "border border-amber/40 bg-amber/10 text-amber" : "border border-destructive/40 bg-destructive/10 text-destructive"}`,
										children: row.is_paid ? "Paid" : "Unpaid"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => startEditing(row),
											className: "inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-xs text-foreground transition-colors hover:border-amber/60 hover:text-amber",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
												className: "size-3",
												"aria-hidden": "true"
											}), "Edit"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											disabled: toggleMutation.isPending,
											onClick: () => toggleMutation.mutate({
												row,
												isPaid: !row.is_paid
											}),
											className: `${portalGhostButton} h-9 px-3.5 text-xs disabled:opacity-60`,
											children: row.is_paid ? "Mark unpaid" : "Mark paid"
										})]
									})
								})
							]
						}, row.id)) })]
					})
				})
			})
		]
	});
}
//#endregion
export { AdminPaymentsPage as component };
