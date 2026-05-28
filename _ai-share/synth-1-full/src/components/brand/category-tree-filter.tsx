'use client';

import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import type { Product } from '@/lib/types';

interface CategoryTreeFilterProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  allProducts: Product[];
  categoryStructure: Record<string, any>;
}

const getAllSubcategories = (category: string, structure: any): string[] => {
  let categories: string[] = [category];

  const findChildren = (currentCategory: string, currentStructure: any) => {
    for (const key in currentStructure) {
      if (key === currentCategory) {
        const children = currentStructure[key];
        if (typeof children === 'object' && children !== null) {
          const childKeys = Object.keys(children);
          categories = [...categories, ...childKeys];
          childKeys.forEach((childKey) => findChildren(childKey, children));
        }
        return;
      }
      if (typeof currentStructure[key] === 'object' && currentStructure[key] !== null) {
        findChildren(currentCategory, currentStructure[key]);
      }
    }
  };

  findChildren(category, structure);
  return [...new Set(categories)];
};

const getAllParentCategories = (structure: Record<string, any>): string[] => {
  const parents: string[] = [];
  const traverse = (node: Record<string, any>) => {
    for (const key in node) {
      if (
        typeof node[key] === 'object' &&
        node[key] !== null &&
        Object.keys(node[key]).length > 0
      ) {
        parents.push(key);
        traverse(node[key]);
      }
    }
  };
  traverse(structure);
  return parents;
};

export default function CategoryTreeFilter({
  value,
  onChange,
  allProducts,
  categoryStructure,
}: CategoryTreeFilterProps) {
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const categoryProductCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (!categoryStructure) return counts;

    const allCategoryKeys: string[] = [];

    function getAllKeys(structure: any) {
      for (const key in structure) {
        allCategoryKeys.push(key);
        if (typeof structure[key] === 'object' && structure[key] !== null) {
          getAllKeys(structure[key]);
        }
      }
    }
    getAllKeys(categoryStructure);

    allCategoryKeys.forEach((category) => {
      const subcategories = getAllSubcategories(category, categoryStructure);
      const count = allProducts.filter(
        (p) =>
          subcategories.includes(p.category) ||
          (p.subcategory && subcategories.includes(p.subcategory))
      ).length;
      counts[category] = count;
    });

    return counts;
  }, [allProducts, categoryStructure]);

  useEffect(() => {
    if (categoryStructure) {
      setOpenCategories(getAllParentCategories(categoryStructure));
    }
  }, [categoryStructure]);

  const handleToggle = (category: string) => {
    setOpenCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleSelect = (category: string) => {
    onChange(value === category ? undefined : category);
  };

  const renderTree = (data: Record<string, any> | string[], level = 0): (JSX.Element | null)[] => {
    if (Array.isArray(data) || !data) return [];

    return Object.entries(data).map(([category, children]) => {
      const hasChildren =
        typeof children === 'object' && children !== null && Object.keys(children).length > 0;

      return (
        <div key={category} style={{ paddingLeft: level > 0 ? '0.5rem' : '0' }}>
          <div
            className={cn(
              'group flex w-full flex-1 cursor-pointer items-center justify-between gap-2 rounded-md p-1 text-left text-sm hover:bg-muted',
              value === category && 'bg-secondary font-semibold'
            )}
            onClick={() => handleSelect(category)}
          >
            <div
              className="flex min-w-0 flex-1 items-center gap-2"
              onClick={(e) => {
                if (hasChildren) {
                  e.stopPropagation();
                  handleToggle(category);
                }
              }}
            >
              {hasChildren && (
                <ChevronRight
                  className={cn(
                    'h-4 w-4 shrink-0 transition-transform',
                    openCategories.includes(category) && 'rotate-90'
                  )}
                />
              )}
              <span
                className={cn(
                  'flex-1 truncate',
                  !hasChildren && level > 0 && 'pl-5',
                  level === 0 && !hasChildren && 'pl-5',
                  level === 0 && 'font-medium'
                )}
              >
                {category}
              </span>
            </div>
          </div>
          {hasChildren && openCategories.includes(category) && (
            <div className="ml-3 space-y-1 border-l py-1 pl-2">
              {renderTree(children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">Категории</CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <ScrollArea className="h-[500px]">
          <div className="p-2">{renderTree(categoryStructure)}</div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
