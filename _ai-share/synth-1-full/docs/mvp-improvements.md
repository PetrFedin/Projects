# План улучшений для MVP демонстрации инвесторам

## 🚨 Критические приоритеты (Must Have для демо)

### 1. Firebase инициализация и интеграция
**Статус:** ❌ Не реализовано  
**Приоритет:** КРИТИЧЕСКИЙ

**Что нужно:**
- [ ] Создать `src/lib/firebase/config.ts` с инициализацией Firebase
- [ ] Настроить Firebase Auth (Email/Password, Google, Apple)
- [ ] Настроить Firestore
- [ ] Настроить Firebase Storage
- [ ] Создать `.env.local` с конфигурацией Firebase
- [ ] Создать Firebase проект в консоли

**Файлы для создания:**
```
src/lib/firebase/
  ├── config.ts          # Инициализация Firebase
  ├── auth.ts            # Auth helpers
  ├── firestore.ts       # Firestore helpers
  └── storage.ts         # Storage helpers
```

### 2. Аутентификация пользователей
**Статус:** ❌ Только mock данные  
**Приоритет:** КРИТИЧЕСКИЙ

**Что нужно:**
- [ ] Страница `/login` с формами входа
- [ ] Страница `/register` с регистрацией
- [ ] Компонент `AuthProvider` для управления сессией
- [ ] Защита роутов (middleware для Next.js)
- [ ] Интеграция с `UIStateProvider` для реального user
- [ ] Восстановление пароля

**Интеграция:**
- Заменить mock user в `UIStateProvider` на реального из Firebase Auth
- Добавить `onAuthStateChanged` listener

### 3. Работа с Firestore (данные)
**Статус:** ❌ Все в локальном состоянии  
**Приоритет:** КРИТИЧЕСКИЙ

**Что нужно:**
- [ ] Синхронизация корзины с `/users/{uid}/cart`
- [ ] Синхронизация wishlist с `/users/{uid}/wishlist`
- [ ] Загрузка продуктов из `/brands/{brandId}/products`
- [ ] Сохранение заказов в `/users/{uid}/orders`
- [ ] Realtime listeners для обновлений

**Файлы для создания:**
```
src/lib/firestore/
  ├── cart.ts            # Cart operations
  ├── wishlist.ts        # Wishlist operations
  ├── products.ts        # Products queries
  ├── orders.ts          # Orders operations
  └── users.ts           # User profile operations
```

### 4. Checkout и платежи
**Статус:** ❌ Только mock toast  
**Приоритет:** КРИТИЧЕСКИЙ

**Что нужно:**
- [ ] API route `/api/checkout/create-intent` для создания платежа
- [ ] Интеграция со Stripe или ЮKassa
- [ ] Страница подтверждения заказа `/checkout/success`
- [ ] Webhook handler `/api/webhooks/payment` для обработки платежей
- [ ] Создание заказа в Firestore после успешной оплаты
- [ ] Резервирование товаров на складе

**Файлы для создания:**
```
src/app/api/
  ├── checkout/
  │   └── create-intent/
  │       └── route.ts
  └── webhooks/
      └── payment/
          └── route.ts
```

### 5. Firestore Security Rules
**Статус:** ⚠️ Много TODO  
**Приоритет:** КРИТИЧЕСКИЙ

**Что нужно:**
- [ ] Доработать правила для `/brands/{brandId}`
- [ ] Доработать правила для `/b2b/linesheets`
- [ ] Доработать правила для `/b2b/preorders`
- [ ] Доработать правила для `/shops/{shopId}`
- [ ] Доработать правила для `/promos`
- [ ] Доработать правила для `/community/looks`
- [ ] Протестировать все правила

## ⚡ Важные улучшения (Should Have)

### 6. Cloud Functions (базовые)
**Статус:** ❌ Не реализовано  
**Приоритет:** ВЫСОКИЙ

**Что нужно:**
- [ ] `onOrderCreate` - валидация и создание заказа
- [ ] `onPaymentWebhook` - обработка платежей
- [ ] `onUserCreate` - создание профиля при регистрации
- [ ] `recoAlsoBought` - рекомендации товаров

**Структура:**
```
functions/
  ├── src/
  │   ├── index.ts
  │   ├── orders.ts
  │   ├── payments.ts
  │   └── users.ts
  └── package.json
```

