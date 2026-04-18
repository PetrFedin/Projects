import Link from 'next/link';
import { tid } from '@/lib/ui/test-ids';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PressPage() {
  return (
    <RegistryPageShell className="max-w-5xl space-y-6 p-4" data-testid={tid.page('press')}>
      <RegistryPageHeader
        title="Пресса"
        leadPlain="Материалы для СМИ, бренд-кит и контакт ответственного за комментарии."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Последние материалы</CardTitle>
            <CardDescription>Короткие заметки о запусках и коллекциях (демо).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">FW26 — превью ключевых линий (PDF, скоро).</p>
            <p className="text-muted-foreground">Syntha Metaverse — тизер AR-дропа.</p>
            <Button variant="outline" size="sm" className="h-8" asChild>
              <Link href="/about">Все новости</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Бренд-кит и запросы</CardTitle>
            <CardDescription>
              Скачайте логотипы и попросите комментарий у пресс-службы.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button size="sm" className="h-8" asChild>
              <a href="/images/hero.svg" download>
                Скачать бренд-кит (демо)
              </a>
            </Button>
            <Button variant="secondary" size="sm" className="h-8" asChild>
              <a href="mailto:press@syntha.example?subject=Комментарий%20Syntha">
                Запросить комментарий
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Кто отвечает</CardTitle>
          <CardDescription>Пресс-служба Syntha (демо-контакт).</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Ответственный:</span> пресс-офицер бренда
            ·{' '}
            <a
              className="text-accent-primary underline-offset-2 hover:underline"
              href="mailto:press@syntha.example"
            >
              press@syntha.example
            </a>
          </p>
        </CardContent>
      </Card>
    </RegistryPageShell>
  );
}
