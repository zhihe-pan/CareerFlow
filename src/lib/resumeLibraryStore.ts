import { create } from "zustand";
import { persist } from "zustand/middleware";

/** 画布上单个模块快照（顺序即编排顺序） */
export interface SavedResumeBlock {
  id: string;
  materialId: string;
  versionIdx: number;
}

export interface ComposerSavedResume {
  id: string;
  targetCompany: string;
  targetRole: string;
  /** 投递锚点文案，如「产品经理·腾讯」「AI 产品经理·通用」 */
  anchorLine: string;
  /** 归入简历库哪一条岗位主轴（与 MOCK 分组 role 一致） */
  groupRole: string;
  isUniversal: boolean;
  /** 看板备选池中的来源职位 id（通用项无） */
  sourceJobId?: string;
  /** @deprecated 旧数据；请优先使用 anchorLine */
  displayTitle?: string;
  savedAt: string;
  completeness: number;
  blocks: SavedResumeBlock[];
}

interface ResumeLibraryState {
  resumeLibrary: ComposerSavedResume[];
  addResumeToLibrary: (resume: ComposerSavedResume) => void;
  updateResumeInLibrary: (resume: ComposerSavedResume) => void;
  removeResumeFromLibrary: (id: string) => void;
}

export const useResumeLibraryStore = create<ResumeLibraryState>()(
  persist(
    (set) => ({
      resumeLibrary: [],
      addResumeToLibrary: (resume) =>
        set((s) => ({
          resumeLibrary: [resume, ...s.resumeLibrary].slice(0, 60),
        })),
      updateResumeInLibrary: (resume) =>
        set((s) => ({
          resumeLibrary: s.resumeLibrary.map((r) => (r.id === resume.id ? resume : r)),
        })),
      removeResumeFromLibrary: (id) =>
        set((s) => ({
          resumeLibrary: s.resumeLibrary.filter((r) => r.id !== id),
        })),
    }),
    { name: "careerflow-resume-library-v1" }
  )
);
