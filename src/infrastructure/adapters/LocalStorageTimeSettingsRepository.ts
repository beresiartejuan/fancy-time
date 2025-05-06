
import { TimeSettings, DEFAULT_SETTINGS } from "../../domain/models/TimeSettings";
import { TimeSettingsRepository } from "../../domain/ports/TimeSettingsRepository";

export class LocalStorageTimeSettingsRepository implements TimeSettingsRepository {
  private readonly STORAGE_KEY = 'fancy-time-settings';

  async saveSettings(settings: TimeSettings): Promise<void> {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage:", error);
    }
  }

  async loadSettings(): Promise<TimeSettings | null> {
    try {
      const storedSettings = localStorage.getItem(this.STORAGE_KEY);
      if (!storedSettings) {
        return DEFAULT_SETTINGS;
      }
      return { ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) };
    } catch (error) {
      console.error("Failed to load settings from localStorage:", error);
      return DEFAULT_SETTINGS;
    }
  }
}
