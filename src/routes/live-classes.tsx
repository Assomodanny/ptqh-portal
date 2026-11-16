import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, X } from "lucide-react";

import {
  EmptyState,
  PortalShell,
  portalCard,
  portalGhostButton,
  portalPrimaryButton,
} from "@/components/portal-shell";
import { ALLOWED_SUBJECTS } from "@/data/curriculum";
import { useAuth } from "@/lib/auth";
import {
  createLiveClass,
  deleteLiveClass,
  fetchLiveClasses,
  fetchUserRole,
  formatDay,
  formatPlatform,
  formatTimeRange,
  updateLiveClass,
  type LiveClass,
  type LiveClassInput,
} from "@/lib/portal";

export const Route = createFileRoute("/live-classes")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Live Classes — Path to Qur'anic Understanding" },
      {
        name: "description",
        content:
          "The recurring live class timetable for Path to Qur'anic Understanding, with join links for each session.",
      },
      { property: "og:title", content: "Live Classes — Path to Qur'anic Understanding" },
      {
        property: "og:description",
        content: "Day, time, subject and join link for every live session.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LiveClassesPage,
});

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const PLATFORMS = ["Google Meet", "WhatsApp", "Zoom"] as const;

const emptyForm: LiveClassInput = {
  subject: ALLOWED_SUBJECTS[0],
  day_of_week: "Saturday",
  start_time: "09:00",
  end_time: "10:00",
  platform: "Google Meet",
  join_url: "",
};

function normaliseDayValue(day: string | number | null): string {
  if (day === null || day === undefined) return "Saturday";
  if (typeof day === "number" && day >= 0 && day <= 6) {
    return DAYS_OF_WEEK[day] ?? "Saturday";
  }
  const str = String(day).trim();
  const numeric = Number(str);
  if (str !== "" && !Number.isNaN(numeric) && numeric >= 0 && numeric <= 6) {
    return DAYS_OF_WEEK[numeric] ?? "Saturday";
  }
  const matched = DAYS_OF_WEEK.find((d) => d.toLowerCase() === str.toLowerCase());
  return matched ?? (str || "Saturday");
}

function normaliseTimeValue(time: string | null): string {
  if (!time) return "";
  // Support "HH:MM:SS" from Postgres time columns by trimming to "HH:MM" for <input type="time">
  return time.slice(0, 5);
}

function LiveClassesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<LiveClassInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  const roleQuery = useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: () => fetchUserRole(user!.id),
    enabled: Boolean(user?.id),
  });
  const isAdmin = roleQuery.data === "admin";

  const classesQuery = useQuery({ queryKey: ["live-classes"], queryFn: fetchLiveClasses });

  const saveMutation = useMutation({
    mutationFn: async (input: LiveClassInput) => {
      const payload: LiveClassInput = {
        subject: input.subject?.trim() || null,
        day_of_week: input.day_of_week?.trim() || null,
        start_time: input.start_time || null,
        end_time: input.end_time || null,
        platform: input.platform?.trim() || null,
        join_url: input.join_url?.trim() || null,
      };
      if (editingId) {
        await updateLiveClass(editingId, payload);
      } else {
        await createLiveClass(payload);
      }
    },
    onSuccess: async () => {
      const wasEditing = Boolean(editingId);
      setEditingId(null);
      setForm(emptyForm);
      setFeedback({
        type: "success",
        text: wasEditing ? "Live class schedule updated." : "Live class added to timetable.",
      });
      await queryClient.invalidateQueries({ queryKey: ["live-classes"] });
    },
    onError: (error: Error) => setFeedback({ type: "error", text: error.message }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => deleteLiveClass(id),
    onSuccess: async (_data, deletedId) => {
      if (editingId === deletedId) {
        setEditingId(null);
        setForm(emptyForm);
      }
      setFeedback({ type: "success", text: "Class removed." });
      await queryClient.invalidateQueries({ queryKey: ["live-classes"] });
    },
    onError: (error: Error) => setFeedback({ type: "error", text: error.message }),
  });

  function startEditing(item: LiveClass) {
    setFeedback(null);
    setEditingId(item.id);
    setForm({
      subject: item.subject ?? ALLOWED_SUBJECTS[0],
      day_of_week: normaliseDayValue(item.day_of_week),
      start_time: normaliseTimeValue(item.start_time),
      end_time: normaliseTimeValue(item.end_time),
      platform: item.platform ?? "Google Meet",
      join_url: item.join_url ?? "",
    });
    document.getElementById("class-form-section")?.scrollIntoView({ behavior: "smooth" });
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptyForm);
    setFeedback(null);
  }

  const classes = classesQuery.data ?? [];

  return (
    <PortalShell
      eyebrow="Timetable"
      title="Live classes"
      subtitle="Recurring live sessions with the day, time, subject and platform. Join links open in a new tab — sessions are held on Google Meet or WhatsApp."
    >
      {classesQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading the timetable…</p>
      ) : classesQuery.error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {(classesQuery.error as Error).message}
        </p>
      ) : classes.length === 0 ? (
        <EmptyState
          title="No live classes scheduled"
          body="Once the school administration publishes the timetable, every session will appear here with its join link."
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {classes.map((item) => {
            const isBeingEdited = editingId === item.id;
            return (
              <li
                key={item.id}
                className={`${portalCard} ${isBeingEdited ? "border-amber bg-amber/5" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber">
                    {formatDay(item.day_of_week)}
                  </p>
                  <span className="rounded-full border border-border bg-secondary/70 px-2.5 py-0.5 text-[11px] text-muted-foreground">
                    {formatPlatform(item.platform)}
                  </span>
                </div>
                <p className="mt-3 font-display text-lg font-semibold text-headline">
                  {item.subject ?? "Subject to be confirmed"}
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {formatTimeRange(item.start_time, item.end_time)}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {item.join_url ? (
                    <a
                      href={item.join_url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={portalPrimaryButton}
                    >
                      Join class
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">Join link pending</span>
                  )}
                  {isAdmin && (
                    <>
                      <button
                        type="button"
                        onClick={() => startEditing(item)}
                        className={`${portalGhostButton} h-10 px-4 text-xs`}
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={removeMutation.isPending}
                        onClick={() => removeMutation.mutate(item.id)}
                        className="inline-flex h-10 items-center gap-1.5 rounded-md border border-border px-3 text-xs text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive disabled:opacity-50"
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
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

      {isAdmin && (
        <section
          id="class-form-section"
          aria-labelledby="class-form-heading"
          className={`${portalCard} mt-12`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-amber">
                {editingId ? "Editing scheduled class" : "Schedule management"}
              </p>
              <h2 id="class-form-heading" className="mt-1 font-display text-xl font-semibold">
                {editingId ? "Edit live class day & time" : "Add a live class"}
              </h2>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={cancelEditing}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-xs text-muted-foreground transition-colors hover:border-amber/60 hover:text-headline"
              >
                <X className="size-3.5" aria-hidden="true" />
                Cancel edit
              </button>
            )}
          </div>

          <form
            className="mt-6 grid gap-4 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              setFeedback(null);
              saveMutation.mutate(form);
            }}
          >
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Subject
              </span>
              <select
                value={form.subject ?? ALLOWED_SUBJECTS[0]}
                onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
                className="mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none transition-colors focus:border-amber"
              >
                {ALLOWED_SUBJECTS.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
                {form.subject &&
                  !ALLOWED_SUBJECTS.some(
                    (s) => s.toLowerCase() === form.subject?.toLowerCase(),
                  ) && <option value={form.subject}>{form.subject}</option>}
              </select>
            </label>

            <label className="block text-sm">
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Day of week
              </span>
              <select
                value={form.day_of_week ?? "Saturday"}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, day_of_week: event.target.value }))
                }
                className="mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none transition-colors focus:border-amber"
              >
                {DAYS_OF_WEEK.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Start time
              </span>
              <input
                type="time"
                required
                value={form.start_time ?? ""}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, start_time: event.target.value }))
                }
                className="mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none transition-colors focus:border-amber"
              />
            </label>

            <label className="block text-sm">
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                End time
              </span>
              <input
                type="time"
                required
                value={form.end_time ?? ""}
                onChange={(event) => setForm((prev) => ({ ...prev, end_time: event.target.value }))}
                className="mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none transition-colors focus:border-amber"
              />
            </label>

            <label className="block text-sm">
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Platform
              </span>
              <select
                value={form.platform ?? "Google Meet"}
                onChange={(event) => setForm((prev) => ({ ...prev, platform: event.target.value }))}
                className="mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none transition-colors focus:border-amber"
              >
                {PLATFORMS.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
                {form.platform &&
                  !PLATFORMS.some((p) => p.toLowerCase() === form.platform?.toLowerCase()) && (
                    <option value={form.platform}>{form.platform}</option>
                  )}
              </select>
            </label>

            <label className="block text-sm">
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Join link
              </span>
              <input
                type="url"
                placeholder="https://meet.google.com/..."
                value={form.join_url ?? ""}
                onChange={(event) => setForm((prev) => ({ ...prev, join_url: event.target.value }))}
                className="mt-2 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none transition-colors focus:border-amber"
              />
            </label>

            <div className="flex flex-wrap gap-3 pt-2 sm:col-span-2">
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className={portalPrimaryButton}
              >
                {!editingId && <Plus className="size-4" aria-hidden="true" />}
                {saveMutation.isPending
                  ? "Saving…"
                  : editingId
                    ? "Save schedule changes"
                    : "Add class"}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEditing} className={portalGhostButton}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>
      )}
    </PortalShell>
  );
}
