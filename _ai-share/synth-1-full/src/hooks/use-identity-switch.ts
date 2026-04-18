'use client';

import { startTransition } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { organizations } from '@/components/team/_fixtures/team-data';
import { useRouter } from 'next/navigation';
import { useUIState } from '@/providers/ui-state';
import { useToast } from '@/hooks/use-toast';
import { ROUTES } from '@/lib/routes';

export function useIdentitySwitch() {
  const { signIn, updateProfile, user: currentUser } = useAuth();
  const { setViewRole } = useUIState();
  const { toast } = useToast();
  const router = useRouter();

  const handleIdentitySwitch = async (email: string, roleKey: string, organizationId?: string) => {
    try {
      console.log('--- GLOBAL IDENTITY SWITCH START ---');
      console.log('Switching to:', { email, roleKey, organizationId });

      toast({
        title: 'Переключение роли...',
        description: `Вход как ${email}`,
      });

      if (!email) {
        throw new Error('Email пользователя не указан');
      }

      // 1. Sign in
      let newProfile;
      try {
        console.log('Attempting sign in for:', email);
        newProfile = await signIn(email, 'password123');
        if (!newProfile) throw new Error('SignIn returned empty profile');
        console.log('Sign in SUCCESS:', newProfile.displayName, newProfile.uid);
      } catch (signInErr: any) {
        console.error('Sign in FAILED:', signInErr);
        throw new Error(
          `Ошибка входа для ${email}: ${signInErr.message || 'Неверный пароль или пользователь не найден'}`
        );
      }

      // 2. Organization context - only if explicitly provided and different
      if (organizationId && newProfile.activeOrganizationId !== organizationId) {
        const org = organizations[organizationId];
        if (org) {
          console.log('Updating organization to:', org.name);
          try {
            newProfile = await updateProfile({
              activeOrganizationId: organizationId,
              partnerName: org.name,
            });
          } catch (updateErr: any) {
            console.warn('Update profile failed, continuing with base profile:', updateErr);
          }
        } else {
          console.warn(`Организация ${organizationId} не найдена в базе.`);
        }
      }

      // 3. Update view mode (B2B vs B2C)
      const b2bRoles = ['admin', 'brand', 'shop', 'manufacturer', 'supplier', 'distributor'];
      const isB2B = b2bRoles.includes(roleKey);
      console.log('Setting view role to:', isB2B ? 'b2b' : 'client');
      setViewRole(isB2B ? 'b2b' : 'client');

      // 4. Determine target URL with robust fallbacks
      let targetUrl = ROUTES.client.profile; // Default to profile

      // Determine effective role type
      const currentOrgId = organizationId || newProfile.activeOrganizationId || '';
      const targetOrg = currentOrgId ? organizations[currentOrgId] : undefined;

      // Use roleKey as fallback if org data is missing
      let effectiveRole = roleKey;

      if (!targetOrg) {
        console.warn(`Organization ${currentOrgId} not found, falling back to roleKey: ${roleKey}`);
        effectiveRole = roleKey;
      } else {
        effectiveRole = targetOrg.type;
      }

      // Safety: check if effectiveRole is a valid role for mapping
      const validRoles = [
        'admin',
        'brand',
        'shop',
        'manufacturer',
        'supplier',
        'distributor',
        'client',
      ];
      if (!validRoles.includes(effectiveRole)) {
        effectiveRole = roleKey;
      }

      console.log('Final Effective Role for Redirect:', effectiveRole);

      // Map roles to URLs (главные страницы профилей)
      const roleMap: Record<string, string> = {
        admin: ROUTES.admin.home,
        brand: ROUTES.brand.home,
        shop: ROUTES.shop.home,
        manufacturer: ROUTES.factory.production,
        supplier: ROUTES.factory.supplier,
        distributor: ROUTES.distributor.home,
        /** Личный кабинет покупателя — страница профиля */
        client: ROUTES.client.profile,
      };

      targetUrl = roleMap[effectiveRole] || ROUTES.client.profile;

      console.log('Identity switch SUCCESS. Final target:', targetUrl);

      toast({
        title: 'Личность изменена',
        description: `Вы вошли как ${newProfile.displayName}`,
      });

      startTransition(() => {
        router.push(targetUrl);
      });
    } catch (err: any) {
      console.error('Identity switch CRITICAL ERROR:', err);
      toast({
        title: 'Ошибка переключения',
        description: err.message || 'Неизвестная ошибка',
        variant: 'destructive',
      });
    }
  };

  return { handleIdentitySwitch };
}
