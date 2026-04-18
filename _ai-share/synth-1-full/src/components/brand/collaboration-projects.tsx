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
    <Card className="border-border-subtle overflow-hidden rounded-xl shadow-sm">
      <CardHeader className="bg-bg-surface2/80 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 uppercase tracking-tight">
            <Handshake className="text-accent-primary h-5 w-5" /> Активные Коллаборации
          </CardTitle>
          <CardDescription>Управление совместными проектами и доступом к ресурсам.</CardDescription>
        </div>
        <Button
          onClick={handleCreateProject}
          size="sm"
          className="bg-text-primary rounded-xl text-[10px] font-bold uppercase tracking-widest text-white"
        >
          <Plus className="mr-1 h-4 w-4" /> Создать
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="text-text-muted h-8 w-8 animate-spin" />
          </div>
        ) : projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border-border-subtle hover:bg-bg-surface2 group flex items-center justify-between rounded-2xl border p-4 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-accent-primary/10 text-accent-primary flex h-10 w-10 items-center justify-center rounded-full">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-text-primary text-sm font-bold uppercase tracking-tight">
                      {project.project_name}
                    </h4>
                    <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
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
                    <Shield className="text-text-muted h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-border-subtle rounded-xl border-2 border-dashed py-12 text-center">
            <p className="text-text-muted text-sm font-bold uppercase tracking-tight">
              Нет активных проектов коллабораций.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
