'use client';

import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, X, View, Sparkles } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Product, ActiveFilters, ProductAudience } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import ContextualSearch from '@/components/contextual-search';
import AvailabilityFilter from '@/components/brand/availability-filter';
import ClothingFitFilter from '@/components/brand/clothing-fit-filter';
import ShoeFilters from '@/components/brand/shoe-filters';
import SustainabilityFilter from '@/components/brand/sustainability-filter';
import ArFilter from '@/components/brand/ar-filter';
import ColorSwatchFilter from '@/components/brand/color-swatch-filter';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import CategoryTreeFilter from './brand/category-tree-filter';
import { getFilteredCategoryStructure } from '@/lib/category-filters';
import { VALUES_FILTER_OPTIONS, VALUES_FILTER_KEY } from '@/lib/rf-market/values-filters';

interface ProductFiltersProps {
  products: Product[];
  activeFilters: ActiveFilters;
  setActiveFilters: React.Dispatch<React.SetStateAction<ActiveFilters>>;
  resetFilters: () => void;
  isLoading: boolean;
  context?: string;
  setContext?: (value: string) => void;
  selectedCategory?: string;
  onSelectCategory: (category: string | undefined) => void;
  audience?: ProductAudience | 'Все' | 'Beauty' | 'Home';
}

const ProductFilters = ({
  products,
  activeFilters,
  setActiveFilters,
  resetFilters,
  isLoading,
  context,
  setContext,
  selectedCategory,
  onSelectCategory,
  audience = 'Все',
}: ProductFiltersProps) => {
  const [localHeelHeight, setLocalHeelHeight] = useState<[number, number] | undefined>(undefined);
  const [fullCategoryStructure, setFullCategoryStructure] = useState(null);

  useEffect(() => {
    fetch('/data/categories.json')
      .then((res) => res.json())
      .then((data) => setFullCategoryStructure(data));
  }, []);

  const categoryStructure = useMemo(() => {
    if (!fullCategoryStructure) return {};
    return getFilteredCategoryStructure(audience, fullCategoryStructure);
  }, [audience, fullCategoryStructure]);

  const filterConfig = useMemo(() => {
    const allColors = products.reduce(
      (acc, p) => {
        (p.availableColors || []).forEach((color) => {
          if (!acc.find((c) => c.hex === color.hex)) {
            acc.push(color);
          }
        });
        return acc;
      },
      [] as { name: string; hex: string }[]
    );

    return {
      Бренд: {
        type: 'checkbox',
        options: [...new Set(products.map((p) => p.brand))],
      },
      Цвет: {
        type: 'color',
        options: allColors,
      },
      Материал: {
        type: 'checkbox',
        options: [...new Set(products.map((p) => p.material).filter(Boolean))],
      },
    };
  }, [products]);

  const handleFilterChange = (category: string, option: string, checked: boolean) => {
    if (setContext) {
      setContext(''); // Clear context if manual filters are applied
    }
    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      if (!newFilters[category]) {
        newFilters[category] = [];
      }
      if (checked) {
        if (!Array.isArray(newFilters[category])) newFilters[category] = [];
        (newFilters[category] as string[]).push(option);
      } else {
        newFilters[category] = (newFilters[category] as string[]).filter((item) => item !== option);
      }
      if (newFilters[category].length === 0) {
        delete newFilters[category];
      }
      return newFilters;
    });
  };

  const handleSingleSelectFilterChange = (
    category: string,
    option: string | string[] | number | number[] | undefined,
    type: 'radio' | 'slider' = 'radio'
  ) => {
    if (setContext) {
      setContext('');
    }
    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      if (option === undefined || (Array.isArray(option) && option.length === 0)) {
        delete newFilters[category];
      } else {
        if (type === 'slider' && Array.isArray(option)) {
          newFilters[category] = option as number[];
        } else {
          newFilters[category] = [option as string];
        }
      }
      return newFilters;
    });
  };

  const resetSingleFilter = (category: string) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[category];
      return newFilters;
    });
  };

  const handleHeelHeightCommit = (value: [number, number]) => {
    handleSingleSelectFilterChange('Высота каблука', value, 'slider');
  };

  const hasActiveFilters =
    Object.values(activeFilters).some(
      (v) =>
        Array.isArray(v) &&
        v.length > 0 &&
<<<<<<< HEAD
        !(v.length === 2 && v.includes('in_stock') && v.includes('pre_order'))
=======
        !(
          v.length === 2 &&
          (v as string[]).includes('in_stock') &&
          (v as string[]).includes('pre_order')
        )
>>>>>>> recover/cabinet-wip-from-stash
    ) ||
    !!context ||
    !!selectedCategory;

  const AccordionItemWithReset = ({
    value,
    title,
    children,
  }: {
    value: string;
    title: string;
    children: React.ReactNode;
  }) => (
    <AccordionItem value={value}>
      <div className="flex items-center justify-between p-2">
        <AccordionTrigger className="flex-1 px-0 py-2 text-left text-base font-semibold hover:no-underline">
          {title}
        </AccordionTrigger>
        {activeFilters[title] && (
          <Button
            variant="ghost"
            size="sm"
            className="mr-2 h-auto px-2 py-0.5 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              resetSingleFilter(title);
            }}
          >
            Сбросить
          </Button>
        )}
      </div>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  );

  if (isLoading || !fullCategoryStructure) {
    return (
      <Card className="sticky top-20">
        <CardContent className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center text-sm font-semibold">
              <Filter className="mr-2 h-5 w-5" />
              Фильтры
            </h2>
          </div>
          <div className="space-y-2">
            <Skeleton className="mb-4 h-40 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="mt-4 h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="sticky top-20 flex flex-col gap-3">
      <Accordion type="single" collapsible className="w-full">
        {setContext && context !== undefined && (
          <AccordionItem value="context-search">
            <AccordionTrigger className="p-2 text-sm font-semibold hover:no-underline [&[data-state=open]>svg]:rotate-180">
              <span className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Контекстный поиск
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ContextualSearch context={context} setContext={setContext} />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      <Card>
        <CardContent className="p-2">
          <div className="flex items-center justify-between p-2">
            <h2 className="flex items-center text-sm font-semibold">
              <Filter className="mr-2 h-5 w-5" />
              Фильтры
            </h2>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <X className="mr-1 h-4 w-4" />
                Сбросить все
              </Button>
            )}
          </div>
          <Accordion
            type="multiple"
            defaultValue={[
              'Категории',
              'Цвет',
              'Материал',
              'Посадка',
              'Характеристики обуви',
              'Экологичность',
              VALUES_FILTER_KEY,
              'Технологии',
            ]}
            className="w-full"
          >
            <AccordionItem value="Категории">
              <AccordionTrigger className="p-2 text-base font-semibold hover:no-underline">
                Категории
              </AccordionTrigger>
              <AccordionContent>
                <CategoryTreeFilter
                  value={selectedCategory}
                  onChange={onSelectCategory}
                  allProducts={products}
                  categoryStructure={categoryStructure}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItemWithReset value="Наличие" title="Наличие">
              <AvailabilityFilter
                value={activeFilters['Наличие'] as string[] | undefined}
                onValueChange={(v, checked) => handleFilterChange('Наличие', v, checked)}
              />
            </AccordionItemWithReset>

            <AccordionItemWithReset value="Бренд" title="Бренд">
              <div className="grid max-h-60 gap-2 overflow-y-auto px-2">
                {(filterConfig['Бренд'].options as string[]).map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${option}`}
<<<<<<< HEAD
                      checked={activeFilters['Бренд']?.includes(option) ?? false}
=======
                      checked={
                        (activeFilters['Бренд'] as string[] | undefined)?.includes(option) ?? false
                      }
>>>>>>> recover/cabinet-wip-from-stash
                      onCheckedChange={(checked) => handleFilterChange('Бренд', option, !!checked)}
                    />
                    <Label htmlFor={`brand-${option}`} className="cursor-pointer font-normal">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionItemWithReset>

            <AccordionItemWithReset value="Цвет" title="Цвет">
              <ColorSwatchFilter
                options={filterConfig['Цвет'].options as { name: string; hex: string }[]}
                value={activeFilters['Цвет'] as string[] | undefined}
                onChange={(color, checked) => handleFilterChange('Цвет', color, checked)}
              />
            </AccordionItemWithReset>

            <AccordionItemWithReset value="Посадка" title="Посадка/Силуэт">
              <ClothingFitFilter
                value={activeFilters['Посадка'] as string[] | undefined}
                onValueChange={(v, checked) => handleFilterChange('Посадка', v, checked)}
              />
            </AccordionItemWithReset>

            <AccordionItemWithReset value="Характеристики обуви" title="Характеристики обуви">
              <ShoeFilters
                heelHeight={
                  localHeelHeight ||
                  (activeFilters['Высота каблука'] as [number, number] | undefined)
                }
                onHeelHeightChange={setLocalHeelHeight}
                onHeelHeightCommit={handleHeelHeightCommit}
                soleMaterial={activeFilters['Материал подошвы'] as string[] | undefined}
                onSoleMaterialChange={(v, checked) =>
                  handleFilterChange('Материал подошвы', v, checked)
                }
                upperMaterial={activeFilters['Материал верха'] as string[] | undefined}
                onUpperMaterialChange={(v, checked) =>
                  handleFilterChange('Материал верха', v, checked)
                }
              />
            </AccordionItemWithReset>

            <AccordionItemWithReset value="Экологичность" title="Экологичность">
              <SustainabilityFilter
                value={activeFilters['Экологичность'] as string[] | undefined}
                onValueChange={(v, checked) => handleFilterChange('Экологичность', v, checked)}
              />
            </AccordionItemWithReset>

            <AccordionItemWithReset value={VALUES_FILTER_KEY} title={VALUES_FILTER_KEY}>
              <div className="grid max-h-60 gap-2 overflow-y-auto px-2">
                {VALUES_FILTER_OPTIONS.map((opt) => (
                  <div key={opt.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`values-${opt.id}`}
                      checked={
                        (activeFilters[VALUES_FILTER_KEY] as string[])?.includes(opt.id) ?? false
                      }
                      onCheckedChange={(checked) =>
                        handleFilterChange(VALUES_FILTER_KEY, opt.id, !!checked)
                      }
                    />
                    <Label htmlFor={`values-${opt.id}`} className="cursor-pointer font-normal">
                      {opt.shortLabel}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionItemWithReset>

            <AccordionItemWithReset value="Технологии" title="Технологии">
              <div className="space-y-4 p-4">
                <ArFilter
<<<<<<< HEAD
                  hasAR={activeFilters['AR']?.includes('true')}
=======
                  hasAR={(activeFilters['AR'] as string[] | undefined)?.includes('true')}
>>>>>>> recover/cabinet-wip-from-stash
                  onCheckedChange={(checked) =>
                    handleSingleSelectFilterChange('AR', checked ? 'true' : undefined, 'radio')
                  }
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    id="3d-mode"
<<<<<<< HEAD
                    checked={activeFilters['3D']?.includes('true')}
=======
                    checked={(activeFilters['3D'] as string[] | undefined)?.includes('true')}
>>>>>>> recover/cabinet-wip-from-stash
                    onCheckedChange={(checked) =>
                      handleSingleSelectFilterChange('3D', checked ? 'true' : undefined, 'radio')
                    }
                  />
                  <Label
                    htmlFor="3d-mode"
                    className="flex cursor-pointer items-center gap-2 font-normal"
                  >
                    <View className="h-4 w-4 text-accent" />
                    Просмотр в 3D
                  </Label>
                </div>
              </div>
            </AccordionItemWithReset>

            {Object.entries(filterConfig)
              .filter(([title]) => !['Бренд', 'Цвет'].includes(title))
              .map(
                ([title, config]) =>
                  config.options.length > 0 && (
                    <AccordionItemWithReset value={title} key={title} title={title}>
                      {config.type === 'color' ? (
                        <ColorSwatchFilter
                          options={config.options as { name: string; hex: string }[]}
                          value={activeFilters[title] as string[] | undefined}
                          onChange={(color, checked) => handleFilterChange(title, color, checked)}
                        />
                      ) : (
                        <div className="grid max-h-60 gap-2 overflow-y-auto px-2">
                          {(config.options as string[]).map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${title}-${option}`}
                                checked={
                                  (activeFilters[title] as string[])?.includes(option) ?? false
                                }
                                onCheckedChange={(checked) =>
                                  handleFilterChange(title, option, !!checked)
                                }
                              />
                              <Label
                                htmlFor={`${title}-${option}`}
                                className="cursor-pointer font-normal"
                              >
                                {option}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </AccordionItemWithReset>
                  )
              )}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductFilters;
