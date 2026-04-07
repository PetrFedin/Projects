import type { Product } from '@/lib/types';
import type { DesignDnaV1 } from './types';

/** Извлечение детальных конструктивных признаков (Design DNA). */
export function extractDesignDna(product: Product): DesignDnaV1 {
  const a = product.attributes ?? {};
  const t = `${product.name} ${product.description}`.toLowerCase();

  return {
    neckline: typeof a.neckline === 'string' ? a.neckline : 
              /v-neck|v-образн/i.test(t) ? 'V-Neck' : 
              /round|круглый/i.test(t) ? 'Round' : undefined,
    sleeveLength: typeof a.sleeve === 'string' ? a.sleeve : 
                  /long\s*sleeve|длинный\s*рукав/i.test(t) ? 'Long' : 
                  /short|короткий/i.test(t) ? 'Short' : undefined,
    fit: typeof a.fit === 'string' ? a.fit : 
         /oversize|оверсайз/i.test(t) ? 'Oversize' : 
         /slim|облегающ/i.test(t) ? 'Slim' : 'Regular',
    hemline: typeof a.hemline === 'string' ? a.hemline : undefined,
    fastening: typeof a.fastening === 'string' ? a.fastening : 
               /button|пуговиц/i.test(t) ? 'Buttons' : 
               /zip|молния/i.test(t) ? 'Zipper' : undefined,
  };
}
