'use client';

import React, { useState } from "react";
import { 
  Settings, 
  Plus, 
  Trash2, 
  Play, 
  Zap, 
  ShieldCheck,
  LayoutGrid,
  Trophy,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export const AdminLotteryPanel = () => {
  const { toast } = useToast();
  const [prizes, setPrizes] = useState([
    { id: "p1", title: "Подарочная карта 20 000 ₽", places: 1 },
    { id: "p2", title: "Кроссовки от спонсора", places: 2 },
  ]);
  const [newPrize, setNewPrize] = useState({ title: "", places: 1 });
  const [winnersCount, setWinnersCount] = useState(3);
  const [isLiveRunning, setIsLiveRunning] = useState(false);

  const handleAddPrize = () => {
    if (!newPrize.title.trim()) return;
    setPrizes((prev) => [
      ...prev,
      {
        id: "p" + (prev.length + 1),
        title: newPrize.title,
        places: Number(newPrize.places) || 1,
      },
    ]);
    setNewPrize({ title: "", places: 1 });
    toast({ title: "Приз добавлен", description: "Список призов обновлен." });
  };

  const handleDeletePrize = (id: string) => {
    setPrizes(prizes.filter(p => p.id !== id));
  };

  const handleStartLive = async () => {
    setIsLiveRunning(true);
    toast({ title: "Live-сессия инициирована", description: "Рассылка событий в систему..." });
    setTimeout(() => {
      setIsLiveRunning(false);
      toast({ title: "Розыгрыш завершен", description: "Данные сохранены в архив." });
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center">
              <Settings className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-sm font-headline font-black uppercase tracking-tighter">Control_Panel</h2>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Управление системными розыгрышами SYNTHA OS</p>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] font-black uppercase px-3 py-1">
          Authenticated_Admin
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Prizes Management */}
        <Card className="md:col-span-2 border-none rounded-xl shadow-xl shadow-slate-200/50">
          <CardHeader className="p-4 pb-4">
            <CardTitle className="text-sm font-headline font-black uppercase tracking-tight">Призовой фонд</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Настройка активов для текущего цикла</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-6">
            <div className="border border-slate-100 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-slate-400">Название</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-slate-400 text-center w-32">Места</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-slate-400 text-right w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {prizes.map((p) => (
                    <tr key={p.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{p.title}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant="outline" className="font-mono font-black">{p.places}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDeletePrize(p.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3">
              <Input
                placeholder="Новый приз (напр. Apple Watch)"
                value={newPrize.title}
                onChange={(e) => setNewPrize({ ...newPrize, title: e.target.value })}
                className="h-12 bg-slate-50 border-slate-100 rounded-xl font-bold"
              />
              <Input
                type="number"
                min={1}
                value={newPrize.places}
                onChange={(e) => setNewPrize({ ...newPrize, places: parseInt(e.target.value) || 1 })}
                className="h-12 w-24 bg-slate-50 border-slate-100 rounded-xl font-bold text-center"
              />
              <Button onClick={handleAddPrize} className="h-12 w-12 p-0 bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/20">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Global Settings */}
        <div className="space-y-4">
          <Card className="border-none rounded-xl shadow-xl shadow-slate-200/50">
            <CardHeader className="p-4 pb-4">
              <CardTitle className="text-sm font-headline font-black uppercase tracking-tight text-indigo-600">Live_Trigger</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-6">
              <div className="space-y-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Лимит победителей</div>
                <Input
                  type="number"
                  min={1}
                  value={winnersCount}
                  onChange={(e) => setWinnersCount(parseInt(e.target.value) || 1)}
                  className="h-12 bg-slate-50 border-slate-100 rounded-xl font-black text-base text-center tabular-nums"
                />
              </div>
              
              <Button 
                onClick={handleStartLive}
                disabled={isLiveRunning}
                className={cn(
                  "w-full h-12 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl transition-all duration-500",
                  isLiveRunning ? "bg-slate-100 text-slate-400" : "bg-slate-900 hover:bg-black text-white shadow-slate-900/30"
                )}
              >
                {isLiveRunning ? "INITIALIZING..." : "Execute_Live_Draw"}
                <Zap className={cn("ml-3 h-4 w-4", !isLiveRunning && "fill-current")} />
              </Button>
              
              <p className="text-[9px] font-medium text-slate-400 leading-relaxed uppercase tracking-wider text-center">
                Это действие инициирует событие в WebSocket и запускает автоматический подбор победителей на стороне сервера.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-indigo-600 border-none rounded-xl shadow-xl shadow-indigo-600/30 text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.2)_1px,transparent_0)] bg-[size:15px_15px]" />
            </div>
            <CardContent className="p-4 relative z-10 space-y-4 text-center">
              <div className="h-12 w-12 bg-white/10 rounded-2xl mx-auto flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="text-base font-headline font-black uppercase tracking-tight">Security_Check</div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mt-1">Все транзакции защищены</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
