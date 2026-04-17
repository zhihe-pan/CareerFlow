import { JobCard, STAGES } from "@/lib/types";
import { Activity, ArrowRight } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { zhCN } from "date-fns/locale";

interface Props {
  cards: JobCard[];
  onCardClick: (c: JobCard) => void;
}

const stageLabel = (id: string) => STAGES.find((s) => s.id === id)?.label ?? id;

export function ActivitySidebar({ cards, onCardClick }: Props) {
  // Sort by createdAt desc, take top 8
  const recent = [...cards]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  return (
    <aside className="hidden xl:flex flex-col w-[280px] shrink-0 glass-strong rounded-3xl p-4 max-h-[calc(100vh-180px)]">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Activity className="h-4 w-4 text-primary-glow" />
        <h2 className="font-display text-sm font-semibold tracking-wide">最近动态</h2>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-none space-y-2 pr-1">
        {recent.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">暂无动态</p>
        ) : (
          recent.map((c) => (
            <button
              key={c.id}
              onClick={() => onCardClick(c)}
              className="w-full text-left rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-border/40 hover:border-primary/40 p-3 transition-all group"
            >
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1">
                <span className="px-1.5 py-0.5 rounded-md bg-primary/15 text-primary-glow font-medium">
                  {stageLabel(c.stage)}
                </span>
                <ArrowRight className="h-2.5 w-2.5" />
                <span className="truncate">{c.company}</span>
              </div>
              <p className="text-[13px] font-medium text-foreground/90 leading-snug truncate">
                {c.role}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                {formatDistanceToNowStrict(new Date(c.createdAt), { locale: zhCN, addSuffix: true })}
              </p>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
