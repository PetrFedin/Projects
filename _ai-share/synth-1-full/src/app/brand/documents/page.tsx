'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FeatureGate } from '@/components/FeatureGate';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, Download, Upload, Send, CheckCircle2,
  Clock, AlertCircle, FileSignature, Search, Filter, Plus,
  ExternalLink, Copy, Eye, Trash2, Edit, Shield, Zap, QrCode
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getDocumentsLinks } from '@/lib/data/entity-links';

const ComplianceStockContent = dynamic(
  () => import('@/app/brand/compliance/stock/page'),
  { ssr: false }
);

type DocumentStatus = 'draft' | 'pending_signature' | 'signed' | 'archived';
type DocumentType = 'contract' | 'act' | 'invoice' | 'specification' | 'nda' | 'agreement';

interface Document {
  id: string;
  title: string;
  type: DocumentType;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
  signedAt?: string;
  counterparty?: string;
  amount?: number;
  fileUrl?: string;
}

const MOCK_DOCUMENTS: Document[] = [
  { id: 'DOC-001', title: 'Договор поставки SS\'26', type: 'contract', status: 'pending_signature', createdAt: '2026-02-15', updatedAt: '2026-02-16', counterparty: 'TSUM', amount: 2400000 },
  { id: 'DOC-002', title: 'Акт приема-передачи ORD-8821', type: 'act', status: 'signed', createdAt: '2026-02-10', updatedAt: '2026-02-12', signedAt: '2026-02-12', counterparty: 'Podium Market', amount: 890000 },
  { id: 'DOC-003', title: 'Спецификация FW\'26 Collection', type: 'specification', status: 'draft', createdAt: '2026-02-14', updatedAt: '2026-02-17', counterparty: 'Nordic Wool Factory' },
  { id: 'DOC-004', title: 'NDA для коллаборации с A.P.C.', type: 'nda', status: 'pending_signature', createdAt: '2026-02-13', updatedAt: '2026-02-13', counterparty: 'A.P.C.' },
  { id: 'DOC-005', title: 'Счет на оплату INV-2026-02', type: 'invoice', status: 'signed', createdAt: '2026-02-01', updatedAt: '2026-02-01', signedAt: '2026-02-01', amount: 49900 },
];

const DOCUMENT_TEMPLATES = [
  { id: 'tpl-contract-b2b', name: 'Договор B2B поставки', type: 'contract', description: 'Стандартный договор для оптовых партнеров' },
  { id: 'tpl-contract-b2c', name: 'Договор B2C комиссии', type: 'contract', description: 'Договор комиссии для розничной торговли' },
  { id: 'tpl-act', name: 'Акт приема-передачи', type: 'act', description: 'Универсальный акт для отгрузки товара' },
  { id: 'tpl-specification', name: 'Спецификация товаров', type: 'specification', description: 'Детальная спецификация с артикулами и ценами' },
  { id: 'tpl-nda', name: 'Соглашение о конфиденциальности (NDA)', type: 'nda', description: 'Для защиты коммерческой информации' },
  { id: 'tpl-agreement', name: 'Дополнительное соглашение', type: 'agreement', description: 'Изменения к основному договору' },
];

const EDO_INTEGRATIONS = [
  { id: 'diadoc', name: 'Диадок (СКБ Контур)', logo: '📦', status: 'active', documents: 24 },
  { id: 'sbis', name: 'СБИС', logo: '🔷', status: 'inactive', documents: 0 },
  { id: 'taxcom', name: 'Такском', logo: '📋', status: 'inactive', documents: 0 },
];

