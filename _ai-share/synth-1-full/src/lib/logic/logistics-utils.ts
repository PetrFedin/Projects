import { InTransitShipment, InTransitItem } from '../types/logistics';

/**
 * Shadow Inventory Logic
 */

export const MOCK_SHIPMENTS: InTransitShipment[] = [
  {
    id: 'SHIP-SEA-9921',
    origin: 'Factory 04, Shenzhen',
    destination: 'Main Hub, Moscow',
    carrier: 'Maersk',
    trackingNumber: 'MAE-SH-112233',
    status: 'at_sea',
    departureDate: '2026-03-01',
    estimatedArrival: '2026-03-25',
    sellableInTransit: true,
    items: [
      {
        sku: 'BL-SLK-M',
        name: 'Silk Satin Blouse',
        qty: 500,
        allocatedToB2B: 200,
        availableForB2C: 300,
      },
      {
        sku: 'TRS-WOL-M',
        name: 'Wool Trousers',
        qty: 300,
        allocatedToB2B: 100,
        availableForB2C: 200,
      },
    ],
  },
  {
    id: 'SHIP-AIR-4242',
    origin: 'Factory 01, Istanbul',
    destination: 'Distribution Center, NYC',
    carrier: 'Turkish Cargo',
    trackingNumber: 'TK-8877-AF',
    status: 'customs',
    departureDate: '2026-03-05',
    estimatedArrival: '2026-03-10',
    sellableInTransit: false,
    items: [
      {
        sku: 'ACC-BELT-01',
        name: 'Leather Belt',
        qty: 1000,
        allocatedToB2B: 800,
        availableForB2C: 200,
      },
    ],
  },
];

export function calculateTotalInTransit(shipments: InTransitShipment[]): number {
  return shipments.reduce((total, ship) => {
    return total + ship.items.reduce((sum, item) => sum + item.qty, 0);
  }, 0);
}

export function getShadowATP(
  sku: string,
  baseStock: number,
  shipments: InTransitShipment[]
): number {
  const inTransit = shipments
    .filter((s) => s.sellableInTransit)
    .reduce((sum, s) => {
      const item = s.items.find((i) => i.sku === sku);
      return sum + (item ? item.availableForB2C : 0);
    }, 0);

  return baseStock + inTransit;
}
