
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, MoreHorizontal, PlusCircle, Search } from "lucide-react";
import Image from "next/image";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";


const mockUsers = [
  { id: '1', name: 'Анна Новикова', email: 'anna.novikova@example.com', role: 'client', status: 'Активен', lastActivity: '2 часа назад', avatar: 'https://picsum.photos/seed/user1/40/40' },
  { id: '2', name: 'Syntha HQ', email: 'admin@syntha.com', role: 'admin', status: 'Активен', lastActivity: '15 минут назад', avatar: 'https://picsum.photos/seed/syntha-logo/40/40' },
  { id: '3', name: 'Podium Store', email: 'contact@podium.store', role: 'shop', status: 'Активен', lastActivity: '1 день назад', avatar: 'https://picsum.photos/seed/podium-logo/40/40' },
  { id: '4', name: 'Иван Петров', email: 'ivan.petrov@example.com', role: 'client', status: 'Заблокирован', lastActivity: '3 недели назад', avatar: 'https://picsum.photos/seed/user2/40/40' },
  { id: '5', name: 'ModaTech Factory', email: 'orders@modatech.pro', role: 'manufacturer', status: 'Активен', lastActivity: '10 минут назад', avatar: 'https://picsum.photos/seed/factory1/40/40' },
  { id: '6', name: 'Hub-Central Dist', email: 'logistics@hub.com', role: 'distributor', status: 'Активен', lastActivity: '5 часов назад', avatar: 'https://picsum.photos/seed/dist1/40/40' },
];

const roleConfig = {
    admin: { label: 'Админ HQ', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    brand: { label: 'Бренд', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    manufacturer: { label: 'Производство', color: 'bg-orange-50 text-orange-600 border-orange-100' },
    supplier: { label: 'Поставщик', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    distributor: { label: 'Дистрибьютор', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    shop: { label: 'Магазин', color: 'bg-rose-50 text-rose-600 border-rose-100' },
    client: { label: 'Клиент', color: 'bg-slate-50 text-slate-600 border-slate-100' },
};

export default function UsersPage() {

    const getStatusVariant = (status: string) => {
        switch(status) {
            case 'Активен': return 'outline';
            case 'Заблокирован': return 'destructive';
            default: return 'secondary';
        }
    }

    return (
        <div className="container mx-auto px-4 py-4 space-y-4 max-w-5xl animate-in fade-in duration-700 pb-24">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        <span>Admin</span>
                        <ChevronRight className="h-2 w-2" />
                        <span className="text-slate-300">Identity Registry</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-base font-bold font-headline tracking-tighter uppercase text-slate-900 leading-none">Network Participants</h1>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold text-[7px] px-1.5 h-4 gap-1 tracking-widest shadow-sm transition-all uppercase">
                           <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Nodes: 124,103
                        </Badge>
                    </div>
                </div>
                <Button className="h-8 px-4 rounded-lg bg-slate-900 text-white text-[9px] font-bold uppercase gap-1.5 hover:bg-indigo-600 transition-all shadow-lg border border-slate-900 tracking-widest">
                    <PlusCircle className="h-3.5 w-3.5" /> Provision User
                </Button>
            </div>

             <div className="space-y-4">
                {/* Toolbar */}
                <div className="bg-slate-100 p-1 flex items-center justify-between rounded-xl border border-slate-200 shadow-inner">
                    <div className="flex items-center gap-1.5 px-1 shrink-0">
                        <div className="relative group">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <Input placeholder="Filter by Identity..." className="h-7 pl-8 w-32 md:w-64 bg-white border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-tight shadow-sm focus:ring-1 focus:ring-indigo-500" />
                        </div>
                    </div>
                </div>

                <Card className="border border-slate-100 rounded-xl bg-white overflow-hidden shadow-sm hover:border-indigo-100/50 transition-all">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                                <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10 px-4">Identity / Metadata</TableHead>
                                <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10">System Role</TableHead>
                                <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10">Pulse Index</TableHead>
                                <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10">Status</TableHead>
                                <TableHead className="text-right text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10 px-4 w-24">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-slate-50">
                            {mockUsers.map(user => {
                                const role = roleConfig[user.role as keyof typeof roleConfig] || roleConfig.client;
                                return (
                                <TableRow key={user.id} className="hover:bg-slate-50/50 transition-all group h-12">
                                    <TableCell className="px-4">
                                        <div className="flex items-center gap-3">
                                             <Avatar className="h-7 w-7 border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback className="text-[10px] font-bold">{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[11px] font-bold uppercase tracking-tight text-slate-900 leading-none mb-1 truncate">{user.name}</span>
                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest opacity-60 truncate">{user.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn("text-[7px] font-bold uppercase px-1.5 h-3.5 rounded shadow-sm tracking-widest border transition-all", role.color)}>
                                            {role.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tabular-nums tracking-tight">{user.lastActivity}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(
                                            "text-[7px] font-bold uppercase px-1.5 h-3.5 rounded shadow-sm tracking-widest border transition-all",
                                            user.status === 'Активен' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                        )}>
                                            {user.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right px-4">
                                         <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-slate-400 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all">
                                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="text-[10px] font-bold uppercase tracking-widest min-w-[140px]">
                                                {user.role === 'client' && (
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/customer-360" className="flex items-center gap-2">Identity 360°</Link>
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem className="gap-2">Edit Entity</DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2">Shift Role</DropdownMenuItem>
                                                <DropdownMenuItem className="text-rose-600 focus:text-rose-600 gap-2">Deactivate</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                    <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest opacity-60">Displaying {mockUsers.length} active nodes</span>
                        <div className="flex gap-1">
                            <button className="h-6 px-2.5 bg-white border border-slate-200 rounded-md text-[8px] font-bold uppercase tracking-widest text-slate-400 hover:bg-slate-50 shadow-sm transition-all disabled:opacity-50" disabled>PREV</button>
                            <button className="h-6 px-2.5 bg-white border border-slate-200 rounded-md text-[8px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 shadow-sm transition-all">NEXT</button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
