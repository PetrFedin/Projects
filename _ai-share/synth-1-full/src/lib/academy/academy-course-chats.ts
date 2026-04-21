import type { Chat, ChatMessage } from '@/lib/types';
import { getCourseById } from '@/lib/education-data';
import { getCourseByIdForClient } from '@/lib/academy-catalog';

export const ACADEMY_ENROLLMENT_EVENT = 'syntha-academy-enrollment';
export const ACADEMY_ENROLLMENT_STORAGE_KEY = 'syntha-academy-enrolled-courses-v1';

function safeCourseKey(courseId: string): string {
  return courseId.replace(/[^a-zA-Z0-9_-]/g, '_');
}

export function academyStaffChatId(courseId: string): string {
  return `academy_${safeCourseKey(courseId)}_staff`;
}

export function academyCohortChatId(courseId: string): string {
  return `academy_${safeCourseKey(courseId)}_cohort`;
}

export function getEnrolledCourseIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ACADEMY_ENROLLMENT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === 'string' && x.length > 0);
  } catch {
    return [];
  }
}

export function isCourseEnrolled(courseId: string): boolean {
  return getEnrolledCourseIds().includes(courseId);
}

/** Запись о зачислении и уведомление списка чатов (Messages). */
export function enrollInCourse(courseId: string): void {
  if (typeof window === 'undefined') return;
  const ids = getEnrolledCourseIds();
  if (!ids.includes(courseId)) {
    ids.push(courseId);
    localStorage.setItem(ACADEMY_ENROLLMENT_STORAGE_KEY, JSON.stringify(ids));
  }
  window.dispatchEvent(new Event(ACADEMY_ENROLLMENT_EVENT));
}

/** Зачислить сразу несколько курсов (например все модули траектории) — создаёт чаты в разделе «Сообщения». */
export function enrollCourses(courseIds: string[]): void {
  if (typeof window === 'undefined' || courseIds.length === 0) return;
  const cur = getEnrolledCourseIds();
  const set = new Set(cur);
  let changed = false;
  for (const id of courseIds) {
    if (id && !set.has(id)) {
      set.add(id);
      changed = true;
    }
  }
  if (changed) {
    localStorage.setItem(ACADEMY_ENROLLMENT_STORAGE_KEY, JSON.stringify([...set]));
  }
  window.dispatchEvent(new Event(ACADEMY_ENROLLMENT_EVENT));
}

export function resolveCourseTitleForAcademy(courseId: string): string {
  return (
    getCourseByIdForClient(courseId)?.title ?? getCourseById(courseId)?.title ?? courseId
  );
}

export function buildAcademyChatsForCourse(courseId: string, courseTitle: string): Chat[] {
  const short =
    courseTitle.length > 48 ? `${courseTitle.slice(0, 46).trim()}…` : courseTitle;
  const staffId = academyStaffChatId(courseId);
  const cohortId = academyCohortChatId(courseId);
  const now = new Date();
  const time = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  const staff: Chat = {
    id: staffId,
    title: `${short} · куратор`,
    subtitle: 'Вопросы по программе и материалам курса',
    time,
    participantsCount: 3,
    type: 'academy',
    linkCourseId: courseId,
    academyChatKind: 'staff',
    avatar: 'https://picsum.photos/seed/academy-staff/40/40',
    creatorId: 'user_petr',
    participants: [
      { id: 'user_petr', name: 'Petr', role: 'brand', isOnline: true, isAdmin: true },
      { id: 'user_academy_curator', name: 'Куратор курса', role: 'brand', isOnline: true },
      { id: 'user_shop_demo', name: 'Вы (ритейл)', role: 'shop', isOnline: true },
    ],
  };

  const cohort: Chat = {
    id: cohortId,
    title: `Группа · ${short}`,
    subtitle: 'Участники потока: обсуждения и домашние задания',
    time,
    participantsCount: 12,
    type: 'academy',
    linkCourseId: courseId,
    academyChatKind: 'cohort',
    avatar: [
      'https://picsum.photos/seed/academy-g1/40/40',
      'https://picsum.photos/seed/academy-g2/40/40',
    ],
    creatorId: 'system',
    participants: [
      { id: 'user_shop_demo', name: 'Вы', role: 'shop', isOnline: true },
      { id: 'user_academy_peer1', name: 'Алексей К.', role: 'shop', isOnline: false },
      { id: 'user_academy_peer2', name: 'Марина Л.', role: 'shop', isOnline: true },
    ],
  };

  return [staff, cohort];
}

