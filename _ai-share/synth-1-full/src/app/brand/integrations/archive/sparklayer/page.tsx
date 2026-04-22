'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Package,
  Users,
  ShoppingCart,
  FileText,
  Percent,
  Settings,
  Code,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';

type Message = { type: 'success' | 'error'; text: string };

export default function BrandIntegrationsSparkLayerPage() {
  const [products, setProducts] = useState<Array<{ id: string; sku?: string; name?: string }>>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [customers, setCustomers] = useState<Array<{ id: string; email?: string; name?: string }>>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [orders, setOrders] = useState<Array<{ id: string; orderNumber?: string; status?: string; total?: number }>>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [quotes, setQuotes] = useState<Array<{ id: string; quoteNumber?: string; status?: string }>>([]);
  const [quotesLoading, setQuotesLoading] = useState(false);
  const [quoteMsg, setQuoteMsg] = useState<Message | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [rules, setRules] = useState<Array<{ id: string; priceListSlug?: string; minOrderTotal?: number }>>([]);
  const [rulesLoading, setRulesLoading] = useState(false);
  const [discounts, setDiscounts] = useState<Array<{ id: string; code?: string; type?: string; value?: number }>>([]);
  const [discountsLoading, setDiscountsLoading] = useState(false);

  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await fetch('/api/b2b/sparklayer/products?limit=20');
      const data = await res.ok ? res.json() : [];
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const loadCustomers = async () => {
    setCustomersLoading(true);
    try {
      const res = await fetch('/api/b2b/sparklayer/customers?limit=20');
      const data = await res.ok ? res.json() : [];
      setCustomers(Array.isArray(data) ? data : []);
    } catch {
      setCustomers([]);
    } finally {
      setCustomersLoading(false);
    }
  };

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/b2b/sparklayer/orders?limit=20');
      const data = await res.ok ? res.json() : [];
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const loadQuotes = async () => {
    setQuotesLoading(true);
    try {
      const res = await fetch('/api/b2b/sparklayer/quotes?limit=20');
      const data = await res.ok ? res.json() : [];
      setQuotes(Array.isArray(data) ? data : []);
    } catch {
      setQuotes([]);
    } finally {
      setQuotesLoading(false);
    }
  };

  const createQuote = async () => {
    setQuoteMsg(null);
    setQuoteLoading(true);
    try {
      const res = await fetch('/api/b2b/sparklayer/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: 'demo-customer',
          lines: [{ sku: 'DEMO-SKU-01', quantity: 10 }],
          note: 'Demo quote',
        }),
      });
      const data = await res.json();
      if (data.success) setQuoteMsg({ type: 'success', text: `КП создано: ${data.quoteId ?? data.quote?.id}` });
      else setQuoteMsg({ type: 'error', text: data.error ?? 'Ошибка' });
    } catch (e) {
      setQuoteMsg({ type: 'error', text: e instanceof Error ? e.message : 'Ошибка запроса' });
    } finally {
      setQuoteLoading(false);
    }
  };

  const loadRules = async () => {
    setRulesLoading(true);
    try {
      const res = await fetch('/api/b2b/sparklayer/customer-rules');
      const data = await res.ok ? res.json() : [];
      setRules(Array.isArray(data) ? data : []);
    } catch {
      setRules([]);
    } finally {
      setRulesLoading(false);
    }
  };

  const loadDiscounts = async () => {
    setDiscountsLoading(true);
    try {
      const res = await fetch('/api/b2b/sparklayer/discounts?valid=true');
      const data = await res.ok ? res.json() : [];
      setDiscounts(Array.isArray(data) ? data : []);
    } catch {
      setDiscounts([]);
    } finally {
      setDiscountsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.brand.integrations}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">SparkLayer</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Core API (products, customers, orders), Quoting, правила и скидки по клиентам. Pricing API уже встроен.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
              <Package className="h-4 w-4" /> Core API — Products
            </CardTitle>
            <CardDescription>Список продуктов из SparkLayer (дополнение к Pricing API).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" size="sm" onClick={loadProducts} disabled={productsLoading}>
              {productsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Загрузить продукты
            </Button>
            {products.length > 0 && (
              <ul className="border rounded-md divide-y text-sm">
                {products.slice(0, 5).map((p) => (
                  <li key={p.id} className="px-3 py-2 flex justify-between">
                    <span>{p.name ?? p.sku ?? p.id}</span>
                    <Badge variant="secondary">{p.sku ?? p.id}</Badge>
                  </li>
                ))}
                {products.length > 5 && <li className="px-3 py-2 text-slate-500">… ещё {products.length - 5}</li>}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
              <Users className="h-4 w-4" /> Core API — Customers
            </CardTitle>
            <CardDescription>Клиенты B2B.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" size="sm" onClick={loadCustomers} disabled={customersLoading}>
              {customersLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Загрузить клиентов
            </Button>
            {customers.length > 0 && (
              <ul className="border rounded-md divide-y text-sm">
                {customers.slice(0, 5).map((c) => (
                  <li key={c.id} className="px-3 py-2">{c.name ?? c.email ?? c.id}</li>
                ))}
                {customers.length > 5 && <li className="px-3 py-2 text-slate-500">… ещё {customers.length - 5}</li>}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" /> Core API — Orders
            </CardTitle>
            <CardDescription>Заказы. Создание через POST /api/b2b/sparklayer/orders.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={loadOrders} disabled={ordersLoading}>
                {ordersLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Загрузить заказы
              </Button>
              <Link href={ROUTES.brand.b2bOrders}>
                <Button variant="ghost" size="sm">B2B заказы</Button>
              </Link>
            </div>
            {orders.length > 0 && (
              <ul className="border rounded-md divide-y text-sm">
                {orders.slice(0, 5).map((o) => (
                  <li key={o.id} className="px-3 py-2 flex justify-between items-center">
                    <span>{o.orderNumber ?? o.id}</span>
                    {o.status && <Badge variant="secondary">{o.status}</Badge>}
                    {o.total != null && <span>{o.total}</span>}
                  </li>
                ))}
                {orders.length > 5 && <li className="px-3 py-2 text-slate-500">… ещё {orders.length - 5}</li>}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
              <FileText className="h-4 w-4" /> Quoting — запросы КП и workflow
            </CardTitle>
            <CardDescription>КП (quote requests), создание, смена статуса.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={loadQuotes} disabled={quotesLoading}>
                {quotesLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Список КП
              </Button>
              <Button size="sm" onClick={createQuote} disabled={quoteLoading}>
                {quoteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Создать КП
              </Button>
            </div>
            {quoteMsg && (
              <p className={quoteMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}>
                {quoteMsg.type === 'success' ? <CheckCircle2 className="inline h-4 w-4 mr-1" /> : <AlertCircle className="inline h-4 w-4 mr-1" />}
                {quoteMsg.text}
              </p>
            )}
            {quotes.length > 0 && (
              <ul className="border rounded-md divide-y text-sm">
                {quotes.slice(0, 5).map((q) => (
                  <li key={q.id} className="px-3 py-2 flex justify-between">
                    <span>{q.quoteNumber ?? q.id}</span>
                    <Badge variant="secondary">{q.status ?? '—'}</Badge>
                  </li>
                ))}
                {quotes.length > 5 && <li className="px-3 py-2 text-slate-500">… ещё {quotes.length - 5}</li>}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
              <Settings className="h-4 w-4" /> Customer rules
            </CardTitle>
            <CardDescription>Правила по клиентам: прайс-лист, лимиты заказа, способы оплаты.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" size="sm" onClick={loadRules} disabled={rulesLoading}>
              {rulesLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Загрузить правила
            </Button>
            {rules.length > 0 && (
              <ul className="border rounded-md divide-y text-sm">
                {rules.slice(0, 5).map((r) => (
                  <li key={r.id} className="px-3 py-2">
                    {r.priceListSlug ?? r.id} {r.minOrderTotal != null && `· min ${r.minOrderTotal}`}
                  </li>
                ))}
                {rules.length > 5 && <li className="px-3 py-2 text-slate-500">… ещё {rules.length - 5}</li>}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
              <Percent className="h-4 w-4" /> Discounts
            </CardTitle>
            <CardDescription>Скидки: код, тип, значение, условия.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" size="sm" onClick={loadDiscounts} disabled={discountsLoading}>
              {discountsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Загрузить скидки
            </Button>
            {discounts.length > 0 && (
              <ul className="border rounded-md divide-y text-sm">
                {discounts.slice(0, 5).map((d) => (
                  <li key={d.id} className="px-3 py-2">
                    {d.code ?? d.id} · {d.type} {d.value != null && `${d.value}%`}
                  </li>
                ))}
                {discounts.length > 5 && <li className="px-3 py-2 text-slate-500">… ещё {discounts.length - 5}</li>}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
              <Code className="h-4 w-4" /> Фронт: JavaScript SDK
            </CardTitle>
            <CardDescription>
              Для виджетов на сайте магазина используйте{' '}
              <a
                href="https://docs.sparklayer.io/tech-docs/javascript-sdk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline inline-flex items-center gap-1"
              >
                SparkLayer JavaScript SDK <ExternalLink className="h-3 w-3" />
              </a>
              — корзина B2B, расчёт цен, проверка правил. REST API выше — для бэкенда и админки.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-4 flex gap-2">
        <Link href={ROUTES.brand.b2bOrders}>
          <Button variant="outline" size="sm">B2B заказы</Button>
        </Link>
        <Link href={ROUTES.brand.integrationsJoor}>
          <Button variant="ghost" size="sm">JOOR</Button>
        </Link>
        <Link href={ROUTES.brand.integrationsNuOrder}>
          <Button variant="ghost" size="sm">NuOrder</Button>
        </Link>
        <Link href={ROUTES.brand.integrationsFashionCloud}>
          <Button variant="ghost" size="sm">Fashion Cloud</Button>
        </Link>
        <Link href={ROUTES.brand.integrationsColect}>
          <Button variant="ghost" size="sm">Colect</Button>
        </Link>
        <Link href={ROUTES.brand.integrationsZedonk}>
          <Button variant="ghost" size="sm">Zedonk</Button>
        </Link>
      </div>
    </div>
  );
}
