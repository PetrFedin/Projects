import React from 'react';
import { useSearchParams } from 'next/navigation';
import { initialConversations, mockChatHistories } from '@/lib/data/messages-data';
import { Chat as ChatConversation, ChatMessage, UserRole } from '@/lib/types';
import { ID } from '../types';
import { canInteract } from '@/lib/interaction-policy';
import {
  STAGE_PREFERRED_CHAT_ID,
  matrixContextChatId,
  matrixContextChatRow,
  matrixContextMessages,
} from '@/lib/production/stages-comm-demo';
import {
  ACADEMY_ENROLLMENT_EVENT,
  buildAcademyChatsForCourse,
  getAcademyChatSeedMessages,
  getAcademyChatsForDeepLink,
  getEnrolledCourseIds,
  resolveCourseTitleForAcademy,
} from '@/lib/academy/academy-course-chats';

export function useChatState(initialRole?: string) {
  const searchParams = useSearchParams();
  const [currentRole, setCurrentRole] = React.useState<UserRole>(
    (initialRole as UserRole) || 'admin'
  );

  const [academyEnrollVersion, setAcademyEnrollVersion] = React.useState(0);

  React.useEffect(() => {
    const bump = () => setAcademyEnrollVersion((v) => v + 1);
    if (typeof window === 'undefined') return;
    window.addEventListener(ACADEMY_ENROLLMENT_EVENT, bump);
    window.addEventListener('storage', bump);
    return () => {
      window.removeEventListener(ACADEMY_ENROLLMENT_EVENT, bump);
      window.removeEventListener('storage', bump);
    };
  }, []);

  const conversationsWithAcademy = React.useMemo(() => {
    const enrolled = typeof window === 'undefined' ? [] : getEnrolledCourseIds();
    const extra = enrolled.flatMap((courseId) =>
      buildAcademyChatsForCourse(courseId, resolveCourseTitleForAcademy(courseId))
    );
    return [...initialConversations, ...extra];
  }, [academyEnrollVersion]);

  const filteredConversations = React.useMemo(() => {
    return conversationsWithAcademy.filter((chat) => {
      // If admin, show everything
      if (currentRole === 'admin') return true;

      // Check if current user can interact with the chat type/participants
      // Each chat has a 'type' property in our mock data which corresponds to the role it belongs to
      return canInteract(currentRole, chat.type as UserRole);
    });
  }, [currentRole, conversationsWithAcademy]);

  const spGet = React.useCallback(
    (name: string) => searchParams?.get(name) ?? null,
    [searchParams]
  );

  const chatParam = searchParams?.get('chat') ?? '';

  const withDeepLinkAcademy = React.useMemo(() => {
    const extra = getAcademyChatsForDeepLink(chatParam);
    if (extra.length === 0) return filteredConversations;
    const ids = new Set(filteredConversations.map((c) => c.id));
    return [...filteredConversations, ...extra.filter((c) => !ids.has(c.id))];
  }, [filteredConversations, chatParam, academyEnrollVersion]);

  const conversationsWithMatrix = React.useMemo(() => {
    const matrixRow = matrixContextChatRow({ get: spGet });
    if (!matrixRow) return withDeepLinkAcademy;
    const rest = withDeepLinkAcademy.filter((c) => c.id !== matrixRow.id);
    return [matrixRow, ...rest];
  }, [withDeepLinkAcademy, spGet]);

  const [chats, setChats] = React.useState<ChatConversation[]>(filteredConversations);
  const [activeChatId, setActiveChatId] = React.useState<ID>(filteredConversations[0]?.id || '');

  React.useEffect(() => {
    setChats(conversationsWithMatrix);
    if (
      conversationsWithMatrix.length > 0 &&
      (!activeChatId || !conversationsWithMatrix.find((c) => c.id === activeChatId))
    ) {
      setActiveChatId(conversationsWithMatrix[0].id);
    }
  }, [conversationsWithMatrix]);

  const chatFromUrl = searchParams?.get('chat');
  React.useEffect(() => {
    if (chatFromUrl && conversationsWithMatrix.some((c) => c.id === chatFromUrl)) {
      setActiveChatId(chatFromUrl);
    }
  }, [chatFromUrl, conversationsWithMatrix]);

  /** Из матрицы: чат по артикулу; иначе — предпочтительный канал этапа (не розница). */
  const stagesStep = searchParams?.get('stagesStep') || '';
  const stageChatAppliedRef = React.useRef('');
  const matrixChatAppliedRef = React.useRef('');
  React.useEffect(() => {
    if (chatFromUrl) return;
    const mid = matrixContextChatId({ get: spGet });
    if (mid && stagesStep && conversationsWithMatrix.some((c) => c.id === mid)) {
      const key = `${stagesStep}:${searchParams?.get('sku')?.trim() ?? ''}`;
      if (matrixChatAppliedRef.current !== key) {
        setActiveChatId(mid);
        matrixChatAppliedRef.current = key;
      }
      return;
    }
    matrixChatAppliedRef.current = '';
    if (!stagesStep) return;
    if (stageChatAppliedRef.current === stagesStep) return;
    const want = STAGE_PREFERRED_CHAT_ID[stagesStep];
    if (!want) return;
    if (conversationsWithMatrix.some((c) => c.id === want)) {
      setActiveChatId(want);
      stageChatAppliedRef.current = stagesStep;
    }
  }, [stagesStep, chatFromUrl, conversationsWithMatrix, spGet, searchParams]);

  const messagesForChat = React.useCallback(
    (id: ID): ChatMessage[] => {
      const mid = matrixContextChatId({ get: spGet });
      if (mid && id === mid) return matrixContextMessages({ get: spGet });
      const academySeed = getAcademyChatSeedMessages(String(id));
      if (academySeed?.length) return academySeed;
      return (mockChatHistories as any)[id] ?? [];
    },
    [spGet]
  );

  const [messages, setMessages] = React.useState<ChatMessage[]>(() =>
    activeChatId ? messagesForChat(activeChatId) : []
  );

  React.useEffect(() => {
    if (activeChatId) setMessages(messagesForChat(activeChatId));
  }, [activeChatId, messagesForChat]);

  const [chatQuery, setChatQuery] = React.useState('');
  const [msgSearch, setMsgSearch] = React.useState('');
  const [tab, setTab] = React.useState<'feed' | 'tasks' | 'archived' | 'starred'>('feed');
  const [activeGroup, setActiveGroup] = React.useState<string>((initialRole as any) || 'all');
  const [composerText, setComposerText] = React.useState('');
  const [isPrivate, setIsPrivate] = React.useState(false);

  const activeChat = React.useMemo(
    () => chats.find((c) => c.id === activeChatId),
    [chats, activeChatId]
  );

  const switchChat = (nextId: ID) => {
    setActiveChatId(nextId);
    setMessages(messagesForChat(nextId));
  };

  const onSendMessage = () => {
    if (!composerText.trim()) return;
    const currentUserName = 'Petr';
    const newMessage: ChatMessage = {
      id: Date.now(),
      chatId: activeChatId,
      user: currentUserName,
      text: composerText,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      type: 'message',
      isPrivate,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setComposerText('');
    setIsPrivate(false);
  };

  return {
    currentRole,
    setCurrentRole,
    chats,
    setChats,
    activeChatId,
    setActiveChatId,
    messages,
    setMessages,
    chatQuery,
    setChatQuery,
    msgSearch,
    setMsgSearch,
    tab,
    setTab,
    activeGroup,
    setActiveGroup,
    activeChat,
    composerText,
    setComposerText,
    isPrivate,
    setIsPrivate,
    onSendMessage,
    switchChat,
  };
}
