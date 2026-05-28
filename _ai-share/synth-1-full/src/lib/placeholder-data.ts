import type { Brand } from './types';
import brandData from '@/lib/data/brands.json';

// Мы используем только бренды из brands.json (Syntha Lab и Nordic Wool)
export const brands: Brand[] = brandData as unknown as Brand[];
