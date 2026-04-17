import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, EyeOff, FileKey, Share2 } from "lucide-react";

export const PrivacyTab = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center border border-destructive/20">
          <Shield className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">隐私与安全</h3>
          <p className="text-sm text-muted-foreground">掌控您的数据可见性与存储策略</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-colors">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-4 items-center">
              <EyeOff className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium">隐身模式</Label>
                <p className="text-xs text-muted-foreground mt-1">在同窗交流中隐藏您的真实姓名和公司信息</p>
              </div>
            </div>
            <Switch className="data-[state=checked]:bg-primary" />
          </div>
        </div>

        <div className="glass rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-colors">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-4 items-center">
              <Share2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium">诊断数据分享</Label>
                <p className="text-xs text-muted-foreground mt-1">允许发送匿名使用数据以帮助我们改进 CareerFlow 体验</p>
              </div>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-primary" />
          </div>
        </div>

        <div className="glass rounded-xl p-5 border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-4 items-start">
              <FileKey className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <Label className="text-sm font-medium text-destructive">本地端到端加密</Label>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  加密同步您的所有简历库资产和面试录音。开启后，如果您丢失恢复密钥，将无法找回数据。
                </p>
                <button className="text-xs font-medium text-destructive underline underline-offset-2 hover:opacity-80">
                  了解更多关于加密策略
                </button>
              </div>
            </div>
            <Switch className="data-[state=checked]:bg-destructive" />
          </div>
        </div>
      </div>
    </div>
  );
};
