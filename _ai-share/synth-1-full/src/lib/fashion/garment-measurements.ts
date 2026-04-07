import type { Product } from '@/lib/types';
import type { SizeMeasurementsV1, GarmentMeasurementV1 } from './types';

/** Извлечение физических мерок из attributes (sizeChart_Specific). */
export function getProductMeasurements(product: Product, sizeName: string): GarmentMeasurementV1[] {
  const chart = product.attributes?.sizeChartDetailed;
  if (!chart || typeof chart !== 'object') return [];

  const sizeData = (chart as Record<string, any>)[sizeName];
  if (!sizeData || typeof sizeData !== 'object') return [];

  return Object.entries(sizeData).map(([key, value]) => ({
    label: formatMeasurementLabel(key),
    value: typeof value === 'number' ? value : String(value),
    unit: 'см',
  }));
}

export function getAllSizeMeasurements(product: Product): SizeMeasurementsV1[] {
  const chart = product.attributes?.sizeChartDetailed;
  if (!chart || typeof chart !== 'object') {
    // Demo fallback if no detailed chart
    if (!product.sizes || product.sizes.length === 0) return [];
    return product.sizes.map(s => ({
      size: s.name,
      measurements: [
        { label: 'Ширина изделия', value: 48 + (product.sizes?.indexOf(s) || 0) * 2, unit: 'см' },
        { label: 'Длина по спинке', value: 68 + (product.sizes?.indexOf(s) || 0) * 1, unit: 'см' },
      ]
    }));
  }

  return Object.entries(chart).map(([size, data]) => ({
    size,
    measurements: Object.entries(data as Record<string, any>).map(([k, v]) => ({
      label: formatMeasurementLabel(k),
      value: typeof v === 'number' ? v : String(v),
      unit: 'см',
    })),
  }));
}

function formatMeasurementLabel(key: string): string {
  const labels: Record<string, string> = {
    chest: 'Обхват груди',
    waist: 'Обхват талии',
    hips: 'Обхват бёдер',
    length: 'Длина изделия',
    sleeve: 'Длина рукава',
    shoulder: 'Ширина плеч',
    inseam: 'Внутренний шов',
    thigh: 'Обхват бедра',
  };
  return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
}
