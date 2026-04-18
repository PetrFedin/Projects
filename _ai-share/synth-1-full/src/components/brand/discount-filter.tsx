'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const discountOptions = ['10', '20', '30', '50', '70'];

interface DiscountFilterProps {
  value?: string;
  onValueChange: (value: string | undefined) => void;
}

export default function DiscountFilter({ value, onValueChange }: DiscountFilterProps) {
  return (
    <RadioGroup value={value} onValueChange={(v) => onValueChange(v === value ? undefined : v)}>
      <div className="space-y-2">
        {discountOptions.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`discount-${option}`} />
            <Label htmlFor={`discount-${option}`} className="font-normal">
              От {option}% и выше
            </Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
}
