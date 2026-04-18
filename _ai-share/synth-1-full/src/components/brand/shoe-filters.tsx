'use client';

import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '../ui/input';
import { useState, useEffect } from 'react';

const soleMaterials = ['Резина', 'Кожа', 'Полиуретан'];
const upperMaterials = ['Натуральная кожа', 'Замша', 'Текстиль'];

interface ShoeFiltersProps {
  heelHeight?: [number, number];
  onHeelHeightChange?: (value: [number, number]) => void;
  onHeelHeightCommit?: (value: [number, number]) => void;
  soleMaterial?: string[];
  onSoleMaterialChange: (value: string, checked: boolean) => void;
  upperMaterial?: string[];
  onUpperMaterialChange: (value: string, checked: boolean) => void;
}

export default function ShoeFilters({
  heelHeight,
  onHeelHeightChange,
  onHeelHeightCommit,
  soleMaterial = [],
  onSoleMaterialChange,
  upperMaterial = [],
  onUpperMaterialChange,
}: ShoeFiltersProps) {
  const [localHeelHeight, setLocalHeelHeight] = useState(heelHeight || [0, 15]);

  useEffect(() => {
    setLocalHeelHeight(heelHeight || [0, 15]);
  }, [heelHeight]);

  const handleSliderChange = (newValue: [number, number]) => {
    setLocalHeelHeight(newValue);
    if (onHeelHeightChange) {
      onHeelHeightChange(newValue);
    }
  };

  const handleSliderCommit = (newValue: [number, number]) => {
    if (onHeelHeightCommit) {
      onHeelHeightCommit(newValue);
    }
  };

  const handleInputChange = (index: 0 | 1, value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      const newRange = [...localHeelHeight] as [number, number];
      newRange[index] = num;
      setLocalHeelHeight(newRange);
    }
  };

  const handleInputCommit = () => {
    if (onHeelHeightCommit) {
<<<<<<< HEAD
      onHeelHeightCommit(localHeelHeight);
=======
      const tuple: [number, number] = [localHeelHeight[0] ?? 0, localHeelHeight[1] ?? 15];
      onHeelHeightCommit(tuple);
>>>>>>> recover/cabinet-wip-from-stash
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Высота каблука (см)</Label>
        <Slider
          min={0}
          max={15}
          step={1}
          value={localHeelHeight}
          onValueChange={handleSliderChange}
          onValueCommit={handleSliderCommit}
          className="my-4"
        />
        <div className="flex items-center justify-between gap-2">
          <Input
            value={localHeelHeight[0]}
            onChange={(e) => handleInputChange(0, e.target.value)}
            onBlur={handleInputCommit}
            onKeyDown={(e) => e.key === 'Enter' && handleInputCommit()}
            className="h-8 w-20 text-center"
          />
          <span>-</span>
          <Input
            value={localHeelHeight[1]}
            onChange={(e) => handleInputChange(1, e.target.value)}
            onBlur={handleInputCommit}
            onKeyDown={(e) => e.key === 'Enter' && handleInputCommit()}
            className="h-8 w-20 text-center"
          />
        </div>
        <div className="relative mt-1 h-2 px-2.5">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="absolute text-muted-foreground/50"
              style={{ left: `${(i / 15) * 100}%`, transform: 'translateX(-50%)' }}
            >
              <div className="h-1 w-px bg-current"></div>
              {i % 5 === 0 && <span className="absolute -bottom-4 text-xs">{i}</span>}
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label>Материал подошвы</Label>
        <div className="mt-2 space-y-1">
          {soleMaterials.map((mat) => (
            <div key={mat} className="flex items-center space-x-2">
              <Checkbox
                id={`sole-${mat}`}
                checked={soleMaterial.includes(mat)}
                onCheckedChange={(checked) => onSoleMaterialChange(mat, !!checked)}
              />
              <Label htmlFor={`sole-${mat}`} className="font-normal">
                {mat}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label>Материал верха</Label>
        <div className="mt-2 space-y-1">
          {upperMaterials.map((mat) => (
            <div key={mat} className="flex items-center space-x-2">
              <Checkbox
                id={`upper-${mat}`}
                checked={upperMaterial.includes(mat)}
                onCheckedChange={(checked) => onUpperMaterialChange(mat, !!checked)}
              />
              <Label htmlFor={`upper-${mat}`} className="font-normal">
                {mat}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
