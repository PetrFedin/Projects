
'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Combobox } from '@/components/ui/combobox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Store } from 'lucide-react';


const teamMembers = [
    { value: 'igor', label: 'Игорь (Дизайнер)', avatar: 'https://picsum.photos/seed/team1/40/40' },
    { value: 'marina', label: 'Марина (Конструктор)', avatar: 'https://picsum.photos/seed/team2/40/40' },
    { value: 'svetlana', label: 'Светлана (Маркетолог)', avatar: 'https://picsum.photos/seed/marketing-team/40/40' },
];

const partners = [
    { value: 'podium', label: 'Podium (Москва)', avatar: 'https://picsum.photos/seed/podium-logo/40/40' },
    { value: 'tsum', label: 'ЦУМ (Москва)', avatar: 'https://i.imgur.com/JMgcWwL.png' },
];


export function CreateChatDialog({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) {
    const { toast } = useToast();
    const [groupName, setGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    const handleCreateChat = () => {
        toast({ title: 'Чат создан (симуляция)' });
        onOpenChange(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Создать новый чат</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="team">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="team"><Users className="mr-2 h-4 w-4" />С командой</TabsTrigger>
                        <TabsTrigger value="partner"><Store className="mr-2 h-4 w-4" />С партнером</TabsTrigger>
                    </TabsList>
                    <TabsContent value="team" className="py-4 space-y-4">
                        <DialogDescription>
                            Создайте приватный групповой чат для обсуждения рабочих вопросов с коллегами.
                        </DialogDescription>
                        <div className="space-y-2">
                            <Label htmlFor="group-name">Название группового чата</Label>
                            <Input id="group-name" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Напр., 'Обсуждение коллекции FW25'" />
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
                         <Button className="w-full" onClick={handleCreateChat} disabled={!groupName || selectedMembers.length === 0}>Создать групповой чат</Button>
                    </TabsContent>
                    <TabsContent value="partner" className="py-4 space-y-4">
                         <DialogDescription>
                            Найдите существующего партнера или клиента для начала диалога.
                        </DialogDescription>
                         <div className="space-y-2">
                            <Label>Найти партнера или клиента</Label>
                            <Input placeholder="Введите имя или название компании..." />
                        </div>
                         <ScrollArea className="h-48 border rounded-md">
                           <div className="p-2 space-y-1">
                            {partners.map(p => (
                                <button key={p.value} className="flex items-center w-full p-2 text-sm rounded-md hover:bg-muted" onClick={handleCreateChat}>
                                    <Avatar className="h-8 w-8 mr-2"><AvatarImage src={p.avatar} /></Avatar>
                                    {p.label}
                                </button>
                            ))}
                           </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
