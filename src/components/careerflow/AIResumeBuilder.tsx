import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Sparkles, BrainCircuit, Target, Layers, 
  RotateCcw, Edit3, ChevronDown, CheckCircle2,
  Briefcase, Zap, Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCards } from "@/lib/store";

interface AIResumeBuilderProps {
  onClose: () => void;
}

const MOCK_MATERIALS = [
  { id: "1", title: "字节跳动 - 前端实习经历", match: 95, tags: ["React", "Performance", "Teamwork"], content: "负责字节跳动核心业务组件库维护，通过原子化组件设计提升开发效率 30%。参与双十一活动页性能优化，首屏加载速度提升 200ms。" },
  { id: "2", title: "美团 - 到店事业部项目", match: 92, tags: ["TypeScript", "Kanban", "UX"], content: "主导美团到店商家端仪表盘重构。采用 TypeScript + Zustand 优化状态管理，降低业务代码耦合度。首创 Stepwise 任务拆解模型，助力商家营收增长。" },
  { id: "3", title: "个人项目 - AI 求职助手", match: 88, tags: ["LLM", "Prompt Engineering", "OpenAI"], content: "独立开发 AI 简历优化工具，利用 GPT-4 接口实现 JD 自动解析与简历内容重写。累计服务用户 1000+，好评率达 98%。" },
  { id: "4", title: "英语能力 - 专业八级", match: 85, tags: ["English", "UI/UX", "Localization"], content: "具备敏锐的国际化视野，能够流利使用中英双语进行技术沟通与文档撰写。" },
  { id: "5", title: "算法竞赛 - ACM 省一", match: 80, tags: ["Algorithms", "Logic", "C++"], content: "拥有极其扎实的算法逻辑功底，能够高效解决复杂业务场景下的计算瓶颈问题。" }
];

const JOB_SKILLS_ANALYSIS = {
  "美团 - AI产品经理": [
    { name: "大模型应用", value: 95 },
    { name: "数据分析", value: 85 },
    { name: "用户洞察", value: 90 },
    { name: "策略定义", value: 80 },
    { name: "技术背景", value: 88 }
  ],
  "字节跳动 - 前端向": [
    { name: "性能优化", value: 98 },
    { name: "工程化能力", value: 92 },
    { name: "协作沟通", value: 85 },
    { name: "产品思维", value: 80 },
    { name: "架构设计", value: 90 }
  ]
};

