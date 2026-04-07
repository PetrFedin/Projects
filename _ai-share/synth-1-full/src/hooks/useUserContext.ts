import { useAuth } from '@/providers/auth-provider';
import { useB2BState } from '@/providers/b2b-state';
import { useMemo } from 'react';
import type { UserProfile, Organization, PermissionSet, UserRole } from '@/lib/types';

export interface UserContext {
  // Basic Info
  user: UserProfile | null;
  
  // Organization Context
  currentOrg: Organization | null;
  allOrgs: Organization[];
  canSwitchOrg: boolean;
  
  // Role Detection
  isPlatformAdmin: boolean;
  isOrgAdmin: boolean;
  isOrgMember: boolean;
  
  // Business Role
  isRetailer: boolean;
  isBrand: boolean;
  isSupplier: boolean;
  isManufacturer: boolean;
  
  // Professional Role
  isBuyer: boolean;
  isSalesRep: boolean;
  isMerchandiser: boolean;
  isDesigner: boolean;
  
  // Permissions
  permissions: PermissionSet;
  
  // Actions
  switchOrganization: (orgId: string) => Promise<void>;
  hasPermission: (permission: keyof PermissionSet) => boolean;
  hasFeatureAccess: (feature: string) => boolean;
}

export function useUserContext(): UserContext {
  const { user, updateProfile } = useAuth();
  const { b2bConnections, retailerProfiles } = useB2BState();
  
  const context = useMemo(() => {
    if (!user) return getGuestContext();
    
    // Get current organization access
    const currentOrgAccess = user.organizations?.find(
      o => o.organizationId === user.activeOrganizationId
    );
    
    // Build organizations list
    const orgs: Organization[] = (user.organizations || []).map(orgAccess => {
      const orgType = detectOrgType(orgAccess.organizationId, user.roles || []);
      
      return {
        id: orgAccess.organizationId,
        name: getOrgName(orgAccess.organizationId, user),
        type: orgType,
        logo: '/placeholder-logo.png',
        ownerId: user.uid,
        participantsLimit: 50,
        isVerified: true,
        visibility: 'public' as const,
        stats: {
          activeUsers: 12,
          totalRevenue: 5000000,
          orderVolume: 150,
          complianceScore: 85,
          lastActivity: new Date().toISOString()
        }
      };
    });
    
    const currentOrg = orgs.find(o => o.id === user.activeOrganizationId) || orgs[0] || null;
    
    // Role Detection
    const isPlatformAdmin = user.roles?.includes('admin') || false;
    const isOrgAdmin = currentOrgAccess?.roleInOrg === 'admin';
    const isOrgMember = currentOrgAccess?.roleInOrg === 'member' || currentOrgAccess?.roleInOrg === 'co-admin';
    
    // Business Type
    const isRetailer = currentOrg?.type === 'shop' || 
                       user.roles?.includes('shop') || 
                       user.roles?.includes('b2b') || false;
    const isBrand = currentOrg?.type === 'brand' || user.roles?.includes('brand') || false;
    const isSupplier = currentOrg?.type === 'supplier' || user.roles?.includes('supplier') || false;
    const isManufacturer = currentOrg?.type === 'manufacturer' || user.roles?.includes('manufacturer') || false;
    
    // Professional Role
    const isBuyer = user.professionalRoles?.includes('buyer') || false;
    const isSalesRep = user.professionalRoles?.includes('sales_representative') || false;
    const isMerchandiser = user.professionalRoles?.includes('merchandiser') || false;
    const isDesigner = user.professionalRoles?.includes('designer') || false;
    
    // Permissions
    const permissions: PermissionSet = currentOrgAccess?.permissions || {
      canViewFinances: isPlatformAdmin || isOrgAdmin,
      canEditPLM: isPlatformAdmin || isOrgAdmin,
      canManageTeam: isPlatformAdmin || isOrgAdmin,
      canViewAnalytics: isPlatformAdmin || isOrgAdmin || isOrgMember,
      canApproveOrders: isPlatformAdmin || isOrgAdmin,
      canAccessAuditTrail: isPlatformAdmin || isOrgAdmin
    };
    
    return {
      user,
      currentOrg,
      allOrgs: orgs,
      canSwitchOrg: orgs.length > 1,
      
      isPlatformAdmin,
      isOrgAdmin: isOrgAdmin || false,
      isOrgMember: isOrgMember || false,
      
      isRetailer,
      isBrand,
      isSupplier,
      isManufacturer,
      
      isBuyer,
      isSalesRep,
      isMerchandiser,
      isDesigner,
      
      permissions,
      
      switchOrganization: async (orgId: string) => {
        await updateProfile({ activeOrganizationId: orgId });
      },
      
      hasPermission: (permission: keyof PermissionSet) => {
        return permissions[permission] === true;
      },
      
      hasFeatureAccess: (feature: string) => {
        // Check subscription plan features
        const planFeatures = currentOrg?.subscription?.features || [];
        return planFeatures.includes(feature) || isPlatformAdmin;
      }
    };
  }, [user, b2bConnections, retailerProfiles, updateProfile]);
  
  return context;
}

function detectOrgType(orgId: string, roles: UserRole[]): UserRole {
  // Try to detect from orgId
  if (orgId.includes('brand')) return 'brand';
  if (orgId.includes('shop')) return 'shop';
  if (orgId.includes('supplier')) return 'supplier';
  if (orgId.includes('manufacturer')) return 'manufacturer';
  
  // Fallback to roles
  if (roles.includes('brand')) return 'brand';
  if (roles.includes('shop')) return 'shop';
  if (roles.includes('b2b')) return 'shop';
  
  return 'client';
}

function getOrgName(orgId: string, user: UserProfile): string {
  // Try to get from partnerName
  if (user.partnerName) return user.partnerName;
  
  // Fallback to generated name
  if (orgId.includes('brand')) return `${user.displayName}'s Brand`;
  if (orgId.includes('shop')) return `${user.displayName}'s Store`;
  
  return `Organization ${orgId.slice(-4)}`;
}

function getGuestContext(): UserContext {
  const defaultPermissions: PermissionSet = {
    canViewFinances: false,
    canEditPLM: false,
    canManageTeam: false,
    canViewAnalytics: false,
    canApproveOrders: false,
    canAccessAuditTrail: false
  };

  return {
    user: null,
    currentOrg: null,
    allOrgs: [],
    canSwitchOrg: false,
    isPlatformAdmin: false,
    isOrgAdmin: false,
    isOrgMember: false,
    isRetailer: false,
    isBrand: false,
    isSupplier: false,
    isManufacturer: false,
    isBuyer: false,
    isSalesRep: false,
    isMerchandiser: false,
    isDesigner: false,
    permissions: defaultPermissions,
    switchOrganization: async () => {},
    hasPermission: () => false,
    hasFeatureAccess: () => false
  };
}
