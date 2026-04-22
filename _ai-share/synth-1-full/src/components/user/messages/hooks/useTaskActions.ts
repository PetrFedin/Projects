import React from 'react';
import { ChatMessage, TaskStatus, TaskPriority } from '@/lib/types';
import { TaskThreadEntry, TaskStage } from '../types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/auth-provider';
import { saveCalendarEvent, deleteCalendarEvent } from '@/lib/collaboration/calendar-store';
import { calendarEventFromChatTask } from '@/lib/communications/chat-task-calendar';

export function useTaskActions(
  currentUser: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  opts?: { activeChatId?: string; calendarOwnerRole?: string }
) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [taskThreads, setTaskThreads] = React.useState<Record<number, TaskThreadEntry[]>>({});
  const [taskStages, setTaskStages] = React.useState<Record<number, TaskStage[]>>({});

  const syncTaskToCalendar = (task: ChatMessage) => {
    const uid = user?.uid ?? 'guest';
    const ownerRole = (opts?.calendarOwnerRole ?? user?.roles?.[0] ?? 'brand') as any;
    const ownerName = user?.displayName ?? 'Пользователь';
    const chatId = task.chatId ?? opts?.activeChatId;
    if (task.reminderData?.isSyncedWithCalendar) {
      saveCalendarEvent(uid, calendarEventFromChatTask(task, uid, ownerName, ownerRole, chatId));
    } else {
      deleteCalendarEvent(uid, `syntha_msg_task_${task.id}`);
    }
  };

  const saveTask = (task: ChatMessage) => {
    const withChat: ChatMessage = { ...task, chatId: task.chatId ?? opts?.activeChatId };
    setMessages(prev => [...prev, withChat]);
    syncTaskToCalendar(withChat);
    toast({ title: 'Задача создана' });
  };

  const updateTask = (task: ChatMessage) => {
    const withChat: ChatMessage = { ...task, chatId: task.chatId ?? opts?.activeChatId };
    setMessages(prev => prev.map(m => m.id === task.id ? withChat : m));
    syncTaskToCalendar(withChat);
    toast({ title: 'Задача обновлена' });
  };

  const setTaskStatus = (taskId: number, status: TaskStatus) => {
    setMessages(prev => prev.map(m => m.id === taskId ? { ...m, status } : m));
  };

  const createStage = (stage: TaskStage) => {
    setTaskStages((prev) => ({ ...prev, [stage.taskId]: [...(prev[stage.taskId] ?? []), stage] }));
  };

  const postTaskThread = (taskId: number, text: string) => {
    setTaskThreads((prev) => ({
      ...prev,
      [taskId]: [...(prev[taskId] ?? []), {
        id: `thr_${Date.now()}`,
        taskId,
        author: currentUser,
        text,
        createdAt: Date.now(),
        kind: 'comment',
      }]
    }));
  };

  return {
    taskThreads,
    taskStages,
    saveTask,
    updateTask,
    setTaskStatus,
    createStage,
    postTaskThread
  };
}