export default function DocumentsPage() {
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const stagesNotesUrlApplied = useRef(false);
  const [activeTab, setActiveTab] = useState<'all' | 'templates' | 'edo' | 'kiz'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [documents] = useState<Document[]>(MOCK_DOCUMENTS);

  /** Deep link из матрицы этапов: заметки / контекст коллекции в поиске */
  useEffect(() => {
    if (stagesNotesUrlApplied.current) return;
    const ctx = searchParams.get('context')?.toLowerCase() ?? '';
    if (ctx !== 'stagesnotes') return;
    const q = searchParams.get('q')?.trim();
    const step = searchParams.get('stagesStep')?.trim();
    const line = [q, step].filter(Boolean).join(' ').trim();
    if (line) {
      setSearchQuery(line);
      stagesNotesUrlApplied.current = true;
    }
  }, [searchParams]);

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case 'draft': return 'bg-slate-100 text-slate-600';
      case 'pending_signature': return 'bg-amber-100 text-amber-600';
      case 'signed': return 'bg-emerald-100 text-emerald-600';
      case 'archived': return 'bg-slate-100 text-slate-400';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case 'draft': return <Edit className="h-3 w-3" />;
      case 'pending_signature': return <Clock className="h-3 w-3" />;
      case 'signed': return <CheckCircle2 className="h-3 w-3" />;
      case 'archived': return <FileText className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  const getTypeLabel = (type: DocumentType) => {
    const labels = {
      contract: 'Договор',
      act: 'Акт',
      invoice: 'Счет',
      specification: 'Спецификация',
      nda: 'NDA',
      agreement: 'Доп. соглашение'
    };
    return labels[type] || type;
  };

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.counterparty?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === 'pending_signature').length,
    signed: documents.filter(d => d.status === 'signed').length,
    draft: documents.filter(d => d.status === 'draft').length
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-20 px-4 md:px-0">
      {/* Control Panel */}
      <div className="flex justify-end items-center mb-4 gap-3">
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" className="h-7 px-3 rounded-lg text-[7px] font-black uppercase tracking-widest bg-white border-slate-200 text-slate-400 shadow-sm hover:bg-slate-50">
            <Download className="h-3 w-3 mr-1" /> Экспорт архива
          </Button>
          <div className="h-4 w-px bg-slate-200 mx-0.5" />
          <Button asChild variant="outline" size="sm" className="h-7 px-3 rounded-lg text-[7px] font-black uppercase tracking-widest bg-white border-slate-200 text-slate-400 shadow-sm hover:bg-slate-50">
            <Link href="/brand/settings">Настройки</Link>
          </Button>
        </div>

        <FeatureGate resource="edo" action="create">
          <Button variant="default" size="sm" className="button-glimmer h-7 px-4 rounded-lg text-[7px] font-black uppercase tracking-widest bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700">
            <Plus className="h-3 w-3 mr-1" /> Создать документ
          </Button>
        </FeatureGate>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Всего документов', value: stats.total, icon: FileText, color: 'text-indigo-600' },
          { label: 'На подписи', value: stats.pending, icon: Clock, color: 'text-amber-600' },
          { label: 'Подписано', value: stats.signed, icon: CheckCircle2, color: 'text-emerald-600' },
          { label: 'Черновиков', value: stats.draft, icon: Edit, color: 'text-slate-600' }
        ].map((stat, i) => (
          <Card key={i} className="bg-white border-slate-100 shadow-sm rounded-2xl">
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <stat.icon className={cn("h-5 w-5", stat.color)} />
                <span className="text-sm font-black text-slate-900 tabular-nums">{stat.value}</span>
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
        <TabsList className="bg-white p-1 rounded-2xl h-auto shadow-sm border border-slate-100">
          <TabsTrigger value="all" className="rounded-xl py-3 px-6 data-[state=active]:bg-slate-900 data-[state=active]:text-white text-[9px] font-black uppercase gap-2">
            <FileText className="h-3.5 w-3.5" /> Все документы
          </TabsTrigger>
          <TabsTrigger value="templates" className="rounded-xl py-3 px-6 data-[state=active]:bg-slate-900 data-[state=active]:text-white text-[9px] font-black uppercase gap-2">
            <Copy className="h-3.5 w-3.5" /> Шаблоны
          </TabsTrigger>
          <TabsTrigger value="edo" className="rounded-xl py-3 px-6 data-[state=active]:bg-slate-900 data-[state=active]:text-white text-[9px] font-black uppercase gap-2">
            <Shield className="h-3.5 w-3.5" /> ЭДО
          </TabsTrigger>
          <TabsTrigger value="kiz" className="rounded-xl py-3 px-6 data-[state=active]:bg-slate-900 data-[state=active]:text-white text-[9px] font-black uppercase gap-2">
            <QrCode className="h-3.5 w-3.5" /> Склад КИЗ
          </TabsTrigger>
        </TabsList>

        {/* All Documents */}
        <TabsContent value="all" className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Поиск по названию или контрагенту..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-11 rounded-xl border-slate-200 bg-white text-sm"
              />
            </div>
            <Button variant="outline" size="sm" className="h-11 px-4 rounded-xl text-[9px] font-black uppercase border-slate-200">
              <Filter className="h-3 w-3 mr-2" /> Фильтры
            </Button>
          </div>

          <div className="space-y-3">
            {filteredDocuments.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="bg-white border-slate-100 shadow-sm rounded-2xl hover:shadow-md transition-all group">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-black uppercase text-slate-900 truncate">{doc.title}</h4>
                        <Badge className={cn("text-[7px] font-black uppercase border-none", getStatusColor(doc.status))}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(doc.status)}
                            {doc.status}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-[9px] text-slate-500">
                        <span className="font-black uppercase">{getTypeLabel(doc.type)}</span>
                        <span>•</span>
                        <span>{doc.counterparty}</span>
                        {doc.amount && (
                          <>
                            <span>•</span>
                            <span className="font-black">{doc.amount.toLocaleString('ru-RU')} ₽</span>
                          </>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(doc.updatedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {doc.status === 'pending_signature' && (
                        <Button size="sm" className="h-9 rounded-xl text-[8px] font-black uppercase bg-indigo-600 text-white hover:bg-indigo-700">
                          <FileSignature className="h-3 w-3 mr-1" /> Подписать
                        </Button>
                      )}
                      {doc.status === 'signed' && (
                        <Button size="sm" variant="outline" className="h-9 rounded-xl text-[8px] font-black uppercase border-slate-200">
                          <Download className="h-3 w-3 mr-1" /> Скачать
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-900">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-9 w-9 rounded-xl text-slate-400 hover:text-rose-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates" className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-indigo-600 rounded-full" />
              <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Готовые шаблоны</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {DOCUMENT_TEMPLATES.map((template, i) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="bg-white border-slate-100 shadow-sm rounded-2xl hover:shadow-lg hover:border-indigo-200 transition-all group cursor-pointer h-full">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <FileText className="h-6 w-6" />
                        </div>
                        <Badge className="bg-slate-100 text-slate-600 border-none text-[7px] font-black uppercase">
                          {getTypeLabel(template.type as DocumentType)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-black uppercase text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {template.name}
                        </h3>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          {template.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <FeatureGate resource="edo" action="create">
                          <Button size="sm" className="flex-1 h-9 rounded-xl text-[8px] font-black uppercase bg-indigo-600 text-white hover:bg-indigo-700">
                            <Plus className="h-3 w-3 mr-1" /> Создать
                          </Button>
                        </FeatureGate>
                        <Button size="sm" variant="outline" className="h-9 w-9 rounded-xl border-slate-200">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-emerald-600 rounded-full" />
              <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Генератор документов</h2>
            </div>
            
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 rounded-xl overflow-hidden">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
                    <Zap className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">AI Document Generator</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Создавайте документы автоматически на основе данных заказа</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button variant="outline" className="h-12 rounded-2xl text-[9px] font-black uppercase border-emerald-200 hover:bg-white">
                    Из заказа B2B
                  </Button>
                  <Button variant="outline" className="h-12 rounded-2xl text-[9px] font-black uppercase border-emerald-200 hover:bg-white">
                    Из спецификации
                  </Button>
                  <Button variant="outline" className="h-12 rounded-2xl text-[9px] font-black uppercase border-emerald-200 hover:bg-white">
                    Пакет документов
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* EDO */}
        <TabsContent value="edo" className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-indigo-600 rounded-full" />
              <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Электронный документооборот</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {EDO_INTEGRATIONS.map((edo, i) => (
                <Card key={edo.id} className={cn(
                  "rounded-xl border-2 transition-all",
                  edo.status === 'active' ? 'bg-white border-emerald-200' : 'bg-slate-50 border-slate-200'
                )}>
                  <CardContent className="p-4 space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="text-sm">{edo.logo}</div>
                        <h3 className="text-sm font-black uppercase text-slate-900">{edo.name}</h3>
                      </div>
                      {edo.status === 'active' ? (
                        <Badge className="bg-emerald-500 text-white border-none text-[7px] font-black uppercase">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Активно
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-200 text-slate-600 border-none text-[7px] font-black uppercase">
                          Не подключено
                        </Badge>
                      )}
                    </div>

                    {edo.status === 'active' ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-50">
                          <span className="text-[9px] font-black uppercase text-slate-600">Документов отправлено</span>
                          <span className="text-sm font-black text-emerald-600">{edo.documents}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 h-10 rounded-xl text-[8px] font-black uppercase border-slate-200">
                            <ExternalLink className="h-3 w-3 mr-1" /> Открыть панель
                          </Button>
                          <Button size="sm" variant="ghost" className="h-10 w-10 rounded-xl text-slate-400 hover:text-rose-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button size="sm" className="w-full h-11 rounded-2xl text-[9px] font-black uppercase bg-indigo-600 text-white hover:bg-indigo-700">
                        <Plus className="h-3 w-3 mr-2" /> Подключить
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="bg-slate-900 text-white rounded-xl overflow-hidden">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-indigo-400" />
                <div>
                  <h3 className="text-sm font-black uppercase">Защищенный обмен документами</h3>
                  <p className="text-[10px] text-slate-400 mt-1">ЭДО обеспечивает юридическую значимость электронных документов</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase text-slate-400">Время доставки</p>
                  <p className="text-sm font-black">5 минут</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase text-slate-400">Экономия</p>
                  <p className="text-sm font-black">90%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase text-slate-400">Безопасность</p>
                  <p className="text-sm font-black">100%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kiz" className="space-y-6">
          {activeTab === 'kiz' && <ComplianceStockContent />}
        </TabsContent>
      </Tabs>

      <RelatedModulesBlock links={getDocumentsLinks()} className="mt-6" />
    </div>
  );
}
