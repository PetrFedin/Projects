'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FileText, FileSignature, Receipt, Upload, Plus } from 'lucide-react';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export function Workshop2ArticleWorkspaceVaultPanel({
  dossier,
}: {
  dossier: Workshop2DossierPhase1 | null;
}) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const docs = dossier?.vaultDocuments ?? [];

  const handleUploadMock = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: 'Документ загружен',
        description: 'Файл успешно сохранен в едином хранилище (Vault).',
      });
    }, 1000);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'contract':
        return <FileSignature className="h-5 w-5 text-indigo-500" />;
      case 'invoice':
        return <Receipt className="h-5 w-5 text-emerald-500" />;
      case 'certificate':
        return <FileText className="h-5 w-5 text-amber-500" />;
      default:
        return <FileText className="h-5 w-5 text-slate-500" />;
    }
  };

  const getLabelForType = (type: string) => {
    switch (type) {
      case 'contract':
        return 'Договор';
      case 'invoice':
        return 'Счет/Инвойс';
      case 'certificate':
        return 'Сертификат';
      default:
        return 'Документ';
    }
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-800">
              Единое хранилище (Vault)
            </CardTitle>
            <CardDescription className="mt-1 text-sm">
              Договоры, инвойсы, сертификаты и другие финансовые и юридические документы артикула.
            </CardDescription>
          </div>
          <Button onClick={handleUploadMock} disabled={isUploading} size="sm" className="gap-1.5">
            {isUploading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Загрузить документ
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {docs.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 px-4 py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
              <FileText className="h-5 w-5 text-slate-400" />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-slate-700">
              Нет загруженных документов
            </h3>
            <p className="mx-auto mb-4 max-w-[280px] text-xs text-slate-500">
              Загрузите сканы договоров, спецификаций или инвойсов, связанных с этим артикулом.
            </p>
            <Button variant="outline" size="sm" onClick={handleUploadMock} disabled={isUploading}>
              <Plus className="mr-1.5 h-4 w-4" />
              Добавить первый документ
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-slate-50">
                      {getIconForType(doc.type)}
                    </div>
                    <div>
                      <h4
                        className="line-clamp-1 text-sm font-semibold text-slate-800"
                        title={doc.title}
                      >
                        {doc.title}
                      </h4>
                      <p className="text-[11px] font-medium text-slate-500">
                        {getLabelForType(doc.type)}
                      </p>
                    </div>
                  </div>
                </div>

                {doc.amount !== undefined ? (
                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-xs text-slate-500">Сумма:</span>
                    <span className="text-sm font-semibold text-slate-800">
                      {doc.amount.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                ) : (
                  <div className="mt-auto border-t border-slate-100 pt-3">
                    <span className="text-xs italic text-slate-400">Сумма не указана</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
