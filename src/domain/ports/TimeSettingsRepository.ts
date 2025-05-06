
import { TimeSettings } from "../models/TimeSettings";

export interface TimeSettingsRepository {
  saveSettings(settings: TimeSettings): Promise<void>;
  loadSettings(): Promise<TimeSettings | null>;
}
