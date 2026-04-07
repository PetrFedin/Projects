'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getCompanyAccounts, ROLE_LABELS } from '@/lib/b2b/company-accounts';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getB2BLinks } from '@/lib/data/entity-links';
import { Building2, ArrowLeft, Users } from 'lucide-react';

export default function CompanyAccountsPage() {
  const accounts = getCompanyAccounts();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.brand.retailers}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><Building2 className="h-6 w-6" /> Company Accounts</h1>
          <p className="text-slate-500 text-sm mt-0.5">Одно юрлицо, несколько пользователей: директор, байер, бухгалтер.</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Корпоративные аккаунты</CardTitle>
          <CardDescription>Shopify Plus B2B style. Группа клиентов и Net terms на уровне компании.</CardDescription>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>Нет company accounts. Создайте при добавлении партнёра.</p>
              <Button variant="outline" size="sm" className="mt-3" asChild><Link href={ROUTES.brand.retailers}>Партнёры</Link></Button>
            </div>
          ) : (
            <div className="space-y-4">
              {accounts.map((a) => (
                <div key={a.id} className="flex items-start justify-between p-4 rounded-xl border border-slate-200">
                  <div>
                    <p className="font-medium">{a.legalName}</p>
                    {a.inn && <p className="text-xs text-slate-500">ИНН {a.inn}</p>}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {a.users.map((u) => (
                        <Badge key={u.id} variant="outline" className="text-[9px]">
                          {u.name} · {ROLE_LABELS[u.role]}
                          {u.isPrimary && ' · Primary'}
                        </Badge>
                      ))}
                    </div>
                    {a.customerGroupId && <Badge variant="secondary" className="mt-2 text-[9px]">Группа: {a.customerGroupId}</Badge>}
                  </div>
                  {a.vatExempt && <Badge variant="outline" className="text-[9px]">Без НДС</Badge>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2 mb-6">
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.brand.customerGroups}>Группы клиентов</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.brand.retailers}>Партнёры</Link></Button>
      </div>
      <RelatedModulesBlock links={getB2BLinks()} title="B2B" />
    </div>
  );
}
