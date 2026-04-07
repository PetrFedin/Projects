# Архитектура Mock данных

## Обзор

Вся функциональность работает на mock данных с использованием localStorage для персистентности. Архитектура построена на Repository Pattern, что позволяет легко заменить mock реализации на Firebase без изменения бизнес-логики.

## Структура

```
src/lib/repositories/
├── types.ts              # Интерфейсы репозиториев
├── index.ts              # Экспорты (точка замены на Firebase)
└── mock/
    ├── auth.ts           # Mock аутентификация
    ├── products.ts       # Mock каталог товаров
    ├── cart.ts           # Mock корзина
    ├── wishlist.ts       # Mock wishlist
    ├── orders.ts         # Mock заказы
    └── payment.ts        # Mock платежи
```

## Репозитории

### AuthRepository
- `signIn(email, password)` - вход пользователя
- `signUp(email, password, displayName)` - регистрация
- `signOut()` - выход
- `getCurrentUser()` - получить текущего пользователя
- `onAuthStateChanged(callback)` - подписка на изменения

**Хранение:** localStorage ключ `syntha_auth_user`

### ProductsRepository
- `getAll()` - все товары
- `getById(id)` - товар по ID
- `getBySlug(slug)` - товар по slug
- `search(query)` - поиск товаров
- `getByCategory(category)` - товары по категории
- `getByBrand(brandId)` - товары по бренду

**Источник данных:** `src/lib/products.ts`

### CartRepository
- `getCart(userId)` - получить корзину
- `addItem(userId, item)` - добавить товар
- `updateItem(userId, productId, size, quantity)` - обновить количество
- `removeItem(userId, productId, size)` - удалить товар
- `clearCart(userId)` - очистить корзину
- `onCartChange(userId, callback)` - подписка на изменения

**Хранение:** localStorage ключ `syntha_cart_{userId}`

### WishlistRepository
- `getWishlist(userId)` - получить wishlist
- `getCollections(userId)` - получить коллекции
- `addItem(userId, product, collectionId?)` - добавить товар
- `removeItem(userId, productId, collectionId?)` - удалить товар
- `addCollection(userId, name)` - создать коллекцию
- `onWishlistChange(userId, callback)` - подписка на изменения

**Хранение:** 
- `syntha_wishlist_{userId}`
- `syntha_wishlist_collections_{userId}`

### OrdersRepository
- `getOrders(userId)` - получить все заказы
- `getOrderById(userId, orderId)` - получить заказ
- `createOrder(userId, orderData)` - создать заказ
- `updateOrderStatus(userId, orderId, status)` - обновить статус
- `onOrdersChange(userId, callback)` - подписка на изменения

**Хранение:** localStorage ключ `syntha_orders_{userId}`

### PaymentRepository
- `createPaymentIntent(amount, currency, metadata)` - создать платеж
- `confirmPayment(paymentIntentId)` - подтвердить платеж

**Хранение:** localStorage ключ `syntha_payment_intents`

## Интеграция

### AuthProvider
`src/providers/auth-provider.tsx` - управляет состоянием аутентификации

```tsx
const { user, loading, signIn, signUp, signOut } = useAuth();
```

### UIStateProvider
`src/providers/ui-state.tsx` - синхронизируется с репозиториями для корзины и wishlist

### Checkout Flow
1. Пользователь заполняет форму доставки
2. Создается payment intent через `paymentRepository`
3. Платеж подтверждается (mock - всегда успешен)
4. Создается заказ через `ordersRepository`
5. Корзина очищается через `cartRepository`
6. Редирект на страницу подтверждения заказа

## Замена на Firebase

Для замены на Firebase:

1. Создать `src/lib/repositories/firebase/` с реализациями интерфейсов
2. Обновить `src/lib/repositories/index.ts`:
   ```ts
   // Заменить
   export const authRepository = mockAuthRepository;
   // На
   export const authRepository = firebaseAuthRepository;
   ```

Все компоненты продолжат работать без изменений!

## Тестовый пользователь

По умолчанию создан тестовый пользователь:
- Email: `test@example.com`
- Password: `password123`

## Особенности

- Все данные сохраняются в localStorage
- Realtime обновления через listeners (симулируются)
- Платежи всегда успешны (95% success rate в mock)
- Заказы создаются с уникальными ID
- Корзина и wishlist синхронизируются между вкладками (через localStorage events)

## Демо Flow

1. **Регистрация/Вход:** `/login`
2. **Просмотр каталога:** Главная страница
3. **Добавление в корзину:** Любая страница товара
4. **Оформление заказа:** `/checkout`
5. **Подтверждение:** `/orders/{orderId}`
6. **История заказов:** `/orders`

## AI Stylist

AI Stylist интегрирован с каталогом:
- Генерирует образ по запросу
- Ищет подходящие товары из каталога
- Показывает рекомендации с возможностью добавить в корзину

Функция поиска: `src/lib/ai-product-matcher.ts`





