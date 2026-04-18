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
  DialogFooter,
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
        <Button
          variant="outline"
          size="sm"
<<<<<<< HEAD
          className="w-full gap-2 border-violet-300 text-xs text-violet-700 hover:bg-violet-50"
=======
          className="border-accent-primary/30 text-accent-primary hover:bg-accent-primary/10 w-full gap-2 text-xs"
>>>>>>> recover/cabinet-wip-from-stash
        >
          <FolderPlus className="h-3.5 w-3.5" />В проект лукбука
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
          {projects.map((p) => {
            const isAdded = p.skus.includes(product.sku);
            return (
              <Button
                key={p.id}
                variant="ghost"
<<<<<<< HEAD
                className={`h-auto justify-between border px-4 py-3 ${isAdded ? 'border-violet-200 bg-violet-50' : ''}`}
=======
                className={`h-auto justify-between border px-4 py-3 ${isAdded ? 'bg-accent-primary/10 border-accent-primary/25' : ''}`}
>>>>>>> recover/cabinet-wip-from-stash
                onClick={() => !isAdded && handleAdd(p.id, p.title)}
                disabled={isAdded}
              >
                <div className="text-left">
                  <p className="text-sm font-medium">{p.title}</p>
                  <p className="text-[10px] uppercase text-muted-foreground">
                    {p.status} • {p.skus.length} SKU
                  </p>
                </div>
                {isAdded ? (
<<<<<<< HEAD
                  <Check className="h-4 w-4 text-violet-600" />
=======
                  <Check className="text-accent-primary h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
                ) : (
                  <Folder className="h-4 w-4 text-muted-foreground" />
                )}
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
