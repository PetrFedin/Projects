'use client';

import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, ShieldCheck, Eye } from 'lucide-react';

interface ProductPrefsTabProps {
  form: UseFormReturn<any>;
}

const compactInput = "h-9 text-sm";

export const ProductPrefsTab = ({ form }: ProductPrefsTabProps) => {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name="preferences.favoriteBrands"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Любимые бренды</FormLabel>
              <FormControl><Input className={compactInput} placeholder="Syntha, COS, Arket" {...field} /></FormControl>
              <div className="text-[11px] text-muted-foreground">Через запятую</div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preferences.favoriteCategories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Категории</FormLabel>
              <FormControl><Input className={compactInput} placeholder="Платья, Обувь, Аксессуары" {...field} /></FormControl>
              <div className="text-[11px] text-muted-foreground">Через запятую</div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preferences.favoriteColors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Цвета</FormLabel>
              <FormControl><Input className={compactInput} placeholder="черный, белый, бежевый" {...field} /></FormControl>
              <div className="text-[11px] text-muted-foreground">Через запятую</div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preferences.preferredMaterials"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Материалы</FormLabel>
              <FormControl><Input className={compactInput} placeholder="шерсть, хлопок, лен" {...field} /></FormControl>
              <div className="text-[11px] text-muted-foreground">Через запятую</div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
        <FormField
          control={form.control}
          name="preferences.stylePersonality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Стиль</FormLabel>
              <FormControl><Input className={compactInput} placeholder="classic / street / minimal" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preferences.priceMin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Бюджет (от)</FormLabel>
              <FormControl><Input className={compactInput} type="number" placeholder="3000" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preferences.priceMax"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Бюджет (до)</FormLabel>
              <FormControl><Input className={compactInput} type="number" placeholder="25000" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-4 space-y-4">
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="preferences.forbiddenMaterials"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Запрещённые материалы</FormLabel>
                <FormControl>
                  <Input className={compactInput} placeholder="Шерсть, полиэстер..." {...field} />
                </FormControl>
                <div className="text-[10px] text-muted-foreground">Материалы, которые вы принципиально не носите.</div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preferences.forbiddenCategories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Не ношу категории</FormLabel>
                <FormControl>
                  <Input className={compactInput} placeholder="Мини-юбки, мех..." {...field} />
                </FormControl>
                <div className="text-[10px] text-muted-foreground">Категории товаров, которые не показывать в ленте.</div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Style Gallery */}
      <div className="mt-6 rounded-lg border p-3">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <div className="text-sm font-semibold">Стиль-галерея</div>
            <div className="text-[10px] text-muted-foreground">5–10 фото для AI-рекомендаций</div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const url = window.prompt('URL изображения:');
              if (url) {
                const current = form.getValues('styleGallery') || [];
                form.setValue('styleGallery', [...current, { url, isPrivate: false }], { shouldDirty: true });
              }
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Добавить фото
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(form.watch('styleGallery') || []).map((item: any, idx: number) => (
            <div key={idx} className="relative group aspect-[3/4] rounded-lg border bg-muted overflow-hidden">
              <img src={item.url} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  className="p-1.5 bg-white rounded-full text-zinc-900 hover:bg-zinc-100"
                  onClick={() => {
                    const current = [...(form.getValues('styleGallery') || [])];
                    current[idx].isPrivate = !current[idx].isPrivate;
                    form.setValue('styleGallery', current, { shouldDirty: true });
                  }}
                  title={item.isPrivate ? "Сделать публичным" : "Сделать приватным"}
                >
                  {item.isPrivate ? <ShieldCheck className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  className="p-1.5 bg-white rounded-full text-red-600 hover:bg-zinc-100"
                  onClick={() => {
                    const current = [...(form.getValues('styleGallery') || [])];
                    current.splice(idx, 1);
                    form.setValue('styleGallery', current, { shouldDirty: true });
                  }}
                  title="Удалить фото"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
