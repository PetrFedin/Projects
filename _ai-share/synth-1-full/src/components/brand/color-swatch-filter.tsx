'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '../ui/label';

interface ColorSwatchFilterProps {
  options: { name: string; hex: string }[];
  value?: string[];
  onChange: (colorName: string, checked: boolean) => void;
}

export default function ColorSwatchFilter({
  options,
  value = [],
  onChange,
}: ColorSwatchFilterProps) {
  return (
    <div className="grid max-h-60 gap-2 overflow-y-auto px-1">
      {options.map((color) => (
        <div key={color.name} className="flex items-center space-x-2">
          <Checkbox
            id={`color-${color.name}`}
            checked={value.includes(color.name)}
            onCheckedChange={(checked) => onChange(color.name, !!checked)}
          />
          <Label
            htmlFor={`color-${color.name}`}
            className="flex cursor-pointer items-center gap-2 font-normal"
          >
            <div
              className="h-4 w-4 rounded-full border"
              style={{ backgroundColor: color.hex }}
            ></div>
            {color.name}
          </Label>
        </div>
      ))}
    </div>
  );
}
