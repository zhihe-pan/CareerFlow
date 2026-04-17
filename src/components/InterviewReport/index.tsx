import React from "react";
import { motion } from "framer-motion";
import { 
  Trophy, TrendingUp, Clock, AlertTriangle, 
  CheckCircle2, FileText, Target, Brain, 
  Zap, ArrowRight, Download, Sparkles, ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScoreRadar } from "./charts/ScoreRadar";
import { BehavioralTimeline } from "./charts/BehavioralTimeline";

interface InterviewReportProps {
  onBack?: () => void;
}

const MOCK_QA = [
  {
    id: "q1",
    question: "请先简单介绍一下你自己和你最近的一个项目。",
    time: "2:15",
    score: 82,
    fillerRate: 8.5,
    userAnswer: "额，我是张三，然后我最近在做那个 CareerFlow 项目。就是我主要负责那个前端的架构，然后用到了 React 和 Tailwind。那个过程中其实遇到了不少挑战，然后我就是想办法解决了。",
    aiSuggestion: {
      situation: "CareerFlow 项目前端架构由于业务增长面临性能瓶颈。",
      task: "在保持 UI 沉浸式体验的同时，优化超大规模看板的渲染性能。",
      action: "引入了虚拟滚动技术，并结合 React 18 的并发渲染特性，对 500+ 以上的卡片进行了分片加载。",
      result: "首屏渲染时间从 2.4s 降低至 0.8s，用户拖拽反馈延迟降低了 60%。"
    }
  },
  {
    id: "q2",
    question: "你是如何处理大量任务卡片在看板上的性能问题的？",
    time: "3:40",
    score: 88,
    fillerRate: 4.2,
    userAnswer: "在这个项目中，然后我们主要采用了虚拟列表渲染，就是只渲染可视区域内的卡片。那个对于大数据量的处理非常有帮助，然后能显著减少 DOM 节点的数量。",
    aiSuggestion: {
      situation: "需要处理复杂的拖拽排序（DnD）且不造成浏览器掉帧。",
      task: "优化 DnD 状态更新逻辑，减少全量渲染。",
      action: "利用 dnd-kit 的碰撞检测算法优化，并结合 Zustand 实现了局部状态更新。",
      result: "在保持 60fps 的流畅度下，支持了最高 1000+ 卡片的实时拖拽互动。"
    }
  }
];

const highlightFillers = (text: string) => {
  const fillers = [/然后/g, /那个/g, /就是/g, /额/g];
  let highlighted = text;
  fillers.forEach(regex => {
    highlighted = highlighted.replace(regex, `<span class="text-destructive font-bold underline decoration-destructive/30 underline-offset-4">$&</span>`);
  });
  return <div dangerouslySetInnerHTML={{ __html: highlighted }} />;
};

