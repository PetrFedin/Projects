'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MoreHorizontal, Mail, Phone, Send, MessageCircle, Instagram, Globe, TrendingUp, TrendingDown, Clock, Check, Share2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import type { TeamMember } from '@/lib/types';

interface TeamTableProps {
  members: TeamMember[];
  currentViewerId?: string;
  onEdit: (member: TeamMember) => void;
  onArchive: (id: string, archive: boolean) => void;
}

export function TeamTable({ members, currentViewerId, onEdit, onArchive }: TeamTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-slate-50 hover:bg-transparent h-12">
          <TableHead className="pl-10 text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">Сотрудник</TableHead>
          <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">Должность</TableHead>
          <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">Контакты</TableHead>
          <TableHead className="text-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">Активность</TableHead>
          <TableHead className="pr-10 text-right text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">Управление</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <AnimatePresence mode="popLayout">
          {members.map(member => (
            <motion.tr key={member.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
              <TableCell className="pl-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-11 rounded-2xl border-2 shadow-md">
                      <AvatarImage src={member.avatar} className="object-cover" />
                      <AvatarFallback>{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <div className={cn("absolute -bottom-1 -right-1 h-4 w-4 border-4 border-white rounded-full", member.isOnline ? "bg-green-500 animate-pulse" : "bg-rose-500")} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-slate-900 text-sm uppercase">{member.firstName} {member.lastName}</span>
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">@{member.nickname}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-slate-900 uppercase">{member.role}</span>
                  <span className="text-[8px] font-bold text-indigo-500 uppercase">{member.department}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-slate-600"><Mail className="h-3 w-3" /><span className="text-xs">{member.email}</span></div>
                  {member.phone && <div className="flex items-center gap-2 text-slate-400"><Phone className="h-3 w-3" /><span className="text-xs">{member.phone}</span></div>}
                </div>
              </TableCell>
              <TableCell className="text-center">
                {member.privacySettings?.showActivity !== false || currentViewerId === member.id ? (
                  <Badge variant="outline" className="text-[8px] uppercase">{member.isOnline ? 'Онлайн' : 'Оффлайн'}</Badge>
                ) : (
                  <div className="flex items-center justify-center gap-1 opacity-30">
                    <EyeOff className="h-3 w-3" />
                    <span className="text-[7px] font-black uppercase">Private</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="pr-10 text-right">
                <Button variant="ghost" size="icon" onClick={() => onEdit(member)}><MoreHorizontal className="h-4 w-4" /></Button>
              </TableCell>
            </motion.tr>
          ))}
        </AnimatePresence>
      </TableBody>
    </Table>
  );
}
