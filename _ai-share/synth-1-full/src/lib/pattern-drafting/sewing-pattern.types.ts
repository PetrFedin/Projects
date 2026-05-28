import type { Vec2 } from '@/lib/pattern-geometry/vec2';

/**
 * Пошивочные лекала (tailored blocks) — расчёт в мм, 1 user unit = 1 мм в SVG-экспорте.
 * Production CAD (AAMA/DXF, вложенные листы) — отдельный сервис.
 */
export type SewingPatternGarmentBlock =
  | 'bodice_front'
  | 'bodice_back'
  | 'skirt_front'
  | 'skirt_back'
  | 'sleeve';

export type SewingPatternDartToggles = {
  shoulderDart: boolean;
  bustSideDart: boolean;
  waistDart: boolean;
};

export type SewingPatternMeasureInput = {
  unit: 'cm' | 'in';
  /** Обхват груди, см. */
  bust: number;
  /** Обхват талии, см. */
  waist: number;
  /** Обхват бёдер, см. */
  hip: number;
  /** Плечо по спинке, см. */
  shoulderWidth: number;
  /** Рост, см (для FWL, длина юбки). */
  bodyHeight?: number;
};

/** Прибавки к обхватам, см. */
export type SewingPatternEase = {
  bust: number;
  waist: number;
  hip: number;
};

export type SewingPatternDraftOptions = {
  measures: SewingPatternMeasureInput;
  garment: SewingPatternGarmentBlock;
  darts: SewingPatternDartToggles;
  ease: SewingPatternEase;
  /** Припуск, мм. */
  seamAllowanceMm: number;
  showSeamLine: boolean;
  showGrain: boolean;
  showDimensions: boolean;
  /** Глубина выреза горловины, см (только визуал). */
  frontNeckDropCm: number;
  /** Плечо наклон/«спущенный» (множитель). */
  shoulderSlant: number;
  /** Высота талии от пола, см (юбка). */
  waistToHemSkirtCm: number;
};

export type PatternDart = {
  id: string;
  kind: 'shoulder' | 'bust_side' | 'waist' | 'skirt_waist';
  apex: Vec2;
  leg0: Vec2;
  leg1: Vec2;
  intakeMm: number;
};

export type PatternPiece = {
  id: string;
  name: string;
  /** Контур детали (ломаная), мм, проход **против часовой** (положит. площадь). */
  outline: Vec2[];
  /** Сгиб / CF — опциональная прямая. */
  foldLine: { a: Vec2; b: Vec2 } | null;
  darts: PatternDart[];
  grain: { from: Vec2; to: Vec2 };
  /** Служебные метрики. */
  meta: Record<string, number | string>;
};

export type SewingPatternDraft = {
  pieces: PatternPiece[];
  /** Светлый/тёмный фон не задаём — в SVG только слои. */
  widthMm: number;
  heightMm: number;
  viewBox: string;
  /** Углы, числа, формулы — для панели «что под капотом». */
  buildLog: {
    key: string;
    value: string;
    unit?: string;
  }[];
  notes: string[];
};

export type SewingPatternResult = {
  svg: string;
  viewBox: string;
  widthMm: number;
  heightMm: number;
  notes: string[];
  buildLog: SewingPatternDraft['buildLog'];
  /** Скачать как .svg. */
  downloadFileName: string;
};

/** Обратная совместимость с ранним демо-типом. */
export type SewingPatternDemoResult = {
  svg: string;
  viewBox: string;
  widthMmApprox: number;
  heightMmApprox: number;
  notes: string[];
};
