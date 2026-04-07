/**
 * RepSpark: Product Customization в checkout — логотипы, мокапы при оформлении.
 * Опции кастомизации для B2B (логотип на мерче, мокапы для превью).
 */

export type CustomizationType = 'logo' | 'mockup' | 'embroidery' | 'print';

export interface CustomizationOption {
  id: string;
  type: CustomizationType;
  label: string;
  /** Требуется ли загрузка файла */
  requiresUpload: boolean;
  /** Макс. размер файла (МБ) */
  maxFileSizeMb?: number;
  acceptedFormats?: string[];
  price?: number;
}

export const CUSTOMIZATION_OPTIONS: CustomizationOption[] = [
  { id: 'logo', type: 'logo', label: 'Логотип на изделии', requiresUpload: true, maxFileSizeMb: 5, acceptedFormats: ['png', 'svg', 'ai'], price: 500 },
  { id: 'mockup', type: 'mockup', label: 'Мокап для превью', requiresUpload: true, maxFileSizeMb: 10, acceptedFormats: ['png', 'jpg', 'psd'] },
  { id: 'embroidery', type: 'embroidery', label: 'Вышивка (логотип)', requiresUpload: true, maxFileSizeMb: 2, acceptedFormats: ['emb', 'dst', 'png'] },
  { id: 'print', type: 'print', label: 'Печать (принт)', requiresUpload: true, maxFileSizeMb: 20, acceptedFormats: ['png', 'ai', 'pdf'] },
];

export interface LineItemCustomization {
  lineItemId: string;
  optionId: string;
  /** URL загруженного файла */
  fileUrl?: string;
  fileName?: string;
  notes?: string;
}
