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
        return <FileSignature className="w-5 h-5 text-indigo-500" />;
      case 'invoice':
        return <Receipt className="w-5 h-5 text-emerald-500" />;
      case 'certificate':
        return <FileText className="w-5 h-5 text-amber-500" />;
      default:
        return <FileText className="w-5 h-5 text-slate-500" />;
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
            <CardTitle className="text-lg font-bold text-slate-800">Единое хранилище (Vault)</CardTitle>
            <CardDescription className="text-sm mt-1">
              Договоры, инвойсы, сертификаты и другие финансовые и юридические документы артикула.
            </CardDescription>
          </div>
          <Button onClick={handleUploadMock} disabled={isUploading} size="sm" className="gap-1.5">
            {isUploading ? (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Загрузить документ
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {docs.length === 0 ? (
          <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
            <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm mb-3">
              <FileText className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">Нет загруженных документов</h3>
            <p className="text-xs text-slate-500 mb-4 max-w-[280px] mx-auto">
              Загрузите сканы договоров, спецификаций или инвойсов, связанных с этим артикулом.
            </p>
            <Button variant="outline" size="sm" onClick={handleUploadMock} disabled={isUploading}>
              <Plus className="w-4 h-4 mr-1.5" />
              Добавить первый документ
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {docs.map((doc) => (
              <div key={doc.id} className="border border-slate-200 rounded-lg p-4 flex flex-col hover:border-slate-300 transition-colors bg-white">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                      {getIconForType(doc.type)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 line-clamp-1" title={doc.title}>
                        {doc.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {getLabelForType(doc.type)}
                      </p>
                    </div>
                  </div>
                </div>
                
                {doc.amount !== undefined ? (
                  <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Сумма:</span>
                    <span className="text-sm font-semibold text-slate-800">{doc.amount.toLocaleString('ru-RU')} ₽</span>
                  </div>
                ) : (
                  <div className="mt-auto pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400 italic">Сумма не указана</span>
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
