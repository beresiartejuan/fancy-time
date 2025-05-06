
import { useState, useEffect, useCallback } from "react";
import { TimeSettings, DEFAULT_SETTINGS } from "../domain/models/TimeSettings";
import { TimeSettingsService } from "../application/services/TimeSettingsService";
import { LocalStorageTimeSettingsRepository } from "../infrastructure/adapters/LocalStorageTimeSettingsRepository";

// Singleton instance of the service
const timeSettingsRepository = new LocalStorageTimeSettingsRepository();
const timeSettingsService = new TimeSettingsService(timeSettingsRepository);

export function useTimeSettings() {
  const [settings, setSettings] = useState<TimeSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const loadedSettings = await timeSettingsService.getSettings();
        setSettings(loadedSettings);
        
        // Apply theme color to CSS variables
        applyThemeColor(loadedSettings.themeColor);
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Update theme color
  const updateThemeColor = useCallback(async (color: string) => {
    try {
      const updatedSettings = await timeSettingsService.updateThemeColor(color);
      setSettings(updatedSettings);
      applyThemeColor(color);
    } catch (error) {
      console.error("Error updating theme color:", error);
    }
  }, []);

  // Apply theme color and calculate appropriate text color
  const applyThemeColor = (color: string) => {
    const hslColor = convertHexToHsl(color);
    document.documentElement.style.setProperty('--theme', hslColor);
    
    // Calculate if we should use light or dark text
    const isDarkColor = isColorDark(color);
    const textColor = isDarkColor ? "255 255 255" : "0 0 0";
    document.documentElement.style.setProperty('--theme-foreground', textColor);
  };

  // Toggle 24-hour format
  const toggle24HourFormat = useCallback(async () => {
    try {
      const updatedSettings = await timeSettingsService.toggle24HourFormat();
      setSettings(updatedSettings);
    } catch (error) {
      console.error("Error toggling 24-hour format:", error);
    }
  }, []);

  return { 
    settings, 
    loading, 
    updateThemeColor, 
    toggle24HourFormat 
  };
}

// Check if a color is dark (to determine text color)
function isColorDark(hex: string): boolean {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate perceived brightness using the formula: (R*299 + G*587 + B*114) / 1000
  // This formula gives more weight to colors the human eye is more sensitive to
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // If brightness is less than 128, consider it a dark color
  return brightness < 128;
}

// Helper function to convert hex to HSL format for CSS variables
function convertHexToHsl(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Find max and min values to compute chroma
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = max - min;
  
  // Calculate lightness
  let l = (max + min) / 2;
  
  // Calculate saturation
  let s = 0;
  if (chroma !== 0) {
    s = chroma / (1 - Math.abs(2 * l - 1));
  }
  
  // Calculate hue
  let h = 0;
  if (chroma !== 0) {
    if (max === r) {
      h = ((g - b) / chroma) % 6;
    } else if (max === g) {
      h = (b - r) / chroma + 2;
    } else {
      h = (r - g) / chroma + 4;
    }
  }
  
  // Convert hue to degrees
  h = Math.round(h * 60);
  if (h < 0) {
    h += 360;
  }
  
  // Convert saturation and lightness to percentage
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  
  return `${h} ${s}% ${l}%`;
}
