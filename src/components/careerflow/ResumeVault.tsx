import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Download,
  Eye,
  Layers,
  Sparkles,
  ChevronRight,
  Briefcase,
  User,
  Cpu,
  Clock,
  ExternalLink,
  Zap,
  X,
  Layout,
  GripVertical,
  Trash2,
  CheckCircle2,
  ChevronsUpDown,
  Pencil,
} from "lucide-react";
import { notify } from "@/lib/app-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { JobCard } from "@/lib/types";
import { useResumeLibraryStore, type ComposerSavedResume } from "@/lib/resumeLibraryStore";
import { AIResumeBuilder } from "./AIResumeBuilder";
import { Reorder } from "framer-motion";
import { FilterTab } from "@/components/ui/filter-tab";

type SubTab = "versions" | "materials";
type Category = "personal" | "education" | "projects" | "academic" | "skills" | "evaluation";

type SelectedMaterialItem = {
  id: string; // unique ID for Reorder
  materialId: string;
  versionIdx: number;
};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const UNIVERSAL_JOB_PREFIX = "__cv_univ__";

type MockCompanyVersion = {
  id: string;
  company: string;
  title: string;
  date: string;
  tags: string[];
  brandColor: string;
  logo: string;
};

type MockResumeGroup = {
  role: string;
  icon: string;
  baseTemplate: { id: string; title: string; date: string; tags: string[] };
  companyVersions: MockCompanyVersion[];
};

const MOCK_RESUME_GROUPS: MockResumeGroup[] = [
  {
    role: "AI 产品经理",
    icon: "🤖",
    baseTemplate: {
      id: "base_1",
      title: "大模型产品经理通用版 - 2024秋招",
      date: "2024-04-12",
      tags: ["#大模型策略", "#中英双语", "#AIGC"],
    },
    companyVersions: [
      {
        id: "cv_1a",
        company: "百度",
        title: "百度文心一言定制版",
        date: "2024-04-14",
        tags: ["#文心大模型", "#Prompt调优"],
        brandColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        logo: "B",
      },
      {
        id: "cv_1b",
        company: "字节跳动",
        title: "字节豆包业务定制版",
        date: "2024-04-15",
        tags: ["#多模态", "#C端增长", "#商业化"],
        brandColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        logo: "Byte",
      },
    ],
  },
  {
    role: "用户研究员",
    icon: "🧠",
    baseTemplate: {
      id: "base_2",
      title: "心理学研究向基础版",
      date: "2024-03-28",
      tags: ["#用户行为", "#AB测试设计", "#数据洞察"],
    },
    companyVersions: [],
  },
];

