'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Shield } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { getIntegrationLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';

export default function SSOPage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 pb-24">
      <SectionInfoCard
        title="SSO — Single Sign-On"
        description="Корпоративная аутентификация. SAML 2.0, OIDC. Подключение к корпоративному IdP (Azure AD, Okta, Keycloak)."
        icon={Lock}
        iconBg="bg-slate-100"
        iconColor="text-slate-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              SAML
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              OIDC
            </Badge>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/integrations">Интеграции</Link>
            </Button>
          </>
        }
      />
      <h1 className="text-2xl font-bold uppercase">Single Sign-On</h1>
      <Card className="rounded-xl border border-slate-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" /> Корпоративный вход
          </CardTitle>
          <CardDescription>Настройте вход через корпоративный IdP</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-[11px] text-slate-600">
              Поддерживаемые провайдеры: Azure AD, Okta, Google Workspace, Keycloak
            </p>
            <Button size="sm" variant="outline">
              Настроить SSO
            </Button>
          </div>
        </CardContent>
      </Card>
      <RelatedModulesBlock links={getIntegrationLinks()} />
    </div>
  );
}
