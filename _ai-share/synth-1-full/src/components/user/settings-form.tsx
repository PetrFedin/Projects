'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { useSettingsForm } from './hooks/useSettingsForm';
import { PrivacySettings } from './_components/settings/PrivacySettings';
import { NotificationSettings } from './_components/settings/NotificationSettings';
import { Eye, Shield, Trash2, Download } from 'lucide-react';
import type { UserProfile } from '@/lib/types';

export default function SettingsForm({ user }: { user: UserProfile }) {
  const state = useSettingsForm(user);

  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-black uppercase">Настройки</CardTitle>
            <CardDescription>
              Управление приватностью, уведомлениями и безопасностью.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => state.setIsPreviewOpen(true)}
            className="gap-2 rounded-xl"
          >
            <Eye className="h-4 w-4" /> Предпросмотр
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-0">
        <Accordion type="multiple" className="w-full space-y-4">
          <AccordionItem value="privacy" className="rounded-2xl border bg-white px-6">
            <AccordionTrigger className="text-xs font-bold uppercase tracking-widest hover:no-underline">
              Приватность
            </AccordionTrigger>
            <AccordionContent>
              <PrivacySettings draft={state.draft} updateDraft={state.updateDraft} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="notifications" className="rounded-2xl border bg-white px-6">
            <AccordionTrigger className="text-xs font-bold uppercase tracking-widest hover:no-underline">
              Уведомления
            </AccordionTrigger>
            <AccordionContent>
              <NotificationSettings draft={state.draft} updateDraft={state.updateDraft} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="security" className="rounded-2xl border bg-white px-6">
            <AccordionTrigger className="text-xs font-bold uppercase tracking-widest hover:no-underline">
              Безопасность
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 rounded-xl"
                  onClick={() => state.setChangePwdOpen(true)}
                >
                  <Shield className="h-4 w-4" /> Сменить пароль
                </Button>
                <div className="flex items-center justify-between rounded-xl border p-4">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Двухфакторная аутентификация</div>
                    <div className="text-xs text-muted-foreground">Защита аккаунта кодом</div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    Настроить
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="data" className="rounded-2xl border bg-white px-6">
            <AccordionTrigger className="text-xs font-bold uppercase tracking-widest hover:no-underline">
              Управление данными
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-3 pt-2 md:grid-cols-2">
                <Button
                  variant="outline"
                  className="h-auto flex-col items-start gap-1 rounded-xl p-4"
                  onClick={() => {}}
                >
                  <Download className="h-4 w-4" />
                  <span className="text-sm font-bold">Экспорт данных</span>
                  <span className="text-[10px] text-muted-foreground">
                    Скачать JSON-файл с вашим профилем
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto flex-col items-start gap-1 rounded-xl p-4 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => {}}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="text-sm font-bold">Очистить локальные данные</span>
                  <span className="text-[10px] text-muted-foreground text-red-500/60">
                    Удалить кэш на этом устройстве
                  </span>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>

      <CardFooter className="flex justify-end px-0 pt-6">
        <Button
          onClick={state.save}
          disabled={state.isSaving}
<<<<<<< HEAD
          className="h-11 rounded-xl bg-black px-8 font-black uppercase tracking-widest text-white shadow-lg shadow-black/10 hover:bg-zinc-900"
=======
          className="hover:bg-text-primary h-11 rounded-xl bg-black px-8 font-black uppercase tracking-widest text-white shadow-lg shadow-black/10"
>>>>>>> recover/cabinet-wip-from-stash
        >
          {state.isSaving ? 'Сохранение...' : 'Сохранить настройки'}
        </Button>
      </CardFooter>
    </Card>
  );
}
