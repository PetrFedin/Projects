export type CisCode =
  | "RU"
  | "BY"
  | "UA"
  | "KZ"
  | "AM"
  | "AZ"
  | "KG"
  | "UZ"
  | "TJ"
  | "TM"
  | "MD"
  | "GE";

export type PeriodPreset = "7d" | "30d" | "90d" | "season" | "year";
export type Granularity = "week" | "month";

export type CityPoint = {
  name: string;
  viewers: number;
  lon: number;
  lat: number;
};

export type CountryView = {
  code: CisCode;
  name: string;
  viewers: number;
  cities: CityPoint[];
};

export type TimePoint = {
  label: string;      // "Неделя 1"
  date: string;       // ISO-like key: "2025-W01"
  viewersByCountry: Record<CisCode, number>;
};

export type GeoAnalyticsResponse = {
  period: PeriodPreset;
  granularity: Granularity;
  points: TimePoint[];
  // для текущего среза (последняя точка)
  current: {
    date: string;
    viewersByCountry: Record<CisCode, number>;
  };
};
