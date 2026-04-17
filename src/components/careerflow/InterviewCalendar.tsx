import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Video, Mic, MicOff, VideoOff, Activity, Trophy,
  User, Clock, ArrowRight, CheckCircle2, Sparkles, 
  ChevronRight, BrainCircuit, FileText, Layout, MessageSquare,
  Maximize2, Minimize2, X, ArrowLeft
} from "lucide-react";
import { Waveform } from "./Waveform";
import { InterviewReport } from "@/components/InterviewReport";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const MOCK_INTERVIEWS = [
  {
    id: "1",
    company: "美团",
    role: "前端开发工程师",
    type: "技术一面",
    time: "10月28日 14:00",
    status: "upcoming"
  },
  {
    id: "2",
    company: "字节跳动",
    role: "抖音事业部 - 前端",
    type: "业务二面",
    time: "11月2日 10:00",
    status: "upcoming"
  },
  {
    id: "3",
    company: "百度",
    role: "资深前端开发",
    type: "技术终面",
    time: "11月5日 15:30",
    status: "pending"
  }
];

const MOCK_JD = {
  title: "高级前端开发工程师",
  company: "美团 - 到家事业部",
  salary: "¥30k-50k",
  description: "1. 负责美团到家业务核心前端页面的开发与维护；\n2. 参与前端架构设计，优化工程化流程与开发效率；\n3. 与产品、设计配合，通过技术手段提升用户体验与页面性能；\n4. 关注前端前沿技术，并能在实际项目中落地。",
  requirements: [
    "5年以上前端开发经验，熟练掌握 React 及其生态系统；",
    "深入理解 TypeScript，有大型复杂项目的架构设计经验；",
    "扎实的算法功底，熟悉常见的设计模式；",
    "具备优秀的沟通能力与团队协作意识。"
  ]
};

const MOCK_TRANSCRIPT = [
  { role: "ai", time: "14:05", content: "你好，请先简单介绍一下你自己和你最近的一个项目。" },
  { role: "user", time: "14:06", content: "你好，我是一名有着5年经验的前端工程师。最近我主导了 CareerFlow 项目，这是一个基于 React 的智能求职看板。" },
  { role: "ai", time: "14:08", content: "听起来很有趣。在这个项目中，你是如何处理大量任务卡片在看板上的性能问题的？" },
  { role: "user", time: "14:10", content: "我们采用了虚拟列表（Virtual List）渲染方案，并使用了 memo 化组件来减少不必要的重绘。" }
];

