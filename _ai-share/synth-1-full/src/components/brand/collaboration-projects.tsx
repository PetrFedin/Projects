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
        console.error('Failed to load collaboration projects:', error);
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
        partner_brand_id: 'PARTNER-BRAND', // Example
        project_name: 'Новая Коллаборация ' + (projects.length + 1),
        description: 'AI-проектирование совместной коллекции',
        status: 'active',
      });
      setProjects([...projects, newProject]);
      toast({ title: 'Проект создан', description: 'Коллаборация успешно инициализирована.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось создать проект.' });
    }
  };

  return (
    <Card className="overflow-hidden rounded-xl border-slate-100 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50">
        <div>
          <CardTitle className="flex items-center gap-2 uppercase tracking-tight">
            <Handshake className="h-5 w-5 text-indigo-600" /> Активные Коллаборации
          </CardTitle>
          <CardDescription>Управление совместными проектами и доступом к ресурсам.</CardDescription>
        </div>
        <Button
          onClick={handleCreateProject}
          size="sm"
          className="rounded-xl bg-slate-900 text-[10px] font-bold uppercase tracking-widest text-white"
        >
          <Plus className="mr-1 h-4 w-4" /> Создать
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
              <div
                key={project.id}
                className="group flex items-center justify-between rounded-2xl border border-slate-100 p-4 transition-all hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-tight text-slate-900">
                      {project.project_name}
                    </h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Партнер: {project.partner_brand_id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="border-none bg-emerald-50 text-[8px] font-bold uppercase tracking-widest text-emerald-600">
                    {project.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100"
                  >
                    <Shield className="h-4 w-4 text-slate-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-slate-100 py-12 text-center">
            <p className="text-sm font-bold uppercase tracking-tight text-slate-400">
              Нет активных проектов коллабораций.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
