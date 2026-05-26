import type { CalendarEvent } from '@/lib/types/calendar';
import type { ChatMessage } from '@/lib/types';
import type { UserRole } from '@/lib/types';

export function calendarEventIdFromChatTask(taskId: number): string {
  return `syntha_msg_task_${taskId}`;
}

/** Слой «communications» — задачи из чатов бренда */
export function calendarEventFromChatTask(
  task: ChatMessage,
  userId: string,
  ownerName: string,
  ownerRole: UserRole,
  chatId?: string
): CalendarEvent {
  const base = task.deadline ? new Date(task.deadline) : new Date();
  const start = new Date(base);
  if (!task.deadline) {
    start.setHours(12, 0, 0, 0);
  } else {
    if (start.getHours() === 0 && start.getMinutes() === 0) {
      start.setHours(9, 0, 0, 0);
    }
  }
  const end = new Date(start.getTime() + 3600000);
  return {
    id: calendarEventIdFromChatTask(task.id),
    ownerId: userId,
    ownerRole,
    ownerName,
    calendarId: 'messages',
    title: task.text?.trim() || 'Задача',
    description: (task.chatId ?? chatId) ? `Из чата · ${task.chatId ?? chatId}` : 'Задача из сообщений',
    layer: 'communications',
    visibility: 'internal',
    type: 'task',
    startAt: start.toISOString(),
    endAt: end.toISOString(),
    participants: [],
    importance: task.priority === 'critical' ? 'critical' : task.priority === 'high' ? 'high' : 'medium',
    targetChatId: task.chatId ?? chatId,
    reminderMinutesBefore: 15,
  };
}
