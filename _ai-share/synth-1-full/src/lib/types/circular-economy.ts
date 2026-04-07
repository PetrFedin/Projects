export type MaterialCondition = 'pristine' | 'slight_damage' | 'cut_leftovers';

export interface MaterialListing {
  id: string;
  supplierId: string;
  supplierName: string;
  materialName: string;
  type: 'fabric' | 'leather' | 'yarn' | 'trims';
  quantity: number;
  unit: 'meters' | 'kg' | 'units';
  pricePerUnit: number;
  originalPrice?: number;
  condition: MaterialCondition;
  description: string;
  composition: string;
  color: string;
  hexColor: string;
  images: string[];
  location: string;
  createdAt: string;
  isEcoCertified: boolean;
}

export interface CircularTransaction {
  id: string;
  listingId: string;
  buyerId: string;
  buyerName: string;
  buyerType: 'brand' | 'factory';
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'received';
  createdAt: string;
}
