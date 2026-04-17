import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, MessageSquare, Bot, Zap } from "lucide-react";

export const AIPrefsTab = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
          <Sparkles className="h-6 w-6 text-primary-glow" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">AI 偏好设置</h3>
          <p className="text-sm text-muted-foreground">定制您的智能副手响应方式和行为习惯</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass rounded-xl p-5 flex items-center justify-between gap-4 border border-border/50 hover:border-primary/30 transition-colors">
          <div className="flex gap-4 items-center">
            <Bot className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label className="text-sm font-medium">主动干预 (Proactive Mode)</Label>
              <p className="text-xs text-muted-foreground mt-1">允许 AI 在发现求职机会或风险时主动发送提醒</p>
            </div>
          </div>
          <Switch defaultChecked className="data-[state=checked]:bg-primary" />
        </div>

        <div className="glass rounded-xl p-5 flex items-center justify-between gap-4 border border-border/50 hover:border-primary/30 transition-colors">
          <div className="flex gap-4 items-center">
            <Zap className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label className="text-sm font-medium">智能高亮 (Auto-Highlight)</Label>
              <p className="text-xs text-muted-foreground mt-1">自动标识高优先级任务和即将到期的截止日期</p>
            </div>
          </div>
          <Switch defaultChecked className="data-[state=checked]:bg-primary" />
        </div>

        <div className="glass rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-colors">
          <div className="flex gap-4 items-start mb-4">
            <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <Label className="text-sm font-medium mb-1 block">AI 沟通语气</Label>
              <p className="text-xs text-muted-foreground mb-4">设置生成邮件、私信时的默认语言风格</p>
              <Select defaultValue="professional">
                <SelectTrigger className="w-[200px] bg-background/50 focus:ring-1 focus:ring-primary focus:border-primary">
                  <SelectValue placeholder="选择语气" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">专业且正式 (Professional)</SelectItem>
                  <SelectItem value="friendly">友好且热情 (Friendly)</SelectItem>
                  <SelectItem value="direct">直接且干练 (Direct)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
