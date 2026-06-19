import { stripAttributeValuesOverlappingCatalog } from './strip-attribute-catalog-overlap';
import { productAttributesRawChunk0 } from './product-attributes/raw-chunk-0';
import { productAttributesRawChunk1 } from './product-attributes/raw-chunk-1';
import { productAttributesRawChunk2 } from './product-attributes/raw-chunk-2';

const allAttributeOptionsRaw = {
  ...productAttributesRawChunk0,
  ...productAttributesRawChunk1,
  ...productAttributesRawChunk2,
};

export const allAttributeOptions = stripAttributeValuesOverlappingCatalog(allAttributeOptionsRaw);
