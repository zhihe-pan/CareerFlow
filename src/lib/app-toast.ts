import { toast as sonnerToast, type ExternalToast } from "sonner";

const defaults: ExternalToast = {
  duration: 4000,
};

function merge(options?: ExternalToast): ExternalToast {
  return { ...defaults, ...options };
}

// 全局消息统一入口；样式与时长由 `components/ui/sonner` 的 Toaster 统一控制。
export const notify = {
  success: (message: string, options?: ExternalToast) => sonnerToast.success(message, merge(options)),
  error: (message: string, options?: ExternalToast) => sonnerToast.error(message, merge(options)),
  info: (message: string, options?: ExternalToast) => sonnerToast.info(message, merge(options)),
  warning: (message: string, options?: ExternalToast) => sonnerToast.warning(message, merge(options)),
  dismiss: (id?: string | number) => sonnerToast.dismiss(id),
};

export type { ExternalToast as NotifyOptions } from "sonner";
