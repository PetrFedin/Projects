import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';

export function generateRealisticSku(
  dossier: Workshop2DossierPhase1 | undefined | null,
  currentLeaf?: HandbookCategoryLeaf
): string {
  if (!dossier) return 'FW26-XXX-XXX-001';

  // 1. Season
  let seasonCode = 'XX00';
  const targetDate = dossier.passportProductionBrief?.targetSampleOrPilotDate;
  if (targetDate) {
    const date = new Date(targetDate);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear().toString().slice(-2);
      const month = date.getMonth() + 1;
      // FW: Aug-Jan (8-1), SS: Feb-Jul (2-7)
      const isFW = month >= 8 || month <= 1;
      seasonCode = `${isFW ? 'FW' : 'SS'}${year}`;
    }
  }

  // 2. Category
  let categoryCode = 'XXX';
  const categoryLabel = currentLeaf?.l3Name || currentLeaf?.pathLabel;
  if (categoryLabel) {
    const cat = categoryLabel.toLowerCase();
    if (cat.includes('платье')) categoryCode = 'DRS';
    else if (cat.includes('брюки')) categoryCode = 'PNT';
    else if (cat.includes('футболка')) categoryCode = 'TSH';
    else if (cat.includes('рубашка')) categoryCode = 'SHT';
    else if (cat.includes('куртка')) categoryCode = 'JKT';
    else if (cat.includes('пальто')) categoryCode = 'COA';
    else if (cat.includes('юбка')) categoryCode = 'SKT';
    else if (cat.includes('свитер')) categoryCode = 'SWT';
    else if (cat.includes('джинсы')) categoryCode = 'JNS';
    else if (cat.includes('шорты')) categoryCode = 'SHR';
    else if (cat.includes('топ')) categoryCode = 'TOP';
    else if (cat.includes('худи')) categoryCode = 'HDY';
    else if (cat.includes('жакет')) categoryCode = 'JAC';
    else
      categoryCode = cat
        .slice(0, 3)
        .toUpperCase()
        .replace(/[^A-ZА-ЯЁ]/g, 'X')
        .padEnd(3, 'X');
  }

  // 3. Color
  let colorCode = 'XXX';
  const colorAssignment = dossier.assignments?.find((a) => a.attributeId === 'color');
  if (colorAssignment && colorAssignment.values.length > 0) {
    const colorLabel = colorAssignment.values[0].displayLabel.toLowerCase();
    if (colorLabel.includes('черный') || colorLabel.includes('чёрный')) colorCode = 'BLK';
    else if (colorLabel.includes('белый')) colorCode = 'WHT';
    else if (colorLabel.includes('красный')) colorCode = 'RED';
    else if (colorLabel.includes('синий')) colorCode = 'BLU';
    else if (colorLabel.includes('зеленый') || colorLabel.includes('зелёный')) colorCode = 'GRN';
    else if (colorLabel.includes('серый')) colorCode = 'GRY';
    else if (colorLabel.includes('желтый') || colorLabel.includes('жёлтый')) colorCode = 'YLW';
    else if (colorLabel.includes('розовый')) colorCode = 'PNK';
    else if (colorLabel.includes('коричневый')) colorCode = 'BRN';
    else if (colorLabel.includes('бежевый')) colorCode = 'BEI';
    else if (colorLabel.includes('оранжевый')) colorCode = 'ORG';
    else if (colorLabel.includes('фиолетовый')) colorCode = 'PRP';
    else
      colorCode = colorLabel
        .slice(0, 3)
        .toUpperCase()
        .replace(/[^A-ZА-ЯЁ]/g, 'X')
        .padEnd(3, 'X');
  }

  // 4. Sequence
  // Mocked as 001 for the generator stub
  const seq = '001';

  return `${seasonCode}-${categoryCode}-${colorCode}-${seq}`;
}
