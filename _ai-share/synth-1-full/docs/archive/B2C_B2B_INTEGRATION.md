# B2C/B2B Integration Architecture

## Обзор системы

Архитектура разделения B2C/B2B операций с синхронизацией остатков между брендами, магазинами и клиентами.

## Ключевые концепции

### 1. Разделение видимости и управления

**Бренд**:
- ✅ Видит все товары в B2C маркетруме (для вдохновения/анализа рынка)
- ✅ Управляет ТОЛЬКО своими товарами
- ✅ Может выставлять свои товары в B2C маркетрум
- ✅ Планирует релизы товаров (scheduled listings)
- ✅ Видит объединенные остатки (свои склады + магазины-партнеры)

**Магазин**:
- ✅ Видит все товары в B2C маркетруме
- ✅ Управляет ТОЛЬКО своими остатками
- ✅ Запрашивает синхронизацию остатков с брендом
- ✅ После одобрения бренда - его остатки видны в маркетруме бренда

**Клиент B2C**:
- ✅ Видит все товары в маркетруме
- ✅ Может заказать у бренда напрямую
- ✅ Может заказать из магазина рядом (pickup/shipping)
- ✅ Видит где какой товар доступен (store locator)

### 2. Синхронизация остатков (Stock Sync)

#### Процесс синхронизации:

```
1. Магазин → запрос на синхронизацию
   └─ Выбирает товары бренда
   └─ Указывает свои остатки
   
2. Бренд → рассматривает запрос
   └─ Одобряет/отклоняет
   └─ Настраивает параметры (частота, условия)
   
3. Система → синхронизирует
   └─ Realtime/Hourly/Daily
   └─ Объединяет в UnifiedStockView
   
4. Маркетрум → показывает клиентам
   └─ Общий сток бренда
   └─ Наличие по магазинам
```

#### Типы синхронизации:

- **Full Agreement** - все товары бренда автоматически
- **Selective Sync** - только выбранные товары/категории
- **Manual Updates** - магазин обновляет вручную

### 3. Unified Stock View (Объединенный вид остатков)

Когда клиент смотрит карточку товара бренда, он видит:

```typescript
{
  productId: "cyber-parka-001",
  brandId: "syntha-lab",
  totalAvailable: 15,
  sources: [
    {
      type: "brand_warehouse",
      locationName: "Syntha Lab Moscow",
      available: 8,
      address: "улица Профсоюзная, 57",
      allowInStorePickup: false
    },
    {
      type: "retail_store",
      locationName: "PODIUM Market",
      available: 5,
      address: "Кутузовский проспект, 48",
      allowInStorePickup: true,
      openingHours: "10:00-22:00"
    },
    {
      type: "retail_store",
      locationName: "TSUM",
      available: 2,
      address: "ул. Петровка, 2",
      allowInStorePickup: true
    }
  ]
}
```

### 4. B2C Product Listing (Выставление товаров)

Бренд может управлять видимостью своих товаров в маркетруме:

```typescript
interface B2CProductListing {
  visibility: 'hidden' | 'scheduled' | 'live' | 'soldout' | 'archived'
  scheduledLiveDate?: string  // Планируемая дата релиза
  b2cPrice: number            // Может отличаться от B2B
  featured: boolean           // Показать на главной
  marketroomCategories: string[] // Категории для маркетрума
}
```

**Workflow**:
1. Бренд создает товар в каталоге
2. Переходит в раздел "B2C Listings"
3. Настраивает видимость и цену для маркетрума
4. Может запланировать релиз на будущее
5. После даты релиза - товар автоматически появляется в маркетруме

### 5. Permissions (Права доступа)

Каждая роль имеет четкие границы:

```typescript
// Бренд
b2c: {
  canViewAllProducts: true,           // Видит все в маркетруме
  canManageOwnProducts: true,         // Управляет своими
  canViewOtherBrandsProducts: true,   // Может смотреть другие
  canCreateB2CListing: true,          // Создает листинги
  canScheduleB2CListing: true,        // Планирует релизы
  canEditB2CPrice: true,              // Меняет B2C цены
  canViewUnifiedStock: true,          // Видит объединенный сток
  canApproveStockSync: true,          // Одобряет синхронизацию
}

b2b: {
  canViewAllWholesale: false,         // Видит только свой оптовый кабинет
  canManageOwnWholesale: true,        // Управляет своими B2B
  canCreateB2BOrder: false,           // Не создает заказы (это делают магазины)
  canRequestStockSync: false,         // Не запрашивает (одобряет)
  canShareRetailStock: false,         // Не делится (получает от магазинов)
}

// Магазин
b2c: {
  canViewAllProducts: true,           // Видит все в маркетруме
  canManageOwnProducts: false,        // Не управляет чужими товарами
  canCreateB2CListing: false,         // Не создает листинги
  canViewUnifiedStock: false,         // Не видит объединенный (только свой)
  canApproveStockSync: false,         // Не одобряет (запрашивает)
}

b2b: {
  canViewAllWholesale: true,          // Видит все B2B коллекции
  canCreateB2BOrder: true,            // Создает оптовые заказы
  canRequestStockSync: true,          // Запрашивает синхронизацию
  canShareRetailStock: true,          // Делится своим стоком
}
```

## Навигация в кабинетах

### Brand Cabinet

