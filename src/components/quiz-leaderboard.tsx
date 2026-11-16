import type { QuizParticipant } from "@/lib/quiz";

export function QuizLeaderboard({
  participants,
  highlightId,
  emptyLabel = "No one has joined yet.",
  live = false,
}: {
  participants: QuizParticipant[];
  highlightId?: string | undefined;
  emptyLabel?: string;
  live?: boolean;
}) {
  const ranked = [...participants].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  if (ranked.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card/80">
      {live && (
        <div className="flex items-center justify-between border-b border-border/80 bg-background/40 px-4 py-2 text-xs">
          <span className="inline-flex items-center gap-2 font-medium uppercase tracking-[0.18em] text-amber">
            <span className="size-2 animate-pulse rounded-full bg-amber" aria-hidden="true" />
            Live standings
          </span>
          <span className="text-muted-foreground">
            {ranked.length} {ranked.length === 1 ? "player" : "players"}
          </span>
        </div>
      )}
      <ol className="divide-y divide-border">
        {ranked.map((participant, index) => {
          const isMe = highlightId === participant.id;
          return (
            <li
              key={participant.id}
              className={`flex items-center gap-4 px-4 py-3 text-sm transition-colors ${
                isMe ? "bg-amber/12" : ""
              }`}
            >
              <span
                className={`grid size-7 shrink-0 place-items-center rounded-full font-display text-sm font-semibold ${
                  index === 0
                    ? "border border-amber/60 bg-amber/20 text-amber"
                    : "border border-border bg-secondary text-muted-foreground"
                }`}
              >
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-headline">
                {participant.student_name ?? "Anonymous"}
                {isMe && (
                  <span className="ml-2 text-xs uppercase tracking-[0.2em] text-amber">You</span>
                )}
              </span>
              <span className="shrink-0 font-display text-base font-semibold text-headline">
                {participant.score ?? 0}{" "}
                <span className="text-xs font-normal text-muted-foreground">pts</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
