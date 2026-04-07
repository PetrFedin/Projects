export interface HourlyTraffic {
  hour: string;
  count: number;
  prevCount: number;
}

export interface ZoneTraffic {
  id: string;
  name: string;
  count: number;
  dwellTime: number; // in minutes
  conversionRate: number;
}

export interface HeatmapPoint {
  x: number;
  y: number;
  value: number;
}

export interface FootfallStats {
  totalVisits: number;
  avgDwellTime: number;
  peakHour: string;
  conversionToSale: number;
  repeatCustomers: number;
  hourlyData: HourlyTraffic[];
  zoneData: ZoneTraffic[];
  heatmap: HeatmapPoint[];
}
