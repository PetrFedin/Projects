'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabChatBody({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const {
    chatMessages,
    filteredChat,
    collections,
    activeChatCollection,
    setActiveChatCollection,
    newMessage,
    setNewMessage,
    handleSendMessage,
  } = px;

  return (
    <div className="border-border-subtle flex min-h-[480px] gap-4 overflow-hidden rounded-xl border bg-white shadow-sm">
      <aside className="border-border-subtle flex w-64 shrink-0 flex-col border-r">
        <div className="border-border-subtle border-b p-3">
          <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
            Чаты по коллекциям
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {(() => {
            const allMsgs = chatMessages || filteredChat || [];
            const chats = Array.from(
              new Set(allMsgs.map((m: any) => m.collection || 'General'))
            );
            const list = chats.length ? chats : ['SS26', 'DROP-UZ', 'BASIC', 'General'];
            return list.map((collId) => {
              const count = allMsgs.filter(
                (m: any) => (m.collection || 'General') === collId
              ).length;
              const collName = collections?.find((c: any) => c.id === collId)?.name || collId;
              const isActive = (activeChatCollection || list[0]) === collId;
              return (
                <button
                  key={String(collId)}
                  type="button"
                  onClick={() => setActiveChatCollection?.(collId)}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 px-3 py-3 text-left transition-colors',
                    isActive
                      ? 'bg-accent-primary/10 border-accent-primary text-accent-primary border-l-2'
                      : 'hover:bg-bg-surface2 text-text-primary'
                  )}
                >
                  <span className="truncate text-[11px] font-bold">{collName}</span>
                  {count > 0 && (
                    <Badge variant="secondary" className="h-5 shrink-0 text-[8px]">
                      {count}
                    </Badge>
                  )}
                </button>
              );
            });
          })()}
        </div>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {(() => {
            const allMsgsForSel = chatMessages || filteredChat || [];
            const selColl = activeChatCollection || allMsgsForSel[0]?.collection || 'SS26';
            const msgs = allMsgsForSel.filter(
              (m: any) => (m.collection || 'General') === selColl
            );
            if (msgs.length === 0) {
              return (
                <p className="text-text-muted py-8 text-center text-[10px]">
                  Нет сообщений. Напишите первым.
                </p>
              );
            }
            return msgs.map((m: any) => (
              <div key={m.id} className="flex gap-3">
                <div className="bg-accent-primary/15 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-black">
                  {m.avatar || (m.sender || '').slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-text-primary text-[10px] font-bold">{m.sender}</p>
                  <p className="text-text-secondary mt-0.5 text-[11px]">{m.text}</p>
                  <p className="text-text-muted mt-1 text-[9px]">{m.time}</p>
                </div>
              </div>
            ));
          })()}
        </div>
        <div className="border-border-subtle flex gap-2 border-t p-4">
          <Input
            placeholder="Сообщение..."
            value={newMessage || ''}
            onChange={(e) => setNewMessage?.(e.target.value)}
            className="h-10 flex-1 rounded-lg text-[11px]"
          />
          <Button
            size="sm"
            className="bg-text-primary h-10 rounded-lg px-5 text-[10px] font-bold text-white hover:bg-black"
            onClick={() => handleSendMessage?.()}
          >
            Отправить
          </Button>
        </div>
      </main>
    </div>
  );
}
