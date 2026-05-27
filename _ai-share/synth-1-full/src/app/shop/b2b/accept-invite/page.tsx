'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { B2bBuyerShell } from '@/components/shop/b2b/B2bBuyerShell';
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';

/** Wave 23: принятие invite-token → partner session + tier. */
export default function B2bAcceptInvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [messageRu, setMessageRu] = useState('');

  useEffect(() => {
    if (!token.trim()) {
      setStatus('error');
      setMessageRu('Токен приглашения не указан.');
      return;
    }
    void fetch('/api/shop/b2b/accept-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((r) => r.json())
      .then(
        (json: {
          ok?: boolean;
          messageRu?: string;
          buyerEmail?: string;
          tier?: string;
          sessionId?: string;
        }) => {
          if (json.ok) {
            setStatus('ok');
            setMessageRu(`Добро пожаловать, ${json.buyerEmail}. Tier: ${json.tier}.`);
            if (json.sessionId) {
              try {
                localStorage.setItem('b2b_partner_session', json.sessionId);
                localStorage.setItem('b2b_partner_tier', json.tier ?? 'standard');
              } catch {
                /* ignore */
              }
            }
          } else {
            setStatus('error');
            setMessageRu(json.messageRu ?? 'Ошибка принятия приглашения.');
          }
        }
      )
      .catch(() => {
        setStatus('error');
        setMessageRu('Сеть недоступна — повторите позже.');
      });
  }, [token]);

  return (
    <CabinetPageContent maxWidth="md">
      <B2bBuyerShell>
        <ShopB2bContentHeader lead="Принятие приглашения бренда — partner session для B2B шоурума." />
        <Card data-testid="b2b-accept-invite">
          <CardHeader>
            <CardTitle className="text-base">Приглашение байера</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p
              className={
                status === 'error' ? 'text-sm text-destructive' : 'text-text-secondary text-sm'
              }
            >
              {messageRu || 'Проверка токена…'}
            </p>
            {status === 'ok' ? (
              <Button onClick={() => router.push('/shop/b2b/showroom?collection=SS27')}>
                Перейти в шоурум
              </Button>
            ) : null}
          </CardContent>
        </Card>
      </B2bBuyerShell>
    </CabinetPageContent>
  );
}
