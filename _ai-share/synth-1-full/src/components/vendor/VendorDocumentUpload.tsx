'use client';

import React, { useState } from 'react';
import { Upload, File, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function VendorDocumentUpload() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; date: string }[]>([]);

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      setUploadedFiles((prev) => [
        { name: `certificate_${Date.now()}.pdf`, date: new Date().toISOString() },
        ...prev,
      ]);
      toast({
        title: 'Успешно',
        description: 'Документ загружен и отправлен на проверку.',
      });
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Загрузка документов</CardTitle>
        <CardDescription className="text-xs">
          Загрузите сертификаты (ISO, OEKO-TEX) или результаты аудита.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-border-default rounded-lg p-6 flex flex-col items-center justify-center text-center bg-bg-surface2/30">
          <Upload className="w-8 h-8 text-text-muted mb-2" />
          <p className="text-sm font-medium text-text-primary mb-1">Перетащите файлы сюда</p>
          <p className="text-xs text-text-muted mb-4">PDF, JPG, PNG до 10MB</p>
          <Button onClick={handleUpload} disabled={isUploading} size="sm">
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Загрузка...
              </>
            ) : (
              'Выбрать файл'
            )}
          </Button>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Недавние загрузки
            </h4>
            <div className="space-y-2">
              {uploadedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded border border-border-subtle bg-bg-surface">
                  <div className="flex items-center gap-2">
                    <File className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-medium text-text-primary">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-text-muted">
                      {new Date(file.date).toLocaleDateString()}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
