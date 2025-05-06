
import { TimeSettings, DEFAULT_SETTINGS } from "../../domain/models/TimeSettings";
import { TimeSettingsRepository } from "../../domain/ports/TimeSettingsRepository";

export class TimeSettingsService {
  constructor(private repository: TimeSettingsRepository) {}

  async getSettings(): Promise<TimeSettings> {
    const settings = await this.repository.loadSettings();
    return settings || DEFAULT_SETTINGS;
  }

  async updateSettings(settings: Partial<TimeSettings>): Promise<TimeSettings> {
    const currentSettings = await this.getSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    await this.repository.saveSettings(updatedSettings);
    return updatedSettings;
  }

  async updateThemeColor(color: string): Promise<TimeSettings> {
    return this.updateSettings({ themeColor: color });
  }

  async toggle24HourFormat(): Promise<TimeSettings> {
    const currentSettings = await this.getSettings();
    return this.updateSettings({ is24HourFormat: !currentSettings.is24HourFormat });
  }
}
