export interface CourseReviewEntry {
  id: string;
  courseId: string;
  authorName: string;
  rating: number;
  text: string;
  createdAt: string;
  source: 'mock' | 'user';
}

const STORAGE_KEY = 'syntha-academy-course-reviews-user-v1';

const MOCK_REVIEWS: CourseReviewEntry[] = [
  {
    id: 'rev-mock-1',
    courseId: 'course-1',
    authorName: 'Елена В.',
    rating: 5,
    text: 'Очень плотная подача по марже и уценкам — сразу применила в своём магазине.',
    createdAt: '2025-11-12T10:00:00.000Z',
    source: 'mock',
  },
  {
    id: 'rev-mock-2',
    courseId: 'course-1',
    authorName: 'Игорь М.',
    rating: 4,
    text: 'Немного быстрый темп в середине курса, но материалы можно пересмотреть.',
    createdAt: '2025-10-28T14:30:00.000Z',
    source: 'mock',
  },
  {
    id: 'rev-mock-3',
    courseId: 'course-2',
    authorName: 'Анна С.',
    rating: 5,
    text: 'Лучшее введение в AI для дизайна — наконец-то понятная связка 3D и генеративки.',
    createdAt: '2025-12-01T09:15:00.000Z',
    source: 'mock',
  },
  {
    id: 'rev-mock-4',
    courseId: 'course-4',
    authorName: 'Ольга П.',
    rating: 5,
    text: 'Практично для визуального мерча, без лишней теории.',
    createdAt: '2025-09-20T16:45:00.000Z',
    source: 'mock',
  },
];

function readUserReviews(): CourseReviewEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is CourseReviewEntry =>
        typeof x === 'object' &&
        x !== null &&
        typeof (x as CourseReviewEntry).id === 'string' &&
        typeof (x as CourseReviewEntry).courseId === 'string'
    );
  } catch {
    return [];
  }
}

function writeUserReviews(entries: CourseReviewEntry[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getCourseReviews(courseId: string): CourseReviewEntry[] {
  const user = readUserReviews().filter((r) => r.courseId === courseId);
  const mock = MOCK_REVIEWS.filter((r) => r.courseId === courseId);
  const merged = [...mock, ...user];
  merged.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return merged;
}

export function getCourseRatingSummary(courseId: string): { average: number; count: number } {
  const list = getCourseReviews(courseId);
  if (list.length === 0) return { average: 0, count: 0 };
  const sum = list.reduce((s, r) => s + r.rating, 0);
  return { average: Math.round((sum / list.length) * 10) / 10, count: list.length };
}

export function addCourseReview(
  courseId: string,
  authorName: string,
  rating: number,
  text: string
): CourseReviewEntry {
  const entry: CourseReviewEntry = {
    id: `rev-user-${Date.now()}`,
    courseId,
    authorName: authorName.trim() || 'Слушатель',
    rating: Math.min(5, Math.max(1, Math.round(rating))),
    text: text.trim(),
    createdAt: new Date().toISOString(),
    source: 'user',
  };
  const all = readUserReviews();
  all.push(entry);
  writeUserReviews(all);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('syntha-academy-reviews-changed'));
  }
  return entry;
}
