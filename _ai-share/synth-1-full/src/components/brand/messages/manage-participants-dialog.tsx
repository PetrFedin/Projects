'use client';
import { useState, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trash2 } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';


const teamMembers = [
    { value: 'igor', label: 'Игорь (Дизайнер)', avatar: 'https://picsum.photos/seed/team1/40/40' },
    { value: 'marina', label: 'Марина (Конструктор)', avatar: 'https://picsum.photos/seed/team2/40/40' },
    { value: 'svetlana', label: 'Светлана (Маркетолог)', avatar: 'https://picsum.photos/seed/marketing-team/40/40' },
];

export function ManageParticipantsDialog({ conversation, isOpen, onOpenChange, onParticipantsChange }: { conversation: any, isOpen: boolean; onOpenChange: (open: boolean) => void, onParticipantsChange: (systemMessage: string) => void }) {
    const { toast } = useToast();
    const [participants, setParticipants] = useState(conversation.participants || []);
    const [newMember, setNewMember] = useState<string | undefined>(undefined);
    
    useEffect(() => {
        setParticipants(conversation.participants || []);
    }, [conversation]);

    const handleRemoveParticipant = (name: string) => {
        setParticipants(participants.filter((p: any) => p.name !== name));
    }
    
    const handleAddParticipant = () => {
        const memberToAdd = teamMembers.find(m => m.value === newMember);
        if(memberToAdd && !participants.some((p: any) => p.name === memberToAdd.label)) {
            setParticipants([...participants, {name: memberToAdd.label}]);
            setNewMember(undefined);
        }
    }

    const handleSaveChanges = () => {
        const initialParticipantNames = new Set((conversation.participants || []).map((p: any) => p.name));
        const finalParticipantNames = new Set(participants.map((p: any) => p.name));

        const added = participants.filter((p: any) => !initialParticipantNames.has(p.name));
        const removed = (conversation.participants || []).filter((p: any) => !finalParticipantNames.has(p.name));

        if(added.length > 0) {
            onParticipantsChange(`Вы добавили пользователя ${added.map((p:any) => `"${p.name}"`).join(', ')}.`);
        }
        if(removed.length > 0) {
            onParticipantsChange(`Вы удалили пользователя ${removed.map((p:any) => `"${p.name}"`).join(', ')}.`);
        }

        toast({ title: 'Состав чата обновлен' });
        onOpenChange(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Участники чата: "{conversation.name}"</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        {participants.map((p: any) => (
                            <div key={p.name} className="flex items-center justify-between p-2 border rounded-md">
                                <p className="font-medium">{p.name}</p>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveParticipant(p.name)}>
                                    <Trash2 className="h-4 w-4 text-destructive"/>
                                </Button>
                            </div>
                        ))}
                    </div>
                     <div className="space-y-2">
                        <Label>Добавить участника</Label>
                        <div className="flex gap-2">
                             <Combobox 
                                options={teamMembers}
                                value={newMember}
                                onChange={(v) => setNewMember(v as string)}
                                placeholder="Выберите участника..."
                                className="flex-1"
                            />
                            <Button onClick={handleAddParticipant} disabled={!newMember}>Добавить</Button>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
                    <Button onClick={handleSaveChanges}>Сохранить</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
