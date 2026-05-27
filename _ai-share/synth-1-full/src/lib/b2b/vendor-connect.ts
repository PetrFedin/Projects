export interface VendorItemStock {
  vendorItemId: string;
  inStock: boolean;
  stockQty: number;
  leadTimeDays: number;
  price?: number;
  currency?: string;
}

export async function getVendorItemStock(vendorItemId: string): Promise<VendorItemStock> {
  // Mock implementation for B2B Vendor Connect
  // In a real app, this would call the vendor's API (e.g., Fashion Cloud, JOOR, NuORDER)

  // Deterministic mock based on ID
  const idNum = parseInt(vendorItemId.replace(/\D/g, '') || '0', 10);

  const inStock = idNum % 3 !== 0; // 2/3 chance of being in stock
  const stockQty = inStock ? (idNum % 1000) + 50 : 0;
  const leadTimeDays = inStock ? (idNum % 14) + 2 : (idNum % 30) + 14;

  return {
    vendorItemId,
    inStock,
    stockQty,
    leadTimeDays,
    price: (idNum % 500) + 10,
    currency: 'RUB',
  };
}
