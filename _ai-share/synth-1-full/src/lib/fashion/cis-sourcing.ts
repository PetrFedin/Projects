import type { CisSupplierV1 } from './types';

/** Реестр локальных фабрик и ателье (СНГ). */
export function getCisSuppliers(): CisSupplierV1[] {
  return [
    {
      id: 'S-RU-01',
      name: 'Ивановский Текстиль',
      location: 'Ivanovo',
      specialization: 'knitwear',
      moq: 100,
      rating: 4.8,
    },
    {
      id: 'S-RU-02',
      name: 'Moscow Atelier Lab',
      location: 'Moscow',
      specialization: 'accessories',
      moq: 20,
      rating: 4.9,
    },
    {
      id: 'S-BY-01',
      name: 'Minsk Fashion Factory',
      location: 'Minsk',
      specialization: 'outerwear',
      moq: 50,
      rating: 4.7,
    },
    {
      id: 'S-KZ-01',
      name: 'Almaty Denim Hub',
      location: 'Almaty',
      specialization: 'denim',
      moq: 200,
      rating: 4.5,
    },
  ];
}
