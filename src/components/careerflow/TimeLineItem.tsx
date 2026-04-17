import { motion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

export type TimelineColorTheme = "primary" | "orange";

const LINE: Record<TimelineColorTheme, string> = {
  primary: "from-primary/60 via-border to-transparent",
  orange: "from-orange-500/55 via-border to-transparent",
};

const NODE: Record<TimelineColorTheme, Record<"done" | "active" | "idle", string>> = {
  primary: {
    done: "bg-success",
    active: "bg-gradient-primary shadow-glow scale-125",
    idle: "bg-muted",
  },
  orange: {
    done: "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.35)]",
    active: "bg-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.55)] scale-110",
    idle: "bg-orange-400/55",
  },
};

const CARD: Record<TimelineColorTheme, Record<"emphasis" | "subtle" | "done", string>> = {
  primary: {
    emphasis: "glass gradient-border",
    subtle: "border border-border/30 bg-muted/25",
    done: "border border-border/30 bg-muted/25",
  },
  orange: {
    emphasis: "border border-orange-500/20 bg-orange-500/[0.05] dark:bg-orange-950/20",
    subtle: "border border-border/35 bg-muted/25",
    done: "border border-border/35 bg-muted/25",
  },
};

export function TimelineTrack({
  colorTheme,
  className,
  children,
}: {
  colorTheme: TimelineColorTheme;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("relative pl-6", className)}>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b",
          LINE[colorTheme]
        )}
      />
      {children}
    </div>
  );
}

export type TimelineNodeKind = "done" | "active" | "idle";
export type TimelineCardKind = "emphasis" | "subtle" | "done";

export function TimeLineItem({
  colorTheme,
  nodeKind,
  cardKind,
  children,
  className,
  itemTransition,
  compact,
  cardClassName,
}: {
  colorTheme: TimelineColorTheme;
  nodeKind: TimelineNodeKind;
  cardKind: TimelineCardKind;
  children: React.ReactNode;
  className?: string;
  itemTransition?: Transition;
  /** 更小的内边距与纵向间距（如面试时间轴） */
  compact?: boolean;
  /** 合并到内层卡片容器（如 `group` 用于 hover 操作） */
  cardClassName?: string;
}) {
  const nodeCls = NODE[colorTheme][nodeKind];
  const cardCls = CARD[colorTheme][cardKind];

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={itemTransition ?? { duration: 0.2 }}
      className={cn(compact ? "relative pb-3.5" : "relative pb-5", className)}
    >
      <div
        className={cn(
          "absolute -left-[19px] top-1 h-3 w-3 rounded-full ring-4 ring-background transition-all",
          nodeCls
        )}
      />
      <div
        className={cn(
          "rounded-xl transition-all",
          compact ? "p-2.5" : "p-3.5",
          cardCls,
          cardClassName
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}
