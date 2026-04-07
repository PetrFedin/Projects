'use client';

import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import type { UserProfile } from '@/lib/types';

import { useProfileForm } from './hooks/useProfileForm';
import { ProfileProgress } from './_components/ProfileProgress';
import { ProfileAudit } from './_components/ProfileAudit';
import { ProfileTab } from './_components/ProfileTab';
import { FamilySyncTab } from './_components/FamilySyncTab';
import { MeasurementsTab } from './_components/MeasurementsTab';
import { ProductPrefsTab } from './_components/ProductPrefsTab';
import { useProfileProgress as useProgressLogic } from './hooks/use-profile-progress';
import useAuditLogic from './hooks/use-profile-audit';

export default function ProfileForm({
  user,
  section = 'profile',
}: {
  user: UserProfile;
  section?: 'profile' | 'familySync' | 'measurements' | 'productPrefs' | 'audit';
}) {
  const {
    form,
    isSubmitting,
    onSubmit,
    setBioAiOpen,
    setBioAiInput,
    setBioAiSuggestion,
    progressOpen,
    setProgressOpen,
  } = useProfileForm(user);

  const profileProgress = useProgressLogic(form);
  const { auditEvents, appendAudit } = useAuditLogic();

  return (
    <Card className="border-none shadow-none bg-transparent">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 p-0">
            {section !== 'audit' && (
              <ProfileProgress 
                progress={profileProgress} 
                isOpen={progressOpen} 
                onToggle={() => setProgressOpen((p) => !p)} 
              />
            )}

            {section === 'audit' && (
              <ProfileAudit events={auditEvents} />
            )}

            {section === 'profile' && (
              <ProfileTab 
                form={form} 
                user={user} 
                appendAudit={appendAudit}
                setBioAiInput={setBioAiInput}
                setBioAiSuggestion={setBioAiSuggestion}
                setBioAiOpen={setBioAiOpen}
              />
            )}

            {section === 'familySync' && (
              <FamilySyncTab form={form} />
            )}

            {section === 'measurements' && (
              <MeasurementsTab form={form} />
            )}

            {section === 'productPrefs' && (
              <ProductPrefsTab form={form} />
            )}
          </CardContent>

          {section !== 'audit' && (
            <CardFooter className="flex justify-end pt-6 px-0">
              <Button type="submit" disabled={isSubmitting} className="rounded-xl px-8 h-11 font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-black/10">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  'Сохранить изменения'
                )}
              </Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
}
