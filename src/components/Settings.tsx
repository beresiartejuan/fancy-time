
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon } from "lucide-react";

interface SettingsProps {
  themeColor: string;
  is24HourFormat: boolean;
  onThemeColorChange: (color: string) => void;
  onToggle24HourFormat: () => void;
}

const predefinedColors = [
  "#9b87f5", // Purple
  "#f59b87", // Coral
  "#87f59b", // Mint
  "#f587e8", // Pink
  "#87c1f5", // Blue
  "#f5e887", // Yellow
];

const Settings: React.FC<SettingsProps> = ({ 
  themeColor, 
  is24HourFormat, 
  onThemeColorChange, 
  onToggle24HourFormat 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(themeColor);

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
  };

  const handleCustomColorApply = () => {
    onThemeColorChange(customColor);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 rounded-full backdrop-blur-lg bg-white/20 border border-white/30 hover:bg-white/30"
        >
          <SettingsIcon className="h-5 w-5" />
          <span className="sr-only">Open settings</span>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 glass-panel border-white/30 p-4">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Theme Color</h3>
            <div className="flex gap-2 flex-wrap mb-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`h-8 w-8 rounded-full transition-all ${themeColor === color ? 'ring-2 ring-white scale-110' : 'hover:scale-110'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => onThemeColorChange(color)}
                  aria-label={`Select ${color} theme color`}
                />
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2 items-center">
              <input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-10 h-10 p-0 border-none bg-transparent"
              />
              <input
                type="text"
                value={customColor}
                onChange={handleCustomColorChange}
                className="flex-1 min-w-[100px] px-3 py-1 rounded-md border border-white/30 bg-background/50"
              />
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleCustomColorApply}
                className="whitespace-nowrap"
              >
                Apply
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="24-hour-format" className="cursor-pointer">
              24-hour time format
            </Label>
            <Switch
              id="24-hour-format"
              checked={is24HourFormat}
              onCheckedChange={onToggle24HourFormat}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Settings;
