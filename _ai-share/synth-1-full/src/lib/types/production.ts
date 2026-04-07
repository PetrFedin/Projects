/**
 * Production & PLM Types (Tech Pack 2.0)
 */

export interface BOMItem {
  id: string;
  category: 'fabric' | 'trim' | 'label' | 'packaging';
  name: string;
  supplierId?: string;
  colorCode?: string;
  consumptionPerUnit: number; // Расход на единицу
  unit: 'meters' | 'pcs' | 'kg';
  wastageAllowance: number;   // % на брак/выпады (например, 0.05)
}

export interface GradingPoint {
  measurementName: string;    // Название измерения (например, "Длина изделия")
  values: Record<string, number>; // { "S": 70, "M": 72, "L": 74 }
  tolerance: number;          // Допуск (+/- мм)
}

export interface SeamSpecification {
  id: string;
  name: string;
  type: string;               // Тип шва
  stitchPerCm: number;        // Стежков на см
  threadId: string;           // ID ниток из BOM
  instruction?: string;
}

export interface TechPack {
  id: string;
  productId: string;
  version: string;
  status: 'draft' | 'approved' | 'archived';
  bom: BOMItem[];
  grading: GradingPoint[];
  seams: SeamSpecification[];
  patternsUrl?: string;       // Ссылка на DXF/AAMA лекала
  attachments: { name: string, url: string }[];
}

export interface ProductionOrderRequirement {
  materialId: string;
  totalRequired: number;
  unit: string;
}
