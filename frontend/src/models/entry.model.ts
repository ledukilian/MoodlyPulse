export interface DailyEntry {
  id?: number;
  user_id?: number;
  date: string;
  mood: number;
  sleep_hours: number;
  water_cups: number;
  sport_min: number;
  note?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EntryStats {
  total_entries: number;
  average_mood: number;
  average_sleep: number;
  total_water_cups: number;
  total_sport_min: number;
  weekly_stats: {
    average_mood: number;
    average_sleep: number;
    total_water_cups: number;
    total_sport_min: number;
    entries_count: number;
  };
  monthly_stats: {
    average_mood: number;
    average_sleep: number;
    total_water_cups: number;
    total_sport_min: number;
    entries_count: number;
  };
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}