export const AIResumeBuilder = ({ onClose }: AIResumeBuilderProps) => {
  const { cards } = useCards();
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [isAssembling, setIsAssembling] = useState(false);

  const selectedJob = useMemo(() => {
    return cards.find(c => c.id === selectedJobId) || cards[0];
  }, [cards, selectedJobId]);

  const skills = useMemo(() => {
    // Determine which skill set to show based on job title, fallback to default
    const title = `${selectedJob?.company} - ${selectedJob?.role}`;
    if (title.includes("AI产品")) return JOB_SKILLS_ANALYSIS["美团 - AI产品经理"];
    return JOB_SKILLS_ANALYSIS["字节跳动 - 前端向"];
  }, [selectedJob]);

  const handleAssemble = () => {
    setIsAssembling(true);
    setTimeout(() => setIsAssembling(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose} />
      
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-7xl h-full glass-strong rounded-[2.5rem] border border-white/10 flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold tracking-tight">AI 智能简历拼装台</h2>
              <p className="text-[11px] text-muted-foreground">根据 JD 实时语义分析，从素材库中动态聚合最优经历组合</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="h-10 w-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Pane: JD Analysis */}
          <aside className="w-[380px] border-r border-white/5 flex flex-col p-8 overflow-y-auto scrollbar-none">
            <div className="mb-10">
              <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-4 block">选择目标岗位 (来自看板)</label>
              <div className="relative group">
                <select 
                  value={selectedJobId} 
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer"
                >
                  <option value="" disabled>选择一个进行中的申请...</option>
                  {cards.map(card => (
                    <option key={card.id} value={card.id}>{card.company} · {card.role}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none group-hover:text-foreground transition-colors" />
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-8">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-bold flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary-glow" />
                    JD 核心能力解析
                  </h3>
                  <span className="text-[10px] bg-primary/20 text-primary-glow px-2 py-0.5 rounded-full font-bold">ALPHA</span>
                </div>

                {/* Radar Chart Mockup */}
                <div className="relative h-64 flex items-center justify-center mb-8">
                  <svg className="w-full h-full p-4 overflow-visible" viewBox="0 0 100 100">
                    {/* Background Polygons */}
                    {[0.2, 0.4, 0.6, 0.8, 1].map(scale => (
                      <polygon
                        key={scale}
                        points="50,0 100,38 82,100 18,100 0,38"
                        className="stroke-white/5 fill-none"
                        transform={`translate(${50 - 50*scale}, ${50 - 50*scale}) scale(${scale})`}
                      />
                    ))}
                    {/* Data Polygon */}
                    <motion.polygon
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      points="50,10 90,40 75,90 25,90 10,40"
                      className="fill-primary/20 stroke-primary-glow stroke-[1.5]"
                    />
                    {/* Labels */}
                    {skills.map((skill, index) => {
                      const angle = (index * 72) - 90;
                      const rad = (angle * Math.PI) / 180;
                      const x = 50 + 60 * Math.cos(rad);
                      const y = 50 + 60 * Math.sin(rad);
                      return (
                        <text
                          key={skill.name}
                          x={x}
                          y={y}
                          className="text-[6px] fill-muted-foreground font-bold"
                          textAnchor="middle"
                          alignmentBaseline="middle"
                        >
                          {skill.name}
                        </text>
                      );
                    })}
                  </svg>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map(s => (
                    <div key={s.name} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[11px] font-medium flex items-center gap-2 transition-all hover:border-primary/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-glow" />
                      {s.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-2 mb-2 text-primary-glow">
                  <BrainCircuit className="h-4 w-4" />
                  <span className="text-xs font-bold">AI 深入解读</span>
                </div>
                <p className="text-[12px] text-muted-foreground leading-relaxed italic">
                  "该岗位核心痛点在于大模型在垂直场景的商业化落地，建议在拼装时优先选择体现‘逻辑拆解’与‘数据闭环’相关的项目素材。"
                </p>
              </div>
            </div>
          </aside>

          {/* Right Pane: Assembly Area */}
          <main className="flex-1 flex flex-col p-10 overflow-y-auto scrollbar-none bg-black/20">
            <header className="mb-8 flex items-end justify-between">
              <div>
                <motion.div 
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="flex items-center gap-2 mb-2"
                >
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-6 w-6 rounded-full border-2 border-card bg-primary-glow/20 flex items-center justify-center">
                        <Star className="h-3 w-3 text-primary-glow" fill="currentColor" />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gradient">AI 已为您从 24 个素材中精准匹配 5 项经历</span>
                </motion.div>
                <h3 className="text-3xl font-display font-bold">整体契合度 <span className="text-success text-shadow-glow">92%</span></h3>
              </div>
              <Button 
                onClick={handleAssemble}
                disabled={isAssembling}
                className="bg-white/10 hover:bg-white/20 border-white/10 rounded-2xl gap-2 font-display uppercase tracking-widest text-xs h-12"
              >
                <RotateCcw className={cn("h-4 w-4", isAssembling && "animate-spin")} />
                重新拼装
              </Button>
            </header>

            <div className="grid grid-cols-1 gap-5">
              <AnimatePresence>
                {MOCK_MATERIALS.map((material, idx) => (
                  <motion.div
                    key={material.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative group glass p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Layers className="h-5 w-5 text-primary-glow" />
                          <h4 className="font-bold text-lg">{material.title}</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {material.tags.map(tag => (
                            <span key={tag} className="text-[10px] text-muted-foreground uppercase font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5">#{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="px-3 py-1.5 rounded-xl bg-success/10 border border-success/20 flex flex-col items-center shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                          <span className="text-[9px] font-bold text-success/70 uppercase">AI Match</span>
                          <span className="text-xl font-mono font-black text-success tracking-tighter">{material.match}%</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-foreground/80 leading-relaxed mb-6 border-l-2 border-primary/20 pl-4 py-1 italic">
                      {material.content}
                    </p>

                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                        <span>已针对 JD 完成关键词映射</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 rounded-lg gap-2 text-muted-foreground hover:text-foreground">
                          <Edit3 className="h-3.5 w-3.5" />
                          编辑
                        </Button>
                        <Button size="sm" className="h-8 rounded-lg gap-2 bg-primary/20 text-primary-glow hover:bg-primary/30">
                          <RotateCcw className="h-3.5 w-3.5" />
                          局部调优
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </main>
        </div>

        {/* Footer Actions */}
        <footer className="h-24 px-10 border-t border-white/5 flex items-center justify-between shrink-0 glass-strong">
          <div className="flex items-center gap-6">
             <div className="flex flex-col">
               <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">预估简历页数</span>
               <span className="text-sm font-bold">1.2 Pgs</span>
             </div>
             <div className="h-8 w-px bg-white/5" />
             <div className="flex flex-col">
               <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">核心关键词覆盖</span>
               <span className="text-sm font-bold text-primary-glow">28 / 32</span>
             </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onClose} className="rounded-2xl px-8 py-6 h-auto border-white/10 hover:bg-white/5">
              取消并退出
            </Button>
            <Button className="bg-gradient-primary rounded-2xl px-10 py-6 h-auto shadow-glow group relative overflow-hidden">
               <motion.div 
                 className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" 
               />
               <div className="flex items-center gap-3">
                 <Zap className="h-5 w-5 fill-white" />
                 <span className="font-bold text-lg">一键生成 PDF 简历</span>
               </div>
            </Button>
          </div>
        </footer>
      </motion.div>
    </motion.div>
  );
};
