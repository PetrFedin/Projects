'use client';

import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { useRef, useState, useLayoutEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Crown,
  Check,
  Trash2,
  ArrowRight,
  Sparkles,
  Plus,
  Mail,
  Phone,
  Instagram,
  Send,
  Youtube,
  Facebook,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { formatRuPhone, pickUniqueNickname, readTakenNicknames } from '@/lib/user-helpers';

interface ProfileTabProps {
  form: UseFormReturn<any>;
  user: any;
  appendAudit: (message: string, section?: string) => void;
  setBioAiInput: (val: string) => void;
  setBioAiSuggestion: (val: string) => void;
  setBioAiOpen: (val: boolean) => void;
}

const compactInput = 'h-9 text-sm';

function circleClass(state: 'empty' | 'pending' | 'verified') {
  if (state === 'verified') return 'bg-green-600 text-white';
  if (state === 'pending') return 'bg-orange-500 text-white';
  return 'bg-zinc-200 text-zinc-500';
}

export const ProfileTab = ({
  form,
  user,
  appendAudit,
  setBioAiInput,
  setBioAiSuggestion,
  setBioAiOpen,
}: ProfileTabProps) => {
  const { toast } = useToast();
  const leftProfileRef = useRef<HTMLDivElement | null>(null);
  const [profileLeftHeight, setProfileLeftHeight] = useState<number | undefined>(undefined);
  const [nicknameStatus, setNicknameStatus] = useState<{
    state: 'idle' | 'checking' | 'ok' | 'taken';
    message?: string;
  }>({
    state: 'idle',
  });
  const [nextNetwork, setNextNetwork] = useState<
    'instagram' | 'telegram' | 'youtube' | 'vk' | 'facebook' | 'max'
  >('instagram');

  useLayoutEffect(() => {
    const el = leftProfileRef.current;
    if (!el) return;
    const update = () => setProfileLeftHeight(el.getBoundingClientRect().height);
    update();
    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const phoneNumbers = useFieldArray({ control: form.control, name: 'personalInfo.phoneNumbers' });
  const emailAddresses = useFieldArray({
    control: form.control,
    name: 'personalInfo.emailAddresses',
  });
  const addressBook = useFieldArray({ control: form.control, name: 'personalInfo.addressBook' });
  const socialLinks = useFieldArray({ control: form.control, name: 'socialLinks' });

  const verifyInList = (path: string, idx: number) => {
    const list = (form.getValues(path as any) || []) as any[];
    const next = list.map((it, i) => (i === idx ? { ...it, verified: true } : it));
    form.setValue(path as any, next, { shouldDirty: true });
  };

  const setPrimaryInList = (path: string, idx: number) => {
    const list = (form.getValues(path as any) || []) as any[];
    if (!list[idx]) return;

    if (path === 'personalInfo.phoneNumbers') {
      if (idx !== 0) phoneNumbers.swap(0, idx);
      window.setTimeout(() => {
        const next = (form.getValues(path as any) || []) as any[];
        next.forEach((_: any, i: number) => {
          form.setValue(`personalInfo.phoneNumbers.${i}.primary` as any, i === 0, {
            shouldDirty: true,
          });
        });
      }, 0);
    } else if (path === 'personalInfo.emailAddresses') {
      if (idx !== 0) emailAddresses.swap(0, idx);
      window.setTimeout(() => {
        const next = (form.getValues(path as any) || []) as any[];
        next.forEach((_: any, i: number) => {
          form.setValue(`personalInfo.emailAddresses.${i}.primary` as any, i === 0, {
            shouldDirty: true,
          });
        });
      }, 0);
    } else {
      const next = list.map((it, i) => ({ ...it, primary: i === idx }));
      form.setValue(path as any, next, { shouldDirty: true });
    }
  };

  const deleteAddressAt = (idx: number) => {
    const list = (form.getValues('personalInfo.addressBook') || []) as any[];
    if (idx === 1) {
      if (list.length >= 2) addressBook.remove(1);
      return;
    }
    if (list.length >= 2) {
      const next0 = { ...list[1], primary: true };
      form.setValue('personalInfo.addressBook.0', next0, { shouldDirty: true });
      addressBook.remove(1);
      return;
    }
    form.setValue('personalInfo.addressBook.0.country', '', { shouldDirty: true });
    form.setValue('personalInfo.addressBook.0.postalCode', '', { shouldDirty: true });
    form.setValue('personalInfo.addressBook.0.city', '', { shouldDirty: true });
    form.setValue('personalInfo.addressBook.0.address', '', { shouldDirty: true });
    form.setValue('personalInfo.addressBook.0.primary', true, { shouldDirty: true });
  };

  const identityVerified = !!form.watch('identity.verified');
  const currentSocials = form.watch('socialLinks') || [];
  const usedNetworks = new Set(currentSocials.map((s: any) => s.network));
  const availableNetworks = (
    ['instagram', 'telegram', 'youtube', 'vk', 'facebook', 'max'] as const
  ).filter((n) => !usedNetworks.has(n));

  return (
    <div className="mt-6">
      <div className="grid items-stretch gap-3 md:grid-cols-2">
        <div className="space-y-3" ref={leftProfileRef}>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="identity.firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input className={compactInput} placeholder="Елена" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="identity.lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Фамилия</FormLabel>
                  <FormControl>
                    <Input className={compactInput} placeholder="Петрова" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="identity.firstNameEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя (EN)</FormLabel>
                  <FormControl>
                    <Input className={compactInput} placeholder="Elena" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="identity.lastNameEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Фамилия (EN)</FormLabel>
                  <FormControl>
                    <Input className={compactInput} placeholder="Petrova" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-2 items-end gap-3">
                  <div>
                    <FormLabel>Никнейм</FormLabel>
                    <FormControl>
                      <Input className={compactInput} placeholder="elena.petrova" {...field} />
                    </FormControl>
                  </div>
                  <div className="flex items-end justify-end gap-3">
                    {nicknameStatus.state !== 'idle' && nicknameStatus.message && (
                      <div
                        className={cn(
                          'text-[11px] leading-none',
                          nicknameStatus.state === 'ok' ? 'text-green-600' : 'text-muted-foreground'
                        )}
                      >
                        <span className="inline-block max-w-[220px] truncate">
                          {nicknameStatus.message}
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => {
                        const raw = (form.getValues('nickname') || '').trim().toLowerCase();
                        if (!raw) {
                          setNicknameStatus({ state: 'taken', message: 'Введите никнейм' });
                          return;
                        }
                        setNicknameStatus({ state: 'checking' });
                        const taken = readTakenNicknames(user.email);
                        if (taken.has(raw)) {
                          const suggested = pickUniqueNickname(raw, taken);
                          form.setValue('nickname', suggested, { shouldDirty: true });
                          setNicknameStatus({
                            state: 'taken',
                            message: `Занят • предложено: ${suggested}`,
                          });
                          toast({
                            title: 'Никнейм занят',
                            description: `Подобрали свободный: ${suggested}`,
                          });
                          return;
                        }
                        setNicknameStatus({ state: 'ok', message: 'Свободен' });
                        toast({ title: 'Никнейм свободен' });
                      }}
                    >
                      <span>Проверить</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="personalInfo.education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сфера деятельности</FormLabel>
                  <FormControl>
                    <Input
                      className={compactInput}
                      placeholder="Маркетинг / IT / Финансы…"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lifestyle.occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Должность</FormLabel>
                  <FormControl>
                    <Input className={compactInput} placeholder="Маркетинг-директор" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div
          className="flex min-h-0 flex-col"
          style={profileLeftHeight ? { height: profileLeftHeight } : undefined}
        >
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="flex min-h-0 flex-1 flex-col">
                <FormLabel className="flex items-center justify-between">
                  <span>О себе</span>
                  <button
                    type="button"
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-zinc-800 transition-colors hover:bg-zinc-200"
                    title="Улучшить описание"
                    onClick={() => {
                      setBioAiInput(field.value || '');
                      setBioAiSuggestion('');
                      setBioAiOpen(true);
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                  </button>
                </FormLabel>
                <FormControl className="min-h-0 flex-1">
                  <Textarea
                    className="h-full min-h-0 flex-1 resize-none"
                    placeholder="Коротко о себе..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="mt-4 rounded-lg border p-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="text-sm font-semibold">Контактные данные</div>
          <div className="text-sm font-semibold">Адреса</div>

          {/* Contacts Fields Implementation */}
          <div className="space-y-4">
            {/* Phone Fields */}
            {[0, 1].map((idx) => {
              const verified = !!form.watch(`personalInfo.phoneNumbers.${idx}.verified`);
              const value = form.watch(`personalInfo.phoneNumbers.${idx}.value`) || '';
              const exists = phoneNumbers.fields.length > idx;
              const verifyState = exists
                ? verified
                  ? 'verified'
                  : value.trim()
                    ? 'pending'
                    : 'empty'
                : 'empty';

              if (idx === 1 && !exists) {
                return (
                  <FormItem key="phone-1-add" className="m-0">
                    <FormLabel>Телефон (дополнительный)</FormLabel>
                    <div className="flex items-center gap-2">
                      <Input
                        className={compactInput + ' flex-1'}
                        disabled
                        placeholder="Добавьте второй телефон"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          phoneNumbers.append({ value: '', verified: false, primary: false })
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormItem>
                );
              }

              return (
                <FormField
                  key={exists ? phoneNumbers.fields[idx].id : `phone-${idx}`}
                  control={form.control}
                  name={`personalInfo.phoneNumbers.${idx}.value`}
                  render={({ field }) => (
                    <FormItem className="m-0">
                      <FormLabel>
                        {idx === 0 ? 'Телефон (основной)' : 'Телефон (дополнительный)'}
                      </FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl className="flex-1">
                          <Input
                            className={compactInput}
                            placeholder="+7 (999) 123-45-67"
                            {...field}
                            onChange={(e) => field.onChange(formatRuPhone(e.target.value))}
                          />
                        </FormControl>
                        <div className="flex shrink-0 items-center gap-2">
                          <Button
                            type="button"
                            size="icon"
                            className={cn('h-5 w-5 rounded-full', circleClass(verifyState))}
                            disabled={verifyState !== 'pending'}
                            onClick={() => {
                              verifyInList('personalInfo.phoneNumbers', idx);
                              appendAudit('Подтвердил телефон', 'profile');
                            }}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            className={cn(
                              'h-5 w-5 rounded-full',
                              idx === 0 ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700'
                            )}
                            onClick={() =>
                              idx !== 0 && setPrimaryInList('personalInfo.phoneNumbers', idx)
                            }
                          >
                            <Crown className="h-3 w-3" />
                          </Button>
                          {idx > 0 && (
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-5 w-5 text-red-600"
                              onClick={() => phoneNumbers.remove(idx)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              );
            })}
          </div>

          <div className="space-y-4">
            {/* Address Fields */}
            {[0, 1].map((idx) => {
              const exists = addressBook.fields.length > idx;
              const isPrimary = !!form.watch(`personalInfo.addressBook.${idx}.primary`);

              if (idx === 1 && !exists) {
                return (
                  <FormItem key="addr-1-add" className="m-0">
                    <FormLabel>Второй адрес</FormLabel>
                    <div className="flex items-center gap-2">
                      <Input
                        className={compactInput + ' flex-1'}
                        disabled
                        placeholder="Добавить адрес"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          addressBook.append({ country: '', city: '', address: '', primary: false })
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormItem>
                );
              }

              return (
                <div
                  key={exists ? addressBook.fields[idx].id : `addr-${idx}`}
                  className="grid grid-cols-2 gap-2"
                >
                  <FormField
                    control={form.control}
                    name={`personalInfo.addressBook.${idx}.country`}
                    render={({ field }) => (
                      <FormItem className="m-0">
                        <FormLabel className="flex justify-between">
                          <span>Страна</span>
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              size="icon"
                              className={cn(
                                'h-4 w-4 rounded-full',
                                isPrimary ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700'
                              )}
                              onClick={() =>
                                !isPrimary && setPrimaryInList('personalInfo.addressBook', idx)
                              }
                            >
                              <Crown className="h-2.5 w-2.5" />
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-4 w-4 text-red-600"
                              onClick={() => deleteAddressAt(idx)}
                            >
                              <Trash2 className="h-2.5 w-2.5" />
                            </Button>
                          </div>
                        </FormLabel>
                        <FormControl>
                          <Input className={compactInput} placeholder="Россия" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`personalInfo.addressBook.${idx}.city`}
                    render={({ field }) => (
                      <FormItem className="m-0">
                        <FormLabel>Город</FormLabel>
                        <FormControl>
                          <Input className={compactInput} placeholder="Москва" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Social Links Section */}
      <div className="mt-4 rounded-lg border p-3">
        <div className="mb-2 flex justify-between">
          <span className="text-sm font-semibold">Социальные сети</span>
          <div className="flex gap-2">
            <Select value={nextNetwork} onValueChange={(v: any) => setNextNetwork(v)}>
              <SelectTrigger className="h-8 w-[120px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableNetworks.map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8"
              disabled={availableNetworks.length === 0}
              onClick={() => {
                socialLinks.append({
                  network: nextNetwork,
                  value: '',
                  synced: false,
                  verified: false,
                });
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {socialLinks.fields.map((field, idx) => (
            <div key={field.id} className="flex items-end gap-2 rounded-lg border p-2">
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">
                  {form.getValues(`socialLinks.${idx}.network`)}
                </span>
                <FormField
                  control={form.control}
                  name={`socialLinks.${idx}.value`}
                  render={({ field }) => (
                    <FormControl>
                      <Input className={compactInput} {...field} />
                    </FormControl>
                  )}
                />
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-red-600"
                onClick={() => socialLinks.remove(idx)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-lg border p-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4" /> Верификация личности
            </div>
            <p className="text-xs text-muted-foreground">Подтвердите личность через Госуслуги</p>
          </div>
          <Button
            type="button"
            size="sm"
            variant={identityVerified ? 'secondary' : 'outline'}
            disabled={identityVerified}
            onClick={() => {
              form.setValue('identity.verified', true, { shouldDirty: true });
              toast({ title: 'Верификация пройдена' });
            }}
          >
            {identityVerified ? 'Подтверждено' : 'Подключить'}
          </Button>
        </div>
      </div>
    </div>
  );
};
