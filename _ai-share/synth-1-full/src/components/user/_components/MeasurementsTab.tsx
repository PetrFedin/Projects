'use client';

import Link from 'next/link';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { calcAge } from '@/lib/user-helpers';
import { ROUTES } from '@/lib/routes';
import { Ruler } from 'lucide-react';

interface MeasurementsTabProps {
  form: UseFormReturn<any>;
}

const compactInput = 'h-9 text-sm';

export const MeasurementsTab = ({ form }: MeasurementsTabProps) => {
  const gender = form.watch('personalInfo.gender') || 'female';

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <FormField
          control={form.control}
          name="personalInfo.gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пол</FormLabel>
              <FormControl>
                <Select value={field.value || 'female'} onValueChange={field.onChange}>
                  <SelectTrigger className={compactInput}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Женский</SelectItem>
                    <SelectItem value="male">Мужской</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalInfo.birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Дата рождения</FormLabel>
              <FormControl>
                <Input className={compactInput} type="date" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <div className="text-sm font-medium">Возраст</div>
          <Input
            className={compactInput}
            value={calcAge(form.watch('personalInfo.birthDate'))?.toString() ?? ''}
            readOnly
            placeholder="—"
          />
        </div>

        <FormField
          control={form.control}
          name="personalInfo.bodyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Тип фигуры</FormLabel>
              <FormControl>
                <Input
                  className={compactInput}
                  placeholder="Напр. груша / песочные часы"
                  list="syntha-body-types"
                  {...field}
                />
              </FormControl>
              <datalist id="syntha-body-types">
                <option value="Песочные часы" />
                <option value="Груша" />
                <option value="Яблоко" />
                <option value="Прямоугольник" />
                <option value="Перевернутый треугольник" />
                <option value="Другое" />
              </datalist>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Clothing: basic measurements */}
      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        <MeasurementField
          name="measurements.height"
          label="Рост (см)"
          placeholder="168"
          form={form}
        />
        <MeasurementField
          name="measurements.weight"
          label="Вес (кг)"
          placeholder="58"
          form={form}
        />
        <MeasurementField
          name="measurements.shoulderWidth"
          label="Плечи (см)"
          placeholder="40"
          form={form}
        />
        <MeasurementField
          name="measurements.sleeveLength"
          label="Рукав (см)"
          placeholder="60"
          form={form}
        />
      </div>

      {/* Clothing: figure */}
      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        {gender === 'male' ? (
          <MeasurementField
            name="measurements.chest"
            label="Грудь (см)"
            placeholder="98"
            form={form}
          />
        ) : (
          <MeasurementField
            name="measurements.bust"
            label="Грудь (см)"
            placeholder="88"
            form={form}
          />
        )}
        <MeasurementField
          name="measurements.waist"
          label="Талия (см)"
          placeholder="64"
          form={form}
        />
        <MeasurementField
          name="measurements.hips"
          label="Бёдра (см)"
          placeholder="92"
          form={form}
        />
        <MeasurementField
          name="measurements.torsoLength"
          label="Торс (см)"
          placeholder="55"
          form={form}
        />
      </div>

      {/* Clothing: fit details */}
      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        <MeasurementField
          name="measurements.armCircumference"
          label="Рука (обхват, см)"
          placeholder="26"
          form={form}
        />
        <MeasurementField
          name="measurements.thighCircumference"
          label="Бедро (обхват, см)"
          placeholder="54"
          form={form}
        />
        <MeasurementField
          name="measurements.calfCircumference"
          label="Икра (обхват, см)"
          placeholder="36"
          form={form}
        />
        <MeasurementField
          name="measurements.inseam"
          label="Внутр. шов (см)"
          placeholder="78"
          form={form}
        />
      </div>

      {/* Clothing: sizes */}
      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        <MeasurementField
          name="measurements.clothingSizeTop"
          label="Одежда • верх"
          placeholder="S / 42"
          form={form}
        />
        <MeasurementField
          name="measurements.clothingSizeBottom"
          label="Одежда • низ"
          placeholder="M / 44"
          form={form}
        />
        <MeasurementField
          name="measurements.clothingSize"
          label="Одежда • общий"
          placeholder="S / M / 42"
          form={form}
        />
        <MeasurementField
          name="measurements.underwearSize"
          label="Бельё"
          placeholder="S / L"
          form={form}
        />
      </div>

      {gender === 'female' && (
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          <MeasurementField
            name="measurements.underbust"
            label="Под грудью (см)"
            placeholder="70"
            form={form}
          />
          <MeasurementField
            name="measurements.braSize"
            label="Бюстгальтер"
            placeholder="70B"
            form={form}
          />
        </div>
      )}

      {/* Footwear */}
      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        <MeasurementField
          name="measurements.footLength"
          label="Стопа • длина (см)"
          placeholder="24"
          form={form}
        />
        <MeasurementField
          name="measurements.footWidth"
          label="Стопа • ширина (см)"
          placeholder="9.5"
          form={form}
        />
        <MeasurementField
          name="measurements.shoeSize"
          label="Размер обуви"
          placeholder="38"
          form={form}
        />
        <MeasurementField
          name="measurements.ankleCircumference"
          label="Щиколотка (см)"
          placeholder="22"
          form={form}
        />
      </div>

      {/* Accessories */}
      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        <MeasurementField
          name="measurements.hatSize"
          label="Головной убор"
          placeholder="56"
          form={form}
        />
        <MeasurementField
          name="measurements.ringSize"
          label="Кольца"
          placeholder="16"
          form={form}
        />
        <MeasurementField
          name="measurements.wristCircumference"
          label="Запястье (см)"
          placeholder="16"
          form={form}
        />
        <MeasurementField name="measurements.neck" label="Шея (см)" placeholder="35" form={form} />
      </div>

<<<<<<< HEAD
      <div className="mt-6 border-t border-slate-200 pt-4">
        <p className="mb-2 text-sm text-slate-600">
=======
      <div className="border-border-default mt-6 border-t pt-4">
        <p className="text-text-secondary mb-2 text-sm">
>>>>>>> recover/cabinet-wip-from-stash
          Используйте мерки для подбора размера в каталоге и при заказе.
        </p>
        <Button variant="outline" size="sm" className="rounded-lg" asChild>
          <Link href={ROUTES.shop.b2bSizeFinder}>
            <Ruler className="mr-1.5 h-3.5 w-3.5" /> Подбор размера / Размерная сетка
          </Link>
        </Button>
      </div>
    </div>
  );
};

const MeasurementField = ({ name, label, placeholder, form, type = 'number' }: any) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input className={compactInput} type={type} placeholder={placeholder} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