function seedMessagesStaff(chatId: string, courseTitle: string): ChatMessage[] {
  const t = Date.now();
  return [
    {
      id: t,
      chatId,
      user: 'user_academy_curator',
      text: `Добро пожаловать на курс «${courseTitle}»! Здесь отвечаю на вопросы по программе и доступу к материалам.`,
      time: '10:02',
      type: 'message',
      createdAt: t - 3600000,
      likes: 2,
      dislikes: 0,
    },
    {
      id: t + 1,
      chatId,
      user: 'user_shop_demo',
      text: 'Спасибо! Подскажите, где лежит шаблон юнит-экономики из второго модуля?',
      time: '10:18',
      type: 'message',
      createdAt: t - 1800000,
      likes: 0,
      dislikes: 0,
    },
    {
      id: t + 2,
      chatId,
      user: 'user_academy_curator',
      text: 'Вкладка «Материалы» карточки курса — файл с пометкой Excel. Если не открывается — напишите, пришлю ссылку повторно.',
      time: '10:21',
      type: 'message',
      createdAt: t - 1500000,
      likes: 1,
      dislikes: 0,
    },
  ];
}

function seedMessagesCohort(chatId: string, courseTitle: string): ChatMessage[] {
  const t = Date.now();
  return [
    {
      id: t + 10,
      chatId,
      user: 'user_academy_peer1',
      text: `Кто-нибудь уже прошёл первый тест по «${courseTitle}»? Как по сложности?`,
      time: '09:40',
      type: 'message',
      createdAt: t - 7200000,
      likes: 3,
      dislikes: 0,
    },
    {
      id: t + 11,
      chatId,
      user: 'user_academy_peer2',
      text: '40 минут, нормально если внимательно смотреть лекции. Удачи!',
      time: '09:55',
      type: 'message',
      createdAt: t - 6000000,
      likes: 1,
      dislikes: 0,
    },
    {
      id: t + 12,
      chatId,
      user: 'system',
      text: 'Системное сообщение: вы добавлены в групповой чат потока. Соблюдайте правила вежливого общения.',
      time: '09:30',
      type: 'system',
      isSystem: true,
      createdAt: t - 7500000,
    },
  ];
}

export function getAcademyChatSeedMessages(chatId: string): ChatMessage[] | null {
  if (!chatId.startsWith('academy_')) return null;
  const courseKey = chatId
    .replace(/^academy_/, '')
    .replace(/_staff$/, '')
    .replace(/_cohort$/, '');
  const courseId =
    getEnrolledCourseIds().find((id) => safeCourseKey(id) === courseKey) ?? courseKey;
  const title = resolveCourseTitleForAcademy(courseId);

  if (chatId.endsWith('_staff')) return seedMessagesStaff(chatId, title);
  if (chatId.endsWith('_cohort')) return seedMessagesCohort(chatId, title);
  return null;
}

/**
 * Если в URL передан `?chat=academy_…`, подмешиваем карточки курса, даже до явного «Начать обучение»
 * (удобно для демо и прямых ссылок).
 */
export function getAcademyChatsForDeepLink(requestedChatId: string): Chat[] {
  if (!requestedChatId.startsWith('academy_')) return [];
  const courseKey = requestedChatId
    .replace(/^academy_/, '')
    .replace(/_staff$/, '')
    .replace(/_cohort$/, '');
  const courseId =
    getEnrolledCourseIds().find((id) => safeCourseKey(id) === courseKey) ??
    (getCourseById(courseKey) ? courseKey : null);
  if (!courseId) return [];
  return buildAcademyChatsForCourse(courseId, resolveCourseTitleForAcademy(courseId));
}
