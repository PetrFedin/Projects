# Визуальные улучшения проекта - Полный гайд

## 📋 Содержание

1. [Обзор изменений](#обзор-изменений)
2. [Новые компоненты](#новые-компоненты)
3. [Глобальные стили](#глобальные-стили)
4. [Примеры использования](#примеры-использования)
5. [Чеклист обновления страниц](#чеклист-обновления-страниц)

---

## Обзор изменений

### ✅ Что было добавлено:

1. **Расширенный `globals.css`** с utility классами для:
   - Glass morphism эффектов
   - Градиентов
   - Анимаций
   - Улучшенных теней
   - Статус-индикаторов
   - Скроллбаров

2. **4 новых UI компонента** с современным дизайном:
   - `StatCard` - карточки статистики
   - `ActionCard` - интерактивные карточки действий
   - `StatusBadge` - индикаторы статуса
   - `EmptyState` - пустые состояния
   - `DataCard` - карточки данных
   - `ModernToast` - современные уведомления
   - `Skeleton` - компоненты загрузки

3. **Улучшенная типографика** с anti-aliasing

---

## Новые компоненты

### 1. StatCard (`/src/components/ui/stat-card-improved.tsx`)

Улучшенная версия карточек статистики с трендами.

**Props**:
- `label` - название метрики
- `value` - значение
- `change` - изменение (опционально)
- `icon` - иконка
- `trend` - направление тренда ('up' | 'down' | 'neutral')

**Пример**:

```tsx
import { StatCard } from '@/components/ui/stat-card-improved';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';

<div className="grid grid-cols-4 gap-4">
  <StatCard 
    label="Выручка" 
    value="€1.2M" 
    change="+18%" 
    icon={DollarSign} 
    trend="up"
  />
  <StatCard 
    label="Заказы" 
    value="42" 
    change="+5" 
    icon={ShoppingBag} 
    trend="up"
  />
  <StatCard 
    label="Клиенты" 
    value="128" 
    change="-2%" 
    icon={Users} 
    trend="down"
  />
  <StatCard 
    label="Конверсия" 
    value="94.2%" 
    change="0%" 
    icon={TrendingUp} 
    trend="neutral"
  />
</div>
```

---

### 2. ActionCard (`/src/components/ui/action-card.tsx`)

Интерактивные карточки для быстрых действий.

**Props**:
- `title` - название действия
- `description` - описание (опционально)
- `icon` - иконка
- `href` - ссылка
- `variant` - 'default' | 'premium' | 'glass'
- `size` - 'sm' | 'md' | 'lg'

**Пример**:

```tsx
import { ActionCard } from '@/components/ui/action-card';
import { Plus, Upload, Users, Download } from 'lucide-react';

<div className="grid grid-cols-2 gap-4">
  <ActionCard
    title="Добавить товар"
    description="Создать новый SKU"
    icon={Plus}
    href="/brand/products/new"
    variant="default"
  />
  <ActionCard
    title="Загрузить линейку"
    icon={Upload}
    href="/brand/b2b/linesheets/create"
    variant="premium"
  />
  <ActionCard
    title="Пригласить партнера"
    icon={Users}
    href="/brand/retailers"
    variant="glass"
    size="sm"
  />
</div>
```

---

### 3. StatusBadge (`/src/components/ui/status-badge.tsx`)

Современные индикаторы статуса с анимацией.

**Props**:
- `status` - 'online' | 'offline' | 'busy' | 'away'
- `label` - кастомный текст (опционально)
- `size` - 'sm' | 'md' | 'lg'
- `showDot` - показывать точку (default: true)

**Пример**:

```tsx
import { StatusBadge } from '@/components/ui/status-badge';

<div className="flex gap-2">
  <StatusBadge status="online" />
  <StatusBadge status="busy" label="В эфире" />
  <StatusBadge status="away" size="sm" showDot={false} />
</div>
```

---

### 4. EmptyState (`/src/components/ui/empty-state.tsx`)

Красивые пустые состояния с призывом к действию.

**Props**:
- `icon` - иконка
- `title` - заголовок
- `description` - описание
- `action` - объект с действием (опционально)
- `variant` - 'default' | 'compact' | 'illustrated'

**Пример**:

```tsx
import { EmptyState } from '@/components/ui/empty-state';
import { ShoppingBag, Plus } from 'lucide-react';

<EmptyState
  icon={ShoppingBag}
  title="Нет активных заказов"
  description="Начните добавлять товары в корзину, чтобы создать первый заказ"
  action={{
    label: "Перейти к каталогу",
    onClick: () => router.push('/products'),
    icon: Plus
  }}
  variant="default"
/>
```

---

### 5. DataCard (`/src/components/ui/data-card.tsx`)

Универсальные карточки для отображения данных.

**Props**:
- `title` - заголовок
- `value` - основное значение
- `subtitle` - подзаголовок (опционально)
- `icon` - иконка (опционально)
- `trend` - тренд с направлением
- `footer` - дополнительный контент внизу
- `variant` - 'default' | 'gradient' | 'minimal'
- `size` - 'sm' | 'md' | 'lg'

**Пример**:

```tsx
import { DataCard } from '@/components/ui/data-card';
import { Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

<DataCard
  title="Active Products"
  value="124"
  subtitle="В каталоге"
  icon={Package}
  trend={{ value: "+12", direction: "up" }}
  footer={
    <Button variant="ghost" size="sm" className="w-full">
      Управление <ArrowRight className="ml-2 h-3 w-3" />
    </Button>
  }
  variant="gradient"
  size="md"
/>
```

---

### 6. ModernToast (`/src/components/ui/modern-toast.tsx`)

Современные toast уведомления с анимациями.

**Props**:
- `title` - заголовок
- `description` - описание (опционально)
- `variant` - 'default' | 'success' | 'warning' | 'error' | 'info'
- `duration` - длительность показа
- `onClose` - callback для закрытия

**Пример**:

```tsx
import { ModernToast, ToastContainer } from '@/components/ui/modern-toast';

// В вашем компоненте:
<ToastContainer>
  <ModernToast
    title="Успешно сохранено"
    description="Изменения были применены"
    variant="success"
    onClose={() => setShowToast(false)}
  />
</ToastContainer>
```

---

### 7. Skeleton (`/src/components/ui/skeleton-improved.tsx`)

Улучшенные компоненты загрузки.

**Варианты**:
- `Skeleton` - базовый компонент
- `CardSkeleton` - скелетон карточки
- `TableSkeleton` - скелетон таблицы

**Пример**:

```tsx
import { Skeleton, CardSkeleton, TableSkeleton } from '@/components/ui/skeleton-improved';

// Базовый
<Skeleton variant="text" width="200px" />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="rectangular" height={120} />

// Карточка
<CardSkeleton />

// Таблица
<TableSkeleton rows={5} columns={4} />

// Множественные строки текста
<Skeleton variant="text" rows={3} />
```

---

## Глобальные стили

### Новые utility классы в `globals.css`:

#### Эффекты

```css
/* Стекло */
.glass-effect { /* backdrop blur + прозрачность */ }

/* Градиентный текст */
.gradient-text { /* blue → indigo → purple */ }

/* Hover эффект для карточек */
.card-hover { /* shadow + translate */ }

/* Свечение */
.glow-effect { /* синее свечение */ }
```

#### Градиенты

```css
/* Premium градиент */
.premium-gradient { /* фиолетовый градиент */ }

/* Brand градиент */
.brand-gradient { /* темный элегантный */ }
```

#### Анимации

```css
/* Анимированное подчеркивание */
.animated-underline { /* плавная линия при hover */ }

/* Скелетон загрузки */
.skeleton { /* плавная анимация загрузки */ }

/* Пульсация badge */
.badge-pulse { /* анимация пульсации */ }
```

#### Индикаторы статуса

```css
/* Базовая точка */
.status-dot { /* 2x2 круг */ }

/* Варианты */
.status-online { /* зеленый с тенью */ }
.status-offline { /* серый */ }
.status-busy { /* красный с тенью */ }
```

#### Тени

```css
/* Мягкая тень */
.shadow-soft { /* деликатная тень */ }

/* Жесткая тень */
.shadow-hard { /* выразительная тень */ }
```

#### Скроллбар

```css
/* Скрыть скроллбар */
.scrollbar-hide { /* полное скрытие */ }
```

---

## Примеры использования

### Пример 1: Dashboard со статистикой

```tsx
import { StatCard } from '@/components/ui/stat-card-improved';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        label="Выручка YTD" 
        value="€1.2M" 
        change="+18%" 
        icon={DollarSign} 
        trend="up"
      />
      <StatCard 
        label="Активные заказы" 
        value="42" 
        change="+5" 
        icon={ShoppingBag} 
        trend="up"
      />
      <StatCard 
        label="Новые клиенты" 
        value="28" 
        change="-3%" 
        icon={Users} 
        trend="down"
      />
      <StatCard 
        label="Конверсия" 
        value="94.2%" 
        change="0%" 
        icon={TrendingUp} 
        trend="neutral"
      />
    </div>
  );
}
```

---

### Пример 2: Quick Actions Panel

```tsx
import { ActionCard } from '@/components/ui/action-card';
import { Plus, Upload, Users, FileText } from 'lucide-react';

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ActionCard
        title="Добавить товар"
        description="Создать новый SKU в каталоге"
        icon={Plus}
        href="/brand/products/new"
        variant="default"
      />
      <ActionCard
        title="Загрузить линейку"
        description="Оптовый прайс-лист"
        icon={Upload}
        href="/brand/b2b/linesheets/create"
        variant="premium"
      />
      <ActionCard
        title="Пригласить ритейлера"
        icon={Users}
        href="/brand/retailers"
        variant="glass"
        size="sm"
      />
      <ActionCard
        title="Экспорт данных"
        icon={FileText}
        href="/brand/analytics"
        variant="default"
        size="sm"
      />
    </div>
  );
}
```

---

### Пример 3: Пустое состояние

```tsx
import { EmptyState } from '@/components/ui/empty-state';
import { ShoppingBag, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function EmptyOrders() {
  const router = useRouter();
  
  return (
    <EmptyState
      icon={ShoppingBag}
      title="Пока нет заказов"
      description="Как только появятся новые заказы от ритейлеров, они будут отображаться здесь"
      action={{
        label: "Создать тестовый заказ",
        onClick: () => router.push('/brand/b2b-orders/new'),
        icon: Plus
      }}
      variant="default"
    />
  );
}
```

---

### Пример 4: Toast уведомления

```tsx
import { useState } from 'react';
import { ModernToast, ToastContainer } from '@/components/ui/modern-toast';

export function MyComponent() {
  const [toasts, setToasts] = useState<Array<{id: string, title: string, description: string, variant: string}>>([]);

  const showToast = (title: string, description: string, variant: 'success' | 'error' | 'warning' | 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, description, variant }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <>
      <button onClick={() => showToast('Успех!', 'Данные сохранены', 'success')}>
        Показать toast
      </button>

      <ToastContainer>
        {toasts.map(toast => (
          <ModernToast
            key={toast.id}
            title={toast.title}
            description={toast.description}
            variant={toast.variant as any}
            onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
          />
        ))}
      </ToastContainer>
    </>
  );
}
```

---

### Пример 5: Loading State

```tsx
import { Skeleton, CardSkeleton, TableSkeleton } from '@/components/ui/skeleton-improved';

export function ProductList() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" width="200px" height="32px" />
        <div className="grid grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <TableSkeleton rows={5} columns={4} />
      </div>
    );
  }

  return (
    // ... продукты
  );
}
```

---

### Пример 6: Data Cards

```tsx
import { DataCard } from '@/components/ui/data-card';
import { Package, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

<div className="grid grid-cols-3 gap-6">
  <DataCard
    title="Active Products"
    value="124"
    subtitle="В каталоге"
    icon={Package}
    trend={{ value: "+12", direction: "up" }}
    footer={
      <Button variant="ghost" size="sm" className="w-full">
        Управление
      </Button>
    }
    variant="gradient"
  />
  
  <DataCard
    title="Revenue"
    value="€850K"
    subtitle="This quarter"
    icon={TrendingUp}
    trend={{ value: "+24%", direction: "up" }}
    variant="default"
    size="lg"
  />
</div>
```

---

### Пример 7: Status Indicators

```tsx
import { StatusBadge } from '@/components/ui/status-badge';

// В списке пользователей
<div className="flex items-center gap-3">
  <img src={user.avatar} className="w-10 h-10 rounded-full" />
  <div>
    <div className="font-bold">{user.name}</div>
    <StatusBadge status="online" size="sm" />
  </div>
</div>

// В шапке профиля
<div className="flex items-center justify-between">
  <h1>Brand Dashboard</h1>
  <StatusBadge status="busy" label="Live Stream" size="md" />
</div>
```

---

## Чеклист обновления страниц

### Для каждой страницы проверить:

#### Dashboard Pages
- [ ] Заменить обычные карточки статистики на `<StatCard>`
- [ ] Добавить `<ActionCard>` для быстрых действий
- [ ] Использовать `.card-hover` для всех карточек
- [ ] Добавить `.shadow-soft` вместо обычных теней

#### List/Table Pages
- [ ] Добавить `<EmptyState>` для пустых списков
- [ ] Использовать `<TableSkeleton>` при загрузке
- [ ] Добавить hover эффекты для строк таблицы (уже есть глобально)
- [ ] Добавить `<StatusBadge>` для статусов

#### Form Pages
- [ ] Улучшить focus states (уже есть глобально)
- [ ] Добавить `<ModernToast>` для уведомлений
- [ ] Использовать `.glass-effect` для модальных окон

#### Product Pages
- [ ] Добавить `.card-hover` для карточек товаров
- [ ] Использовать `<Skeleton>` при загрузке изображений
- [ ] Добавить `.gradient-text` для цен премиум-товаров
- [ ] Использовать `.glow-effect` для featured товаров

---

## CSS Utility Classes - Quick Reference

### Layout & Effects
```css
.glass-effect          /* Матовое стекло */
.card-hover           /* Hover эффект для карточек */
.shadow-soft          /* Мягкая тень */
.shadow-hard          /* Жесткая тень */
.scrollbar-hide       /* Скрыть скроллбар */
```

### Text & Typography
```css
.gradient-text        /* Градиентный текст */
.animated-underline   /* Анимированное подчеркивание */
```

### Status & Indicators
```css
.status-dot           /* Базовая точка статуса */
.status-online        /* Зеленый онлайн */
.status-offline       /* Серый офлайн */
.status-busy          /* Красный занят */
.notification-badge   /* Badge с анимацией */
```

### Backgrounds
```css
.premium-gradient     /* Фиолетовый градиент */
.brand-gradient       /* Темный элегантный */
```

### Animations
```css
.skeleton            /* Анимация загрузки */
.badge-pulse         /* Пульсация */
```

---

## Цветовая палитра

### Primary Colors
- **Slate** (основной): `slate-50` до `slate-900`
- **Blue** (accent): `blue-500`, `blue-600`
- **Indigo**: `indigo-500`, `indigo-600`

### Status Colors
- **Success**: `emerald-500`, `emerald-600`
- **Warning**: `amber-500`, `amber-600`
- **Error**: `rose-500`, `rose-600`
- **Info**: `blue-500`, `blue-600`

### Brand Specific
- **Brand Cabinet**: indigo accent
- **Shop Cabinet**: rose accent
- **Admin Cabinet**: indigo accent
- **Client**: blue accent

---

## Best Practices

### 1. Consistency
Используйте одинаковые компоненты для одинаковых паттернов:
- Статистика → `<StatCard>`
- Действия → `<ActionCard>`
- Статусы → `<StatusBadge>`
- Пустые состояния → `<EmptyState>`
- Загрузка → `<Skeleton>`

### 2. Spacing
Используйте Tailwind spacing scale:
- `gap-4`, `gap-6`, `gap-8` для grid/flex
- `space-y-4`, `space-y-6` для вертикальных стеков
- `p-6`, `p-8` для padding карточек

### 3. Border Radius
- Small elements: `rounded-lg` (8px)
- Cards: `rounded-2xl` (16px)
- Large cards: `rounded-3xl` (24px)
- Buttons: `rounded-xl` (12px)

### 4. Shadows
- Subtle: `shadow-soft`
- Medium: `shadow-lg`
- Strong: `shadow-hard` или `shadow-2xl`

### 5. Transitions
Всегда добавляйте плавные переходы:
```tsx
className="transition-all duration-300"
```

---

## Migration Guide

### Обновление существующего Dashboard:

#### Было:
```tsx
<div className="grid grid-cols-4 gap-4">
  {stats.map(stat => (
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-sm text-gray-500">{stat.label}</p>
      <p className="text-2xl font-bold">{stat.value}</p>
    </div>
  ))}
</div>
```

#### Стало:
```tsx
<div className="grid grid-cols-4 gap-6">
  {stats.map(stat => (
    <StatCard
      label={stat.label}
      value={stat.value}
      change={stat.change}
      icon={stat.icon}
      trend={stat.trend}
    />
  ))}
</div>
```

---

## Тестирование

### Чеклист для визуального тестирования:

- [ ] Все карточки имеют hover эффекты
- [ ] Все кнопки имеют active states
- [ ] Все inputs имеют focus states
- [ ] Loading states корректно отображаются
- [ ] Empty states информативны
- [ ] Toasts появляются и исчезают плавно
- [ ] Transitions не глючат
- [ ] Responsive на мобильных устройствах
- [ ] Высокий контраст текста (WCAG AA)
- [ ] Интерактивные элементы ≥ 44x44px

---

## Приоритет обновления страниц

### Высокий приоритет:
1. `/brand` - главная dashboard
2. `/brand/products` - каталог товаров
3. `/brand/b2b-orders` - B2B заказы
4. `/shop` - shop dashboard
5. `/shop/b2b` - B2B hub

### Средний приоритет:
6. `/brand/analytics` - аналитика
7. `/brand/retailers` - партнеры
8. `/shop/orders` - заказы
9. `/shop/inventory` - склад

### Низкий приоритет:
10. Настройки и профили
11. Административные страницы
12. Вспомогательные разделы

---

## Заключение

Все основные визуальные улучшения внедрены и готовы к использованию:

✅ 7 новых UI компонентов с современным дизайном
✅ Расширенный `globals.css` с utility классами
✅ Улучшенная типографика и anti-aliasing
✅ Готовые примеры для всех паттернов
✅ Comprehensive documentation

Теперь можно постепенно обновлять существующие страницы, используя новые компоненты и стили для создания консистентного и профессионального интерфейса.