### 7. AI Stylist интеграция с каталогом
**Статус:** ⚠️ Генерирует изображения, но не товары  
**Приоритет:** ВЫСОКИЙ

**Что нужно:**
- [ ] Интеграция AI Stylist с Firestore products
- [ ] Поиск реальных товаров по описанию AI
- [ ] Кнопки "Добавить в корзину" для предложенных товаров
- [ ] Сохранение образов в lookboards

### 8. Обработка ошибок
**Статус:** ❌ Нет error boundaries  
**Приоритет:** СРЕДНИЙ

**Что нужно:**
- [ ] Error Boundary компонент
- [ ] Fallback UI для ошибок
- [ ] Toast уведомления для ошибок
- [ ] Логирование ошибок

### 9. Аналитика
**Статус:** ❌ Не реализовано  
**Приоритет:** СРЕДНИЙ

**Что нужно:**
- [ ] Firebase Analytics события:
  - `view_item`
  - `add_to_cart`
  - `begin_checkout`
  - `purchase`
  - `ai_stylist_use`
- [ ] Интеграция в ключевые компоненты

### 10. Оптимизация производительности
**Статус:** ⚠️ Нужна оптимизация  
**Приоритет:** СРЕДНИЙ

**Что нужно:**
- [ ] Lazy loading для изображений
- [ ] Code splitting для больших компонентов
- [ ] Оптимизация bundle size
- [ ] Кэширование Firestore запросов

## 📋 Nice to Have (для впечатляющего демо)

### 11. PWA функциональность
- [ ] Service Worker
- [ ] Offline поддержка
- [ ] Push уведомления

### 12. SEO оптимизация
- [ ] Meta tags для всех страниц
- [ ] Open Graph tags
- [ ] Structured data (JSON-LD)

### 13. Тестирование
- [ ] Unit тесты для критичных функций
- [ ] E2E тесты для checkout flow

### 14. Мониторинг
- [ ] Sentry для error tracking
- [ ] Performance monitoring

## 🎯 План действий (приоритетный порядок)

### Неделя 1: Критические основы
1. ✅ Firebase инициализация
2. ✅ Аутентификация
3. ✅ Базовая работа с Firestore (корзина, wishlist)
4. ✅ Firestore Security Rules доработка

### Неделя 2: Checkout и платежи
5. ✅ Checkout интеграция
6. ✅ Платежная система
7. ✅ Создание заказов
8. ✅ Cloud Functions (базовые)

### Неделя 3: Полировка
9. ✅ AI Stylist интеграция
10. ✅ Обработка ошибок
11. ✅ Аналитика
12. ✅ Тестирование flow

## 📝 Чеклист перед демо

### Функциональность
- [ ] Пользователь может зарегистрироваться и войти
- [ ] Пользователь может просматривать каталог
- [ ] Пользователь может добавить товар в корзину
- [ ] Корзина сохраняется между сессиями
- [ ] Пользователь может оформить заказ
- [ ] Платеж проходит успешно (test mode)
- [ ] Заказ создается в Firestore
- [ ] AI Stylist предлагает реальные товары
- [ ] Все страницы загружаются без ошибок

### Техническое
- [ ] Firebase проект настроен
- [ ] Firestore rules протестированы
- [ ] Environment variables настроены
- [ ] Build проходит без ошибок
- [ ] Нет критических ошибок в консоли

### UX
- [ ] Loading states для всех async операций
- [ ] Error messages понятны пользователю
- [ ] Мобильная версия работает
- [ ] Нет broken links

## 🔧 Технические детали

### Firebase конфигурация
```typescript
// src/lib/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### Пример Firestore синхронизации корзины
```typescript
// src/lib/firestore/cart.ts
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

export const syncCart = (userId: string, callback: (items: CartItem[]) => void) => {
  const cartRef = collection(db, `users/${userId}/cart`);
  return onSnapshot(cartRef, (snapshot) => {
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(items);
  });
};
```

## 📊 Метрики успеха MVP

- ✅ Все критические функции работают
- ✅ Нет критических багов
- ✅ Демо можно провести за 10-15 минут
- ✅ Инвесторы видят полный цикл: регистрация → покупка → заказ
- ✅ AI функции демонстрируются
- ✅ B2B функции доступны (если нужны для демо)





