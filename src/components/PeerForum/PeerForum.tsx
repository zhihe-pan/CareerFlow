import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, MessageSquare, ThumbsUp, MessageCircle, 
  MapPin, Clock, Search, Filter, Sparkles, 
  ChevronRight, Share2, MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterTab } from "@/components/ui/filter-tab";

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  jobRole: string;
  company: string;
  content: string;
  tags: string[];
  timestamp: string;
  metrics: {
    likes: number;
    comments: number;
  };
}

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    author: { name: "张小强", avatar: "👤" },
    jobRole: "前端开发",
    company: "字节跳动",
    content: "刚面完字节抖音前端二面，面试官人超好。考了大量的 CSS 布局和 React 底层原理，感觉 Fiber 架构那块没答太透。希望能攒个人品过二面！",
    tags: ["#二面", "#React", "#许愿"],
    timestamp: "2小时前",
    metrics: { likes: 24, comments: 8 }
  },
  {
    id: "2",
    author: { name: "李老师", avatar: "🧠" },
    jobRole: "算法工程师",
    company: "美团",
    content: "美团大模型组的一面经验分享：重点考察了 Transformer 的注意力机制优化，以及在实际业务中如何处理长文本。手撕代码是一道变种的动态规划，难度中等偏上。",
    tags: ["#一面", "#大模型", "#算法题"],
    timestamp: "5小时前",
    metrics: { likes: 56, comments: 12 }
  },
  {
    id: "3",
    author: { name: "王大拿", avatar: "🛠️" },
    jobRole: "后端开发",
    company: "腾讯",
    content: "腾讯云后端日常实习面试。被问到了很多关于分布式锁和 Redis 缓存一致性的问题。感觉对高并发场景的理解还不够深，需要再补补课。",
    tags: ["#实习", "#Redis", "#分布式"],
    timestamp: "8小时前",
    metrics: { likes: 15, comments: 4 }
  },
  {
    id: "4",
    author: { name: "陈皮皮", avatar: "🎨" },
    jobRole: "产品经理",
    company: "小红书",
    content: "小红书产品运营面经：围绕社区生态和用户留存做了深入讨论。需要对小红书的调性有很强的感知力。面试官问得非常细，甚至涉及到了某一个交互改动的预期效果。",
    tags: ["#产品面经", "#用户增长", "#小红书"],
    timestamp: "12小时前",
    metrics: { likes: 32, comments: 6 }
  },
  {
    id: "5",
    author: { name: "赵六六", avatar: "👨‍💻" },
    jobRole: "前端开发",
    company: "阿里巴巴",
    content: "阿里核心业务前端架构面。主要聊了微前端的选型（Qiankun vs Module Federation）和大型项目的首屏性能优化。面试官非常有深度，学到了很多。",
    tags: ["#三面", "#架构", "#微前端"],
    timestamp: "1天前",
    metrics: { likes: 89, comments: 21 }
  }
];

const ROLES = ["全部", "前端开发", "后端开发", "算法工程师", "产品经理"];

export const PeerForum = () => {
  const [activeFilter, setActiveFilter] = useState("全部");

  const filteredPosts = useMemo(() => {
    if (activeFilter === "全部") return MOCK_POSTS;
    return MOCK_POSTS.filter(post => post.jobRole === activeFilter);
  }, [activeFilter]);

  return (
    <div className="flex flex-col h-full overflow-hidden animate-fade-in text-foreground px-4 sm:px-8">
      {/* Filter Area */}
      <div className="flex flex-wrap items-center gap-2 pt-3 pb-4 shrink-0">
        {ROLES.map((role) => (
          <FilterTab
            key={role}
            label={role}
            active={activeFilter === role}
            onClick={() => setActiveFilter(role)}
          />
        ))}
      </div>

      {/* Posts List */}
      <div className="flex-1 overflow-y-auto scrollbar-none pb-12">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative glass p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col h-full"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full glass-strong flex items-center justify-center text-xl shadow-inner">
                      {post.author.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{post.author.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                        <span className="text-primary-glow">{post.jobRole}</span>
                        <span className="h-1 w-1 rounded-full bg-white/20" />
                        <span>{post.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <button className="h-8 w-8 rounded-full hover:bg-white/5 flex items-center justify-center text-muted-foreground transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>

                {/* Post Content */}
                <div className="mb-4 flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="px-2.5 py-1 rounded bg-success/10 border border-success/20 text-success text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
                      <MapPin className="h-3 w-3" />
                      {post.company}
                    </div>
                    {post.tags.map(tag => (
                      <span key={tag} className="text-[10px] text-muted-foreground font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-[13px] leading-relaxed text-foreground/80 line-clamp-3">
                    {post.content}
                  </p>
                </div>

                {/* Post Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary-glow transition-all active:scale-95 group/btn">
                      <ThumbsUp className="h-3.5 w-3.5 group-hover/btn:fill-primary-glow" />
                      <span className="font-mono">{post.metrics.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary-glow transition-all active:scale-95 group/btn">
                      <MessageCircle className="h-3.5 w-3.5 group-hover/btn:fill-primary-glow" />
                      <span className="font-mono">{post.metrics.comments}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground transition-colors">
                      <Share2 className="h-3.5 w-3.5" />
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-bold text-muted-foreground hover:text-foreground transition-all">
                      查看详情
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Glow Backdrop */}
                <div className="absolute inset-0 rounded-3xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <div className="h-20 w-20 rounded-full glass flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <h3 className="text-lg font-bold text-muted-foreground">暂无相关动态</h3>
            <p className="text-sm text-muted-foreground/60 max-w-xs mt-2">换个筛选条件试试，或者成为第一个发起讨论的人吧！</p>
          </div>
        )}
      </div>
    </div>
  );
};
