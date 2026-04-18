'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const sustainabilityOptions = [
  'Переработанные материалы',
  'Этичное производство',
  'Экологичная ткань',
  'Органический лен',
  'Технология Water<Less®',
  'Переработанная шерсть',
  'Органический шелк',
];

interface SustainabilityFilterProps {
  value?: string[];
  onValueChange: (value: string, checked: boolean) => void;
}

export default function SustainabilityFilter({
  value = [],
  onValueChange,
}: SustainabilityFilterProps) {
  return (
    <div className="grid gap-2">
      {sustainabilityOptions.map((option) => (
        <div key={option} className="flex items-center space-x-2">
          <Checkbox
            id={`sustainability-${option}`}
            checked={value.includes(option)}
            onCheckedChange={(checked) => onValueChange(option, !!checked)}
          />
          <Label htmlFor={`sustainability-${option}`} className="cursor-pointer font-normal">
            {option}
          </Label>
        </div>
      ))}
    </div>
  );
}
