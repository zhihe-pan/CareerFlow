export type Stage = "backlog" | "applied" | "written_test" | "interviewing" | "offer" | "closed";
export type StrategicTier = "reach" | "core" | "safe";

export const STAGES: { 
  id: Stage; 
  label: string; 
  accent: string; 
  borderColor: string; 
  hoverShadow: string; 
  emptyText: string 
}[] = [
  { 
    id: "backlog", 
    label: "我的备选池", 
    accent: "from-slate-400/40 to-slate-300/10",
    borderColor: "border-purple-500/30",
    hoverShadow: "hover:shadow-[0_0_15px_-3px_rgba(168,85,247,0.3)]",
    emptyText: "拖拽卡片到此"
  },
  { 
    id: "applied", 
    label: "已投递", 
    accent: "from-blue-400/50 to-cyan-300/10",
    borderColor: "border-blue-500/50",
    hoverShadow: "hover:shadow-[0_0_15px_-3px_rgba(59,130,246,0.4)]",
    emptyText: "拖拽卡片到此"
  },
  { 
    id: "written_test", 
    label: "待笔试", 
    accent: "from-amber-400/60 to-orange-300/10",
    borderColor: "border-amber-500/50",
    hoverShadow: "hover:shadow-[0_0_15px_-3px_rgba(245,158,11,0.4)]",
    emptyText: "拖拽卡片到此"
  },
  { 
    id: "interviewing", 
    label: "面试中", 
    accent: "from-violet-400/60 to-fuchsia-300/10",
    borderColor: "border-orange-500/50",
    hoverShadow: "hover:shadow-[0_0_15px_-3px_rgba(249,115,22,0.4)]",
    emptyText: "拖拽卡片到此"
  },
  { 
    id: "offer", 
    label: "录用意向 (Offer)", 
    accent: "from-emerald-400/60 to-teal-300/10",
    borderColor: "border-emerald-500/50",
    hoverShadow: "hover:shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]",
    emptyText: "✨ 暂无 Offer，通关之路正在进行中"
  },
  { 
    id: "closed", 
    label: "已结束 (归档)", 
    accent: "from-zinc-500/40 to-zinc-400/10",
    borderColor: "border-rose-500/30",
    hoverShadow: "hover:shadow-[0_0_15px_-3px_rgba(244,63,94,0.3)]",
    emptyText: "☕ 休息一下，将经历转化为经验"
  },
];

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  checklist: { id: string; text: string; done: boolean }[];
}


/** 单轮面试记录（时间轴） */
export interface InterviewRound {
  id: string;
  /** 轮次名称，如「一面」「HR面」 */
  name: string;
  /** 计划/实际面试时间，ISO */
  scheduledAt?: string;
  status: "completed" | "pending";
}



export interface JobCard {
  id: string;
  company: string;
  role: string;
  salary?: string;
  location?: string;
  requirements?: string[];
  summary?: string;
  jdUrl?: string;
  stage: Stage;
  /** 备选池：投递截止（看板时间标签优先使用；旧数据可能只在 `deadline`） */
  applicationDeadline?: string;
  /** 已投递：用于「已投递 N 天」；缺省时用 `createdAt` */
  appliedAt?: string;
  /** @deprecated 请用 `applicationDeadline`（备选池）；保留以兼容旧 localStorage */
  deadline?: string; // ISO
  createdAt: string;
  roadmap: RoadmapStep[];
  reflection?: string;
  reflectionSummary?: string;
  
  // Strategic positioning & UI enhancements
  strategicTier?: StrategicTier;
  priority?: "核心" | "保底" | "冲刺" | string; // legacy, kept for compatibility
  attachment?: string;
  progressStatus?: string;
  // New interview rounds tracking
  interviewRounds?: InterviewRound[];
}
