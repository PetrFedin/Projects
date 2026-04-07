
'use client';

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { Product, ActiveFilters } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import ContextualSearch from './contextual-search';


interface ProductFiltersProps {
    products: Product[];
    activeFilters: ActiveFilters;
    setActiveFilters: React.Dispatch<React.SetStateAction<ActiveFilters>>;
    resetFilters: () => void;
    isLoading: boolean;
    context?: string;
    setContext?: (value: string) => void;
}

const ProductFilters = ({ products, activeFilters, setActiveFilters, resetFilters, isLoading, context, setContext }: ProductFiltersProps) => {

  const filterConfig = useMemo(() => ({
    Категория: {
      type: 'checkbox',
      options: [...new Set(products.map(p => p.category))]
    },
    Бренд: {
      type: 'checkbox',
      options: [...new Set(products.map(p => p.brand))]
    },
    Экологичность: {
        type: 'checkbox',
        options: [...new Set(products.reduce((acc, p) => {
            if (p.sustainability && Array.isArray(p.sustainability)) {
                return acc.concat(p.sustainability);
            }
            return acc;
        }, [] as string[]))]
    }
  }), [products]);

  const handleFilterChange = (category: string, option: string, checked: boolean) => {
    if (setContext) {
      setContext(''); // Clear context if manual filters are applied
    }
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      if (!newFilters[category]) {
        newFilters[category] = [];
      }
      if (checked) {
        newFilters[category].push(option);
      } else {
        newFilters[category] = newFilters[category].filter(item => item !== option);
      }
      if (newFilters[category].length === 0) {
        delete newFilters[category];
      }
      return newFilters;
    });
  };
  
  const hasActiveFilters = Object.values(activeFilters).some(v => v.length > 0) || !!context;

  if (isLoading) {
    return (
        <Card className="sticky top-20">
            <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold flex items-center">
                        <Filter className="h-5 w-5 mr-2" />
                        Фильтры
                    </h2>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-40 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full mt-4" />
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="sticky top-20 flex flex-col gap-6">
        {setContext && context !== undefined && <ContextualSearch context={context} setContext={setContext}/>}
        <Card>
            <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Фильтры
                </h2>
                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                        <X className="h-4 w-4 mr-1" />
                        Сбросить
                    </Button>
                )}
                </div>

                <Accordion type="multiple" defaultValue={["Категория", "Бренд", "Экологичность"]} className="w-full">
                
                {Object.entries(filterConfig).map(([title, config]) => (
                    config.options.length > 0 &&
                    <AccordionItem value={title} key={title}>
                    <AccordionTrigger>{title}</AccordionTrigger>
                    <AccordionContent>
                        <div className="grid gap-2 max-h-60 overflow-y-auto">
                        {config.options.map(option => (
                            <div key={option} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`${title}-${option}`}
                                checked={activeFilters[title]?.includes(option) ?? false}
                                onCheckedChange={(checked) => handleFilterChange(title, option, !!checked)}
                            />
                            <Label htmlFor={`${title}-${option}`} className="font-normal cursor-pointer">{option}</Label>
                            </div>
                        ))}
                        </div>
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            </CardContent>
        </Card>
    </div>
  );
}

export default ProductFilters;