**B2C Розничные продажи** → **Маркетрум листинги**:
- Все товары бренда
- Выставление в маркетрум
- Планирование релизов
- Управление B2C ценами

**Продукты** → **Остатки** → **Unified Stock View**:
- Свои склады
- + Синхронизированные остатки магазинов
- Карта магазинов с остатками

**B2B Оптовые продажи** → **Партнеры-магазины** → **Stock Sync**:
- Запросы на синхронизацию от магазинов
- Одобрение/отклонение
- Настройка параметров синхронизации
- Мониторинг синхронизированных остатков

### Shop Cabinet

**Розничные продажи (B2C)** → **Inventory** → **Stock Sync Settings**:
- Выбор брендов для синхронизации
- Запрос синхронизации
- Обновление остатков
- История синхронизации

**Оптовые закупки (B2B)** → **Мои бренды** → **Sync Agreement**:
- Соглашения о синхронизации с брендами
- Условия синхронизации
- Статистика синхронизированных товаров

## Примеры use-cases

### Use Case 1: Бренд выставляет новую коллекцию

```
1. Бренд создает товары в каталоге
2. Переходит: B2C → Маркетрум листинги
3. Выбирает товары → "Создать B2C листинг"
4. Настраивает:
   - B2C цена: 25,000₽
   - Релиз: 1 марта 2026
   - Категории: Верхняя одежда, Новинки
5. Сохраняет (status: "scheduled")
6. 1 марта → автоматически status: "live"
7. Товар появляется в маркетруме для всех клиентов
```

### Use Case 2: Магазин синхронизирует остатки

```
1. Магазин заказал у бренда оптовую партию
2. Товар пришел на склад магазина
3. Магазин: Inventory → Stock Sync → "Запросить синхронизацию"
4. Выбирает бренд "Syntha Lab"
5. Выбирает товары (или все)
6. Указывает остатки: Cyber Parka - 5 шт
7. Бренд получает уведомление
8. Бренд: B2B → Партнеры → Stock Sync Requests
9. Одобряет → выбирает частоту: Realtime
10. Система начинает синхронизацию
11. Теперь в карточке товара бренда клиенты видят:
    - Склад бренда: 8 шт
    - PODIUM Market: 5 шт (с адресом и pickup)
```

### Use Case 3: Клиент заказывает с примеркой

```
1. Клиент смотрит Cyber Parka в маркетруме
2. Видит наличие:
   - Склад бренда (доставка 3-5 дней)
   - PODIUM Market рядом (доступна примерка)
3. Выбирает: "Примерить в PODIUM Market"
4. Резервирует на 24 часа
5. Приходит в магазин, примеряет
6. Покупает → оформляет заказ
7. Система:
   - Списывает из стока PODIUM Market
   - Обновляет Unified Stock View
   - Комиссия делится: бренд + магазин
```

## Технические детали

### Фильтрация данных

```typescript
// В b2b-state.tsx

// Товары - бренд видит все, управляет своими
const filteredProducts = useMemo(() => {
  if (isAdmin) return allProductsData;
  if (isClient) return allProductsData.filter(p => 
    // Клиент видит только live в маркетруме
    b2cListings.find(l => l.productId === p.id && l.visibility === 'live')
  );
  if (isBrand) {
    // Бренд видит все (для анализа рынка)
    // Но редактировать может только свои
    return allProductsData;
  }
  if (isRetailer) return allProductsData;
  return [];
}, [allProductsData, user, isAdmin, isClient, isBrand, isRetailer, b2cListings]);

// Права на редактирование
const canEditProduct = (product: Product) => {
  if (isAdmin) return true;
  if (isBrand) return product.brand === user?.partnerName;
  return false;
};
```

### Компонент Unified Stock View

```tsx
// components/marketplace/UnifiedStockView.tsx
export function UnifiedStockView({ productId }: { productId: string }) {
  const { getUnifiedStock } = useB2BState();
  const stock = getUnifiedStock(productId);
  
  if (!stock) return null;
  
  return (
    <div className="space-y-4">
      <div className="text-lg font-bold">
        Всего в наличии: {stock.totalAvailable} шт
      </div>
      
      {stock.sources.map(source => (
        <div key={source.locationId} className="border rounded-lg p-4">
          <div className="flex justify-between">
            <div>
              <div className="font-medium">{source.locationName}</div>
              <div className="text-sm text-gray-500">{source.address}</div>
            </div>
            <div className="text-right">
              <div className="font-bold">{source.available} шт</div>
              {source.allowInStorePickup && (
                <Badge>Доступна примерка</Badge>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Статус реализации

### ✅ Реализовано (типы):
- Все типы в `marketplace.ts`
- Расширенный интерфейс `B2BState`
- Разделение прав доступа

### 🚧 Требуется реализация:
1. Добавить реализацию методов в `b2b-state.tsx`
2. Создать компоненты для UI:
   - `B2CListingsManager.tsx` (для брендов)
   - `StockSyncManager.tsx` (для брендов)
   - `StockSyncRequester.tsx` (для магазинов)
   - `UnifiedStockView.tsx` (для всех)
   - `StoreLocator.tsx` (для клиентов)
3. Обновить навигацию в разделах
4. Добавить API endpoints для синхронизации

### 📋 Следующие шаги:
1. Реализовать провайдер с новыми методами
2. Создать UI компоненты
3. Интегрировать в существующие страницы
4. Добавить тестовые данные
5. Документировать workflow для каждой роли
