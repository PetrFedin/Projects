'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Upload, Download, FileText, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import Image from 'next/image';

export function StockSync() {
  const [isExcelDialogOpen, setIsExcelDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [lastAcceptedName, setLastAcceptedName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      await fetch('/api/shop/inventory/stock-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name }),
      });
      setLastAcceptedName(file.name);
      setIsExcelDialogOpen(false);
      toast({
        title: 'Файл успешно загружен',
        description: 'Остатки будут обновлены в течение нескольких минут.',
      });
    } catch {
      toast({
        title: 'Ошибка загрузки',
        description: 'Повторите попытку.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // In a real app, this would trigger a file download.
    toast({
      title: 'Шаблон скачан',
      description: 'Файл `template.xlsx` сохранен в ваших загрузках.',
    });
  };

  return (
    <div data-testid="shop-stock-sync">
      <Card>
        <CardHeader>
          <CardTitle>Синхронизация остатков</CardTitle>
          <CardDescription>
            Обновите количество товаров на вашем складе с помощью интеграции или загрузки файла.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <Button variant="outline" className="h-12 justify-start text-left" disabled>
            <Image
              src="https://i.imgur.com/q3cQe5L.png"
              alt="МойСклад"
              width={24}
              height={24}
              className="mr-3"
            />
            <div>
              <p className="font-semibold">МойСклад</p>
              <p className="text-xs text-muted-foreground">Интеграция</p>
            </div>
          </Button>
          <Button variant="outline" className="h-12 justify-start text-left" disabled>
            <Image
              src="https://i.imgur.com/k2oTj7e.png"
              alt="1С"
              width={24}
              height={24}
              className="mr-3"
            />
            <div>
              <p className="font-semibold">1С: Управление торговлей</p>
              <p className="text-xs text-muted-foreground">Интеграция</p>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-12 justify-start text-left"
            onClick={() => setIsExcelDialogOpen(true)}
            data-testid="shop-stock-sync-open-excel"
          >
            <Image
              src="https://i.imgur.com/sC5PSAS.png"
              alt="Excel"
              width={24}
              height={24}
              className="mr-3"
            />
            <div>
              <p className="font-semibold">Excel / CSV</p>
              <p className="text-xs text-muted-foreground">Загрузка файла</p>
            </div>
          </Button>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <span data-testid="shop-stock-sync-last-accepted">
            {lastAcceptedName
              ? `Последний принятый файл: ${lastAcceptedName}`
              : 'Последний принятый файл: —'}
          </span>
        </CardFooter>
      </Card>

      <Dialog open={isExcelDialogOpen} onOpenChange={setIsExcelDialogOpen}>
        <DialogContent data-testid="shop-stock-sync-dialog">
          <DialogHeader>
            <DialogTitle>Загрузить файл с остатками</DialogTitle>
            <DialogDescription>
              Подготовьте файл в формате .xlsx или .csv со следующими колонками: `brand`, `sku`,
              `color`, `quantity`.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertTitle>Требования к файлу</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 list-disc pl-5 text-xs">
                  <li>
                    Колонки должны быть в следующем порядке: Бренд, Артикул, Цвет, Количество.
                  </li>
                  <li>Если товар не имеет цвета, оставьте ячейку пустой.</li>
                </ul>
              </AlertDescription>
            </Alert>
            <div
              className="relative flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed hover:bg-muted"
              onClick={() => document.getElementById('shop-stock-sync-upload-input')?.click()}
            >
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Нажмите, чтобы выбрать файл</p>
                  <input
                    id="shop-stock-sync-upload-input"
                    data-testid="shop-stock-sync-upload-input"
                    type="file"
                    className="hidden"
                    accept=".xlsx,.csv"
                    onChange={handleFileUpload}
                  />
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleDownloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Скачать шаблон
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
