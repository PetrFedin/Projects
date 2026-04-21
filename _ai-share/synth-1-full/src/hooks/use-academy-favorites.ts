'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'syntha-academy-favorites-v1';

export type AcademyFavorites = {
  courseIds: string[];
  articleIds: string[];
  eventIds: string[];
};

const empty: AcademyFavorites = { courseIds: [], articleIds: [], eventIds: [] };

function load(): AcademyFavorites {
  if (typeof window === 'undefined') return empty;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<AcademyFavorites>;
    return {
      courseIds: Array.isArray(parsed.courseIds) ? parsed.courseIds : [],
      articleIds: Array.isArray(parsed.articleIds) ? parsed.articleIds : [],
      eventIds: Array.isArray(parsed.eventIds) ? parsed.eventIds : [],
    };
  } catch {
    return empty;
  }
}

function save(data: AcademyFavorites) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export function useAcademyFavorites() {
  const [favorites, setFavorites] = useState<AcademyFavorites>(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFavorites(load());
    setReady(true);
  }, []);

  const persist = useCallback((next: AcademyFavorites) => {
    setFavorites(next);
    save(next);
  }, []);

  const toggleCourse = useCallback(
    (id: string) => {
      persist({ ...favorites, courseIds: toggle(favorites.courseIds, id) });
    },
    [favorites, persist]
  );

  const toggleArticle = useCallback(
    (id: string) => {
      persist({ ...favorites, articleIds: toggle(favorites.articleIds, id) });
    },
    [favorites, persist]
  );

  const toggleEvent = useCallback(
    (id: string) => {
      persist({ ...favorites, eventIds: toggle(favorites.eventIds, id) });
    },
    [favorites, persist]
  );

  const isCourseFavorite = useCallback(
    (id: string) => favorites.courseIds.includes(id),
    [favorites.courseIds]
  );
  const isArticleFavorite = useCallback(
    (id: string) => favorites.articleIds.includes(id),
    [favorites.articleIds]
  );
  const isEventFavorite = useCallback(
    (id: string) => favorites.eventIds.includes(id),
    [favorites.eventIds]
  );

  /** Удалить из избранного id курсов, которых нет в актуальном каталоге (архив, снятие с публикации). */
  const pruneStaleCourseFavorites = useCallback((allowedCourseIds: ReadonlySet<string>) => {
    setFavorites((prev) => {
      const nextIds = prev.courseIds.filter((id) => allowedCourseIds.has(id));
      if (nextIds.length === prev.courseIds.length) return prev;
      const next = { ...prev, courseIds: nextIds };
      save(next);
      return next;
    });
  }, []);

  return {
    ready,
    favorites,
    toggleCourse,
    toggleArticle,
    toggleEvent,
    isCourseFavorite,
    isArticleFavorite,
    isEventFavorite,
    pruneStaleCourseFavorites,
  };
}
