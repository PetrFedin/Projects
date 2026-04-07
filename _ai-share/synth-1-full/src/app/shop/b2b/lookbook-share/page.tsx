'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Share2, ArrowLeft, Copy, Check, Link2 } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { getLookbookProjects, getWatermarkedPdfUrl } from '@/lib/b2b/lookbook-projects-store';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';

/** JOOR/Colect: шаринг лукбука/лайншита — ссылка с истечением срока, опционально пароль. */
export default function LookbookSharePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? '';
  const [copied, setCopied] = useState(false);
  const [expiryDays, setExpiryDays] = useState(14);
  const [withPassword, setWithPassword] = useState(false);
  const [sharePassword, setSharePassword] = useState('');

  const projects = getLookbookProjects();
  const project = id ? projects.find((p) => p.id === id) : null;

  const shareLink = typeof window !== 'undefined'
    ? `${window.location.origin}${ROUTES.shop.b2bLookbookShare}?id=${id}`
    : '';

  const handleCopy = useCallback(() => {
    if (typeof navigator !== 'undefined' && shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareLink]);

  return (
    <div className="container max-w-xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2bShowroom}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
            <Share2 className="h-6 w-6" /> Поделиться лукбуком / лайншитом
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Ссылка на просмотр лукбука. Срок действия и пароль (опционально).
          </p>
        </div>
      </div>

      {project ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{project.name}</CardTitle>
            <CardDescription>{project.brandName} · доступ до {new Date(project.visibleUntil).toLocaleDateString('ru-RU')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Ссылка для шаринга</Label>
              <div className="flex gap-2">
                <Input readOnly value={shareLink} className="font-mono text-xs rounded-lg" />
                <Button size="icon" variant="outline" className="rounded-lg shrink-0" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-[10px] text-slate-500">Получатель откроет лукбук по этой ссылке (до даты видимости проекта).</p>
            </div>

            <div className="space-y-2">
              <Label>Срок действия ссылки (дней)</Label>
              <Input
                type="number"
                min={1}
                max={90}
                value={expiryDays}
                onChange={(e) => setExpiryDays(Number(e.target.value) || 14)}
                className="rounded-lg w-24"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="withPassword"
                checked={withPassword}
                onChange={(e) => setWithPassword(e.target.checked)}
                className="rounded border-slate-300"
              />
              <Label htmlFor="withPassword" className="text-sm font-medium">Защитить паролем</Label>
            </div>
            {withPassword && (
              <div className="space-y-2">
                <Label>Пароль для доступа</Label>
                <Input
                  type="password"
                  placeholder="Необязательно"
                  value={sharePassword}
                  onChange={(e) => setSharePassword(e.target.value)}
                  className="rounded-lg"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <Button asChild>
                <a href={getWatermarkedPdfUrl(project.id)} target="_blank" rel="noopener noreferrer">
                  Скачать лайншит (PDF)
                </a>
              </Button>
              <Button variant="outline" asChild>
                <Link href={ROUTES.shop.b2bShowroom}>Виртуальный шоурум</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Link2 className="h-12 w-12 text-slate-300 mx-auto mb-3 block" />
            <p className="text-slate-600 font-medium">Выберите лукбук в виртуальном шоуруме или в разделе «Лукбуки», затем нажмите «Поделиться лайншитом».</p>
            <Button className="mt-4 rounded-xl" asChild>
              <Link href={ROUTES.shop.b2bShowroom}>Открыть виртуальный шоурум</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 flex gap-2">
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bLookbooks}>Лукбуки</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2b}>B2B</Link></Button>
      </div>
      <RelatedModulesBlock links={getShopB2BHubLinks()} title="Шоурум, лукбуки, заказы" className="mt-6" />
    </div>
  );
}
