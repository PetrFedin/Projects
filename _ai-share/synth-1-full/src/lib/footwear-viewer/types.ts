/**
 * Ассеты обуви: многоракурсные фото / 360, опционально GLB после 3D-скана,
 * пресеты «с чем носить» (низ, цвет, материал).
 * Хранить в PIM в `Product.footwear` по этой схеме (сериализация JSON).
 */

export type FootwearAngleId =
  | 'top'
  | 'sole'
  | 'side_left'
  | 'side_right'
  | 'front'
  | 'back'
  | 'three_quarter_left'
  | 'three_quarter_right';

export interface FootwearAngleShot {
  id: FootwearAngleId;
  /** Подпись в UI: «Сверху», «Подошва», … */
  label: string;
  imageUrl: string;
  /** Порядок в круговом 360 (0…n), по возрастанию угла обзора */
  sequenceIndex: number;
}

export type FootwearScanSource =
  | 'photogrammetry'
  | 'lid_ar'
  | 'studio_scan'
  | 'manual_upload';

export interface FootwearScanMeta {
  source: FootwearScanSource;
  capturedAt?: string;
  notes?: string;
}

export interface FootwearScanBundle {
  skuId: string;
  name: string;
  angles: FootwearAngleShot[];
  /** GLB/GLTF из DAM после реконструкции или студийного скана */
  model3dUrl?: string;
  scan?: FootwearScanMeta;
  /** Пресеты «с чем носить» из PIM; иначе демо в UI */
  pairingPresets?: BottomWearPairingPreset[];
}

export type BottomWearCategory = 'jeans' | 'trousers' | 'joggers' | 'shorts' | 'skirt' | 'dress_pants';

export interface BottomWearPairingPreset {
  id: string;
  label: string;
  category: BottomWearCategory;
  fabricHint: string;
  colorName: string;
  colorHex: string;
  /** Композит или лук «обувь + низ» */
  pairingPreviewUrl?: string;
}