export const InterviewCalendar = () => {
  const [selectedId, setSelectedId] = useState(MOCK_INTERVIEWS[0].id);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isJDOpen, setIsJDOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const activeInterview = MOCK_INTERVIEWS.find(i => i.id === selectedId) || MOCK_INTERVIEWS[0];

  return (
    <div className="flex flex-1 w-full h-full gap-6 overflow-hidden animate-fade-in text-foreground">
      {/* Left Pane: Upcoming Timeline */}
      <div className="flex flex-col gap-4 w-1/4 min-w-[280px] h-full bg-white/[0.02] rounded-3xl p-5 border border-white/5">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60">即将到来的战役</span>
          <span className="text-[10px] text-muted-foreground/40 font-mono">3 总计</span>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto pr-1 scrollbar-none">
          {MOCK_INTERVIEWS.map((interview) => {
            const isActive = selectedId === interview.id;
            return (
              <motion.button
                key={interview.id}
                onClick={() => {
                  setSelectedId(interview.id);
                  setShowReport(false);
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={cn(
                  "relative p-3 rounded-xl text-left transition-all duration-300",
                  isActive ? "bg-primary/10 shadow-glow border-primary/20" : "bg-white/[0.02] border border-white/5 hover:bg-white/5"
                )}
              >
                {isActive && <div className="absolute inset-0 rounded-xl flow-border pointer-events-none" />}
                
                <div className="flex justify-between items-start mb-1">
                  <span className={cn(
                    "text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider",
                    isActive ? "bg-primary-glow/20 text-primary-glow" : "bg-white/10 text-muted-foreground"
                  )}>
                    {interview.type}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                    <Clock className="h-2.5 w-2.5" />
                    <span>{interview.time}</span>
                  </div>
                </div>

                <h3 className="font-bold text-sm mb-0.5">{interview.company}</h3>
                <p className="text-[11px] text-muted-foreground truncate">{interview.role}</p>

                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, x: -5 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-2 flex items-center gap-1.5 text-[9px] text-primary-glow/80 font-bold uppercase tracking-tighter"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary-glow animate-pulse" />
                    <span>正在校准模拟器</span>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Right Pane: AI Interview Station */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        <div className="flex-1 glass-strong rounded-3xl overflow-hidden flex flex-col border border-blue-500/10 shadow-2xl relative">
          {/* Subtle flowing border effect for the whole station */}
          <div className="absolute inset-0 rounded-3xl border border-blue-500/10 pointer-events-none" />

          {/* Station Header */}
          <header className="h-14 px-6 bg-white/[0.03] border-b border-white/5 flex items-center justify-between shrink-0 z-10">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowReport(false)}
                className={cn("h-8 w-8 rounded-full transition-all bg-white/5 ring-1 ring-white/10 hover:bg-white/10", !showReport && "hidden")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-500",
                showReport ? "bg-primary/20" : "bg-success/20"
              )}>
                {showReport ? (
                  <Activity className="h-4 w-4 text-primary-glow" />
                ) : (
                  <BrainCircuit className="h-4 w-4 text-success" />
                )}
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                  {showReport ? "战役复盘分析" : "正在进行模拟"}
                </span>
                <h4 className="text-sm font-bold flex items-center gap-2">
                  {activeInterview.company} · {activeInterview.role}
                </h4>
              </div>
            </div>
            
            {!showReport ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[11px] font-bold text-success uppercase tracking-widest">AI 面试官已就绪</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Trophy className="h-3 w-3 text-primary-glow" />
                <span className="text-[11px] font-bold text-primary-glow uppercase tracking-widest">Performance Score: 85</span>
              </div>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsJDOpen(true)}
                className="h-8 gap-2 text-muted-foreground hover:text-foreground hover:bg-white/5"
              >
                <FileText className="h-4 w-4" />
                <span className="text-xs">查看 JD</span>
              </Button>
            </div>
          </header>

          <div className="flex-1 flex flex-col relative overflow-hidden">
            <AnimatePresence mode="wait">
              {showReport ? (
                <motion.div
                  key="report"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 overflow-hidden"
                >
                  <InterviewReport onBack={() => setShowReport(false)} />
                </motion.div>
              ) : (
                <motion.div
                  key="station"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex-1 flex flex-col relative overflow-hidden"
                >
                  {/* AI View (Upper) — shrink-0: protected, will NOT be compressed */}
                  <motion.div 
                    layout
                    className="glass bg-black/40 flex flex-col items-center justify-start relative p-6 pt-10 transition-all duration-500 shrink-0 overflow-hidden"
                  >
                    <div className="absolute top-4 left-6 flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold shrink-0">
                      <Activity className="h-3 w-3 text-primary-glow" />
                      <span>AI 面试官实战舱</span>
                    </div>

                    <div className="relative mb-4 shrink-0">
                      <motion.div 
                        layout
                        className={cn(
                          "rounded-full bg-primary/10 flex items-center justify-center relative shadow-[0_0_50px_rgba(139,92,246,0.3)] transition-all duration-500",
                          isFocusMode ? "h-20 w-20" : "h-24 w-24"
                        )}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
                        />
                        <div className={cn(
                          "rounded-full glass flex items-center justify-center text-primary-glow transition-all duration-500",
                          isFocusMode ? "h-14 w-14" : "h-16 w-16"
                        )}>
                          <Sparkles className={cn("transition-all", isFocusMode ? "h-6 w-6" : "h-8 w-8")} />
                        </div>
                      </motion.div>
                    </div>

                    <div className="shrink-0">
                      <Waveform />
                    </div>

                    <div className="mt-2 max-w-2xl text-center px-6 shrink-0">
                      <p className="text-[13px] text-foreground/80 font-medium leading-relaxed italic line-clamp-2">
                        "同学你好，我看你的简历里提到了在之前的项目中用到了大模型，能具体讲讲你的 prompt 优化策略吗？"
                      </p>
                    </div>
                  </motion.div>

                  {/* User View / Transcript Area (Lower) — flex-1 min-h-0: can shrink freely */}
                  <div className="flex-1 min-h-0 relative flex flex-col overflow-hidden bg-black/60">
                    <AnimatePresence mode="wait">
                      {isFocusMode ? (
                        <motion.div
                          key="transcript"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="flex-1 flex flex-col p-6 overflow-y-auto scrollbar-none"
                        >
                          <div className="flex items-center gap-2 mb-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            <MessageSquare className="h-3 w-3" />
                            <span>面试对话历史 (Transcript)</span>
                          </div>
                          <div className="flex flex-col gap-4">
                            {MOCK_TRANSCRIPT.map((item, idx) => (
                              <div key={idx} className={cn(
                                "flex flex-col max-w-[85%] rounded-2xl p-4 text-[13px] leading-relaxed",
                                item.role === "ai" 
                                  ? "self-start bg-white/5 border border-white/5 text-foreground/90" 
                                  : "self-end bg-primary/10 border border-primary/20 text-primary-glow"
                              )}>
                                <div className="flex items-center gap-2 mb-1.5 opacity-50 text-[10px] font-mono">
                                  <span className="uppercase font-bold">{item.role}</span>
                                  <span>{item.time}</span>
                                </div>
                                {item.content}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="camera"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex-1 relative flex items-center justify-center overflow-hidden bg-black/80"
                        >
                          <div className="absolute top-4 left-6 flex items-center gap-3 z-10">
                            <div className="flex items-center gap-2 px-2 py-1 rounded bg-black/40 border border-white/10">
                              <div className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
                              <span className="text-[10px] font-mono font-bold tracking-tighter text-white">REC</span>
                            </div>
                            <span className="text-[10px] text-white/40 font-mono">00:04:12</span>
                          </div>

                          {isVideoOn ? (
                            <div className="w-full h-full relative group">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <div className="flex flex-col items-center justify-center h-full text-white/20">
                                <User className="h-24 w-24 mb-4" />
                                <p className="text-xs font-medium uppercase tracking-[0.2em]">Live Camera Feed Placeholder</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-muted-foreground gap-4">
                              <div className="h-24 w-24 rounded-full glass flex items-center justify-center">
                                <VideoOff className="h-8 w-8 text-white/20" />
                              </div>
                              <p className="text-sm">摄像头已关闭</p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* HUD Panels (Floating) */}
                    <motion.div 
                      layout
                      className={cn(
                        "absolute flex flex-col gap-3 transition-all duration-500",
                        isFocusMode ? "bottom-4 left-6" : "bottom-6 right-6"
                      )}
                    >
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass p-4 rounded-2xl w-48 border-white/5 shadow-2xl"
                      >
                        <h5 className="text-[10px] text-muted-foreground uppercase font-bold mb-3 tracking-widest">心理学实时增强</h5>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px]">情绪波动</span>
                            <div className="flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-success" />
                              <span className="text-[11px] font-bold text-success">平稳</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-[11px]">语速情况</span>
                            <span className="text-[11px] font-bold text-white/80">适中 (140wpm)</span>
                          </div>

                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-2">
                            <motion.div 
                              animate={{ width: ["30%", "60%", "45%", "55%"] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="h-full bg-primary-glow"
                            />
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Control Bar */}
          <footer className={cn(
            "h-24 glass-strong border-t border-white/10 px-8 flex items-center justify-between shrink-0 relative z-10 transition-all duration-500",
            showReport && "opacity-0 pointer-events-none translate-y-full h-0 border-none"
          )}>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsMicOn(!isMicOn)}
                className={cn(
                  "h-12 w-12 rounded-full border-white/10 transition-all duration-300",
                  isMicOn ? "bg-white/5" : "bg-destructive/20 text-destructive border-destructive/20"
                )}
              >
                {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={cn(
                  "h-12 w-12 rounded-full border-white/10 transition-all duration-300",
                  isVideoOn ? "bg-white/5" : "bg-destructive/20 text-destructive border-destructive/20"
                )}
              >
                {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
            </div>

            <Button
              size="lg"
              disabled={isFinishing}
              onClick={() => {
                setIsFinishing(true);
                setTimeout(() => {
                  setIsFinishing(false);
                  setShowReport(true);
                }, 2000);
              }}
              className="bg-gradient-primary hover:opacity-90 shadow-glow rounded-full px-8 py-6 h-auto font-bold text-base gap-2"
            >
              {isFinishing ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>计算评分中...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>结束回答，获取 AI 评分</span>
                </>
              )}
            </Button>

            <div className="flex items-center gap-4">
               <Button
                 variant="ghost"
                 onClick={() => setIsFocusMode(!isFocusMode)}
                 className={cn(
                   "gap-2 h-11 px-4 rounded-xl transition-all duration-300",
                   isFocusMode ? "bg-primary/20 text-primary-glow" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                 )}
               >
                 {isFocusMode ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                 <span className="text-xs font-bold uppercase tracking-wider">{isFocusMode ? "退出专注" : "专注模式"}</span>
               </Button>
               <button className="p-3 rounded-xl hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground">
                 <Activity className="h-5 w-5" />
               </button>
            </div>
          </footer>

          {/* JD Detail Overlay */}
          <AnimatePresence>
            {isJDOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsJDOpen(false)}
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40"
                />
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="absolute top-0 right-0 bottom-24 w-[400px] glass-strong border-l border-white/10 z-50 p-8 overflow-y-auto shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold font-display">职位详情 (JD)</h3>
                    <Button variant="ghost" size="icon" onClick={() => setIsJDOpen(false)} className="rounded-full hover:bg-white/5">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-sm font-bold text-primary-glow mb-2 uppercase tracking-wider">岗位名称</h4>
                      <p className="text-lg font-bold">{MOCK_JD.title}</p>
                      <p className="text-sm text-muted-foreground">{MOCK_JD.company} · {MOCK_JD.salary}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-primary-glow mb-2 uppercase tracking-wider">岗位描述</h4>
                      <div className="text-[13px] leading-relaxed text-foreground/80 space-y-2">
                        {MOCK_JD.description.split('\n').map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-primary-glow mb-2 uppercase tracking-wider">任职要求</h4>
                      <ul className="space-y-3">
                        {MOCK_JD.requirements.map((req, i) => (
                          <li key={i} className="flex gap-3 text-[13px] text-foreground/80">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary-glow shrink-0 mt-2" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
