'use client';

import type { Dispatch, SetStateAction } from 'react';
import {
  AlertCircle,
  ArrowUpRight,
  Award,
  Check,
  Database,
  Download,
  ExternalLink,
  Globe,
  Loader2,
  Package,
  Plus,
  ShieldCheck,
  Upload,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';

export type BrandProfileCertificateStatus = 'active' | 'expiring' | 'expired';

export type BrandProfileCertificateItem = {
  id: number;
  name: string;
  type: string;
  certNumber: string;
  issueDate: string;
  expiryDate: string;
  status: BrandProfileCertificateStatus;
  file: string;
  issuingBody: string;
  scope: string;
  trTs: string;
  notes: string;
};

export type BrandProfileCertificatesTabProps = {
  certificates: BrandProfileCertificateItem[];
  isEditing: boolean;
  canEditProfile: boolean;
  tabPanelClassName: string;
  showCertificateDialog: boolean;
  setShowCertificateDialog: Dispatch<SetStateAction<boolean>>;
  uploadingCertificate: number | null;
  setUploadingCertificate: Dispatch<SetStateAction<number | null>>;
  onUploadCertificate: (certId: number) => void;
};

export function BrandProfileCertificatesTab({
  certificates,
  isEditing,
  canEditProfile,
  tabPanelClassName,
  showCertificateDialog,
  setShowCertificateDialog,
  uploadingCertificate,
  setUploadingCertificate,
  onUploadCertificate,
}: BrandProfileCertificatesTabProps) {
  return (
    <>
      <TabsContent value="certificates" className={tabPanelClassName}>
        <div className="space-y-1 border-b border-border-subtle pb-4">
          <h2 className="text-base font-semibold text-text-primary">Сертификаты и соответствие</h2>
          <p className="text-sm text-text-secondary">
            Сертификаты качества, сроки, ТР ТС и связка с ESG и маркировкой.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border-default bg-muted/30 p-3">
          <span className="text-sm font-medium text-text-secondary">Связанные разделы:</span>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 rounded-lg border-border-default text-xs font-medium"
          >
            <Link href={ROUTES.brand.esg}>
              <Globe className="size-3.5" /> ESG
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 rounded-lg border-border-default text-xs font-medium"
          >
            <Link href={ROUTES.brand.compliance}>
              <ShieldCheck className="size-3.5" /> EAC и Честный ЗНАК
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 rounded-lg border-border-default text-xs font-medium"
          >
            <Link href={ROUTES.brand.complianceStock}>
              <Database className="size-3.5" /> Склад и КИЗ
            </Link>
          </Button>
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-3">
            <h3 className="text-sm font-semibold text-text-primary">Список сертификатов</h3>
            <div className="flex items-center gap-2">
              {isEditing && canEditProfile && (
                <Button
                  size="sm"
                  className="h-9 gap-2 rounded-lg bg-accent-primary px-3 text-xs font-medium text-text-inverse shadow-sm hover:bg-accent-hover"
                  onClick={() => setShowCertificateDialog(true)}
                >
                  <Plus className="size-3.5" /> Добавить сертификат
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {certificates.map((cert) => (
              <Card
                key={cert.id}
                className={cn(
                  'group rounded-xl border p-4 shadow-sm transition-all hover:shadow-md md:p-5',
                  cert.status === 'active'
                    ? 'border-border-default bg-white'
                    : cert.status === 'expiring'
                      ? 'border-amber-200 bg-amber-50/40'
                      : 'border-state-error/30 bg-state-error/10'
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'flex size-12 shrink-0 items-center justify-center rounded-lg border shadow-inner transition-transform group-hover:scale-105',
                      cert.status === 'active'
                        ? 'border-state-success/30 bg-state-success/10 text-state-success'
                        : cert.status === 'expiring'
                          ? 'border-amber-200 bg-amber-100 text-amber-700'
                          : 'border-state-error/30 bg-state-error/15 text-state-error'
                    )}
                  >
                    <Award className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h4
                        className={cn(
                          'truncate text-base font-semibold tracking-tight',
                          cert.status === 'active'
                            ? 'text-text-primary'
                            : cert.status === 'expiring'
                              ? 'text-amber-950'
                              : 'text-state-error'
                        )}
                      >
                        {cert.name}
                      </h4>
                      <Badge
                        className={cn(
                          'h-6 rounded-md border-none px-2 text-xs font-medium text-white',
                          cert.status === 'active'
                            ? 'bg-state-success'
                            : cert.status === 'expiring'
                              ? 'bg-amber-600'
                              : 'bg-state-error'
                        )}
                      >
                        {cert.status === 'active'
                          ? 'Активен'
                          : cert.status === 'expiring'
                            ? 'Истекает'
                            : 'Истёк'}
                      </Badge>
                    </div>
                    <p className="mb-2 text-sm text-text-secondary">{cert.type}</p>
                    {cert.certNumber ? (
                      <p className="mb-2 font-mono text-xs text-text-secondary">№ {cert.certNumber}</p>
                    ) : null}
                    <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                      <div className="rounded-lg border border-border-subtle bg-bg-surface2 p-2.5">
                        <p className="mb-0.5 text-xs font-medium text-text-muted">Выдан</p>
                        <p className="text-sm font-semibold text-text-primary">{cert.issueDate}</p>
                      </div>
                      <div
                        className={cn(
                          'rounded-lg border p-2.5',
                          cert.status === 'active'
                            ? 'border-state-success/30 bg-state-success/10'
                            : cert.status === 'expiring'
                              ? 'border-amber-100 bg-amber-50'
                              : 'border-state-error/30 bg-state-error/10'
                        )}
                      >
                        <p className="mb-0.5 text-xs font-medium text-text-muted">Истекает</p>
                        <p
                          className={cn(
                            'text-sm font-semibold',
                            cert.status === 'active'
                              ? 'text-state-success'
                              : cert.status === 'expiring'
                                ? 'text-amber-800'
                                : 'text-state-error'
                          )}
                        >
                          {cert.expiryDate}
                        </p>
                      </div>
                      {cert.issuingBody ? (
                        <div className="col-span-2 rounded-lg border border-border-subtle bg-bg-surface2 p-2.5">
                          <p className="mb-0.5 text-xs font-medium text-text-muted">
                            Орган сертификации
                          </p>
                          <p className="text-sm font-medium text-text-primary">{cert.issuingBody}</p>
                        </div>
                      ) : null}
                    </div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {cert.scope ? (
                        <Badge variant="outline" className="border-border-default text-xs font-normal">
                          Область: {cert.scope}
                        </Badge>
                      ) : null}
                      {cert.trTs ? (
                        <Badge
                          variant="outline"
                          className="border-accent-soft text-xs font-normal text-accent-hover"
                        >
                          {cert.trTs}
                        </Badge>
                      ) : null}
                    </div>
                    {cert.notes ? (
                      <p className="mb-3 text-sm italic text-text-secondary">{cert.notes}</p>
                    ) : null}
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 gap-1.5 rounded-lg border-border-default text-xs font-medium"
                      >
                        <Download className="size-3.5" /> Скачать PDF
                      </Button>
                      {cert.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 gap-1.5 rounded-lg border-border-default text-xs font-medium"
                        >
                          <ExternalLink className="size-3.5" /> Верифицировать
                        </Button>
                      )}
                      {(cert.status === 'expiring' || cert.status === 'expired') && isEditing && (
                        <Button
                          onClick={() => {
                            setShowCertificateDialog(true);
                            setUploadingCertificate(cert.id);
                          }}
                          size="sm"
                          className="h-9 gap-2 rounded-lg bg-accent-primary px-3 text-xs font-medium text-text-inverse hover:bg-accent-hover"
                        >
                          <Upload className="size-3.5" /> Обновить
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border-subtle pb-3">
            <h3 className="text-sm font-semibold text-text-primary">Декларации ТР ТС / EAC</h3>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-9 text-xs font-medium text-accent-primary hover:text-accent-hover"
            >
              <Link href={ROUTES.brand.compliance}>
                Compliance <ArrowUpRight className="ml-0.5 inline size-3.5" />
              </Link>
            </Button>
          </div>
          <Card className="rounded-xl border border-border-default bg-bg-surface2/60 p-4 md:p-5">
            <p className="mb-3 text-sm text-text-secondary">
              Декларации о соответствии техническим регламентам (ТР ТС 017/2011, ТР ТС 019/2011 и др.)
              ведутся в разделе Compliance, с привязкой к Честному ЗНАК и КИЗ.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs font-normal">
                ТР ТС 017/2011 — лёгкая промышленность
              </Badge>
              <Badge variant="outline" className="text-xs font-normal">
                ТР ТС 019/2011 — СИЗ
              </Badge>
            </div>
          </Card>
        </div>

        <div className="mt-8 space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border-subtle pb-3">
            <h3 className="text-sm font-semibold text-text-primary">Устойчивое развитие (ESG)</h3>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-9 gap-1 rounded-lg px-2 text-xs font-medium text-state-success hover:bg-state-success/10"
            >
              <Link href={ROUTES.brand.esg}>
                ESG-дашборд <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          </div>
          <Card className="rounded-xl border border-state-success/30 bg-gradient-to-br from-state-success/10 to-bg-surface p-4 shadow-sm md:p-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {(
                [
                  {
                    label: 'Углеродная нейтральность',
                    value: '2025',
                    icon: Globe,
                    achieved: true,
                  },
                  { label: 'Ноль отходов', value: '2026', icon: Package, achieved: false },
                  { label: 'Справедливая торговля', value: '100%', icon: Users, achieved: true },
                ] as const
              ).map((goal, i) => (
                <div
                  key={i}
                  className="border-state-success/30/50 group rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className={cn(
                        'flex size-9 items-center justify-center rounded-lg border shadow-inner transition-transform group-hover:scale-105',
                        goal.achieved
                          ? 'border-state-success/30 bg-state-success/10 text-state-success'
                          : 'border-border-subtle bg-bg-surface2 text-text-muted'
                      )}
                    >
                      <goal.icon className="h-4.5 w-4.5" />
                    </div>
                    {goal.achieved && (
                      <Badge className="h-4 rounded-md border-none bg-state-success/100 px-1.5 text-white">
                        <Check className="size-2.5" />
                      </Badge>
                    )}
                  </div>
                  <h4 className="mb-1 text-xs font-medium text-text-secondary">{goal.label}</h4>
                  <p className="text-lg font-semibold tracking-tight text-text-primary">{goal.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </TabsContent>

      <Dialog open={showCertificateDialog} onOpenChange={setShowCertificateDialog}>
        <DialogContent className="rounded-xl border-border-default sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold uppercase tracking-tight text-text-primary">
              <Upload className="size-4 text-accent-primary" />
              Обновить сертификат
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-text-muted">
              Загрузите актуальный документ для верификации статуса
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-text-primary">
                Файл сертификата <span className="text-state-error">*</span>
              </Label>
              <div className="group cursor-pointer rounded-xl border-2 border-dashed border-border-subtle p-4 text-center transition-all hover:border-accent-primary hover:bg-accent-soft/30">
                <Upload className="mx-auto mb-2 size-8 text-text-muted transition-colors group-hover:text-accent-primary" />
                <p className="mb-0.5 text-md font-bold uppercase text-text-primary">Загрузите файл</p>
                <p className="text-[9px] font-medium text-text-muted">PDF, JPG или PNG до 5MB</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-text-primary">Номер сертификата</Label>
              <Input
                className="h-9 rounded-lg border-border-default bg-bg-surface2 text-[13px]"
                placeholder="Напр. ISO-9001-2024"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-text-primary">Дата выдачи</Label>
                <Input
                  type="date"
                  className="h-9 rounded-lg border-border-default bg-bg-surface2 text-[13px]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-text-primary">Срок действия</Label>
                <Input
                  type="date"
                  className="h-9 rounded-lg border-border-default bg-bg-surface2 text-[13px]"
                />
              </div>
            </div>

            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold uppercase text-amber-900">Важное уведомление</p>
                  <p className="text-xs font-medium leading-snug text-amber-700 opacity-90">
                    Документ будет верифицирован AI в течение 2-х минут. Статус обновится
                    автоматически.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowCertificateDialog(false)}
              className="h-8 rounded-lg text-xs font-bold uppercase tracking-widest text-text-muted"
            >
              Отмена
            </Button>
            <Button
              onClick={() => uploadingCertificate && onUploadCertificate(uploadingCertificate)}
              className="h-8 rounded-lg bg-accent-primary px-6 text-xs font-bold uppercase tracking-widest text-text-inverse shadow-lg shadow-accent-soft hover:bg-accent-hover"
              disabled={uploadingCertificate === null}
            >
              {uploadingCertificate ? (
                <>
                  <Loader2 className="mr-2 size-3.5 animate-spin" />
                  Загрузка...
                </>
              ) : (
                <>
                  <Upload className="mr-2 size-3.5" />
                  Сохранить
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
