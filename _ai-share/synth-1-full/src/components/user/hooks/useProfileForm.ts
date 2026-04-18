'use client';

import { useForm, useWatch, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { profileSchema } from '@/lib/schemas/user-profile';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/types';
import { parseList, calcAge } from '@/lib/user-helpers';

export function useProfileForm(user: UserProfile) {
  const { toast } = useToast();
  const { updateProfile } = useAuth();

  const initialPrefs = user.preferences ?? {};

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user.displayName || '',
      email: user.email || '',
      bio: user.bio || '',
      nickname: user.nickname || '',
      identity: {
        firstName: user.identity?.firstName || '',
        lastName: user.identity?.lastName || '',
        firstNameEn: user.identity?.firstNameEn || '',
        lastNameEn: user.identity?.lastNameEn || '',
      },
      personalInfo: {
        gender: user.personalInfo?.gender || 'female',
        birthDate: user.personalInfo?.birthDate || '',
        bodyType: user.personalInfo?.bodyType || '',
        education: user.personalInfo?.education || '',
        country: user.personalInfo?.country || '',
        postalCode: user.personalInfo?.postalCode || '',
        city: user.personalInfo?.city || '',
        emails: {
          primary: user.personalInfo?.emails?.primary || user.email || '',
          secondary: user.personalInfo?.emails?.secondary || '',
        },
        phones: {
          primary: user.personalInfo?.phones?.primary || '',
          secondary: user.personalInfo?.phones?.secondary || '',
        },
        verification: {
          email: user.personalInfo?.verification?.email ?? true,
          phone: user.personalInfo?.verification?.phone ?? false,
        },
        addresses: {
          primary: user.personalInfo?.addresses?.primary || '',
          secondary: user.personalInfo?.addresses?.secondary || '',
        },
        phoneNumbers: (() => {
          const list = (
            user.personalInfo?.phoneNumbers?.length
              ? user.personalInfo.phoneNumbers
              : [
                  {
                    value: user.personalInfo?.phones?.primary || '',
                    verified: !!user.personalInfo?.verification?.phone,
                    primary: true,
                  },
                ]
          ) as any[];
          return list.sort((a, b) => (b.primary ? 1 : 0) - (a.primary ? 1 : 0));
        })(),
        emailAddresses: (() => {
          const list = (
            user.personalInfo?.emailAddresses?.length
              ? user.personalInfo.emailAddresses
              : [
                  {
                    value: user.personalInfo?.emails?.primary || user.email || '',
                    verified: !!user.personalInfo?.verification?.email,
                    primary: true,
                  },
                ]
          ) as any[];
          return list.sort((a, b) => (b.primary ? 1 : 0) - (a.primary ? 1 : 0));
        })(),
        addressBook: (() => {
          const list = (
            user.personalInfo?.addressBook?.length
              ? user.personalInfo.addressBook
              : [
                  {
                    country: user.personalInfo?.country || '',
                    postalCode: user.personalInfo?.postalCode || '',
                    city: user.personalInfo?.city || '',
                    address: user.personalInfo?.addresses?.primary || '',
                    primary: true,
                  },
                ]
          ) as any[];
          return list.sort((a, b) => (b.primary ? 1 : 0) - (a.primary ? 1 : 0));
        })(),
      },
      socialLinks: (() => {
        const existing = user.socials || {};
        const order = ['instagram', 'telegram', 'youtube', 'vk', 'facebook'] as const;
        const fromExisting = order
          .map((network) => {
            const v = (existing as any)[network];
            if (!v || !v.value) return null;
            return { network, value: v.value || '', synced: !!v.synced, verified: !!v.verified };
          })
          .filter(Boolean) as any[];
        const base = fromExisting.slice(0, 2);
        while (base.length < 2) {
          const network: 'instagram' | 'telegram' = base.length === 0 ? 'instagram' : 'telegram';
          const v = (existing as any)[network];
          base.push({
            network,
            value: v?.value || '',
            synced: !!v?.synced,
            verified: !!v?.verified,
          });
        }
        return base;
      })(),
      sync: {
        accounts: (user.sync?.accounts as any[]) || [],
      },
      lifestyle: {
        occupation: user.lifestyle?.occupation || '',
        age: user.lifestyle?.age ?? undefined,
      },
      measurements: {
        height: user.measurements?.height || undefined,
        weight: user.measurements?.weight || undefined,
        footLength: user.measurements?.footLength || undefined,
        footWidth: user.measurements?.footWidth || undefined,
        bust: user.measurements?.bust || undefined,
        underbust: user.measurements?.underbust || undefined,
        waist: user.measurements?.waist || undefined,
        hips: user.measurements?.hips || undefined,
        chest: user.measurements?.chest || undefined,
        shoulderWidth: user.measurements?.shoulderWidth || undefined,
        sleeveLength: user.measurements?.sleeveLength || undefined,
        inseam: user.measurements?.inseam || undefined,
        neck: user.measurements?.neck || undefined,
        torsoLength: user.measurements?.torsoLength || undefined,
        armCircumference: user.measurements?.armCircumference || undefined,
        thighCircumference: user.measurements?.thighCircumference || undefined,
        calfCircumference: user.measurements?.calfCircumference || undefined,
        ankleCircumference: user.measurements?.ankleCircumference || undefined,
        shoeSize: user.measurements?.shoeSize || '',
        clothingSize: user.measurements?.clothingSize || '',
        clothingSizeTop: user.measurements?.clothingSizeTop || '',
        clothingSizeBottom: user.measurements?.clothingSizeBottom || '',
        underwearSize: user.measurements?.underwearSize || '',
        braSize: user.measurements?.braSize || '',
        hatSize: user.measurements?.hatSize || '',
        ringSize: user.measurements?.ringSize || '',
        wristCircumference: user.measurements?.wristCircumference || undefined,
      },
      preferences: {
        favoriteBrands: initialPrefs.favoriteBrands?.join(', ') || '',
        favoriteColors: initialPrefs.favoriteColors?.join(', ') || '',
        favoriteCategories: initialPrefs.favoriteCategories?.join(', ') || '',
        preferredMaterials: initialPrefs.preferredMaterials?.join(', ') || '',
        stylePersonality: initialPrefs.stylePersonality || '',
        priceMin: initialPrefs.priceRange?.min ?? undefined,
        priceMax: initialPrefs.priceRange?.max ?? undefined,
        forbiddenMaterials: initialPrefs.forbiddenMaterials?.join(', ') || '',
        forbiddenCategories: initialPrefs.forbiddenCategories?.join(', ') || '',
      },
      styleGallery: user.styleGallery || [],
    },
  });

  const { isSubmitting } = form.formState;

  const [bioAiOpen, setBioAiOpen] = useState(false);
  const [bioAiInput, setBioAiInput] = useState('');
  const [bioAiSuggestion, setBioAiSuggestion] = useState<string>('');
  const [progressOpen, setProgressOpen] = useState(false);

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    const primaryPhoneEntry = data.personalInfo?.phoneNumbers?.find((p: any) => p.primary);
    const primaryEmailEntry = data.personalInfo?.emailAddresses?.find((e: any) => e.primary);
    const primaryAddr = data.personalInfo?.addressBook?.find((a: any) => a.primary);
    const secondaryAddr = data.personalInfo?.addressBook?.find((a: any) => !a.primary);

    const socialsRecord: Record<string, any> = {};
    data.socialLinks?.forEach((sl: any) => {
      socialsRecord[sl.network] = { value: sl.value, synced: sl.synced, verified: sl.verified };
    });

    const birthDateStr = data.personalInfo?.birthDate;
    const derivedAge = birthDateStr ? calcAge(birthDateStr) : undefined;

    await updateProfile({
      displayName: data.displayName,
      email: data.email,
      bio: data.bio,
      nickname: data.nickname,
      identity: data.identity,
      personalInfo: {
        ...data.personalInfo,
        phones: {
          primary: primaryPhoneEntry?.value || '',
          secondary: data.personalInfo?.phoneNumbers?.[1]?.value || '',
        },
        emails: {
          primary: primaryEmailEntry?.value || '',
          secondary: data.personalInfo?.emailAddresses?.[1]?.value || '',
        },
        country: primaryAddr?.country || '',
        postalCode: primaryAddr?.postalCode || '',
        city: primaryAddr?.city || '',
        addresses: {
          primary: primaryAddr?.address || '',
          secondary: secondaryAddr?.address || '',
        },
      } as any,
      socials: socialsRecord as any,
      sync: data.sync,
      styleGallery: data.styleGallery,
      measurements: data.measurements,
      preferences: data.preferences
        ? {
            favoriteBrands: parseList(data.preferences.favoriteBrands),
            favoriteColors: parseList(data.preferences.favoriteColors),
            favoriteCategories: parseList(data.preferences.favoriteCategories),
            preferredMaterials: parseList(data.preferences.preferredMaterials),
            stylePersonality: data.preferences.stylePersonality || undefined,
            forbiddenMaterials: parseList(data.preferences.forbiddenMaterials),
            forbiddenCategories: parseList(data.preferences.forbiddenCategories),
            priceRange:
              data.preferences.priceMin || data.preferences.priceMax
                ? { min: data.preferences.priceMin || 0, max: data.preferences.priceMax || 0 }
                : undefined,
          }
        : undefined,
      lifestyle: {
        occupation: data.lifestyle?.occupation || '',
        age: derivedAge ?? data.lifestyle?.age,
      },
    } as Partial<UserProfile>);

    toast({
      title: 'Данные сохранены',
      description: 'Личная информация успешно обновлена.',
    });
  };

  return {
    form,
    isSubmitting,
    onSubmit,
    bioAiOpen,
    setBioAiOpen,
    bioAiInput,
    setBioAiInput,
    bioAiSuggestion,
    setBioAiSuggestion,
    progressOpen,
    setProgressOpen,
  };
}
