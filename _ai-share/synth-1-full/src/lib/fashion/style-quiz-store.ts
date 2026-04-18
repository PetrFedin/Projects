import type { StyleQuizProfileV1 } from './types';
import { STYLE_QUIZ_VERSION } from './types';

const STORAGE_KEY = 'synth.styleQuiz.profile.v1';

export const STYLE_QUIZ_DEFAULTS: StyleQuizProfileV1 = {
  version: STYLE_QUIZ_VERSION,
  updatedAt: Date.now(),
  mood: 'classic',
  silhouette: 'relaxed',
  palette: 'neutral',
};

export function loadStyleQuizProfile(): StyleQuizProfileV1 | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<StyleQuizProfileV1>;
    if (p.version !== STYLE_QUIZ_VERSION) return null;
    return {
      version: STYLE_QUIZ_VERSION,
      updatedAt: p.updatedAt ?? Date.now(),
      mood: p.mood === 'minimal' || p.mood === 'bold' || p.mood === 'classic' ? p.mood : 'classic',
      silhouette:
        p.silhouette === 'fitted' || p.silhouette === 'relaxed' ? p.silhouette : 'relaxed',
      palette: p.palette === 'neutral' || p.palette === 'bright' ? p.palette : 'neutral',
    };
  } catch {
    return null;
  }
}

export function saveStyleQuizProfile(
  profile: Omit<StyleQuizProfileV1, 'version' | 'updatedAt'> &
    Partial<Pick<StyleQuizProfileV1, 'updatedAt'>>
) {
  if (typeof window === 'undefined') return;
  const full: StyleQuizProfileV1 = {
    version: STYLE_QUIZ_VERSION,
    updatedAt: Date.now(),
    mood: profile.mood,
    silhouette: profile.silhouette,
    palette: profile.palette,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
}

export function clearStyleQuizProfile() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
