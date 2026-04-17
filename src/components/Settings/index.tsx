import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/app-toast";
import { ProfileTab } from "./ProfileTab";
import { AIPrefsTab } from "./AIPrefsTab";
import { DeviceTab } from "./DeviceTab";
import { PrivacyTab } from "./PrivacyTab";
import { Loader2, Save } from "lucide-react";

export const Settings = () => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      notify.success("设置保存成功", {
        description: "您的配置已安全地同步至云端。",
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pt-6 pb-16 scrollbar-none">
        <Tabs defaultValue="profile" className="w-full">
          {/* Underline Tabs List */}
          <TabsList className="bg-transparent border-b border-white/10 w-full justify-start rounded-none p-0 flex h-auto overflow-x-auto scrollbar-none gap-8 mb-8 px-4 sm:px-8 shrink-0">
            <TabsTrigger 
              value="profile" 
              className="pb-3 border-b-2 border-transparent text-[14px] font-bold transition-all data-[state=active]:border-primary data-[state=active]:text-primary-glow text-muted-foreground hover:text-foreground bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-1"
            >
              个人资料
            </TabsTrigger>
            <TabsTrigger 
              value="ai" 
              className="pb-3 border-b-2 border-transparent text-[14px] font-bold transition-all data-[state=active]:border-primary data-[state=active]:text-primary-glow text-muted-foreground hover:text-foreground bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-1"
            >
              AI 偏好
            </TabsTrigger>
            <TabsTrigger 
              value="device" 
              className="pb-3 border-b-2 border-transparent text-[14px] font-bold transition-all data-[state=active]:border-primary data-[state=active]:text-primary-glow text-muted-foreground hover:text-foreground bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-1"
            >
              设备调试
            </TabsTrigger>
            <TabsTrigger 
              value="privacy" 
              className="pb-3 border-b-2 border-transparent text-[14px] font-bold transition-all data-[state=active]:border-primary data-[state=active]:text-primary-glow text-muted-foreground hover:text-foreground bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-1"
            >
              隐私安全
            </TabsTrigger>
          </TabsList>

          {/* Form content + Save Button in normal flow */}
          <div className="px-4 sm:px-8 max-w-[800px]">
            <TabsContent value="profile" className="mt-0 focus-visible:ring-0">
              <ProfileTab />
            </TabsContent>
            <TabsContent value="ai" className="mt-0 focus-visible:ring-0">
              <AIPrefsTab />
            </TabsContent>
            <TabsContent value="device" className="mt-0 focus-visible:ring-0">
              <DeviceTab />
            </TabsContent>
            <TabsContent value="privacy" className="mt-0 focus-visible:ring-0">
              <PrivacyTab />
            </TabsContent>

            {/* Save Button — normal flow, left-aligned, below the last field */}
            <div className="mt-8 pt-2 border-t border-white/5">
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="min-w-[160px] h-10 px-6 rounded-lg bg-primary/80 hover:bg-primary text-primary-foreground font-medium text-[13px] shadow-[0_2px_12px_rgba(139,92,246,0.25)] hover:shadow-[0_4px_20px_rgba(139,92,246,0.35)] transition-all"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5 mr-2" />
                    保存所有设置
                  </>
                )}
              </Button>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
