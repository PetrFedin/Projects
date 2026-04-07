import React from 'react';
import { ChatMessage, ID } from '../types';
import { useToast } from '@/hooks/use-toast';

export function useMessageActions(
  activeChatId: ID,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  currentUserName: string
) {
  const { toast } = useToast();

  const toggleStar = (messageId: number) => {
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, isStarred: !m.isStarred } : m)));
  };

  const togglePin = (messageId: number) => {
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, isPinned: !m.isPinned } : m)));
  };

  const deleteMessage = (messageId: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    toast({ title: 'Сообщение удалено' });
  };

  const addReaction = (messageId: number, reaction: string) => {
    setMessages((prev) => prev.map((m) => m.id === messageId ? { ...m, userReaction: reaction as any } : m));
  };

  return {
    toggleStar,
    togglePin,
    deleteMessage,
    addReaction
  };
}
