import type { EaeuDigitalPassportV1 } from './types';

/** Цифровой паспорт EAEU/Честный Знак (EAC Certification, KIZ, ЭДО). */
export function getEaeuDigitalPassport(sku: string): EaeuDigitalPassportV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 31;

  return {
    sku,
    honestMarkId: `01${seed}1234567890${seed % 100}21${seed % 99}`,
    edoStatus: seed % 5 === 0 ? 'pending' : 'signed',
    customsDeclarationNum: `10113110/${seed % 28}0326/${seed % 999999}`,
    certificationType: seed % 2 === 0 ? 'TR_CU' : 'EAC',
    originCountry: seed % 3 === 0 ? 'China' : seed % 2 === 0 ? 'Uzbekistan' : 'Russia',
  };
}
