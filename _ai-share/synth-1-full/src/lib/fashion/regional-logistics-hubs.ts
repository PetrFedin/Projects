/** Региональные логистические хабы и ПВЗ (для ритейла). */
export function getRegionalLogisticsHubs() {
  return [
    { id: 'HUB-MSK', city: 'Moscow (Khimki)', capacity: 'High', load: 85, services: ['Express', 'Next Day', 'Pick-up'] },
    { id: 'HUB-SPB', city: 'St. Petersburg', capacity: 'Medium', load: 60, services: ['Standard', 'Pick-up'] },
    { id: 'HUB-EKB', city: 'Ekaterinburg', capacity: 'Medium', load: 45, services: ['Standard', 'Trucking'] },
  ];
}