export const InterviewReport = ({ onBack }: InterviewReportProps) => {
  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto scrollbar-none animate-fade-in pb-32 relative">

      {/* 1. Header: Score Overview */}
      <section className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 shrink-0">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-strong rounded-[2.5rem] p-8 flex flex-col justify-center relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy className="h-32 w-32" />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-muted-foreground uppercase tracking-widest font-bold text-xs mb-4">综合战果评估</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-7xl font-black text-gradient drop-shadow-glow">85</span>
              <span className="text-2xl font-bold text-muted-foreground">/ 100</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 w-fit mb-6">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="text-xs font-bold text-success">面试表现优异 (Top 12%)</span>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed italic border-l-2 border-primary-glow pl-4 py-1">
              "你的逻辑思考能力非常突出，尤其是在技术细节调研方面。主要优化空间在于语速控制，在描述复杂架构时建议适当停顿以增加听众理解度。"
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-[2.5rem] p-8"
        >
          <div className="flex items-center gap-2 mb-4">
             <Brain className="h-5 w-5 text-primary-glow" />
             <span className="text-sm font-bold">全维度能力雷达</span>
          </div>
          <ScoreRadar />
        </motion.div>
      </section>

      {/* 2. Middle: Behavioral Timeline */}
      <section className="px-8 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[2.5rem] p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
               <TrendingUp className="h-5 w-5 text-accent" />
               <span className="text-sm font-bold uppercase tracking-widest">情绪与语速波动曲线</span>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                 <span className="h-2 w-2 rounded-full bg-primary-glow" />
                 <span>平均语速: 138 WPM</span>
               </div>
               <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                 <span className="h-2 w-2 rounded-full bg-accent" />
                 <span>峰值稳定度: 95%</span>
               </div>
            </div>
          </div>
          <BehavioralTimeline />
        </motion.div>
      </section>

      {/* 3. Bottom: Q&A Accordion */}
      <section className="px-8 pb-12 overflow-visible">
        <div className="flex items-center gap-2 mb-6 ml-2">
           <Zap className="h-5 w-5 text-warning" />
           <span className="text-sm font-bold uppercase tracking-widest">逐题深度复盘</span>
        </div>
        
        <div className="flex flex-col gap-4">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {MOCK_QA.map((qa, index) => (
              <AccordionItem key={qa.id} value={qa.id} className="border-none">
                <div className="glass rounded-[1.5rem] overflow-hidden border border-white/5 hover:border-white/10 transition-all">
                  <AccordionTrigger className="w-full h-auto px-6 py-5 hover:no-underline">
                    <div className="flex w-full items-center justify-between pr-4">
                      <div className="flex items-center gap-4 text-left">
                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center font-mono font-bold text-muted-foreground">
                          0{index + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-foreground/90">{qa.question}</h4>
                          <div className="flex items-center gap-3 mt-1.5">
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{qa.time}s</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-success font-bold">
                              <Star className="h-3 w-3" />
                              <span>得分: {qa.score}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 mt-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                      {/* Your Answer */}
                      <div className="space-y-4">
                        <header className="flex items-center justify-between mb-2">
                          <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">你的回答 (Your Answer)</span>
                          <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-destructive/10 border border-destructive/20">
                            <AlertTriangle className="h-3 w-3 text-destructive" />
                            <span className="text-[10px] font-bold text-destructive">废话率: {qa.fillerRate}%</span>
                          </div>
                        </header>
                        <div className="p-5 rounded-2xl bg-black/30 border border-white/5 text-[13px] leading-relaxed text-foreground/70 min-h-[140px]">
                          {highlightFillers(qa.userAnswer)}
                        </div>
                      </div>

                      {/* AI Suggestion */}
                      <div className="space-y-4">
                        <header className="flex items-center mb-2">
                          <span className="text-[10px] uppercase font-black text-primary-glow tracking-widest">AI 优化建议 (STAR 法则)</span>
                        </header>
                        <div className="p-5 rounded-2xl glass-strong border border-primary/20 text-[13px] leading-relaxed min-h-[140px]">
                           <div className="space-y-3">
                              <p><span className="font-bold text-primary-glow mr-2">S:</span> {qa.aiSuggestion.situation}</p>
                              <p><span className="font-bold text-primary-glow mr-2">T:</span> {qa.aiSuggestion.task}</p>
                              <p><span className="font-bold text-primary-glow mr-2">A:</span> {qa.aiSuggestion.action}</p>
                              <p><span className="font-bold text-primary-glow mr-2">R:</span> {qa.aiSuggestion.result}</p>
                           </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 4. Action Bar (Floating) */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-full p-2 flex items-center gap-3 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          <Button variant="ghost" className="rounded-full px-6 h-12 gap-2 text-muted-foreground hover:text-foreground hover:bg-white/5">
            <Download className="h-4 w-4" />
            <span>导出 PDF 报告</span>
          </Button>
          <div className="h-6 w-px bg-white/10" />
          <Button className="bg-gradient-primary rounded-full px-8 h-12 gap-2 shadow-glow group">
            <Target className="h-4 w-4" />
            <span>将弱点转化为学习目标</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

function Star({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
