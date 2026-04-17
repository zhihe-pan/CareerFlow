import type { InterviewRound, JobCard } from "./types";

export function createInterviewRoundId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `ir-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** 添加面试轮次时的预设类型 */
export const INTERVIEW_ROUND_PRESETS = [
  "机试/笔试",
  "一面",
  "二面",
  "三面",
  "主管面",
  "HR面",
] as const;

export type InterviewRoundPreset = (typeof INTERVIEW_ROUND_PRESETS)[number];

/** 按 scheduledAt 升序排列（无时间的排在有时间的之后、相对顺序稳定） */
export function sortInterviewRounds(rounds: InterviewRound[]): InterviewRound[] {
  return [...rounds].sort((a, b) => {
    const ta = a.scheduledAt ? new Date(a.scheduledAt).getTime() : Number.MAX_SAFE_INTEGER;
    const tb = b.scheduledAt ? new Date(b.scheduledAt).getTime() : Number.MAX_SAFE_INTEGER;
    return ta - tb;
  });
}

/**
 * 时间轴唯一数据源：下一场「待面试」轮次（按 scheduledAt 升序，无时间的 pending 排在有时间的之后）。
 * 看板倒计时、详情页只读提示均依赖此函数。
 */
export function getNextPendingInterviewRound(
  rounds: InterviewRound[] | undefined
): InterviewRound | null {
  if (!rounds?.length) return null;
  const pending = rounds.filter((r) => r.status === "pending");
  if (!pending.length) return null;
  const sorted = sortInterviewRounds(pending);
  return sorted[0] ?? null;
}

/**
 * 看板标签：取「最新」一轮尚未完成的面试（数组中最后一个 pending，表示当前进行到哪一轮）。
 */
export function getLatestPendingRoundName(rounds: InterviewRound[] | undefined): string | null {
  if (!rounds?.length) return null;
  const pending = rounds.filter((r) => r.status === "pending");
  if (!pending.length) return null;
  return pending[pending.length - 1]?.name ?? null;
}

export function deriveProgressStatusFromRounds(rounds: InterviewRound[] | undefined): string | undefined {
  const label = getLatestPendingRoundName(rounds);
  return label ?? undefined;
}

/** 面试中卡片缺省示例：约明天下午（用于本地旧数据 / 无排期时的看板演示） */
const DEFAULT_NEXT_INTERVIEW_MS = 26 * 60 * 60 * 1000;

function ensureDefaultInterviewTime(card: JobCard, rounds: InterviewRound[] | undefined): InterviewRound[] | undefined {
  if (card.stage !== "interviewing" || !rounds?.length) return rounds;
  const hasPendingWithTime = rounds.some((r) => r.status === "pending" && r.scheduledAt);
  if (hasPendingWithTime) return rounds;
  const hasPending = rounds.some((r) => r.status === "pending");
  if (!hasPending) return rounds;
  const defaultIso = new Date(Date.now() + DEFAULT_NEXT_INTERVIEW_MS).toISOString();
  let assigned = false;
  return rounds.map((r) => {
    if (assigned || r.status !== "pending" || r.scheduledAt) return r;
    assigned = true;
    return { ...r, scheduledAt: defaultIso };
  });
}

/** 兼容旧 localStorage：补全 id、scheduledAt，面试中且无时间轴时从 progressStatus 生成一条待面试记录 */
export function normalizeJobCardForStorage(card: JobCard): JobCard {
  const { nextInterviewTime: _legacyNextInterview, ...cardBase } = card as JobCard & {
    nextInterviewTime?: string;
  };
  let interviewRounds = cardBase.interviewRounds;
  if (interviewRounds?.length) {
    interviewRounds = interviewRounds.map((r) => {
      const legacy = r as InterviewRound & { date?: string };
      return {
        id: typeof legacy.id === "string" ? legacy.id : createInterviewRoundId(),
        name: typeof legacy.name === "string" ? legacy.name : "面试",
        scheduledAt:
          typeof legacy.scheduledAt === "string"
            ? legacy.scheduledAt
            : typeof legacy.date === "string"
              ? legacy.date
              : undefined,
        status: legacy.status === "completed" ? "completed" : "pending",
      };
    });
  } else if (cardBase.stage === "interviewing" && cardBase.progressStatus) {
    interviewRounds = [
      {
        id: createInterviewRoundId(),
        name: cardBase.progressStatus,
        status: "pending",
      },
    ];
  } else if (cardBase.stage === "interviewing" && !interviewRounds?.length) {
    interviewRounds = [
      {
        id: createInterviewRoundId(),
        name: "面试",
        status: "pending",
        scheduledAt: new Date(Date.now() + DEFAULT_NEXT_INTERVIEW_MS).toISOString(),
      },
    ];
  }

  interviewRounds = ensureDefaultInterviewTime(cardBase, interviewRounds);

  const derived = deriveProgressStatusFromRounds(interviewRounds);
  const applicationDeadline =
    cardBase.applicationDeadline ??
    (cardBase.stage === "backlog" && cardBase.deadline ? cardBase.deadline : undefined);

  return {
    ...cardBase,
    interviewRounds,
    applicationDeadline,
    progressStatus: derived ?? cardBase.progressStatus,
  };
}
