
'use client';

import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface PriceRangeFilterProps {
  value?: [number, number];
  onValueChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
}

export default function PriceRangeFilter({ value, onValueChange, min=0, max=100000 }: PriceRangeFilterProps) {
  const [localValue, setLocalValue] = useState(value || [min, max]);

  useEffect(() => {
    setLocalValue(value || [min, max]);
  }, [value, min, max]);

  const handleSliderChange = (newValue: [number, number]) => {
    setLocalValue(newValue);
  };

  const handleSliderCommit = (newValue: [number, number]) => {
    onValueChange(newValue);
  };
  
  const handleInputChange = (index: 0 | 1, val: string) => {
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      const newRange = [...localValue] as [number, number];
      newRange[index] = num;
      setLocalValue(newRange);
      onValueChange(newRange);
    }
  }

  return (
    <div className="space-y-4">
      <Slider
        min={min}
        max={max}
        step={100}
        value={localValue}
        onValueChange={handleSliderChange}
        onValueCommit={handleSliderCommit}
        className="my-4"
      />
      <div className="flex justify-between items-center gap-2">
        <Input 
          value={localValue[0]} 
          onChange={(e) => handleInputChange(0, e.target.value)}
          className="w-24 h-8 text-center"
        />
        <span>-</span>
        <Input 
          value={localValue[1]}
          onChange={(e) => handleInputChange(1, e.target.value)}
          className="w-24 h-8 text-center"
        />
      </div>
    </div>
  );
}
