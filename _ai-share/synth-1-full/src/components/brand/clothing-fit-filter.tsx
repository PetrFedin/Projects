'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const fitOptions = ['Облегающий', 'Прямой', 'Свободный', 'Oversize'];

interface ClothingFitFilterProps {
  value?: string[];
  onValueChange: (value: string, checked: boolean) => void;
}

export default function ClothingFitFilter({ value = [], onValueChange }: ClothingFitFilterProps) {
  return (
    <div className="grid gap-2">
      {fitOptions.map((option) => (
        <div key={option} className="flex items-center space-x-2">
          <Checkbox
            id={`fit-${option}`}
            checked={value.includes(option)}
            onCheckedChange={(checked) => onValueChange(option, !!checked)}
          />
          <Label htmlFor={`fit-${option}`} className="cursor-pointer font-normal">
            {option}
          </Label>
        </div>
      ))}
    </div>
  );
}
