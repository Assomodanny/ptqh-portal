import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, X } from "lucide-react";

import {
  EmptyState,
  PortalShell,
  portalCard,
  portalGhostButton,
  portalPrimaryButton,
} from "@/components/portal-shell";
import {
  applyRateToUnpaidMonth,
  createPayment,
  fetchPayments,
  fetchStudents,
  formatMonth,
  formatNaira,
  monthStart,
  referenceStudentCode,
  referenceTag,
  setPaymentPaid,
  updatePayment,
  type PaymentRow,
} from "@/lib/portal";
import { usePortalRole } from "@/lib/use-portal-role";

const FEE_RATE_STORAGE_KEY = "ptqu_monthly_fee_rate";
const DEFAULT_FEE_RATE = 4000;

export const Route = createFileRoute("/admin/payments")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Payments — Admin — Path to Qur'anic Understanding" },
      {
        name: "description",
        content: "Manage monthly fee rates, student payment amounts, grace periods and status.",
      },
      { property: "og:title", content: "Payments — Admin" },
      { property: "og:description", content: "Manage monthly student fees and payment status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPaymentsPage,
});

function AdminPaymentsPage() {
  const { role } = usePortalRole("admin");
  const queryClient = useQueryClient();
  const [month, setMonth] = useState(() => monthStart().slice(0, 7));
  const monthKey = `${month}-01`;

  const [feeRate, setFeeRate] = useState<number>(DEFAULT_FEE_RATE);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRow, setEditingRow] = useState<PaymentRow | null>(null);

  // Create form state
  const [newStudentId, setNewStudentId] = useState("");
  const [newAmountDue, setNewAmountDue] = useState(String(DEFAULT_FEE_RATE));
  const [newAmountPaid, setNewAmountPaid] = useState("0");
  const [newReference, setNewReference] = useState("");
  const [newIsPaid, setNewIsPaid] = useState(false);
  const [newGraceActive, setNewGraceActive] = useState(false);

  // Edit form state
  const [editAmountDue, setEditAmountDue] = useState("0");
  const [editAmountPaid, setEditAmountPaid] = useState("0");
  const [editReference, setEditReference] = useState("");
  const [editIsPaid, setEditIsPaid] = useState(false);
  const [editGraceActive, setEditGraceActive] = useState(false);

  const [feedback, setFeedback] = useState<{ type: "error" | "success"; text: string } | null>(
    null,
  );

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(FEE_RATE_STORAGE_KEY);
      if (saved) {
        const parsed = Number(saved);
        if (!Number.isNaN(parsed) && parsed >= 0) {
          setFeeRate(parsed);
          setNewAmountDue(String(parsed));
        }
      }
    } catch {
      // Ignore storage failures
    }
  }, []);

  const paymentsQuery = useQuery({
    queryKey: ["admin-payments", monthKey],
    queryFn: () => fetchPayments(monthKey),
    enabled: role === "admin",
  });

  const studentsQuery = useQuery({
    queryKey: ["admin-students"],
    queryFn: fetchStudents,
    enabled: role === "admin",
  });

  const students = useMemo(() => studentsQuery.data ?? [], [studentsQuery.data]);

  const nameFor = useMemo(() => {
    const byRowId = new Map<string, string>();
    const byCode = new Map<string, string>();
    for (const student of students) {
      const label = student.profiles?.full_name ?? student.student_id ?? "Student";
      byRowId.set(student.id, label);
      if (student.student_id) byCode.set(student.student_id, label);
    }
    return (row: PaymentRow) => {
      if (row.student_id && byRowId.has(row.student_id)) return byRowId.get(row.student_id)!;
      const code = referenceStudentCode(row.receipt_reference);
      if (code && byCode.has(code)) return byCode.get(code)!;
      return code ?? "Unmatched record";
    };
  }, [students]);

  const rows = useMemo(() => paymentsQuery.data ?? [], [paymentsQuery.data]);

  const summary = useMemo(() => {
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
      unpaidCount,
    };
  }, [rows]);

  const invalidatePayments = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-payments", monthKey] });
    await queryClient.invalidateQueries({ queryKey: ["student-payments"] });
  };

  const toggleMutation = useMutation({
    mutationFn: ({ row, isPaid }: { row: PaymentRow; isPaid: boolean }) =>
      setPaymentPaid(row, isPaid),
    onMutate: () => setFeedback(null),
    onError: (mutationError: Error) => setFeedback({ type: "error", text: mutationError.message }),
    onSuccess: async () => {
      await invalidatePayments();
      setFeedback({ type: "success", text: "Payment status updated." });
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const amountDue = Number(newAmountDue);
      const amountPaid = Number(newAmountPaid);
      if (Number.isNaN(amountDue) || amountDue < 0) {
        throw new Error("Enter a valid amount due.");
      }
      if (Number.isNaN(amountPaid) || amountPaid < 0) {
        throw new Error("Enter a valid amount paid.");
      }
      await createPayment({
        student_id: newStudentId || null,
        month: monthKey,
        amount_due: amountDue,
        amount_paid: amountPaid,
        is_paid: newIsPaid,
        grace_period_active: newGraceActive,
        receipt_reference: newReference.trim() || null,
      });
    },
    onMutate: () => setFeedback(null),
    onError: (mutationError: Error) => setFeedback({ type: "error", text: mutationError.message }),
    onSuccess: async () => {
      setShowCreateForm(false);
      setNewStudentId("");
      setNewAmountDue(String(feeRate));
      setNewAmountPaid("0");
      setNewReference("");
      setNewIsPaid(false);
      setNewGraceActive(false);
      await invalidatePayments();
      setFeedback({ type: "success", text: "Payment record created." });
    },
  });

  const editMutation = useMutation({
    mutationFn: async () => {
      if (!editingRow) return;
      const amountDue = Number(editAmountDue);
      const amountPaid = Number(editAmountPaid);
      if (Number.isNaN(amountDue) || amountDue < 0) {
        throw new Error("Enter a valid amount due.");
      }
      if (Number.isNaN(amountPaid) || amountPaid < 0) {
        throw new Error("Enter a valid amount paid.");
      }
      await updatePayment(editingRow.id, {
        amount_due: amountDue,
        amount_paid: amountPaid,
        is_paid: editIsPaid,
        grace_period_active: editGraceActive,
        receipt_reference: editReference.trim() || null,
      });
    },
    onMutate: () => setFeedback(null),
    onError: (mutationError: Error) => setFeedback({ type: "error", text: mutationError.message }),
    onSuccess: async () => {
      setEditingRow(null);
      await invalidatePayments();
      setFeedback({ type: "success", text: "Payment record updated." });
    },
  });

  const applyRateMutation = useMutation({
    mutationFn: () => applyRateToUnpaidMonth(monthKey, feeRate),
    onMutate: () => setFeedback(null),
    onError: (mutationError: Error) => setFeedback({ type: "error", text: mutationError.message }),
    onSuccess: async () => {
      await invalidatePayments();
      setFeedback({
        type: "success",
        text: `Updated amount due to ${formatNaira(feeRate)} for unpaid records in ${formatMonth(monthKey)}.`,
      });
    },
  });

  function saveDefaultRate(nextRate: number) {
    const clean = Math.max(0, Math.round(nextRate));
    setFeeRate(clean);
    setNewAmountDue(String(clean));
    try {
      window.localStorage.setItem(FEE_RATE_STORAGE_KEY, String(clean));
    } catch {
      // Ignore storage errors
    }
  }

  function startEditing(row: PaymentRow) {
    setFeedback(null);
    setEditingRow(row);
    setEditAmountDue(String(row.amount_due ?? feeRate));
    setEditAmountPaid(String(row.amount_paid ?? 0));
    setEditReference(row.receipt_reference ?? "");
    setEditIsPaid(row.is_paid === true);
    setEditGraceActive(row.grace_period_active === true);
  }

  function handleStudentChange(studentRowId: string) {
    setNewStudentId(studentRowId);
    const chosen = students.find((s) => s.id === studentRowId);
    if (chosen?.student_id) {
      setNewReference(`${referenceTag(chosen.student_id)} ${month}`);
    }
  }

  return (
    <PortalShell
      eyebrow="Administration"
      title="Payments"
      subtitle="Control the monthly fee rate, edit payment amounts and grace periods, and mark student fees as paid or unpaid."
      role="admin"
    >
      <Link
        to="/admin"
        className="text-sm text-muted-foreground underline underline-offset-4 hover:text-amber"
      >
        ← Back to admin dashboard
      </Link>

      {/* Summary metrics */}
      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total billed", value: formatNaira(summary.billed), accent: false },
          { label: "Collected", value: formatNaira(summary.collected), accent: true },
          { label: "Outstanding", value: formatNaira(summary.outstanding), accent: false },
          { label: "Unpaid records", value: String(summary.unpaidCount), accent: false },
        ].map((item) => (
          <div key={item.label} className={portalCard}>
            <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {item.label}
            </dt>
            <dd
              className={`mt-3 font-display text-2xl font-semibold ${
                item.accent ? "text-amber" : "text-headline"
              }`}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Filter + Fee Rate Controls */}
      <div className={`${portalCard} mt-8`}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-wrap items-end gap-4">
            <label className="text-sm">
              <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Month
              </span>
              <input
                type="month"
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                className="mt-2 h-11 rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
              />
            </label>

            <label className="text-sm">
              <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Standard monthly rate (₦)
              </span>
              <input
                type="number"
                min={0}
                step={500}
                value={feeRate}
                onChange={(event) => saveDefaultRate(Number(event.target.value) || 0)}
                className="mt-2 h-11 w-40 rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
              />
            </label>

            <button
              type="button"
              disabled={applyRateMutation.isPending || summary.unpaidCount === 0}
              onClick={() => applyRateMutation.mutate()}
              className={`${portalGhostButton} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {applyRateMutation.isPending
                ? "Applying…"
                : `Apply ${formatNaira(feeRate)} to unpaid`}
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setFeedback(null);
              setShowCreateForm((v) => !v);
            }}
            className={portalPrimaryButton}
          >
            {showCreateForm ? (
              <>
                <X className="size-4" aria-hidden="true" />
                Close form
              </>
            ) : (
              <>
                <Plus className="size-4" aria-hidden="true" />
                Add payment record
              </>
            )}
          </button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Showing {formatMonth(monthKey)}. Unpaid students see the Payment Due screen automatically
          after the 2-day grace period (unless grace period is active).
        </p>
      </div>

      {/* Create Payment Form */}
      {showCreateForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
          className={`${portalCard} mt-6 space-y-5 border-amber/40`}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-headline">
              New payment record ({formatMonth(monthKey)})
            </h2>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="text-xs text-muted-foreground hover:text-headline"
            >
              Cancel
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-sm">
              <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Student
              </span>
              <select
                value={newStudentId}
                onChange={(e) => handleStudentChange(e.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
              >
                <option value="">Select student (or tag via reference)</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.profiles?.full_name ?? "Student"} {s.student_id ? `(${s.student_id})` : ""}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Amount due (₦)
              </span>
              <input
                type="number"
                min={0}
                required
                value={newAmountDue}
                onChange={(e) => setNewAmountDue(e.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
              />
            </label>

            <label className="text-sm">
              <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Amount paid (₦)
              </span>
              <input
                type="number"
                min={0}
                required
                value={newAmountPaid}
                onChange={(e) => setNewAmountPaid(e.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
              />
            </label>

            <label className="text-sm sm:col-span-2">
              <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Reference / Narration
              </span>
              <input
                type="text"
                placeholder="[STU001] MNP-TRF-..."
                value={newReference}
                onChange={(e) => setNewReference(e.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
              />
            </label>

            <div className="flex flex-col justify-end gap-2.5 pb-1 text-sm">
              <label className="inline-flex items-center gap-2.5 text-foreground">
                <input
                  type="checkbox"
                  checked={newIsPaid}
                  onChange={(e) => setNewIsPaid(e.target.checked)}
                  className="size-4 accent-amber"
                />
                Mark as paid immediately
              </label>
              <label className="inline-flex items-center gap-2.5 text-foreground">
                <input
                  type="checkbox"
                  checked={newGraceActive}
                  onChange={(e) => setNewGraceActive(e.target.checked)}
                  className="size-4 accent-amber"
                />
                Grace period active
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className={portalPrimaryButton}
            >
              {createMutation.isPending ? "Creating…" : "Create payment"}
            </button>
          </div>
        </form>
      )}

      {/* Edit Payment Modal/Panel */}
      {editingRow && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            editMutation.mutate();
          }}
          className={`${portalCard} mt-6 space-y-5 border-amber`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-amber">Editing record</p>
              <h2 className="mt-1 font-display text-lg font-semibold text-headline">
                {nameFor(editingRow)}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setEditingRow(null)}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-headline"
            >
              <X className="size-4" aria-hidden="true" />
              Cancel
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm">
              <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Amount due (₦)
              </span>
              <input
                type="number"
                min={0}
                required
                value={editAmountDue}
                onChange={(e) => setEditAmountDue(e.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
              />
            </label>

            <label className="text-sm">
              <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Amount paid (₦)
              </span>
              <input
                type="number"
                min={0}
                required
                value={editAmountPaid}
                onChange={(e) => setEditAmountPaid(e.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
              />
            </label>

            <label className="text-sm sm:col-span-2">
              <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Receipt / Reference
              </span>
              <input
                type="text"
                value={editReference}
                onChange={(e) => setEditReference(e.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-amber"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            <label className="inline-flex items-center gap-2.5 text-foreground">
              <input
                type="checkbox"
                checked={editIsPaid}
                onChange={(e) => setEditIsPaid(e.target.checked)}
                className="size-4 accent-amber"
              />
              Paid in full
            </label>
            <label className="inline-flex items-center gap-2.5 text-foreground">
              <input
                type="checkbox"
                checked={editGraceActive}
                onChange={(e) => setEditGraceActive(e.target.checked)}
                className="size-4 accent-amber"
              />
              Grace period active (do not block student dashboard)
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={editMutation.isPending} className={portalPrimaryButton}>
              {editMutation.isPending ? "Saving…" : "Save payment changes"}
            </button>
            <button type="button" onClick={() => setEditingRow(null)} className={portalGhostButton}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {feedback && (
        <p
          role="status"
          className={`mt-6 rounded-md border px-4 py-3 text-sm ${
            feedback.type === "error"
              ? "border-destructive/40 bg-destructive/10 text-destructive"
              : "border-amber/40 bg-amber/10 text-amber"
          }`}
        >
          {feedback.text}
        </p>
      )}

      <div className="mt-8">
        {paymentsQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading payments…</p>
        ) : paymentsQuery.error ? (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {(paymentsQuery.error as Error).message}
          </p>
        ) : rows.length === 0 ? (
          <EmptyState
            title="No payment records for this month"
            body="Use 'Add payment record' above to create fee records for students this month."
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-card/80">
            <table className="w-full min-w-[54rem] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-[0.16em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3.5 font-medium">Student</th>
                  <th className="px-4 py-3.5 font-medium">Reference</th>
                  <th className="px-4 py-3.5 font-medium">Due</th>
                  <th className="px-4 py-3.5 font-medium">Paid</th>
                  <th className="px-4 py-3.5 font-medium">Grace</th>
                  <th className="px-4 py-3.5 font-medium">Status</th>
                  <th className="px-4 py-3.5 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-3.5 font-medium text-headline">{nameFor(row)}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {row.receipt_reference ?? "—"}
                    </td>
                    <td className="px-4 py-3.5 text-foreground">
                      {formatNaira(row.amount_due ?? 0)}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {formatNaira(row.amount_paid ?? 0)}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-muted-foreground">
                      {row.grace_period_active ? "Active" : "Standard"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          row.is_paid
                            ? "border border-amber/40 bg-amber/10 text-amber"
                            : "border border-destructive/40 bg-destructive/10 text-destructive"
                        }`}
                      >
                        {row.is_paid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(row)}
                          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-xs text-foreground transition-colors hover:border-amber/60 hover:text-amber"
                        >
                          <Pencil className="size-3" aria-hidden="true" />
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={toggleMutation.isPending}
                          onClick={() => toggleMutation.mutate({ row, isPaid: !row.is_paid })}
                          className={`${portalGhostButton} h-9 px-3.5 text-xs disabled:opacity-60`}
                        >
                          {row.is_paid ? "Mark unpaid" : "Mark paid"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PortalShell>
  );
}
