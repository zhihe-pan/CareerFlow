import { format } from "date-fns";
import type { InterviewRound } from "@/lib/types";
import { getNextPendingInterviewRound } from "@/lib/interviewRounds";
import { cn } from "@/lib/utils";

export function NextInterviewReadonlyHint({ rounds }: { rounds?: InterviewRound[] }) {
  const next = getNextPendingInterviewRound(rounds);
  if (!next) return null;

  const timePart = next.scheduledAt
    ? format(new Date(next.scheduledAt), "yyyy/MM/dd HH:mm")
    : "时间未设置";

  return (
    <div
      className={cn(
        "mt-3 rounded-xl border border-primary/30 bg-primary/[0.12] px-3 py-2.5 text-[12px] leading-snug",
        "text-foreground/95 shadow-sm shadow-primary/5"
      )}
    >
      <span className="font-medium">💡 下一场面试：</span>
      <span className="text-foreground/90">
        {next.name} · {timePart}
      </span>
    </div>
  );
}
