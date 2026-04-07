import { FootfallStats, HourlyTraffic, ZoneTraffic, HeatmapPoint } from '../types/footfall';

export const MOCK_HOURLY_TRAFFIC: HourlyTraffic[] = [
  { hour: '10:00', count: 45, prevCount: 38 },
  { hour: '11:00', count: 82, prevCount: 75 },
  { hour: '12:00', count: 124, prevCount: 110 },
  { hour: '13:00', count: 156, prevCount: 142 },
  { hour: '14:00', count: 138, prevCount: 125 },
  { hour: '15:00', count: 115, prevCount: 108 },
  { hour: '16:00', count: 142, prevCount: 130 },
  { hour: '17:00', count: 198, prevCount: 185 },
  { hour: '18:00', count: 245, prevCount: 220 },
  { hour: '19:00', count: 210, prevCount: 195 },
  { hour: '20:00', count: 165, prevCount: 150 },
  { hour: '21:00', count: 85, prevCount: 78 },
];

export const MOCK_ZONE_TRAFFIC: ZoneTraffic[] = [
  { id: 'z1', name: 'Входная зона', count: 1850, dwellTime: 2.5, conversionRate: 100 },
  { id: 'z2', name: 'Женская коллекция', count: 1240, dwellTime: 12.8, conversionRate: 18.5 },
  { id: 'z3', name: 'Мужская коллекция', count: 850, dwellTime: 9.4, conversionRate: 12.2 },
  { id: 'z4', name: 'Аксессуары', count: 620, dwellTime: 5.6, conversionRate: 24.8 },
  { id: 'z5', name: 'Примерочные', count: 480, dwellTime: 15.2, conversionRate: 45.0 },
  { id: 'z6', name: 'Кассовая зона', count: 320, dwellTime: 4.8, conversionRate: 100 },
];

// Generate some random heatmap points
const generateHeatmap = (): HeatmapPoint[] => {
  const points: HeatmapPoint[] = [];
  for (let i = 0; i < 50; i++) {
    points.push({
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
      value: Math.floor(Math.random() * 100),
    });
  }
  return points;
};

export const MOCK_FOOTFALL_STATS: FootfallStats = {
  totalVisits: 1850,
  avgDwellTime: 24.5,
  peakHour: '18:00',
  conversionToSale: 17.3,
  repeatCustomers: 28.5,
  hourlyData: MOCK_HOURLY_TRAFFIC,
  zoneData: MOCK_ZONE_TRAFFIC,
  heatmap: generateHeatmap(),
};
