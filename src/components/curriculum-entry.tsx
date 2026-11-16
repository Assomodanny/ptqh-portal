import type { Course } from "@/data/curriculum";

/**
 * A single curriculum card: ordinal, Arabic title, English title, description.
 * Purely presentational — the course object may come from a backend later.
 */
export function CurriculumEntry({ course, index }: { course: Course; index: number }) {
  const ordinal = String(index + 1).padStart(2, "0");

  return (
    <article className="group flex h-full flex-col rounded-lg border border-border bg-card p-6 transition-colors duration-300 hover:border-amber/60 focus-within:border-amber/60 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <p
          dir="rtl"
          lang="ar"
          className="min-w-0 font-arabic text-2xl leading-[1.7] text-amber sm:text-[1.7rem]"
        >
          {course.arabicTitle}
        </p>
        <span
          className="shrink-0 pt-1 font-display text-sm tabular-nums text-muted-foreground transition-colors duration-300 group-hover:text-amber"
          aria-hidden="true"
        >
          {ordinal}
        </span>
      </div>

      <h3 className="mt-4 text-balance font-display text-lg font-semibold tracking-tight sm:text-xl">
        {course.englishTitle}
      </h3>

      <div className="mt-4 h-px w-10 bg-amber/60" aria-hidden="true" />

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{course.description}</p>
    </article>
  );
}