function jobRoleHeadline(role: string): string {
  const head = role.split(/[·（(]/)[0]?.trim();
  return head || role.trim();
}

function pickGroupRoleForJob(job: JobCard, groups: MockResumeGroup[]): string {
  const jr = job.role.toLowerCase();
  for (const g of groups) {
    const gr = g.role.toLowerCase();
    if (jr.includes(gr) || gr.split(/[\s·/]/).some((p) => p.length >= 2 && jr.includes(p.toLowerCase()))) {
      return g.role;
    }
  }
  return groups[0]?.role ?? "AI 产品经理";
}

type DeliveryOption =
  | {
      kind: "universal";
      id: string;
      groupIndex: number;
      anchorLine: string;
      groupRole: string;
      targetCompany: string;
      targetRole: string;
    }
  | {
      kind: "job";
      id: string;
      anchorLine: string;
      groupRole: string;
      targetCompany: string;
      targetRole: string;
      sourceJob: JobCard;
    };

function composerCardTitle(item: ComposerSavedResume): string {
  return item.anchorLine ?? item.displayTitle ?? `${jobRoleHeadline(item.targetRole)}·${item.targetCompany}`;
}

function LibraryCardCornerActions({
  onEdit,
  onDelete,
  deleteDisabled,
}: {
  onEdit: () => void;
  onDelete: () => void;
  deleteDisabled?: boolean;
}) {
  return (
    <div className="absolute top-2 right-2 z-20 flex gap-0.5">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-primary-glow hover:bg-primary/10"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        title="编辑"
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={deleteDisabled}
        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-35 disabled:pointer-events-none"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title={deleteDisabled ? "内置示例不可删除" : "删除"}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

function SavedComposerVersionCard({
  item,
  onEdit,
  onDelete,
}: {
  item: ComposerSavedResume;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const title = composerCardTitle(item);
  const logo =
    item.targetCompany === "通用"
      ? "通"
      : item.targetCompany.slice(0, 2);
  const dateStr = format(new Date(item.savedAt), "yyyy-MM-dd HH:mm");
  const tags = [`#编排 ${item.completeness}%`, `${item.blocks.length} 模块`];
  return (
    <div className="group relative h-44 rounded-2xl glass bg-[#121318]/40 p-5 border border-white/10 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 flex flex-col justify-between ml-0 xl:ml-6">
      <LibraryCardCornerActions onEdit={onEdit} onDelete={onDelete} />
      <div className="hidden xl:block absolute -left-[26px] top-1/2 w-6 h-px bg-white/10 pointer-events-none group-hover:bg-primary/30 transition-colors" />
      <div className="hidden xl:block absolute -left-[26px] -top-6 bottom-1/2 w-px bg-white/10 pointer-events-none group-hover:bg-primary/30 transition-colors" />
      <div>
        <div className="flex items-end justify-between mb-3 gap-2">
          <div className="flex items-center gap-2.5 min-w-0 pr-14">
            <div className="h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold border bg-primary/15 text-primary-glow border-primary/25 shrink-0">
              {logo}
            </div>
            <h3 className="font-display font-semibold text-[14px] truncate text-foreground/90 antialiased">{title}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-3 w-3 text-muted-foreground/50" />
          <span className="text-[10px] text-muted-foreground/50 font-mono tracking-wide">编排定稿 | {dateStr}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 line-clamp-1 h-[22px] overflow-hidden">
          {tags.map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.03] text-muted-foreground/70 border border-white/5 font-mono">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-auto pt-4 w-full">
        <Button
          className="w-10 bg-white/[0.03] hover:bg-white/10 text-xs h-8 p-0 border border-white/5 shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          variant="secondary"
          title="预览"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button className="flex-1 bg-white/5 hover:bg-white/10 text-foreground/90 text-xs h-8 gap-2 border border-white/10 hover:border-white/20 transition-all font-medium">
          <FileText className="h-3.5 w-3.5 opacity-70" /> 生成 PDF 文档
        </Button>
      </div>
    </div>
  );
}

interface ResumeVaultProps {
  /** 看板「我的备选池」中的职位，用于选择投递目标 */
  poolJobs?: JobCard[];
}

export const ResumeVault = ({ poolJobs = [] }: ResumeVaultProps) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("versions");
  const [activeCategory, setActiveCategory] = useState<Category>("personal");
  const [isAdapting, setIsAdapting] = useState<string | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<SelectedMaterialItem[]>([]);
  const [viewedVersions, setViewedVersions] = useState<Record<string, number>>({});
  const resumeCanvasRef = useRef<HTMLDivElement>(null);
  const [confirmingLibrary, setConfirmingLibrary] = useState(false);
  const [sealSuccessPulse, setSealSuccessPulse] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [editingResumeId, setEditingResumeId] = useState<string | null>(null);
  const resumeLibrary = useResumeLibraryStore((s) => s.resumeLibrary);

  const deliveryOptions = useMemo<DeliveryOption[]>(() => {
    const universal: DeliveryOption[] = MOCK_RESUME_GROUPS.map((g, i) => ({
      kind: "universal",
      id: `${UNIVERSAL_JOB_PREFIX}${i}`,
      groupIndex: i,
      anchorLine: `${g.role}·通用`,
      groupRole: g.role,
      targetCompany: "通用",
      targetRole: g.role,
    }));
    const jobs: DeliveryOption[] = poolJobs.map((j) => ({
      kind: "job",
      id: j.id,
      anchorLine: `${jobRoleHeadline(j.role)}·${j.company.trim()}`,
      groupRole: pickGroupRoleForJob(j, MOCK_RESUME_GROUPS),
      targetCompany: j.company.trim(),
      targetRole: j.role.trim(),
      sourceJob: j,
    }));
    return [...universal, ...jobs];
  }, [poolJobs]);

  const selectedDelivery = useMemo(
    () => deliveryOptions.find((o) => o.id === selectedJobId),
    [deliveryOptions, selectedJobId]
  );
  const targetCompany = selectedDelivery?.targetCompany ?? "";
  const targetRole = selectedDelivery?.targetRole ?? "";

  useEffect(() => {
    if (selectedJobId && !deliveryOptions.some((o) => o.id === selectedJobId)) {
      setSelectedJobId("");
    }
  }, [deliveryOptions, selectedJobId]);

  const categories = [
    { id: "personal", label: "个人信息", icon: User },
    { id: "education", label: "教育经历", icon: Layers },
    { id: "projects", label: "实习项目", icon: Briefcase },
    { id: "academic", label: "学术经历", icon: FileText },
    { id: "skills", label: "专业技能", icon: Cpu },
    { id: "evaluation", label: "个人评价", icon: Zap },
  ];

  const resumeGroups = MOCK_RESUME_GROUPS;

  const atomicMaterials: Record<Category, { id: string; title: string; versions: { name: string; content: string }[] }[]> = {
    personal: [
      {
        id: "p1",
        title: "基础联系信息",
        versions: [
          {
            name: "默认配置",
            content: "电话：+86 138-xxxx-xxxx\n邮箱：caddice@example.com\nGitHub: github.com/caddicedev\n求职意向：全栈研发 / AI产品经理",
          }
        ]
      }
    ],
    education: [
      {
        id: "e1",
        title: "北京大学 / 计算机科学",
        versions: [
          {
            name: "硕博连读",
            content: "学历：博士研究生 | 时间：2020.09 - 2025.06\nGPA：3.85 / 4.00 (专业前 5%)\n荣誉奖项：国家奖学金 (2022)、CCF 优秀博士生奖\n核心课程：深度学习、人机交互应用、高级算法分析",
          }
        ]
      },
      {
        id: "e2",
        title: "浙江大学 / 软件工程",
        versions: [
          {
            name: "本科学历",
            content: "学历：工学学士 | 时间：2016.09 - 2020.06\nGPA：3.90 / 4.00 (专业前 3%)\n荣誉奖项：校优秀毕业生 (2020)、ACM-ICPC 亚洲区金牌",
          }
        ]
      }
    ],
    projects: [
      {
        id: "m1",
        title: "Stepwise 智能求职看板 / 核心研发组长",
        versions: [
          {
            name: "版本A：侧重目标拆解业务逻辑",
            content: "承担角色：项目负责人 & 核心研发\n项目内容：基于心理学理论设计并实现具备目标颗粒度自动拆解的求职看板。将复杂求职流程抽象为可量化的进度模型，有效降低系统使用认知阻力，提升用户 40% 的执行动力。",
          },
          {
            name: "版本B：侧重技术栈",
            content: "承担角色：前端业务架构师\n项目内容：采用 React 18 + TS + Framer Motion 构建高性能 SPA。使用 dnd-kit 实现沉浸式拖拽流，结合 Glassmorphism 规范打造全景动画 UI，建立 LocalStorage 实时脱机同步机制。",
          }
        ],
      }
    ],
    academic: [
      {
        id: "a1",
        title: "关于大型语言模型中少样本学习的认知 analysis",
        versions: [
          {
            name: "期刊论文",
            content: "期刊：ACL 2023 (CCF-A 类会议)\n作者排序：第一作者 (First Author)\n核心内容：提出了一种基于人类认知规律的 Prompt 工程理论范式，通过对比度实验证明了人类示范能够将 LLM 在低资源任务上的推理准确率提升 21%。",
          }
        ]
      }
    ],
    skills: [
      {
        id: "s1",
        title: "专业技术栈与评测方法",
        versions: [
          {
            name: "技术/研究底座",
            content: "编程语言：TypeScript, Python, C++\n领域专精：React 生态构建, 跨端架构工程化, LLM 性能调优框架\n软件及方法论：敏捷开发 (Scrum), A/B 测试实验设计, SPSS 数据驱动与量化分析",
          }
        ]
      }
    ],
    evaluation: [
      {
        id: "ev1",
        title: "自我综合评价",
        versions: [
          {
            name: "通用求职",
            content: "拥有从零到一独立负责复杂工程项目的破局经验。具备极其强烈的自驱力与跨领域学习能力，遇到全新技术栈可以在极短时间内拆解掌握，始终保持对前沿技术的饥饿感与对代码质量的偏执。",
          }
        ]
      }
    ]
  };

  const CANONICAL_SECTIONS: { id: Category, title: string, mandatory: boolean }[] = [
    { id: "personal", title: "个人信息", mandatory: true },
    { id: "education", title: "教育经历", mandatory: true },
    { id: "projects", title: "实习或项目经历", mandatory: false },
    { id: "academic", title: "学术经历", mandatory: false },
    { id: "skills", title: "专业技能", mandatory: true },
    { id: "evaluation", title: "个人评价", mandatory: false },
  ];

  const handleAIAdapt = (materialId: string) => {
    setIsAdapting(materialId);
    setTimeout(() => setIsAdapting(null), 1500);
  };

  const handleToggleViewVersion = (materialId: string, idx: number) => {
    setViewedVersions(prev => ({ ...prev, [materialId]: idx }));
  };

  const handleAddToCanvas = (materialId: string) => {
    const vIdx = viewedVersions[materialId] || 0;
    setSelectedMaterials(prev => [...prev, { id: generateId(), materialId, versionIdx: vIdx }]);
  };

  const handleRemoveFromCanvas = (id: string) => {
    setSelectedMaterials(prev => prev.filter(item => item.id !== id));
  };

  const getCategoryItems = (categoryId: Category) => {
    return selectedMaterials.filter(item => {
      const match = Object.entries(atomicMaterials).find(([cat, materials]) =>
        materials.some(m => m.id === item.materialId)
      );
      return match?.[0] === categoryId;
    });
  };

  const handleReorder = (categoryId: Category, newOrder: SelectedMaterialItem[]) => {
    setSelectedMaterials(prev => {
      const otherItems = prev.filter(item => {
        const match = Object.entries(atomicMaterials).find(([cat, materials]) =>
          materials.some(m => m.id === item.materialId)
        );
        return match?.[0] !== categoryId;
      });
      return [...otherItems, ...newOrder];
    });
  };

  const allItems = Object.values(atomicMaterials).flat();
  const totalMaterials = allItems.length;
  const uniqueItemsInCanvas = new Set(selectedMaterials.map(item => item.materialId)).size;
  const completeness = totalMaterials === 0 ? 0 : Math.round((uniqueItemsInCanvas / totalMaterials) * 100);

  const canSaveResume = useMemo(() => {
    return Boolean(selectedDelivery && selectedMaterials.length > 0);
  }, [selectedDelivery, selectedMaterials.length]);

  const resetMaterialsComposer = useCallback(() => {
    setSelectedMaterials([]);
    setViewedVersions({});
    setSelectedJobId("");
    setEditingResumeId(null);
    setActiveCategory("personal");
  }, []);

  const hydrateDeliveryFromSaved = useCallback(
    (item: ComposerSavedResume) => {
      if (item.isUniversal === true || item.targetCompany === "通用") {
        const idx = MOCK_RESUME_GROUPS.findIndex((g) => g.role === item.groupRole);
        setSelectedJobId(`${UNIVERSAL_JOB_PREFIX}${idx >= 0 ? idx : 0}`);
        return;
      }
      if (item.sourceJobId && poolJobs.some((j) => j.id === item.sourceJobId)) {
        setSelectedJobId(item.sourceJobId);
        return;
      }
      const idx = MOCK_RESUME_GROUPS.findIndex((g) => g.role === (item.groupRole ?? ""));
      setSelectedJobId(`${UNIVERSAL_JOB_PREFIX}${idx >= 0 ? idx : 0}`);
      notify.info("原职位已不在备选池，已改选本组通用投递目标");
    },
    [poolJobs]
  );

  const handleDeleteSaved = useCallback(
    (item: ComposerSavedResume) => {
      useResumeLibraryStore.getState().removeResumeFromLibrary(item.id);
      if (editingResumeId === item.id) {
        resetMaterialsComposer();
      }
      notify.success("已从简历库移除");
    },
    [editingResumeId, resetMaterialsComposer]
  );

  const handleEditSaved = useCallback(
    (item: ComposerSavedResume) => {
      setEditingResumeId(item.id);
      hydrateDeliveryFromSaved(item);
      const vv: Record<string, number> = {};
      item.blocks.forEach((b) => {
        vv[b.materialId] = b.versionIdx;
      });
      setViewedVersions(vv);
      setSelectedMaterials(
        item.blocks.map((b) => ({
          id: generateId(),
          materialId: b.materialId,
          versionIdx: b.versionIdx,
        }))
      );
      setActiveSubTab("materials");
      setActiveCategory("personal");
      notify.success("已载入编排，可在原子素材中继续修改");
    },
    [hydrateDeliveryFromSaved]
  );

  /** 将当前编排写入简历库（调用前需已通过校验）；若在编辑则覆盖同 id */
  const saveToLibrary = useCallback(() => {
    if (!selectedDelivery || selectedMaterials.length === 0) return;
    const id = editingResumeId ?? generateId();
    const resume: ComposerSavedResume = {
      id,
      targetCompany: selectedDelivery.targetCompany,
      targetRole: selectedDelivery.targetRole,
      anchorLine: selectedDelivery.anchorLine,
      groupRole: selectedDelivery.groupRole,
      isUniversal: selectedDelivery.kind === "universal",
      sourceJobId: selectedDelivery.kind === "job" ? selectedDelivery.sourceJob.id : undefined,
      savedAt: new Date().toISOString(),
      completeness,
      blocks: selectedMaterials.map(({ id, materialId, versionIdx }) => ({ id, materialId, versionIdx })),
    };
    if (editingResumeId) {
      useResumeLibraryStore.getState().updateResumeInLibrary(resume);
    } else {
      useResumeLibraryStore.getState().addResumeToLibrary(resume);
    }
  }, [editingResumeId, selectedDelivery, completeness, selectedMaterials]);

  /** 定稿：仅入库；保存后重置原子素材画布并切到简历库 */
  const handleSealDraft = () => {
    if (!selectedDelivery) {
      notify.error("请选择投递目标");
      return;
    }
    if (selectedMaterials.length === 0) {
      notify.error("请先在画布中加入至少一个素材模块");
      return;
    }
    setConfirmingLibrary(true);
    saveToLibrary();
    notify.success(editingResumeId ? "简历已更新" : "已定稿：已保存至简历库");
    resetMaterialsComposer();
    setSealSuccessPulse(true);
    window.setTimeout(() => setActiveSubTab("versions"), 600);
    window.setTimeout(() => setSealSuccessPulse(false), 2200);
    setConfirmingLibrary(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden animate-fade-in w-full">
      {/* Module Controls */}
      <div className="shrink-0 pt-3 pb-4 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <FilterTab
            label="简历库"
            active={activeSubTab === "versions"}
            onClick={() => setActiveSubTab("versions")}
          />
          <FilterTab
            label="原子素材"
            active={activeSubTab === "materials"}
            onClick={() => setActiveSubTab("materials")}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsBuilderOpen(true)}
            className="relative bg-white/5 border border-white/10 hover:bg-white/10 transition-all h-10 px-5 rounded-xl group"
          >
            <div className="absolute inset-0 rounded-xl flow-border opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-2 relative z-10 font-bold text-primary-glow">
              <Sparkles className="h-4 w-4" />
              <span>AI 根据 JD 智能拼装</span>
            </div>
          </Button>
          <Button className="bg-gradient-primary shadow-glow gap-2 h-10 px-5 rounded-xl">
            <Plus className="h-4 w-4" />
            <span>新增素材</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none pb-8">
        <AnimatePresence mode="wait">
          {activeSubTab === "versions" ? (
            <motion.div
              key="versions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-10 pb-12 w-full pt-2"
            >
              {resumeGroups.map((group, groupIndex) => {
                const savedForGroup = resumeLibrary.filter(
                  (r) => (r.groupRole ?? MOCK_RESUME_GROUPS[0].role) === group.role
                );
                const savedUniversals = savedForGroup
                  .filter((r) => r.isUniversal === true || r.targetCompany === "通用")
                  .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
                const savedOthers = savedForGroup
                  .filter((r) => !savedUniversals.includes(r))
                  .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
                const totalCards = 1 + group.companyVersions.length + savedForGroup.length;

                return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  key={group.role}
                  className="flex flex-col gap-5"
                >
                  {/* Role Group Header */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{group.icon}</span>
                      <h2 className="font-display font-bold text-lg text-foreground/90">{group.role}</h2>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground font-mono">
                        共 {totalCards} 份
                      </span>
                    </div>
                    <Button variant="ghost" className="h-8 gap-1.5 text-muted-foreground hover:text-primary-glow hover:bg-primary/10 transition-colors rounded-lg px-3 border border-transparent hover:border-primary/20">
                      <Plus className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">新增定制版</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
                    {/* Base Template */}
                    <div className="group relative h-44 rounded-2xl glass p-5 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 overflow-hidden shadow-[0_0_15px_rgba(139,92,246,0.05)] hover:shadow-glow flex flex-col justify-between">
                      <LibraryCardCornerActions
                        deleteDisabled
                        onEdit={() => {
                          setActiveSubTab("materials");
                          setSelectedMaterials([]);
                          setViewedVersions({});
                          setEditingResumeId(null);
                          setSelectedJobId(`${UNIVERSAL_JOB_PREFIX}${groupIndex}`);
                          setActiveCategory("personal");
                          notify.success("已切换至原子素材，可从通用主轴重新编排");
                        }}
                        onDelete={() => notify.info("内置示例不可删除")}
                      />
                      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-40 transition-opacity pointer-events-none">
                        <Layout className="h-16 w-16 text-primary-glow" />
                      </div>
                      <div className="relative z-10 w-full">
                        <div className="flex items-center gap-2 mb-2 w-full pr-12">
                          <h3 className="font-display font-semibold text-[15px] truncate pr-4 text-foreground/95 antialiased">{group.baseTemplate.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          <Clock className="h-3 w-3 text-muted-foreground/70" />
                          <span className="text-[10px] text-muted-foreground/70 font-mono tracking-wide">通用源模版 | 最后编排 {group.baseTemplate.date}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 line-clamp-1 h-[22px] overflow-hidden">
                          {group.baseTemplate.tags.map(tag => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-active/40 text-muted-foreground border border-white/5 font-mono">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-auto pt-4 relative z-10">
                        <Button className="flex-1 bg-white/5 hover:bg-white/10 text-xs h-9 gap-2 border border-white/5 transition-colors text-muted-foreground hover:text-foreground shadow-sm" variant="secondary">
                          <Eye className="h-3.5 w-3.5" />
                          设计预览
                        </Button>
                        <Button className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary-glow text-xs h-9 gap-2 border border-primary/20 transition-all shadow-glow hover:shadow-[0_0_15px_hsl(var(--primary-glow))]">
                          <Download className="h-3.5 w-3.5" />
                          导出长图
                        </Button>
                      </div>
                    </div>

                    {savedUniversals.map((item) => (
                      <SavedComposerVersionCard
                        key={item.id}
                        item={item}
                        onEdit={() => handleEditSaved(item)}
                        onDelete={() => handleDeleteSaved(item)}
                      />
                    ))}

                    {group.companyVersions.map(cv => (
                      <div key={cv.id} className="group relative h-44 rounded-2xl glass bg-[#121318]/40 p-5 border border-white/10 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 flex flex-col justify-between ml-0 xl:ml-6">
                        <LibraryCardCornerActions
                          deleteDisabled
                          onEdit={() => {
                            setActiveSubTab("materials");
                            setSelectedMaterials([]);
                            setViewedVersions({});
                            setEditingResumeId(null);
                            const matchJob = poolJobs.find((j) => j.company === cv.company);
                            setSelectedJobId(
                              matchJob?.id ?? `${UNIVERSAL_JOB_PREFIX}${groupIndex}`
                            );
                            if (!matchJob) {
                              notify.info("备选池无该公司职位，已选用本组通用投递目标");
                            }
                            setActiveCategory("personal");
                            notify.success("已切换至原子素材，可重新编排");
                          }}
                          onDelete={() => notify.info("内置示例不可删除")}
                        />
                        <div className="hidden xl:block absolute -left-[26px] top-1/2 w-6 h-px bg-white/10 pointer-events-none group-hover:bg-primary/30 transition-colors" />
                        <div className="hidden xl:block absolute -left-[26px] -top-6 bottom-1/2 w-px bg-white/10 pointer-events-none group-hover:bg-primary/30 transition-colors" />

                        <div>
                          <div className="flex items-end justify-between mb-3 gap-2">
                            <div className="flex items-center gap-2.5 pr-14">
                              <div className={cn("h-6 w-6 rounded-md flex items-center justify-center text-[11px] font-bold border", cv.brandColor)}>
                                {cv.logo}
                              </div>
                              <h3 className="font-display font-semibold text-[14px] truncate max-w-[190px] text-foreground/90 antialiased">{cv.title}</h3>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-4">
                            <Clock className="h-3 w-3 text-muted-foreground/50" />
                            <span className="text-[10px] text-muted-foreground/50 font-mono tracking-wide">投递特化版本 | 最后修订 {cv.date}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 line-clamp-1 h-[22px] overflow-hidden">
                            {cv.tags.map(tag => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.03] text-muted-foreground/70 border border-white/5 font-mono">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-auto pt-4 w-full">
                          <Button className="w-10 bg-white/[0.03] hover:bg-white/10 text-xs h-8 p-0 border border-white/5 shrink-0 text-muted-foreground hover:text-foreground transition-colors" variant="secondary" title="极速预览">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button className="flex-1 bg-white/5 hover:bg-white/10 text-foreground/90 text-xs h-8 gap-2 border border-white/10 hover:border-white/20 transition-all font-medium">
                            <FileText className="h-3.5 w-3.5 opacity-70" /> 生成 PDF 文档
                          </Button>
                        </div>
                      </div>
                    ))}

                    {savedOthers.map((item) => (
                      <SavedComposerVersionCard
                        key={item.id}
                        item={item}
                        onEdit={() => handleEditSaved(item)}
                        onDelete={() => handleDeleteSaved(item)}
                      />
                    ))}
                  </div>
                </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="materials"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-6 h-[80vh] min-h-[600px] w-full"
            >
              <div className="w-[178px] shrink-0 flex flex-col gap-3 overflow-y-auto scrollbar-none pb-8 pr-0.5">
                <div className="rounded-xl border border-primary/30 bg-primary/10 backdrop-blur-sm px-2.5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] shrink-0">
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground/80 font-bold mb-1.5 px-0.5">
                    投递目标
                  </p>
                  <div className="flex items-start gap-1 min-w-0">
                    <p
                      className={cn(
                        "flex-1 min-w-0 text-[11px] leading-snug font-medium px-0.5 line-clamp-3",
                        selectedDelivery ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {selectedDelivery
                        ? selectedDelivery.anchorLine
                        : "点击右侧图标选择"}
                    </p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={deliveryOptions.length === 0}
                          title="切换投递目标"
                          className="h-7 w-7 shrink-0 rounded-lg text-muted-foreground hover:text-primary-glow hover:bg-primary/15 border border-transparent hover:border-primary/25"
                        >
                          <ChevronsUpDown className="h-3.5 w-3.5 opacity-80" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-[min(100vw-2rem,260px)] glass-strong border-white/10 p-1 max-h-[min(70vh,320px)] overflow-y-auto"
                        align="start"
                        side="right"
                        sideOffset={8}
                      >
                        {deliveryOptions
                          .filter((o) => o.kind === "universal")
                          .map((opt) => (
                            <DropdownMenuItem
                              key={opt.id}
                              className={cn(
                                "text-[11px] py-2.5 px-2.5 cursor-pointer rounded-md flex flex-col items-start gap-0.5",
                                opt.id === selectedJobId && "bg-primary/12 font-semibold text-primary-glow"
                              )}
                              onClick={() => setSelectedJobId(opt.id)}
                            >
                              <span className="font-medium text-foreground leading-snug">{opt.anchorLine}</span>
                              <span className="text-[10px] text-muted-foreground">本组通用简历主轴</span>
                            </DropdownMenuItem>
                          ))}
                        {deliveryOptions.some((o) => o.kind === "job") &&
                          deliveryOptions.some((o) => o.kind === "universal") && (
                            <DropdownMenuSeparator className="bg-white/10" />
                          )}
                        {deliveryOptions
                          .filter((o) => o.kind === "job")
                          .map((opt) => (
                            <DropdownMenuItem
                              key={opt.id}
                              className={cn(
                                "text-[11px] py-2.5 px-2.5 cursor-pointer rounded-md",
                                opt.id === selectedJobId && "bg-primary/12 font-semibold text-primary-glow"
                              )}
                              onClick={() => setSelectedJobId(opt.id)}
                            >
                              <span className="font-medium text-foreground leading-snug">{opt.anchorLine}</span>
                            </DropdownMenuItem>
                          ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {poolJobs.length === 0 && (
                    <p className="text-[10px] text-muted-foreground/90 leading-relaxed mt-1.5 px-0.5">
                      备选池暂无职位时，仍可选择「岗位·通用」定稿至通用简历旁。
                    </p>
                  )}
                </div>

                <div className="px-2 shrink-0">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">
                    简历模块库
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id as Category)}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-300",
                          isActive
                            ? "bg-primary/20 text-primary-glow border border-primary/30 shadow-glow"
                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="font-medium leading-tight text-left">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="w-[35%] min-w-[280px] shrink-0 overflow-y-auto scrollbar-none pb-8 relative">
                <div className="absolute right-0 top-0 bottom-0 w-px bg-white/5 pointer-events-none" />
                <div className="flex flex-col gap-5 pr-6">
                  {atomicMaterials[activeCategory].length > 0 ? (
                    atomicMaterials[activeCategory].map((material) => {
                      const activeVIdx = viewedVersions[material.id] || 0;
                      const activeContent = material.versions[activeVIdx];
                      const isAdded = selectedMaterials.some(m => m.materialId === material.id && m.versionIdx === activeVIdx);

                      return (
                        <div key={material.id} className="rounded-2xl glass p-5 border border-white/10 flex flex-col group hover:border-white/20 transition-all">
                          <div className="flex items-start justify-between mb-3 gap-2">
                            <h4 className="font-bold text-[14px] leading-tight text-foreground/90 flex-1">{material.title}</h4>
                            <Button
                              onClick={() => handleAIAdapt(material.id)}
                              disabled={isAdapting === material.id}
                              variant="ghost"
                              title="自动调整语气"
                              className="bg-primary/5 hover:bg-primary/20 text-primary-glow/80 hover:text-primary-glow h-7 px-2 shrink-0 text-[10px] rounded-lg"
                            >
                              {isAdapting === material.id ? <Sparkles className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                            </Button>
                          </div>

                          <div className="flex items-center gap-1 mb-4 bg-white/5 p-1 rounded-lg w-fit">
                            {material.versions.map((ver, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleToggleViewVersion(material.id, idx)}
                                className={cn(
                                  "px-3 py-1 text-[11px] rounded-md transition-all font-mono uppercase tracking-wider focus:outline-none flex items-center gap-1.5",
                                  activeVIdx === idx
                                    ? "bg-white/10 text-primary-glow font-bold shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                )}
                              >
                                {activeVIdx === idx && <span className="h-1.5 w-1.5 rounded-full bg-primary-glow shadow-[0_0_8px_hsl(var(--primary-glow))]" />}
                                {ver.name.split('：')[0]}
                              </button>
                            ))}
                          </div>

                          <p className="text-[13px] leading-relaxed text-foreground/80 font-light mb-5 line-clamp-3 group-hover:line-clamp-none transition-all duration-300 min-h-[60px]">
                            {activeContent.content}
                          </p>

                          <Button
                            onClick={() => handleAddToCanvas(material.id)}
                            className={cn(
                              "w-full h-9 transition-all text-xs outline-none",
                              isAdded
                                ? "bg-primary/10 text-primary-glow border border-primary/20 hover:bg-primary/20 hover:border-primary/40"
                                : "bg-white/5 hover:bg-primary/20 hover:text-primary-glow hover:border-primary/30 border border-white/5 border-dashed"
                            )}
                          >
                            <Plus className={cn("h-3.5 w-3.5 mr-1.5", isAdded && "rotate-45")} />
                            {isAdded ? "再添一块" : "添加至画布"}
                          </Button>
                        </div>
                      )
                    })
                  ) : (
                    <div className="h-64 rounded-2xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-muted-foreground text-sm italic w-full">
                      <Layers className="h-8 w-8 mb-4 opacity-50" />
                      暂无 {categories.find(c => c.id === activeCategory)?.label} 素材
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-none pb-10 relative">
                <div className="w-full mx-auto mb-3 shrink-0 flex items-center justify-between gap-3 glass p-3.5 sm:p-4 rounded-xl border border-white/5 shadow-md">
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <span className="text-[12px] font-bold text-muted-foreground tracking-wider uppercase flex items-center gap-2 min-w-0">
                        <Layout className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">A4 履历编排进度</span>
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-xs font-mono font-bold text-primary-glow tabular-nums min-w-[2.5rem] text-right">
                          {completeness}%
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={!canSaveResume || confirmingLibrary}
                          onClick={handleSealDraft}
                          title={
                            !canSaveResume
                              ? !selectedDelivery
                                ? "请选择投递目标（岗位·通用 或 岗位·公司）"
                                : "请先在画布中加入至少一个素材模块"
                              : "定稿：保存至简历库"
                          }
                          className={cn(
                            "h-8 w-8 rounded-full border transition-all duration-300",
                            sealSuccessPulse
                              ? "text-cyan-400 border-cyan-400/45 bg-cyan-500/15 shadow-[0_0_14px_rgba(34,211,238,0.35)]"
                              : "border-transparent text-muted-foreground/70 hover:text-primary-glow hover:bg-primary/15 hover:border-primary/25",
                            "disabled:opacity-40 disabled:scale-100 disabled:shadow-none disabled:pointer-events-none"
                          )}
                        >
                          {confirmingLibrary ? (
                            <Sparkles className="h-4 w-4 animate-spin" />
                          ) : (
                            <motion.span
                              className="inline-flex"
                              animate={
                                sealSuccessPulse
                                  ? { scale: [1, 1.18, 1.08, 1] }
                                  : { scale: 1 }
                              }
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                              <CheckCircle2
                                className={cn(
                                  "h-4 w-4 transition-colors duration-300",
                                  sealSuccessPulse && "text-cyan-400"
                                )}
                              />
                            </motion.span>
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completeness}%` }}
                        transition={{ type: "spring", damping: 20 }}
                        className="h-full bg-gradient-primary shadow-glow"
                      />
                    </div>
                  </div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground shrink-0 text-right leading-tight max-w-[100px] sm:max-w-none">
                    已编入 <span className="text-foreground font-bold text-sm tracking-wider">{selectedMaterials.length}</span> 个模块
                  </div>
                </div>

                <div ref={resumeCanvasRef} className="w-full min-h-[800px] mx-auto bg-white shadow-2xl rounded-sm relative overflow-hidden">
                  <div className="px-8 md:px-12 pt-10 pb-8 border-b border-zinc-200 font-sans bg-white flex flex-col items-center justify-center text-center">
                    <span className="text-5xl sm:text-6xl leading-none mb-4 select-none" aria-hidden>
                      👨‍💻
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">你的姓名</h1>
                  </div>
                  <div className="p-10 md:p-14 h-full z-10 relative flex flex-col gap-6 font-serif">
                    {CANONICAL_SECTIONS.map(section => {
                      const items = getCategoryItems(section.id);

                      return (
                        <div key={section.id} className="flex flex-col mb-2">
                          <div className="flex flex-col gap-2 mb-4">
                            <h2 className="font-bold text-[18px] tracking-[0.1em] text-zinc-900 border-l-4 border-zinc-800 pl-3 leading-none">
                              {section.title}
                            </h2>
                            <div className="w-full h-[1.5px] bg-zinc-800"></div>
                          </div>

                          {items.length === 0 ? (
                            <div className={cn(
                              "w-full py-5 border-2 border-dashed rounded-sm flex items-center justify-center text-xs font-sans",
                              section.mandatory
                                ? "border-red-900/10 bg-red-50/30 text-red-900/40"
                                : "border-zinc-200 bg-zinc-50/50 text-zinc-400"
                            )}>
                              {section.mandatory ? `[必填] 请从左侧选择相关素材填至「${section.title}」` : `[可选] 您暂未添加「${section.title}」`}
                            </div>
                          ) : (
                            <Reorder.Group axis="y" values={items} onReorder={(newOrder) => handleReorder(section.id, newOrder)} className="flex flex-col gap-5">
                              <AnimatePresence>
                                {items.map(item => {
                                  const mat = allItems.find(m => m.id === item.materialId);
                                  if (!mat) return null;
                                  const contentInfo = mat.versions[item.versionIdx];

                                  return (
                                    <Reorder.Item
                                      key={item.id}
                                      value={item}
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                      whileDrag={{ scale: 1.01, backgroundColor: "#fafafa", zIndex: 50, boxShadow: "0 10px 20px -10px rgba(0,0,0,0.1)" }}
                                      className="group flex flex-col gap-2 -mx-4 px-4 py-2 hover:bg-zinc-50 transition-colors rounded-sm relative"
                                    >
                                      <div className="absolute left-0 top-3 -ml-6 cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-500 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <GripVertical className="h-4 w-4" />
                                      </div>

                                      <div className="flex items-center justify-between w-full">
                                        <h4 className="font-semibold text-[15px] text-zinc-900 antialiased">{mat.title}</h4>
                                        {["education", "projects", "academic"].includes(section.id) && (
                                          <span className="text-[13px] font-sans text-zinc-600 font-medium tracking-wide">
                                            2023.09 - 至今
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-[13px] leading-[1.8] text-zinc-700 whitespace-pre-wrap font-sans">
                                        {contentInfo.content}
                                      </p>

                                      <div className="absolute right-0 top-2 -mr-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleRemoveFromCanvas(item.id)}
                                          className="h-6 w-6 text-zinc-400 hover:text-red-500 hover:bg-red-50 p-0"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </Reorder.Item>
                                  )
                                })}
                              </AnimatePresence>
                            </Reorder.Group>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isBuilderOpen && <AIResumeBuilder onClose={() => setIsBuilderOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};
