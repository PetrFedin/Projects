import { MaterialListing, CircularTransaction } from '../types/circular-economy';

export const MOCK_MATERIAL_LISTINGS: MaterialListing[] = [
  {
    id: 'list-001',
    supplierId: 'org-supplier-001',
    supplierName: 'EuroTextile Hub',
    materialName: 'Premium Italian Silk',
    type: 'fabric',
    quantity: 45,
    unit: 'meters',
    pricePerUnit: 1200,
    originalPrice: 3500,
    condition: 'pristine',
    description:
      'Остаток после пошива коллекции SS24. Шелк высшей категории, идеален для мелких серий или аксессуаров.',
    composition: '100% Silk',
    color: 'Midnight Blue',
    hexColor: '#191970',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=400&auto=format&fit=crop',
    ],
    location: 'Milan, Italy',
    createdAt: '2024-03-01T10:00:00Z',
    isEcoCertified: true,
  },
  {
    id: 'list-002',
    supplierId: 'org-supplier-002',
    supplierName: 'EcoCotton Turkey',
    materialName: 'Organic GOTS Cotton Jersey',
    type: 'fabric',
    quantity: 120,
    unit: 'meters',
    pricePerUnit: 450,
    originalPrice: 850,
    condition: 'pristine',
    description: 'Перепроизводство лота. Органический хлопок, сертифицирован GOTS.',
    composition: '95% Organic Cotton, 5% Elastane',
    color: 'Off-White',
    hexColor: '#F5F5F5',
    images: [
      'https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=400&auto=format&fit=crop',
    ],
    location: 'Istanbul, Turkey',
    createdAt: '2024-03-02T11:30:00Z',
    isEcoCertified: true,
  },
  {
    id: 'list-003',
    supplierId: 'org-brand-002',
    supplierName: 'Nordic Wool Archive',
    materialName: 'Selvedge Denim Leftovers',
    type: 'fabric',
    quantity: 15,
    unit: 'meters',
    pricePerUnit: 800,
    originalPrice: 1800,
    condition: 'cut_leftovers',
    description:
      'Остатки раскроя джинсов. Ширина полосы 40-60см. Идеально для апсайклинга и пэчворка.',
    composition: '100% Cotton Selvedge Denim',
    color: 'Raw Indigo',
    hexColor: '#1a237e',
    images: [
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=400&auto=format&fit=crop',
    ],
    location: 'Paris, France',
    createdAt: '2024-03-04T09:00:00Z',
    isEcoCertified: false,
  },
];

export const MOCK_CIRCULAR_TRANSACTIONS: CircularTransaction[] = [
  {
    id: 'tr-001',
    listingId: 'list-001',
    buyerId: 'org-brand-001',
    buyerName: 'Syntha Premium',
    buyerType: 'brand',
    quantity: 10,
    totalAmount: 12000,
    status: 'paid',
    createdAt: '2024-03-06T15:00:00Z',
  },
];

export const getConditionLabel = (condition: string) => {
  const labels: { [key: string]: string } = {
    pristine: 'Идеальное (целый рулон)',
    slight_damage: 'Небольшие дефекты',
    cut_leftovers: 'Обрезки / Остатки раскроя',
  };
  return labels[condition] || condition;
};

export const getConditionColor = (condition: string) => {
  const colors: { [key: string]: string } = {
    pristine: 'bg-emerald-100 text-emerald-600',
    slight_damage: 'bg-amber-100 text-amber-600',
    cut_leftovers: 'bg-accent-primary/15 text-accent-primary',
  };
  return colors[condition] || 'bg-bg-surface2 text-text-secondary';
};
