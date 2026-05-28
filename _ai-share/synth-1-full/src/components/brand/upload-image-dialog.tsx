'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Loader2, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function UploadImageDialog({
  open,
  onOpenChange,
  onSave,
  title,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (dataUri: string, altText: string) => void;
  title: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [altText, setAltText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (preview) {
      onSave(preview, altText);
      onOpenChange(false);
      setPreview(null);
      setAltText('');
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setPreview(null);
    setAltText('');
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {preview ? (
            <div className="space-y-4">
              <div className="relative aspect-square w-full rounded-md border">
                <Image src={preview} alt="Предпросмотр" fill className="object-contain" />
              </div>
              <div>
                <Label htmlFor="alt-text">Alt-текст (для SEO)</Label>
                <Input
                  id="alt-text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Напр., 'черный кашемировый свитер вид спереди'"
                />
              </div>
            </div>
          ) : (
            <div
              className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed hover:bg-muted"
              onClick={triggerFileSelect}
            >
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <UploadCloud className="mb-2 h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Нажмите, чтобы выбрать файл</p>
                </>
              )}
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,video/*,.glb,.usdz"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={!preview || isLoading}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
