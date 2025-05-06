
export interface TimeSettings {
  themeColor: string;
  timerPresets: number[];
  is24HourFormat: boolean;
}

export const DEFAULT_SETTINGS: TimeSettings = {
  themeColor: '#9b87f5', // Default purple
  timerPresets: [60, 300, 900, 1800], // 1min, 5min, 15min, 30min
  is24HourFormat: false,
};
