
import React, { useEffect } from "react";
import { useTimeSettings } from "@/hooks/useTimeSettings";
import Clock from "@/components/Clock";
import Timer from "@/components/Timer";
import Settings from "@/components/Settings";
import { useToast } from "@/components/ui/use-toast";
//import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const { settings, loading, updateThemeColor, toggle24HourFormat } = useTimeSettings();
  const { toast } = useToast();
  // const isMobile = useIsMobile();
  // Este hook puede servir en un futuro
  
  useEffect(() => {
    // Request notification permission for timer alerts
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    if (!loading) {
      toast({
        title: "Welcome to Fancy Time",
        description: "Your settings have been loaded successfully.",
      });
    }
  }, [loading, toast]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center theme-gradient">
        <div className="animate-pulse-light text-2xl font-medium">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen theme-gradient overflow-auto py-6 px-3 md:py-8 md:px-4 transition-colors duration-500">
      <div className="container max-w-3xl mx-auto relative animate-fade-in">
        <div className="fixed top-4 right-4 z-50">
          <Settings 
            themeColor={settings.themeColor}
            is24HourFormat={settings.is24HourFormat}
            onThemeColorChange={updateThemeColor}
            onToggle24HourFormat={toggle24HourFormat}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:gap-6 mb-4 md:mb-6 pt-12 md:pt-6">
          <Clock is24HourFormat={settings.is24HourFormat} />
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <Timer presets={settings.timerPresets} />
        </div>
      </div>
    </div>
  );
};

export default Index;
