import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Briefcase, MapPin, Camera } from "lucide-react";

export const ProfileTab = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative group cursor-pointer">
          <div className="h-20 w-20 rounded-2xl bg-gradient-primary p-[2px] transition-transform group-hover:scale-105 duration-300">
            <div className="h-full w-full rounded-2xl bg-background/90 backdrop-blur-sm flex items-center justify-center overflow-hidden relative">
              <User className="h-8 w-8 text-primary-glow transition-opacity duration-300 group-hover:opacity-0" />
              <div className="absolute inset-0 bg-primary/40 backdrop-blur-md flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">个人资料</h3>
          <p className="text-sm text-muted-foreground">更新您的基本信息和联系方式</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">姓名</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              defaultValue="Alex Chen" 
              className="pl-9 bg-background/50 border-border/50 focus:ring-1 focus:ring-primary focus:border-primary hover:border-primary/50 transition-colors" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">意向岗位</Label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              defaultValue="高级产品经理" 
              className="pl-9 bg-background/50 border-border/50 focus:ring-1 focus:ring-primary focus:border-primary hover:border-primary/50 transition-colors" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">联系邮箱</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              defaultValue="alex.chen@example.com" 
              type="email"
              className="pl-9 bg-background/50 border-border/50 focus:ring-1 focus:ring-primary focus:border-primary hover:border-primary/50 transition-colors" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">所在地</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              defaultValue="上海, 中国" 
              className="pl-9 bg-background/50 border-border/50 focus:ring-1 focus:ring-primary focus:border-primary hover:border-primary/50 transition-colors" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
