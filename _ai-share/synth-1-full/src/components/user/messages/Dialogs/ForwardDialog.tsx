import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Chat as ChatConversation } from '@/lib/types';
import { ID, Person } from '../types';

interface ForwardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chats: ChatConversation[];
  people: Person[];
  onForward: (targets: { chatIds: ID[]; peopleIds: string[] }) => void;
}

export const ForwardDialog: React.FC<ForwardDialogProps> = ({
  open,
  onOpenChange,
  chats,
  people,
  onForward,
}) => {
  const [q, setQ] = React.useState('');
  const [chatIds, setChatIds] = React.useState<ID[]>([]);
  const [peopleIds, setPeopleIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (!open) return;
    setQ('');
    setChatIds([]);
    setPeopleIds([]);
  }, [open]);

  const filteredChats = React.useMemo(() => {
    const qq = q.trim().toLowerCase();
    const base = chats.filter((c) => !c.isArchived);
    if (!qq) return base;
    return base.filter(
      (c) => c.title.toLowerCase().includes(qq) || (c.subtitle ?? '').toLowerCase().includes(qq)
    );
  }, [chats, q]);

  const filteredPeople = React.useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return people;
    return people.filter((p) => p.name.toLowerCase().includes(qq));
  }, [people, q]);

  function toggle(arr: string[], id: string) {
    return arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
  }

  function submit() {
    onForward({ chatIds, peopleIds });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-xl border-none bg-white p-3 shadow-2xl">
        <DialogHeader className="mb-6 space-y-3">
          <DialogTitle className="text-text-primary text-base font-black uppercase tracking-tighter">
            Переслать
          </DialogTitle>
          <DialogDescription className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
            Выберите получателей контента
          </DialogDescription>
        </DialogHeader>

        <div className="relative mb-6">
          <Search className="text-text-muted absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск контактов и групп…"
            className="bg-bg-surface2 h-10 rounded-2xl border-none pl-12 text-sm font-bold"
          />
        </div>

        <ScrollArea className="-mx-2 h-[400px] px-2">
          <div className="space-y-4">
            <div className="space-y-4">
              <h4 className="text-text-muted ml-2 text-[10px] font-black uppercase tracking-widest">
                Активные диалоги
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {filteredChats.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setChatIds((p) => toggle(p, c.id))}
                    className={cn(
                      'group flex items-center gap-3 rounded-3xl border p-4 text-left transition-all',
                      chatIds.includes(c.id)
                        ? 'border-blue-200 bg-blue-50 shadow-sm'
                        : 'bg-bg-surface2 border-border-subtle hover:border-border-default'
                    )}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-bg-surface2 text-text-muted text-[10px] font-black">
                          {c.title[0]}
                        </AvatarFallback>
                        <AvatarImage src={typeof c.avatar === 'string' ? c.avatar : undefined} />
                      </Avatar>
                      {chatIds.includes(c.id) && (
                        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-blue-600 shadow-sm">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={cn(
                          'truncate text-xs font-black uppercase',
                          chatIds.includes(c.id) ? 'text-blue-700' : 'text-text-primary'
                        )}
                      >
                        {c.title}
                      </p>
                      <p className="text-text-muted truncate text-[9px] font-bold uppercase tracking-widest">
                        {c.subtitle}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-text-muted ml-2 text-[10px] font-black uppercase tracking-widest">
                Контакты
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {filteredPeople.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPeopleIds((prev) => toggle(prev, p.id))}
                    className={cn(
                      'group flex items-center gap-3 rounded-3xl border p-4 text-left transition-all',
                      peopleIds.includes(p.id)
                        ? 'bg-accent-primary/10 border-accent-primary/30 shadow-sm'
                        : 'bg-bg-surface2 border-border-subtle hover:border-border-default'
                    )}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarFallback className="text-[10px] font-black">
                          {p.name[0]}
                        </AvatarFallback>
                        <AvatarImage src={p.avatar} />
                      </Avatar>
                      {peopleIds.includes(p.id) && (
                        <div className="bg-accent-primary absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white shadow-sm">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={cn(
                          'truncate text-xs font-black uppercase',
                          peopleIds.includes(p.id) ? 'text-accent-primary' : 'text-text-primary'
                        )}
                      >
                        {p.name}
                      </p>
                      <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
                        {p.role}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-10 gap-3">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-text-muted h-12 rounded-2xl px-8 text-[10px] font-black uppercase tracking-widest"
          >
            Отмена
          </Button>
          <Button
            disabled={chatIds.length === 0 && peopleIds.length === 0}
            onClick={submit}
            className="bg-text-primary disabled:bg-bg-surface2 disabled:text-text-muted h-12 rounded-2xl px-10 text-[10px] font-black uppercase tracking-[0.2rem] text-white shadow-md shadow-xl hover:bg-black disabled:shadow-none"
          >
            ОТПРАВИТЬ ({chatIds.length + peopleIds.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
