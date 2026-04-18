'use client';

import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, RefreshCw, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { calcAge, formatRuPhone } from '@/lib/user-helpers';
import { cn } from '@/lib/utils';

interface FamilySyncTabProps {
  form: UseFormReturn<any>;
}

const compactInput = 'h-9 text-sm';

const VerifiedMark = ({ on }: { on: boolean }) =>
  on ? (
    <CheckCircle2 className="h-3 w-3 text-green-600" />
  ) : (
    <XCircle className="h-3 w-3 text-red-500" />
  );

const roleLabel = (role: string) => {
  const map: any = {
    husband: 'Муж',
    wife: 'Жена',
    son: 'Сын',
    daughter: 'Дочь',
    father: 'Отец',
    mother: 'Мать',
    other: 'Другое',
  };
  return map[role] || role;
};

export const FamilySyncTab = ({ form }: FamilySyncTabProps) => {
  const relatives = useFieldArray({ control: form.control, name: 'sync.accounts' });

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="text-xs text-muted-foreground">
          Добавляйте родственников вручную или синхронизируйте их кабинет — тогда пол и параметры
          подтянутся автоматически.
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            relatives.append({
              role: 'other',
              name: '',
              phone: '',
              contact: '',
              gender: 'female',
              synced: false,
              shareBonuses: false,
              verified: false,
              measurements: {},
            } as any)
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Добавить
        </Button>
      </div>

      {relatives.fields.map((r, idx) => {
        const role = form.watch(`sync.accounts.${idx}.role`) || 'other';
        const relGender =
          form.watch(`sync.accounts.${idx}.gender`) ||
          (role === 'husband' || role === 'son' || role === 'father' ? 'male' : 'female');
        const relBirthDate = form.watch(`sync.accounts.${idx}.birthDate`) || '';
        const relAge = calcAge(relBirthDate);

        return (
          <div key={r.id} className="mb-3 rounded-lg border p-3">
            <div className="grid grid-cols-2 items-end gap-3 md:grid-cols-4">
              <FormField
                control={form.control}
                name={`sync.accounts.${idx}.role`}
                render={({ field }) => (
                  <FormItem className="m-0">
                    <FormLabel>Роль</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className={compactInput}>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['husband', 'wife', 'son', 'daughter', 'father', 'mother', 'other'].map(
                          (v) => (
                            <SelectItem key={v} value={v}>
                              {roleLabel(v)}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`sync.accounts.${idx}.name`}
                render={({ field }) => (
                  <FormItem className="m-0">
                    <FormLabel>Имя</FormLabel>
                    <FormControl>
                      <Input className={compactInput} placeholder="Имя" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`sync.accounts.${idx}.gender`}
                render={({ field }) => (
                  <FormItem className="m-0">
                    <FormLabel>Пол</FormLabel>
                    <Select value={field.value || relGender} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className={compactInput}>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="female">Женский</SelectItem>
                        <SelectItem value="male">Мужской</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`sync.accounts.${idx}.birthDate`}
                render={({ field }) => (
                  <FormItem className="m-0">
                    <FormLabel className="flex items-center justify-between">
                      <span>Дата рождения</span>
                      {relAge !== null && (
                        <span className="text-xs text-muted-foreground">{relAge} лет</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input className={compactInput} type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-3 grid grid-cols-2 items-end gap-3 md:grid-cols-4">
              <FormField
                control={form.control}
                name={`sync.accounts.${idx}.phone`}
                render={({ field }) => (
                  <FormItem className="m-0">
                    <FormLabel>Телефон</FormLabel>
                    <FormControl>
                      <Input
                        className={compactInput}
                        placeholder="+7 (999) 123-45-67"
                        {...field}
                        onChange={(e) => field.onChange(formatRuPhone(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`sync.accounts.${idx}.contact`}
                render={({ field }) => (
                  <FormItem className="m-0">
                    <FormLabel>Контакт (email/id)</FormLabel>
                    <FormControl>
                      <Input className={compactInput} placeholder="email / id" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-3 flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => form.setValue(`sync.accounts.${idx}.synced`, true)}
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Синхронизировать
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => relatives.remove(idx)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Удалить
                </Button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <FormField
                  control={form.control}
                  name={`sync.accounts.${idx}.shareBonuses`}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2">
                      <FormLabel className="text-sm">Бонусы</FormLabel>
                      <FormControl>
                        <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`sync.accounts.${idx}.verified`}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2">
                      <FormLabel className="flex items-center gap-2 text-sm">
                        Подтв. <VerifiedMark on={field.value} />
                      </FormLabel>
                      <FormControl>
                        <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
