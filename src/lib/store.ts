import { useEffect, useState, useCallback } from "react";
import type { JobCard, Stage, RoadmapStep } from "./types";

const KEY = "careerflow.cards.v2-zh";

const seed: JobCard[] = [
  {
    id: crypto.randomUUID(),
    company: "字节跳动",
    role: "产品经理 (PM) · AI 方向",
    salary: "¥25k-40k/月 · 16薪",
    location: "北京 · 望京",
    summary: "负责豆包 / 抖音相关 AI 产品方向，参与从 0 到 1 的功能定义与落地。",
    requirements: ["985 / 211 优先", "对 LLM 产品有深度思考", "数据敏感、逻辑清晰"],
    stage: "interviewing",
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
    roadmap: [
      { id: "1", title: "简历定向优化", description: "针对 AI PM 岗位重写项目经历", checklist: [
        { id: "a", text: "量化最近 3 个项目数据", done: true },
        { id: "b", text: "突出 AI / 大模型相关关键词", done: true },
      ]},
      { id: "2", title: "寻找内推", description: "找一位字节在职学长内推", checklist: [
        { id: "a", text: "在脉脉 / 领英联系 2 位 PM", done: true },
      ]},
      { id: "3", title: "面试准备", description: "产品 Sense + 项目深挖演练", checklist: [
        { id: "a", text: "准备 3 个 STAR 故事", done: false },
        { id: "b", text: "复盘豆包 / 即梦产品逻辑", done: false },
      ]},
      { id: "4", title: "Offer 谈判", description: "薪资锚点与意向确认", checklist: [
        { id: "a", text: "调研同级别薪资区间", done: false },
      ]},
    ],
  },
  {
    id: crypto.randomUUID(),
    company: "美团",
    role: "前端开发工程师",
    salary: "¥20k-30k/月",
    location: "北京 · 远程",
    summary: "负责美团到店业务前端架构与性能优化。",
    requirements: ["TypeScript 熟练", "性能优化经验", "审美在线"],
    stage: "applied",
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    roadmap: [],
  },
  {
    id: crypto.randomUUID(),
    company: "腾讯",
    role: "增长产品经理",
    salary: "¥22k-35k/月",
    location: "深圳 · 南山",
    stage: "backlog",
    createdAt: new Date().toISOString(),
    roadmap: [],
  },
  {
    id: crypto.randomUUID(),
    company: "小红书",
    role: "品牌设计师",
    salary: "¥18k-28k/月",
    location: "上海 · 静安",
    stage: "offer",
    createdAt: new Date().toISOString(),
    roadmap: [],
  },
];

export function useCards() {
  const [cards, setCards] = useState<JobCard[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      setCards(raw ? JSON.parse(raw) : seed);
    } catch {
      setCards(seed);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(cards));
  }, [cards, loaded]);

  const addCard = useCallback((c: Omit<JobCard, "id" | "createdAt" | "stage" | "roadmap"> & Partial<Pick<JobCard, "stage" | "roadmap">>) => {
    const card: JobCard = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      stage: c.stage ?? "backlog",
      roadmap: c.roadmap ?? [],
      ...c,
    };
    setCards((prev) => [card, ...prev]);
    return card;
  }, []);

  const updateCard = useCallback((id: string, patch: Partial<JobCard>) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const moveCard = useCallback((id: string, stage: Stage) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, stage } : c)));
  }, []);

  const removeCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const setRoadmap = useCallback((id: string, steps: RoadmapStep[]) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, roadmap: steps } : c)));
  }, []);

  return { cards, loaded, addCard, updateCard, moveCard, removeCard, setRoadmap };
}
