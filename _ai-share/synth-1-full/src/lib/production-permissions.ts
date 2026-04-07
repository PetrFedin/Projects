/**
 * Роли и права доступа в производстве
 */
export type ProductionRole = 'admin' | 'brand' | 'designer' | 'technologist' | 'production_manager' | 'manufacturer' | 'supplier';

export const PRODUCTION_PERMISSIONS: Record<ProductionRole, {
  canViewCollections: boolean;
  canEditCollections: boolean;
  canViewPlm: boolean;
  canEditPlm: boolean;
  canViewSamples: boolean;
  canApproveSamples: boolean;
  canViewOrders: boolean;
  canCreatePO: boolean;
  canViewBudget: boolean;
  canEditBudget: boolean;
  canViewFinance: boolean;
  canViewQC: boolean;
  canEditQC: boolean;
}> = {
  admin: { canViewCollections: true, canEditCollections: true, canViewPlm: true, canEditPlm: true, canViewSamples: true, canApproveSamples: true, canViewOrders: true, canCreatePO: true, canViewBudget: true, canEditBudget: true, canViewFinance: true, canViewQC: true, canEditQC: true },
  brand: { canViewCollections: true, canEditCollections: true, canViewPlm: true, canEditPlm: true, canViewSamples: true, canApproveSamples: true, canViewOrders: true, canCreatePO: true, canViewBudget: true, canEditBudget: true, canViewFinance: true, canViewQC: true, canEditQC: true },
  designer: { canViewCollections: true, canEditCollections: false, canViewPlm: true, canEditPlm: true, canViewSamples: true, canApproveSamples: false, canViewOrders: false, canCreatePO: false, canViewBudget: false, canEditBudget: false, canViewFinance: false, canViewQC: false, canEditQC: false },
  technologist: { canViewCollections: true, canEditCollections: false, canViewPlm: true, canEditPlm: true, canViewSamples: true, canApproveSamples: true, canViewOrders: true, canCreatePO: false, canViewBudget: false, canEditBudget: false, canViewFinance: false, canViewQC: true, canEditQC: true },
  production_manager: { canViewCollections: true, canEditCollections: true, canViewPlm: true, canEditPlm: true, canViewSamples: true, canApproveSamples: true, canViewOrders: true, canCreatePO: true, canViewBudget: true, canEditBudget: false, canViewFinance: true, canViewQC: true, canEditQC: true },
  manufacturer: { canViewCollections: false, canEditCollections: false, canViewPlm: false, canEditPlm: false, canViewSamples: true, canApproveSamples: false, canViewOrders: true, canCreatePO: false, canViewBudget: false, canEditBudget: false, canViewFinance: false, canViewQC: true, canEditQC: true },
  supplier: { canViewCollections: false, canEditCollections: false, canViewPlm: false, canEditPlm: false, canViewSamples: false, canApproveSamples: false, canViewOrders: false, canCreatePO: false, canViewBudget: false, canEditBudget: false, canViewFinance: false, canViewQC: false, canEditQC: false },
};

export function getProductionRole(userRoles: string[] | undefined): ProductionRole {
  if (!userRoles?.length) return 'brand';
  if (userRoles.includes('admin')) return 'admin';
  if (userRoles.includes('manufacturer') || userRoles.includes('factory')) return 'manufacturer';
  if (userRoles.includes('supplier')) return 'supplier';
  if (userRoles.includes('designer')) return 'designer';
  if (userRoles.includes('technologist')) return 'technologist';
  if (userRoles.includes('production_manager') || userRoles.includes('buyer')) return 'production_manager';
  return 'brand';
}
