export type Stage = "backlog" | "applied" | "interviewing" | "offer" | "closed";

export const STAGES: { id: Stage; label: string; accent: string }[] = [
  { id: "backlog", label: "我的备选池", accent: "from-slate-400/40 to-slate-300/10" },
  { id: "applied", label: "已投递", accent: "from-blue-400/50 to-cyan-300/10" },
  { id: "interviewing", label: "面试中", accent: "from-violet-400/60 to-fuchsia-300/10" },
  { id: "offer", label: "录用意向 (Offer)", accent: "from-emerald-400/60 to-teal-300/10" },
  { id: "closed", label: "已结束 (归档)", accent: "from-zinc-500/40 to-zinc-400/10" },
];

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  checklist: { id: string; text: string; done: boolean }[];
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
  deadline?: string; // ISO
  createdAt: string;
  roadmap: RoadmapStep[];
  reflection?: string;
  reflectionSummary?: string;
}
