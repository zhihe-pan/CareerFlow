import { useEffect, useState } from "react";
import type { JobCard } from "@/lib/types";
import { differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import {
  formatInterviewCountdownBadge,
  formatPoolDeadlineBadge,
  getApplicationDeadlineIso,
  getNextInterviewIso,
} from "@/lib/cardTimeBadge";

interface Props {
  card: JobCard;
}

export function CardTimeBadge({ card }: Props) {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const now = new Date();

  if (card.stage === "backlog") {
    const iso = getApplicationDeadlineIso(card);
    if (!iso) return null;
    const text = formatPoolDeadlineBadge(iso, now);
    if (!text) return null;
    const urgent = differenceInDays(new Date(iso), now) <= 1;
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide border border-border/60",
          urgent ? "border-destructive/60 bg-destructive/15 text-destructive" : "bg-muted/50 text-foreground/85"
        )}
      >
        {text}
      </span>
    );
  }

  if (card.stage === "applied") {
    const ref = card.appliedAt ?? card.createdAt;
    const days = Math.max(0, differenceInDays(now, new Date(ref)));
    return (
      <span className="text-[10px] text-muted-foreground/80 tabular-nums">已投递 {days} 天</span>
    );
  }

  if (card.stage === "interviewing" || card.stage === "written_test") {
    const iso = getNextInterviewIso(card);
    if (!iso) return null;
    const text = formatInterviewCountdownBadge(iso, now);
    if (!text) return null;
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide border border-orange-500/35 bg-orange-500/15 text-orange-300">
        {text}
      </span>
    );
  }

  return null;
}
