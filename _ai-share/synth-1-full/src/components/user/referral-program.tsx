'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  Gift,
  Copy,
  CheckCircle2,
  Share2,
  Mail,
  MessageSquare,
  TrendingUp,
  Award,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Referral {
  id: string;
  email: string;
  status: 'pending' | 'completed' | 'rewarded';
  registeredAt?: Date;
  firstPurchaseAt?: Date;
  rewardEarned?: number;
}

export default function ReferralProgram() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralCode, setReferralCode] = useState('');
  const [totalEarned, setTotalEarned] = useState(0);
  const [pendingRewards, setPendingRewards] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Генерируем реферальный код на основе email
    const code =
      user.email?.split('@')[0].toUpperCase().slice(0, 6) +
      Math.random().toString(36).substring(2, 6).toUpperCase();
    setReferralCode(code);

    // Загружаем рефералов из localStorage
    const stored = localStorage.getItem(`referrals_${user.uid}`);
    if (stored) {
      try {
        const parsed = (JSON.parse(stored) as Referral[]).map((item) => ({
          ...item,
          registeredAt: item.registeredAt ? new Date(item.registeredAt) : undefined,
          firstPurchaseAt: item.firstPurchaseAt ? new Date(item.firstPurchaseAt) : undefined,
        }));
        setReferrals(parsed);
        setTotalEarned(
          parsed
            .filter((r: Referral) => r.rewardEarned)
            .reduce((sum: number, r: Referral) => sum + (r.rewardEarned || 0), 0)
        );
        setPendingRewards(
          parsed.filter((r: Referral) => r.status === 'completed' && !r.rewardEarned).length * 500
        );
      } catch (e) {
        console.error('Failed to parse referrals:', e);
      }
    }
  }, [user]);

  const referralLink =
    typeof window !== 'undefined' ? `${window.location.origin}/signup?ref=${referralCode}` : '';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: 'Код скопирован!',
      description: 'Реферальный код скопирован в буфер обмена',
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: 'Ссылка скопирована!',
      description: 'Реферальная ссылка скопирована в буфер обмена',
    });
  };

  const handleShare = async (method: 'email' | 'message') => {
    const subject = encodeURIComponent('Присоединяйся к Syntha!');
    const body = encodeURIComponent(
      `Привет! Я использую Syntha и хочу пригласить тебя. Используй мой реферальный код ${referralCode} при регистрации и получи скидку 500₽ на первый заказ!\n\n${referralLink}`
    );

    if (method === 'email') {
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    } else if (method === 'message') {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Присоединяйся к Syntha!',
            text: `Используй мой реферальный код ${referralCode} и получи скидку 500₽!`,
            url: referralLink,
          });
        } catch (e) {
          console.error('Share failed:', e);
        }
      } else {
        handleCopyLink();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">{referrals.length}</p>
                <p className="mt-1 text-xs text-muted-foreground">Приглашено друзей</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">{totalEarned.toLocaleString('ru-RU')} ₽</p>
                <p className="mt-1 text-xs text-muted-foreground">Заработано баллов</p>
              </div>
              <Award className="h-8 w-8 text-yellow-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">{pendingRewards.toLocaleString('ru-RU')} ₽</p>
                <p className="mt-1 text-xs text-muted-foreground">Ожидает начисления</p>
              </div>
              <Gift className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code */}
      <Card className="border-2 border-accent/20 bg-gradient-to-br from-background to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Ваш реферальный код
          </CardTitle>
          <CardDescription>
            Приглашайте друзей и получайте бонусы за каждую регистрацию и покупку
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border-2 border-dashed bg-muted/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="mb-2 text-sm text-muted-foreground">Реферальный код</p>
                <p className="font-mono text-sm font-bold">{referralCode}</p>
              </div>
              <Button onClick={handleCopyCode} variant="outline">
                <Copy className="mr-2 h-4 w-4" />
                Копировать
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="mb-2 text-sm text-muted-foreground">Реферальная ссылка</p>
            <div className="flex items-center gap-2">
              <Input value={referralLink} readOnly className="font-mono text-sm" />
              <Button onClick={handleCopyLink} variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="w-full" onClick={() => handleShare('email')}>
              <Mail className="mr-2 h-4 w-4" />
              Отправить email
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleShare('message')}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Поделиться
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Как это работает
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                <span className="text-sm font-bold text-accent">1</span>
              </div>
              <h4 className="mb-2 font-semibold">Поделитесь кодом</h4>
              <p className="text-sm text-muted-foreground">
                Отправьте реферальную ссылку или код друзьям через email, сообщения или социальные
                сети
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                <span className="text-sm font-bold text-accent">2</span>
              </div>
              <h4 className="mb-2 font-semibold">Друг регистрируется</h4>
              <p className="text-sm text-muted-foreground">
                Ваш друг регистрируется по вашей ссылке и получает скидку 500₽ на первый заказ
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                <span className="text-sm font-bold text-accent">3</span>
              </div>
              <h4 className="mb-2 font-semibold">Вы получаете бонус</h4>
              <p className="text-sm text-muted-foreground">
                После первой покупки друга вы получаете 500 баллов на свой счет
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referrals List */}
      <Card>
        <CardHeader>
          <CardTitle>Приглашенные друзья</CardTitle>
          <CardDescription>
            Список пользователей, зарегистрированных по вашей ссылке
          </CardDescription>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">
              <Users className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>Пока никто не зарегистрировался по вашей ссылке</p>
              <p className="mt-2 text-sm">
                Поделитесь реферальным кодом с друзьями, чтобы начать зарабатывать бонусы
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <span className="text-sm font-medium">
                        {referral.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{referral.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {referral.status === 'pending' && 'Ожидает регистрации'}
                        {referral.status === 'completed' && 'Зарегистрирован'}
                        {referral.status === 'rewarded' && 'Бонус начислен'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {referral.rewardEarned && (
                      <Badge variant="outline" className="border-green-500/20 text-green-600">
                        +{referral.rewardEarned} ₽
                      </Badge>
                    )}
                    <Badge
                      variant={
                        referral.status === 'rewarded'
                          ? 'default'
                          : referral.status === 'completed'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {referral.status === 'pending' && 'Ожидает'}
                      {referral.status === 'completed' && 'Завершено'}
                      {referral.status === 'rewarded' && 'Награждено'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
