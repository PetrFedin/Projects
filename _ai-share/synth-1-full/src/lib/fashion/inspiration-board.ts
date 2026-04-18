import type { Product } from '@/lib/types';
import {
  INSPIRATION_BOARD_VERSION,
  type InspirationBoardStateV1,
  type InspirationPinV1,
} from './types';

export type { InspirationBoardStateV1, InspirationPinV1 };

const STORAGE_KEY = 'synth.inspirationBoard.v1';

export function loadInspirationBoard(): InspirationBoardStateV1 {
  if (typeof window === 'undefined') {
    return emptyBoard();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyBoard();
    const p = JSON.parse(raw) as Partial<InspirationBoardStateV1>;
    if (p.version !== INSPIRATION_BOARD_VERSION || !Array.isArray(p.pins)) return emptyBoard();
    return {
      version: INSPIRATION_BOARD_VERSION,
      updatedAt: p.updatedAt ?? Date.now(),
      title: typeof p.title === 'string' ? p.title : 'Моя доска',
      pins: p.pins.filter((x) => x?.productId && x?.slug),
    };
  } catch {
    return emptyBoard();
  }
}

function emptyBoard(): InspirationBoardStateV1 {
  return {
    version: INSPIRATION_BOARD_VERSION,
    updatedAt: Date.now(),
    title: 'Моя доска',
    pins: [],
  };
}

export function saveInspirationBoard(state: InspirationBoardStateV1) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, updatedAt: Date.now() }));
}

export function addPin(
  state: InspirationBoardStateV1,
  product: Product,
  note?: string
): InspirationBoardStateV1 {
  if (state.pins.some((x) => x.productId === String(product.id))) return state;
  const pin: InspirationPinV1 = {
    productId: String(product.id),
    slug: product.slug,
    note,
    addedAt: Date.now(),
  };
  return { ...state, pins: [...state.pins, pin], updatedAt: Date.now() };
}

export function removePin(
  state: InspirationBoardStateV1,
  productId: string
): InspirationBoardStateV1 {
  return {
    ...state,
    pins: state.pins.filter((x) => x.productId !== productId),
    updatedAt: Date.now(),
  };
}

export function parseInspirationBoardImport(raw: unknown): InspirationBoardStateV1 | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Partial<InspirationBoardStateV1>;
  if (o.version !== INSPIRATION_BOARD_VERSION || !Array.isArray(o.pins)) return null;
  return {
    version: INSPIRATION_BOARD_VERSION,
    updatedAt: o.updatedAt ?? Date.now(),
    title: typeof o.title === 'string' ? o.title : 'Импорт',
    pins: o.pins.filter((x) => x?.productId && x?.slug),
  };
}
