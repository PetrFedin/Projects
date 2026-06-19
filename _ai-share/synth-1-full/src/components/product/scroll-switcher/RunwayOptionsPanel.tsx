'use client';

import { GitCompare, Maximize2, Minimize2, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  RUNWAY_SCROLL_SENSITIVITY_MAX,
  RUNWAY_SCROLL_SENSITIVITY_MIN,
} from '@/lib/scroll-switcher-constants';
import type { RunwayUserPreferences } from '@/hooks/useRunwayUserPreferences';
import { t } from '@/lib/runway/runway-i18n';
import { RunwayKeyboardLegend } from '@/components/product/scroll-switcher/RunwayKeyboardLegend';

interface RunwayOptionsPanelProps {
  prefs: RunwayUserPreferences;
  onUpdate: (patch: Partial<RunwayUserPreferences>) => void;
  className?: string;
  /** Доп. действия в блоке «Ещё». */
  showCompare?: boolean;
  onOpenCompare?: () => void;
  showFullscreen?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  /** Встроить toggles без gear-trigger (RunwayMoreMenu). */
  embedded?: boolean;
  /** Показать легенду клавиш (RunwayMoreMenu может отключать). */
  showKeyboardLegend?: boolean;
}

/** Содержимое настроек — переиспользуется в gear popover и RunwayMoreMenu. */
export function RunwayOptionsContent({
  prefs,
  onUpdate,
  showCompare = false,
  onOpenCompare,
  showFullscreen = false,
  isFullscreen = false,
  onToggleFullscreen,
  showKeyboardLegend = true,
}: Omit<RunwayOptionsPanelProps, 'className' | 'embedded'>) {
  return (
    <div className="space-y-4" data-runway-options-panel>
      <div>
        <p className="text-sm font-semibold">{t('runway.options.title')}</p>
        <p className="text-xs text-muted-foreground">{t('runway.options.savedLocally')}</p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="runway-reduced-motion" className="text-xs">
          {t('runway.options.reduceMotion')}
        </Label>
        <Switch
          id="runway-reduced-motion"
          checked={prefs.reducedMotionOverride === true}
          onCheckedChange={(checked) => onUpdate({ reducedMotionOverride: checked ? true : null })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">{t('runway.aria.scrollSensitivity')}</Label>
          <span className="text-xs tabular-nums text-muted-foreground">
            {t('runway.options.sensitivityValue', {
              value: prefs.scrollSensitivity.toFixed(1),
            })}
          </span>
        </div>
        <Slider
          min={RUNWAY_SCROLL_SENSITIVITY_MIN}
          max={RUNWAY_SCROLL_SENSITIVITY_MAX}
          step={0.1}
          value={[prefs.scrollSensitivity]}
          onValueChange={([value]) => onUpdate({ scrollSensitivity: value })}
          aria-label={t('runway.aria.scrollSensitivity')}
          data-runway-scroll-sensitivity
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="runway-ambient-video" className="text-xs">
          {t('runway.options.backgroundVideo')}
        </Label>
        <Switch
          id="runway-ambient-video"
          checked={prefs.ambientVideoEnabled}
          onCheckedChange={(checked) => onUpdate({ ambientVideoEnabled: checked })}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="runway-show-stories" className="text-xs">
          {t('runway.options.sectionStories')}
        </Label>
        <Switch
          id="runway-show-stories"
          checked={prefs.showStories}
          onCheckedChange={(checked) => onUpdate({ showStories: checked })}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="runway-show-look" className="text-xs">
          {t('runway.options.completeLook')}
        </Label>
        <Switch
          id="runway-show-look"
          checked={prefs.showCompleteLook}
          onCheckedChange={(checked) => onUpdate({ showCompleteLook: checked })}
        />
      </div>

      {(showCompare && onOpenCompare) || (showFullscreen && onToggleFullscreen) ? (
        <div className="space-y-2 border-t border-border pt-3">
          <p className="text-xs font-semibold text-muted-foreground">{t('runway.options.more')}</p>
          {showCompare && onOpenCompare ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 w-full justify-start text-xs"
              onClick={onOpenCompare}
            >
              <GitCompare className="mr-2 h-3.5 w-3.5" />
              {t('runway.compareVariants')}
            </Button>
          ) : null}
          {showFullscreen && onToggleFullscreen ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 w-full justify-start text-xs"
              onClick={onToggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize2 className="mr-2 h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="mr-2 h-3.5 w-3.5" />
              )}
              {isFullscreen ? t('runway.fullscreenExit') : t('runway.fullscreenEnter')}
            </Button>
          ) : null}
        </div>
      ) : null}

      {showKeyboardLegend ? <RunwayKeyboardLegend embedded /> : null}
    </div>
  );
}

/** Gear popover — пользовательские настройки runway (legacy full layout). */
export function RunwayOptionsPanel({
  prefs,
  onUpdate,
  className,
  showCompare = false,
  onOpenCompare,
  showFullscreen = false,
  isFullscreen = false,
  onToggleFullscreen,
  embedded = false,
}: RunwayOptionsPanelProps) {
  if (embedded) {
    return (
      <RunwayOptionsContent
        prefs={prefs}
        onUpdate={onUpdate}
        showCompare={showCompare}
        onOpenCompare={onOpenCompare}
        showFullscreen={showFullscreen}
        isFullscreen={isFullscreen}
        onToggleFullscreen={onToggleFullscreen}
        showKeyboardLegend={false}
      />
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn('h-9 w-9 bg-background/90 backdrop-blur-sm', className)}
          aria-label={t('runway.aria.options')}
          data-runway-options-trigger
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <RunwayOptionsContent
          prefs={prefs}
          onUpdate={onUpdate}
          showCompare={showCompare}
          onOpenCompare={onOpenCompare}
          showFullscreen={showFullscreen}
          isFullscreen={isFullscreen}
          onToggleFullscreen={onToggleFullscreen}
        />
      </PopoverContent>
    </Popover>
  );
}
