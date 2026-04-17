import { JobCard } from "@/lib/types";
import { useDraggable } from "@dnd-kit/core";
import { DeadlinePill } from "./DeadlinePill";
import { MapPin, Wallet, Route } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Props {
  card: JobCard;
  dimmed?: boolean;
  highlighted?: boolean;
  onClick: () => void;
}

export function JobCardItem({ card, dimmed, highlighted, onClick }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
  });

  const totalChecks = card.roadmap.reduce((acc, s) => acc + s.checklist.length, 0);
  const doneChecks = card.roadmap.reduce(
    (acc, s) => acc + s.checklist.filter((i) => i.done).length,
    0
  );
  const pct = totalChecks ? Math.round((doneChecks / totalChecks) * 100) : 0;

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
    >
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={(e) => {
          if (isDragging) return;
          onClick();
          e.stopPropagation();
        }}
        className={cn(
          "group relative cursor-grab active:cursor-grabbing select-none",
          "rounded-2xl p-4 glass transition-all duration-300",
          "hover:-translate-y-0.5 hover:shadow-glow hover:bg-white/[0.04]",
          isDragging && "opacity-60 rotate-1 scale-105 shadow-glow z-50",
          highlighted && "gradient-border ring-1 ring-primary/30",
          dimmed && "focus-dim"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium tracking-wider text-muted-foreground truncate mb-1">
              {card.company}
            </p>
            <h3 className="font-display text-[15px] font-semibold leading-snug text-foreground truncate">
              {card.role}
            </h3>
          </div>
          <DeadlinePill deadline={card.deadline} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px]">
          {card.salary && (
            <span className="inline-flex items-center gap-1 font-mono text-accent font-medium">
              <Wallet className="h-3.5 w-3.5" />
              {card.salary}
            </span>
          )}
          {card.location && (
            <span className="inline-flex items-center gap-1 text-foreground/75">
              <MapPin className="h-3.5 w-3.5" />
              {card.location}
            </span>
          )}
        </div>

        {totalChecks > 0 && (
          <div className="mt-3.5">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Route className="h-3 w-3" /> Stepwise 路径
              </span>
              <span className="font-mono font-semibold text-foreground/90">{pct}% 通关</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
              <div
                className="h-full bg-gradient-primary transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
