import { GeoAnalyticsResponse, Granularity, PeriodPreset } from "@/components/geo/geo.types";
import { buildMockTimeSeries, sliceByPeriod } from "@/components/geo/geo.utils";

export interface GeoRepo {
  getGeoAnalytics(params: { period: PeriodPreset; granularity: Granularity }): Promise<GeoAnalyticsResponse>;
}

/**
 * MVP: Mock реализация.
 * Позже заменишь на Firestore/BigQuery, но интерфейс останется тем же.
 */
export class MockGeoRepo implements GeoRepo {
  async getGeoAnalytics(params: { period: PeriodPreset; granularity: Granularity }): Promise<GeoAnalyticsResponse> {
    // сейчас granularity не влияет (держим для будущего API)
    const full = buildMockTimeSeries();
    const points = sliceByPeriod(full, params.period);
    const current = points[points.length - 1] ?? points[0];

    return {
      period: params.period,
      granularity: params.granularity,
      points,
      current: {
        date: current?.date ?? "n/a",
        viewersByCountry: current?.viewersByCountry ?? ({} as any),
      },
    };
  }
}
