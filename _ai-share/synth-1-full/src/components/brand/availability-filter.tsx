'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const availabilityOptions = [
  { value: 'in_stock', label: 'В наличии' },
  { value: 'coming_soon', label: 'Скоро в продаже' },
  { value: 'pre_order', label: 'Предзаказ' },
  { value: 'out_of_stock', label: 'Нет в наличии' },
];

interface AvailabilityFilterProps {
  value?: string[];
  onValueChange: (value: string, checked: boolean) => void;
}

export default function AvailabilityFilter({ value = [], onValueChange }: AvailabilityFilterProps) {
  return (
    <div className="space-y-2 p-2">
      {availabilityOptions.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <Checkbox
            id={option.value}
            checked={value.includes(option.value)}
            onCheckedChange={(checked) => onValueChange(option.value, !!checked)}
          />
          <Label htmlFor={option.value} className="font-normal">
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  );
}
