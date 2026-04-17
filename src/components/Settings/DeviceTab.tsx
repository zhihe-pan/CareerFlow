import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Mic, Video, Monitor, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DeviceTab = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30">
          <Settings2 className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">设备与调试</h3>
          <p className="text-sm text-muted-foreground">配置模拟面试所需的硬件设备权限</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-strong rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-colors">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background/50">
                <Mic className="h-5 w-5 text-primary-glow" />
              </div>
              <h4 className="font-medium text-sm">麦克风权限</h4>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-primary" />
          </div>
          <p className="text-xs text-muted-foreground mb-4">用于模拟面试中捕获您的语音输入，分析情绪和语速。</p>
          <Button variant="outline" size="sm" className="w-full text-xs h-8 border-border/50 hover:bg-primary/10 hover:text-primary-glow hover:border-primary/40 transition-colors">
            测试麦克风
          </Button>
        </div>

        <div className="glass-strong rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-colors">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background/50">
                <Video className="h-5 w-5 text-accent" />
              </div>
              <h4 className="font-medium text-sm">摄像头权限</h4>
            </div>
            <Switch className="data-[state=checked]:bg-primary" />
          </div>
          <p className="text-xs text-muted-foreground mb-4">用于视频面试模拟，分析面部表情和眼神交流情况。</p>
          <Button variant="outline" size="sm" className="w-full text-xs h-8 border-border/50 hover:bg-primary/10 hover:text-primary-glow hover:border-primary/40 transition-colors">
            进行画面测试
          </Button>
        </div>

        <div className="glass-strong rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-colors md:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background/50">
                <Monitor className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">硬件加速</h4>
                <p className="text-xs text-muted-foreground">在可能的情况下使用 GPU 加速以提升 UI 性能。</p>
              </div>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};
