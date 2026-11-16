import { portalCard } from "@/components/portal-shell";
import { formatMonth, formatNaira, type PaymentRow } from "@/lib/portal";

export const bankDetails = {
  bank: "Moniepoint",
  accountNumber: "9046914150",
  accountName: "Munirudeen Lekan Azeez",
};

/**
 * Shown in place of the student dashboard while a current-month payment is
 * outstanding and the 2-day grace period has passed.
 */
export function PaymentDue({
  amountOwed,
  unpaid,
  studentCode,
  month,
}: {
  amountOwed: number;
  unpaid: PaymentRow[];
  studentCode: string | null;
  month: string;
}) {
  const reference = studentCode ? `[${studentCode}] ${month}` : month;

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-amber/50 bg-amber/10 p-6 sm:p-8">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-amber">Payment due</p>
        <h2 className="mt-4 font-display text-2xl font-semibold text-headline sm:text-3xl">
          Your {formatMonth(month)} fees are outstanding
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/85">
          Your dashboard is on hold until this month's fees are received. The grace period of two
          days after the 1st has passed. Once payment is confirmed by the administration, your
          dashboard opens again immediately.
        </p>
        <p className="mt-6 font-display text-4xl font-semibold text-amber">
          {formatNaira(amountOwed)}
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Total amount owed
        </p>
      </section>

      <section aria-labelledby="bank-transfer">
        <h3 id="bank-transfer" className="font-display text-xl font-semibold">
          Bank transfer details
        </h3>
        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Bank", value: bankDetails.bank },
            { label: "Account number", value: bankDetails.accountNumber },
            { label: "Account name", value: bankDetails.accountName },
          ].map((item) => (
            <div key={item.label} className={portalCard}>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {item.label}
              </dt>
              <dd className="mt-3 text-base text-headline">{item.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Please use <span className="text-amber">{reference}</span> as your transfer narration or
          reference so your payment can be matched to your record, then send the receipt to the
          administration on WhatsApp.
        </p>
      </section>

      {unpaid.length > 0 && (
        <section aria-labelledby="outstanding">
          <h3 id="outstanding" className="font-display text-xl font-semibold">
            Outstanding items
          </h3>
          <ul className="mt-6 space-y-3">
            {unpaid.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/70 px-4 py-3 text-sm"
              >
                <span className="text-headline">{formatMonth(row.month)}</span>
                <span className="text-amber">
                  {formatNaira(Math.max((row.amount_due ?? 0) - (row.amount_paid ?? 0), 0))}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
