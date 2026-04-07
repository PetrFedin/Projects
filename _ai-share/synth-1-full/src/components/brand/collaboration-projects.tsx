'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Handshake, Users, Shield, Plus, Loader2 } from 'lucide-react';
import { fastApiService } from '@/lib/fastapi-service';
import { useToast } from '@/hooks/use-toast';

export default function CollaborationProjects({ brandId }: { brandId: string }) {
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        async function loadProjects() {
            try {
                const data = await fastApiService.getCollaborationProjects(brandId);
                setProjects(data);
            } catch (error) {
                console.error("Failed to load collaboration projects:", error);
                // Fallback to empty list or mock if needed
                setProjects([]);
            } finally {
                setIsLoading(false);
            }
        }
        loadProjects();
    }, [brandId]);

    const handleCreateProject = async () => {
        try {
            const newProject = await fastApiService.createCollaborationProject({
                owner_brand_id: brandId,
                partner_brand_id: "PARTNER-BRAND", // Example
                project_name: "Новая Коллаборация " + (projects.length + 1),
                description: "AI-проектирование совместной коллекции",
                status: "active"
            });
            setProjects([...projects, newProject]);
            toast({ title: "Проект создан", description: "Коллаборация успешно инициализирована." });
        } catch (error) {
            toast({ variant: "destructive", title: "Ошибка", description: "Не удалось создать проект." });
        }
    };

    return (
        <Card className="rounded-xl border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="uppercase tracking-tight flex items-center gap-2">
                        <Handshake className="h-5 w-5 text-indigo-600" /> Активные Коллаборации
                    </CardTitle>
                    <CardDescription>Управление совместными проектами и доступом к ресурсам.</CardDescription>
                </div>
                <Button onClick={handleCreateProject} size="sm" className="rounded-xl bg-slate-900 text-white font-bold uppercase text-[10px] tracking-widest">
                    <Plus className="h-4 w-4 mr-1" /> Создать
                </Button>
            </CardHeader>
            <CardContent className="pt-6">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                    </div>
                ) : projects.length > 0 ? (
                    <div className="space-y-4">
                        {projects.map((project) => (
                            <div key={project.id} className="p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm uppercase text-slate-900 tracking-tight">{project.project_name}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Партнер: {project.partner_brand_id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-bold uppercase tracking-widest">
                                        {project.status}
                                    </Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100">
                                        <Shield className="h-4 w-4 text-slate-400" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-xl">
                        <p className="text-sm font-bold uppercase tracking-tight text-slate-400">Нет активных проектов коллабораций.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
