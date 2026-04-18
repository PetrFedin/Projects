'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ROUTES } from '@/lib/routes';
import { getB2BCreditTerms, PAYMENT_TERM_LABELS } from '@/lib/fashion/b2b-finance';
import { ArrowLeft, Wallet, CreditCard, Clock, CheckCircle2 } from 'lucide-react';

export default function B2BFinancePage() {
  const buyers = ['BUY-7721', 'BUY-8842', 'BUY-1102', 'BUY-4493'];
  const data = useMemo(() => buyers.map((id) => ({ id, terms: getB2BCreditTerms(id) })), []);

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-6 pb-24">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.brand.growthHub}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <Wallet className="h-6 w-6" />
            B2B Finance & Credit
          </h1>
          <p className="text-sm text-muted-foreground">
            Управление лимитами, отсрочками платежей и задолженностью байеров.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {data.map(({ id, terms }) => (
          <Card key={id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    Partner: {id}
                    <Badge variant="outline" className="text-[10px] font-normal">
                      Active
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Invoicing currency: {terms.currency}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">
                    Credit Limit
                  </p>
                  <p className="text-lg font-bold">
                    {terms.creditLimit.toLocaleString()} {terms.currency}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">Credit Utilization</span>
                  <span>{Math.round((terms.outstandingBalance / terms.creditLimit) * 100)}%</span>
                </div>
                <Progress
                  value={(terms.outstandingBalance / terms.creditLimit) * 100}
                  className="h-2 bg-muted"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Used: {terms.outstandingBalance.toLocaleString()}</span>
                  <span>Available: {terms.availableCredit.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid gap-4 border-t pt-2 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3">
                  <Clock className="h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">
                      Payment Terms
                    </p>
                    <p className="text-xs font-medium">{PAYMENT_TERM_LABELS[terms.paymentTerms]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">
                      Risk Status
                    </p>
                    <p className="text-xs font-medium">Low (Good Payer)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
