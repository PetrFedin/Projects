import { sizeChartDataShirts } from './sizes';
import { sizeChartDataHats, sizeChartDataBelts, sizeChartDataGloves } from './accessory-sizes';

export interface SizeDetails {
  label: string;
  value: string;
  description: string;
  fit?: string;
}

export const getSizeDetails = (category: string, sizeName: string): SizeDetails => {
  const cat = category.toLowerCase();

  // 1. Tops / Knitwear / Shirts / Outerwear
  if (['топы', 'трикотаж', 'рубашки и блузы', 'верхняя одежда', 'платья'].includes(cat)) {
    const data = sizeChartDataShirts.find((d) => d.Alpha === sizeName || d.RU === sizeName);
    if (data) {
      const fit =
        sizeName === 'XS' || sizeName === '40'
          ? 'Slim Fit'
          : sizeName === 'XL' || sizeName === '50'
            ? 'Oversize'
            : 'Regular Fit';
      return {
        label: 'ОГ / ОТ / ОБ',
        value: `${data.bust} / ${data.waist} / ${data.hips}`,
        description: `Рост: ${data.height}см`,
        fit: fit,
      };
    }
  }

  // 2. Trousers / Jeans
  if (['брюки', 'джинсы'].includes(cat)) {
    const pantsMap: Record<string, any> = {
      '40': { waist: '66-70', hips: '90-94', len: '100' },
      '42': { waist: '70-74', hips: '94-98', len: '102' },
      '44': { waist: '74-78', hips: '98-102', len: '104' },
      '46': { waist: '78-82', hips: '102-106', len: '106' },
      '48': { waist: '82-86', hips: '106-110', len: '108' },
      '50': { waist: '86-90', hips: '110-114', len: '110' },
      XS: { waist: '66-70', hips: '90-94', len: '100' },
      S: { waist: '70-74', hips: '94-98', len: '102' },
      M: { waist: '74-78', hips: '98-102', len: '104' },
      L: { waist: '78-82', hips: '102-106', len: '106' },
      XL: { waist: '82-86', hips: '106-110', len: '108' },
    };
    const d = pantsMap[sizeName];
    if (d)
      return {
        label: 'ОТ / ОБ / Длина',
        value: `${d.waist} / ${d.hips} / ${d.len}`,
        description: 'Straight Cut',
        fit: 'Regular',
      };
  }

  // 3. Shoes
  if (cat === 'обувь') {
    const shoeMap: Record<string, string> = {
      '36': '23.0',
      '37': '23.5',
      '38': '24.5',
      '39': '25.0',
      '40': '25.5',
      '41': '26.0',
      '42': '26.5',
      '43': '27.5',
      '44': '28.0',
      '45': '28.5',
    };
    const val = shoeMap[sizeName];
    if (val)
      return {
        label: 'Стопа (см)',
        value: val,
        description: 'Идет размер в размер',
        fit: 'Standard',
      };
  }

  // 4. Accessories (Hats, Belts, Gloves)
  if (cat === 'аксессуары') {
    // Hats
    const hat = sizeChartDataHats.find((d) => d.Alpha === sizeName || d.RU === sizeName);
    if (hat)
      return {
        label: 'Охват головы',
        value: `${hat.headCircumference} см`,
        description: `Глубина: ${hat.domeDepth}см`,
        fit: 'Classic',
      };

    // Belts
    const belt = sizeChartDataBelts.find((d) => d.Alpha === sizeName);
    if (belt)
      return {
        label: 'Длина / Ширина',
        value: `${belt.beltLength} / ${belt.width} см`,
        description: `Отверстий: ${belt.holes}`,
        fit: 'Adjustable',
      };
  }

  // Fallback
  return {
    label: 'Габариты',
    value: '86-66-90',
    description: 'Стандартный замер',
    fit: 'Normal',
  };
};
