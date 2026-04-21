'use client';
import { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Combobox } from '@/components/ui/combobox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

const teamMembers = [
  { value: 'igor', label: 'Игорь (Дизайнер)', avatar: 'https://picsum.photos/seed/team1/40/40' },
  {
    value: 'marina',
    label: 'Марина (Конструктор)',
    avatar: 'https://picsum.photos/seed/team2/40/40',
  },
  {
    value: 'svetlana',
    label: 'Светлана (Маркетолог)',
    avatar: 'https://picsum.photos/seed/marketing-team/40/40',
  },
];

const partners = [
  {
    value: 'podium',
    label: 'Podium (Москва)',
    avatar: 'https://picsum.photos/seed/podium-logo/40/40',
  },
  { value: 'tsum', label: 'ЦУМ (Москва)', avatar: 'https://i.imgur.com/JMgcWwL.png' },
];

export function CreateChatDialog({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleCreateChat = () => {
    toast({ title: 'Чат создан (симуляция)' });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Создать новый чат</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="team">
          {/* cabinetSurface v1 */}
          <TabsList className={cn(cabinetSurface.tabsList, 'w-full')}>
            <TabsTrigger
              value="team"
              className={cn(
                cabinetSurface.tabsTrigger,
                'h-9 flex-1 gap-2 text-sm font-medium normal-case tracking-normal'
              )}
            >
              <Users className="h-4 w-4 shrink-0" />С командой
            </TabsTrigger>
            <TabsTrigger
              value="partner"
              className={cn(
                cabinetSurface.tabsTrigger,
                'h-9 flex-1 gap-2 text-sm font-medium normal-case tracking-normal'
              )}
            >
              <Store className="h-4 w-4 shrink-0" />С партнером
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="team"
            className={cn(cabinetSurface.cabinetProfileTabPanel, 'py-4')}
          >
            <DialogDescription>
              Создайте приватный групповой чат для обсуждения рабочих вопросов с коллегами.
            </DialogDescription>
            <div className="space-y-2">
              <Label htmlFor="group-name">Название группового чата</Label>
              <Input
                id="group-name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Напр., 'Обсуждение коллекции FW25'"
              />
            </div>
            <div className="space-y-2">
              <Label>Участники</Label>
              <Combobox
                options={teamMembers}
                multiple
                value={selectedMembers}
                onChange={(v) => setSelectedMembers(v as string[])}
                placeholder="Выберите участников..."
              />
            </div>
            <Button
              className="w-full"
              onClick={handleCreateChat}
              disabled={!groupName || selectedMembers.length === 0}
            >
              Создать групповой чат
            </Button>
          </TabsContent>
          <TabsContent
            value="partner"
            className={cn(cabinetSurface.cabinetProfileTabPanel, 'py-4')}
          >
            <DialogDescription>
              Найдите существующего партнера или клиента для начала диалога.
            </DialogDescription>
            <div className="space-y-2">
              <Label>Найти партнера или клиента</Label>
              <Input placeholder="Введите имя или название компании..." />
            </div>
            <ScrollArea className="h-48 rounded-md border">
              <div className="space-y-1 p-2">
                {partners.map((p) => (
                  <button
                    key={p.value}
                    className="flex w-full items-center rounded-md p-2 text-sm hover:bg-muted"
                    onClick={handleCreateChat}
                  >
                    <Avatar className="mr-2 h-8 w-8">
                      <AvatarImage src={p.avatar} />
                    </Avatar>
                    {p.label}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
