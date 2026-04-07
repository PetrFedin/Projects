import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
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
  onForward
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
    return base.filter((c) => c.title.toLowerCase().includes(qq) || (c.subtitle ?? '').toLowerCase().includes(qq));
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
      <DialogContent className="max-w-2xl bg-white rounded-xl border-none shadow-2xl p-3">
        <DialogHeader className="space-y-3 mb-6">
          <DialogTitle className="text-base font-black tracking-tighter text-slate-800 uppercase">Переслать</DialogTitle>
          <DialogDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Выберите получателей контента</DialogDescription>
        </DialogHeader>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск контактов и групп…" className="bg-slate-50 border-none rounded-2xl h-10 pl-12 font-bold text-sm" />
        </div>

        <ScrollArea className="h-[400px] -mx-2 px-2">
          <div className="space-y-4">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Активные диалоги</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredChats.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setChatIds((p) => toggle(p, c.id))}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-3xl border transition-all text-left group",
                      chatIds.includes(c.id) ? "bg-blue-50 border-blue-200 shadow-sm" : "bg-slate-50 border-slate-100 hover:border-slate-200"
                    )}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarFallback className="text-[10px] font-black bg-slate-100 text-slate-400">{c.title[0]}</AvatarFallback>
                        <AvatarImage src={typeof c.avatar === 'string' ? c.avatar : undefined} />
                      </Avatar>
                      {chatIds.includes(c.id) && (
                        <div className="absolute -top-1 -right-1 h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className={cn("text-xs font-black uppercase truncate", chatIds.includes(c.id) ? "text-blue-700" : "text-slate-800")}>{c.title}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{c.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Контакты</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredPeople.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPeopleIds((prev) => toggle(prev, p.id))}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-3xl border transition-all text-left group",
                      peopleIds.includes(p.id) ? "bg-indigo-50 border-indigo-200 shadow-sm" : "bg-slate-50 border-slate-100 hover:border-slate-200"
                    )}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarFallback className="text-[10px] font-black">{p.name[0]}</AvatarFallback>
                        <AvatarImage src={p.avatar} />
                      </Avatar>
                      {peopleIds.includes(p.id) && (
                        <div className="absolute -top-1 -right-1 h-5 w-5 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className={cn("text-xs font-black uppercase truncate", peopleIds.includes(p.id) ? "text-indigo-700" : "text-slate-800")}>{p.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{p.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-10 gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-12 px-8 font-black text-[10px] uppercase text-slate-400 tracking-widest">
            Отмена
          </Button>
          <Button
            disabled={chatIds.length === 0 && peopleIds.length === 0}
            onClick={submit}
            className="bg-slate-900 hover:bg-black text-white rounded-2xl h-12 px-10 font-black text-[10px] uppercase tracking-[0.2rem] shadow-xl shadow-slate-100 disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none"
          >
            ОТПРАВИТЬ ({chatIds.length + peopleIds.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
