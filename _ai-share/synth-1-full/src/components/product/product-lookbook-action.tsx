'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { loadLookbookProjects, addSkuToProject } from '@/lib/fashion/lookbook-logic';
import { FolderPlus, Check, Folder } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Props = { product: Product };

export function ProductLookbookAction({ product }: Props) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<ReturnType<typeof loadLookbookProjects>>([]);

  useEffect(() => {
    setProjects(loadLookbookProjects());
  }, [open]);

  const handleAdd = (projectId: string, title: string) => {
    addSkuToProject(projectId, product.sku);
    setOpen(false);
    toast({
      title: 'Добавлено в проект',
      description: `Артикул ${product.sku} добавлен в лукбук «${title}».`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full gap-2 text-xs border-violet-300 text-violet-700 hover:bg-violet-50">
          <FolderPlus className="h-3.5 w-3.5" />
          В проект лукбука
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Выберите проект</DialogTitle>
          <DialogDescription>
            Добавьте товар в текущую подборку для планирования коллекции или съемки.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          {projects.map(p => {
            const isAdded = p.skus.includes(product.sku);
            return (
              <Button
                key={p.id}
                variant="ghost"
                className={`justify-between h-auto py-3 px-4 border ${isAdded ? 'bg-violet-50 border-violet-200' : ''}`}
                onClick={() => !isAdded && handleAdd(p.id, p.title)}
                disabled={isAdded}
              >
                <div className="text-left">
                  <p className="font-medium text-sm">{p.title}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">{p.status} • {p.skus.length} SKU</p>
                </div>
                {isAdded ? <Check className="h-4 w-4 text-violet-600" /> : <Folder className="h-4 w-4 text-muted-foreground" />}
              </Button>
            );
          })}
        </div>
        <DialogFooter>
          <Button variant="secondary" size="sm" className="w-full" onClick={() => setOpen(false)}>
            Создать новый проект...
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
