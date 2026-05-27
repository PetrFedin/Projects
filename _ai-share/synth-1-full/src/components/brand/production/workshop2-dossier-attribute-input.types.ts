import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';

export interface DossierAttributeDisplayDefinition extends AttributeCatalogAttribute {
  uiType:
    | 'text_input'
    | 'select'
    | 'multiselect'
    | 'number_input'
    | 'color_palette'
    | 'image_upload'
    | 'date_input';
  value: string | string[] | number | null;
  // Additional properties for display logic
  label: string;
  placeholder?: string;
  options?: { value: string; label: string; color?: string }[];
  imageUploadUrl?: string; // For uiType 'image_upload'
  description?: string; // For hints or additional information
}
