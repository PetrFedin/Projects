'use client';

import type { Dispatch, SetStateAction } from 'react';
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  DollarSign,
  FileText,
  MapPin,
  RotateCcw,
  Shield,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export type BrandProfileLegalDataState = {
  legalName: string;
  inn: string;
  kpp: string;
  ogrn: string;
  okpo: string;
  oktmo: string;
  okved: string;
  okvedDesc: string;
  okfs: string;
  okopf: string;
  legalAddress: string;
  actualAddress: string;
  bankName: string;
  bik: string;
  corrAccount: string;
  paymentAccount: string;
  ceo: string;
  ceoPosition: string;
  foundingDate: string;
  registrationAuthority: string;
  taxRegime: string;
  authorizedCapital: string;
  licenses: string;
  powersOfAttorney: string;
  insurance: string;
  isVerified: boolean;
};

export type BrandProfileLegalTabProps = {
  legalData: BrandProfileLegalDataState;
  setLegalData: Dispatch<SetStateAction<BrandProfileLegalDataState>>;
  isEditing: boolean;
  isVerifying: string | null;
  onVerifyLegal: () => void;
  tabPanelClassName: string;
};

export function BrandProfileLegalTab({
  legalData,
  setLegalData,
  isEditing,
  isVerifying,
  onVerifyLegal,
  tabPanelClassName,
}: BrandProfileLegalTabProps) {
  return (
    <TabsContent value="legal" className={tabPanelClassName}>
      <div className="space-y-1 border-b border-border-subtle pb-4">
        <h2 className="text-base font-semibold text-text-primary">Юридические данные</h2>
        <p className="text-sm text-text-secondary">
          Реквизиты и регистрационные сведения для договоров и счетов в РФ.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border-subtle pb-3">
            <h3 className="text-sm font-semibold text-text-primary">Регистрация компании</h3>
            <div className="flex items-center gap-2">
              {legalData.isVerified ? (
                <Badge className="h-6 gap-1 border border-state-success/30 bg-state-success/10 px-2 text-xs font-medium text-state-success">
                  <CheckCircle2 className="size-3.5" /> Верифицировано ФНС
                </Badge>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onVerifyLegal}
                  disabled={isVerifying === 'legal'}
                  className="h-8 gap-1.5 rounded-lg bg-amber-50 px-3 text-xs font-medium text-amber-800 hover:bg-amber-100"
                >
                  <RotateCcw
                    className={cn('size-3.5', isVerifying === 'legal' && 'animate-spin')}
                  />{' '}
                  Проверить в ФНС
                </Button>
              )}
            </div>
          </div>
          <Card className="space-y-2 rounded-xl border border-border-default bg-white p-4 shadow-sm md:p-5">
            {(
              [
                {
                  key: 'legalName' as const,
                  label: 'Наименование',
                  value: legalData.legalName,
                  icon: Building2,
                },
                { key: 'inn' as const, label: 'ИНН', value: legalData.inn, icon: FileText },
                { key: 'kpp' as const, label: 'КПП', value: legalData.kpp, icon: FileText },
                { key: 'ogrn' as const, label: 'ОГРН', value: legalData.ogrn, icon: FileText },
                { key: 'okpo' as const, label: 'ОКПО', value: legalData.okpo, icon: FileText },
                { key: 'oktmo' as const, label: 'ОКТМО', value: legalData.oktmo, icon: FileText },
                { key: 'okved' as const, label: 'ОКВЭД', value: legalData.okved, icon: FileText },
                {
                  key: 'okvedDesc' as const,
                  label: 'ОКВЭД (описание)',
                  value: legalData.okvedDesc,
                  icon: FileText,
                },
                {
                  key: 'foundingDate' as const,
                  label: 'Дата регистрации',
                  value: legalData.foundingDate,
                  icon: Calendar,
                },
              ] as const
            ).map((item, i) => (
              <div
                key={i}
                className="group flex items-center justify-between rounded-lg border border-border-subtle/50 bg-bg-surface2 p-2.5 transition-colors hover:bg-bg-surface2"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-lg border border-border-subtle bg-white shadow-sm transition-transform group-hover:scale-105">
                    <item.icon className="size-3.5 text-accent-primary" />
                  </div>
                  <span className="text-xs font-medium text-text-muted">{item.label}</span>
                </div>
                {isEditing ? (
                  <Input
                    value={item.value}
                    onChange={(e) =>
                      setLegalData((prev) => ({ ...prev, [item.key]: e.target.value }))
                    }
                    className="h-8 w-full max-w-[min(100%,20rem)] rounded-md border-border-default bg-white text-right text-sm font-medium sm:w-48"
                  />
                ) : (
                  <span className="max-w-[min(100%,20rem)] text-right text-sm font-medium tracking-tight text-text-primary">
                    {item.value}
                  </span>
                )}
              </div>
            ))}
          </Card>
        </div>

        <div className="space-y-3">
          <div className="border-b border-border-subtle pb-3">
            <h3 className="text-sm font-semibold text-text-primary">Руководство и полномочия</h3>
          </div>
          <Card className="flex h-full flex-col justify-center space-y-2 rounded-xl border border-border-default bg-white p-4 shadow-sm md:p-5">
            {(
              [
                { key: 'ceo' as const, label: 'CEO', value: legalData.ceo, icon: Users },
                {
                  key: 'ceoPosition' as const,
                  label: 'Должность',
                  value: legalData.ceoPosition,
                  icon: Briefcase,
                },
                {
                  key: 'registrationAuthority' as const,
                  label: 'Рег. Орган',
                  value: legalData.registrationAuthority,
                  icon: ShieldCheck,
                },
                {
                  key: 'taxRegime' as const,
                  label: 'Налоговый режим',
                  value: legalData.taxRegime,
                  icon: CreditCard,
                },
                {
                  key: 'authorizedCapital' as const,
                  label: 'Уставной капитал',
                  value: legalData.authorizedCapital,
                  icon: DollarSign,
                },
              ] as const
            ).map((item, i) => (
              <div
                key={i}
                className="group flex items-center justify-between rounded-lg border border-border-subtle/50 bg-bg-surface2 p-2.5 transition-colors hover:bg-bg-surface2"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-lg border border-border-subtle bg-white shadow-sm transition-transform group-hover:scale-105">
                    <item.icon className="size-3.5 text-state-success" />
                  </div>
                  <span className="text-xs font-medium text-text-muted">{item.label}</span>
                </div>
                {isEditing ? (
                  <Input
                    value={item.value}
                    onChange={(e) =>
                      setLegalData((prev) => ({ ...prev, [item.key]: e.target.value }))
                    }
                    className="h-8 w-full max-w-[min(100%,20rem)] rounded-md border-border-default bg-white text-right text-sm font-medium sm:w-48"
                  />
                ) : (
                  <span className="max-w-[min(100%,20rem)] truncate text-right text-sm font-medium tracking-tight text-text-primary">
                    {item.value}
                  </span>
                )}
              </div>
            ))}
          </Card>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="border-b border-border-subtle pb-3">
            <h3 className="text-sm font-semibold text-text-primary">Адреса</h3>
          </div>
          <Card className="space-y-3 rounded-xl border border-border-default bg-white p-4 shadow-sm md:p-5">
            {(
              [
                {
                  key: 'legalAddress' as const,
                  label: 'Юридический адрес',
                  value: legalData.legalAddress,
                },
                {
                  key: 'actualAddress' as const,
                  label: 'Фактический адрес',
                  value: legalData.actualAddress,
                },
              ] as const
            ).map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <MapPin className="size-3 text-blue-600" />
                  <span className="text-xs font-medium text-text-muted">{item.label}</span>
                </div>
                {isEditing ? (
                  <Textarea
                    value={item.value}
                    onChange={(e) =>
                      setLegalData((prev) => ({ ...prev, [item.key]: e.target.value }))
                    }
                    className="min-h-[72px] rounded-lg border-border-default bg-bg-surface2 p-3 text-sm font-medium"
                  />
                ) : (
                  <p className="rounded-lg border border-border-subtle bg-bg-surface2 p-3 text-sm font-medium text-text-secondary">
                    {item.value}
                  </p>
                )}
              </div>
            ))}
          </Card>
        </div>

        <div className="space-y-3">
          <div className="border-b border-border-subtle pb-3">
            <h3 className="text-sm font-semibold text-text-primary">Банковские реквизиты</h3>
          </div>
          <Card className="flex h-full flex-col justify-center rounded-xl border border-border-default bg-white p-4 shadow-sm md:p-5">
            <div className="space-y-2">
              {(
                [
                  { key: 'bankName' as const, label: 'Банк', value: legalData.bankName },
                  { key: 'bik' as const, label: 'БИК', value: legalData.bik },
                  { key: 'corrAccount' as const, label: 'Корр. счет', value: legalData.corrAccount },
                  {
                    key: 'paymentAccount' as const,
                    label: 'Р/С',
                    value: legalData.paymentAccount,
                  },
                ] as const
              ).map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-border-subtle pb-2 last:border-0 last:pb-0"
                >
                  <span className="text-xs font-medium text-text-muted">{item.label}</span>
                  {isEditing ? (
                    <Input
                      value={item.value}
                      onChange={(e) =>
                        setLegalData((prev) => ({ ...prev, [item.key]: e.target.value }))
                      }
                      className="h-8 w-full max-w-xs rounded-md border-border-default bg-bg-surface2 text-right font-mono text-sm font-medium"
                    />
                  ) : (
                    <span className="font-mono text-sm font-medium tracking-tight text-text-primary">
                      {item.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-xl border border-border-default bg-white p-4 shadow-sm md:p-5">
          <div className="mb-3 flex items-center gap-2 border-b border-border-subtle pb-3">
            <ShieldCheck className="size-4 text-accent-primary" />
            <h3 className="text-sm font-semibold text-text-primary">Лицензии</h3>
          </div>
          {isEditing ? (
            <Textarea
              value={legalData.licenses}
              onChange={(e) => setLegalData((prev) => ({ ...prev, licenses: e.target.value }))}
              className="min-h-[60px] text-sm"
              placeholder="При необходимости"
            />
          ) : (
            <p className="text-sm font-medium text-text-secondary">{legalData.licenses}</p>
          )}
        </Card>
        <Card className="rounded-xl border border-border-default bg-white p-4 shadow-sm md:p-5">
          <div className="mb-3 flex items-center gap-2 border-b border-border-subtle pb-3">
            <FileText className="size-4 text-state-success" />
            <h3 className="text-sm font-semibold text-text-primary">Доверенности</h3>
          </div>
          {isEditing ? (
            <Textarea
              value={legalData.powersOfAttorney}
              onChange={(e) =>
                setLegalData((prev) => ({ ...prev, powersOfAttorney: e.target.value }))
              }
              className="min-h-[60px] text-sm"
              placeholder="Ген. доверенность, спец. доверенность"
            />
          ) : (
            <p className="text-sm font-medium text-text-secondary">{legalData.powersOfAttorney}</p>
          )}
        </Card>
        <Card className="rounded-xl border border-border-default bg-white p-4 shadow-sm md:p-5">
          <div className="mb-3 flex items-center gap-2 border-b border-border-subtle pb-3">
            <Shield className="size-4 text-amber-600" />
            <h3 className="text-sm font-semibold text-text-primary">Страхование</h3>
          </div>
          {isEditing ? (
            <Input
              value={legalData.insurance}
              onChange={(e) => setLegalData((prev) => ({ ...prev, insurance: e.target.value }))}
              className="h-9 text-sm"
              placeholder="ОСАГО, ДМС, КАСКО"
            />
          ) : (
            <p className="text-sm font-medium text-text-secondary">{legalData.insurance}</p>
          )}
        </Card>
      </div>
    </TabsContent>
  );
}
