/**
 * PLM Integrations — Gerber, CLO3D, Lectra
 * Импорт BOM, градаций, лекал
 */

export type PlmProvider = 'gerber' | 'clo3d' | 'lectra';

export interface PlmConnection {
  provider: PlmProvider;
  name: string;
  baseUrl?: string;
  apiKey?: string;
  lastSync?: string;
  status: 'connected' | 'disconnected' | 'error';
}

export interface PlmImportBom {
  provider: PlmProvider;
  collectionId: string;
  skuId?: string;
  file?: File | Buffer;
  rawXml?: string; // для Gerber/Lectra XML
}

export interface PlmBomItem {
  componentId: string;
  name: string;
  consumption: number;
  unit: string;
  size?: string;
}

export interface PlmImportResult {
  success: boolean;
  skuId?: string;
  bomItems?: PlmBomItem[];
  gradations?: { size: string; measurements: Record<string, number> }[];
  errors?: string[];
}

const PROVIDER_LABELS: Record<PlmProvider, string> = {
  gerber: 'Gerber AccuMark',
  clo3d: 'CLO3D',
  lectra: 'Lectra Modaris',
};

export function getPlmProviderLabel(p: PlmProvider): string {
  return PROVIDER_LABELS[p] ?? p;
}

/** Парсинг BOM из mock/XML (упрощённо) */
export function parsePlmBom(provider: PlmProvider, data: string | unknown): PlmBomItem[] {
  if (typeof data === 'string' && data.includes('<')) {
    return parseXmlBom(data);
  }
  if (Array.isArray(data)) {
    return (data as PlmBomItem[]).slice(0, 50);
  }
  return [
    { componentId: 'F-001', name: 'Cotton Jersey 180g', consumption: 1.2, unit: 'м' },
    { componentId: 'Z-001', name: 'Молния', consumption: 1, unit: 'шт' },
  ];
}

function parseXmlBom(xml: string): PlmBomItem[] {
  const items: PlmBomItem[] = [];
  const m = xml.match(/<component[^>]*>[\s\S]*?<\/component>/gi);
  if (m) {
    m.slice(0, 30).forEach((block) => {
      const id = block.match(/id="([^"]+)"/)?.[1] ?? 'C-?';
      const name = block.match(/name="([^"]+)"/)?.[1] ?? 'Component';
      const qty = parseFloat(block.match(/quantity="([^"]+)"/)?.[1] ?? '1');
      const unit = block.match(/unit="([^"]+)"/)?.[1] ?? 'шт';
      items.push({ componentId: id, name, consumption: qty, unit });
    });
  }
  if (items.length === 0) {
    items.push({ componentId: 'F-001', name: 'Fabric', consumption: 1.2, unit: 'м' });
  }
  return items;
}
