'use client';

import { useCallback, useMemo } from 'react';
import type { ColorInfo, Product, ProductScrollSwitcherSection } from '@/lib/types';
import {
  buildRunwayProductViewModel,
  productSupportsScrollVideo,
  resolveSectionIndexForColor,
  type RunwayProductViewModel,
} from '@/lib/product-scroll-switcher';
import { useScrollExperienceConfig } from '@/hooks/useScrollExperienceConfig';

export interface UseProductRunwayStateOptions {
  product: Product;
  /** Текущий цвет из UIState / color picker. */
  activeColor?: ColorInfo | null;
  /** Синхронизация цвета при смене секции runway. */
  onColorChange?: (colorName: string) => void;
}

export interface UseProductRunwayStateResult {
  enabled: boolean;
  viewModel: RunwayProductViewModel | null;
  sections: ProductScrollSwitcherSection[];
  activeSectionIndex: number;
  activeSection: ProductScrollSwitcherSection | undefined;
  displayPrice: number;
  variantSku: string;
  /** Индекс для controlledSectionIndex в ProductScrollSwitcher. */
  controlledSectionIndex: number;
  /** Callback для onSectionChange — обновляет цвет PDP. */
  handleSectionChange: (index: number, section: ProductScrollSwitcherSection) => void;
  /** Индекс секции по имени цвета (для color picker → runway). */
  sectionIndexForColor: (colorName: string | undefined) => number;
}

/**
 * Единый слой состояния runway ↔ standard PDP.
 * Централизует VM, цену, SKU и двустороннюю синхронизацию цвета.
 */
export function useProductRunwayState({
  product,
  activeColor,
  onColorChange,
}: UseProductRunwayStateOptions): UseProductRunwayStateResult {
  const config = useScrollExperienceConfig();
  const enabled = productSupportsScrollVideo(product);

  const viewModel = useMemo(() => {
    if (!enabled) return null;
    return buildRunwayProductViewModel(product, {
      activeColorName: activeColor?.name,
      config,
    });
  }, [enabled, product, activeColor?.name, config]);

  const sections = viewModel?.sections ?? [];
  const activeSectionIndex = viewModel?.activeSectionIndex ?? 0;
  const activeSection = viewModel?.activeSection;
  const displayPrice = viewModel?.displayPrice ?? product.price;
  const variantSku = viewModel?.variantSku ?? product.sku;
  const controlledSectionIndex = activeSectionIndex;

  const handleSectionChange = useCallback(
    (index: number, section: ProductScrollSwitcherSection) => {
      const colorName = section.colorName ?? section.label;
      if (colorName) onColorChange?.(colorName);
    },
    [onColorChange]
  );

  const sectionIndexForColor = useCallback(
    (colorName: string | undefined) => resolveSectionIndexForColor(product, colorName, config),
    [product, config]
  );

  return {
    enabled,
    viewModel,
    sections,
    activeSectionIndex,
    activeSection,
    displayPrice,
    variantSku,
    controlledSectionIndex,
    handleSectionChange,
    sectionIndexForColor,
  };
}
