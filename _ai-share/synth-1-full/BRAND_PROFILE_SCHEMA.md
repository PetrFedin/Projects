# Профиль бренда — целевая схема разделов и полей

> Источник правды для наполнения раздела «Профиль» (`/brand`). Использовать при любых правках — не додумывать заново.

---

## 1. Структура

### Группы верхнего уровня

| Группа            | Табы                                                | ROUTES                                            |
| ----------------- | --------------------------------------------------- | ------------------------------------------------- |
| **Профиль**       | Бренд, Юр. данные, Сертификаты, Press Kit           | profile, legal, certificates, presskit            |
| **B2B & Продажи** | Коммерция, Лайншиты, Кампании, Прайсинг, Лояльность | commerce, linesheets, campaigns, pricing, loyalty |
| **B2C & Розница** | Предзаказы, Клиенты, Промо                          | pre-orders, customers, promotions                 |
| **Обзор**         | Обзор, VMI, ESG, RU Layer, Академия                 | overview, vmi, esg, academy                       |

### Таб «Бренд» — подразделы (целевой порядок)

1. О бренде — название, лого, основан, страна
2. Шоурум — адрес, карта, телефон, сайт, график
3. Сайт и соцсети — сайт, Instagram, X, TikTok, YouTube
4. Адреса магазинов — офлайн-точки, синхр. стоков
5. Интернет-магазины — WB, Ozon, Яндекс, парсинг цен
6. Контакты и доступ — почта, логин, TG, WA, телефоны (с подписями: Пресса, B2B, Общий)

---

## 2. Источники данных и синхронизация

| Подраздел         | Кто заполняет                                           | Откуда синхр.                    | Поле state               |
| ----------------- | ------------------------------------------------------- | -------------------------------- | ------------------------ |
| О бренде          | Бренд                                                   | —                                | brand, brandInfo.logos   |
| Шоурум            | Бренд                                                   | —                                | brandInfo.showroom       |
| Сайт, соцсети     | Бренд                                                   | Профиль платформы (isSocialSync) | contacts                 |
| Адреса магазинов  | Бренд добавляет, магазины дополняют график/телефон/сайт | Синхр. стоков, подтверждение     | brandInfo.storeAddresses |
| Интернет-магазины | Бренд                                                   | Парсинг цен (WB, Ozon API)       | brandInfo.onlineStores   |
| Контакты          | Бренд                                                   | —                                | brandContacts            |
| Юр. данные        | Бренд                                                   | ФНС верификация                  | legalData                |

### Связи (один факт — одно место)

| Данные                       | Где master                                      | Где отображается                  |
| ---------------------------- | ----------------------------------------------- | --------------------------------- |
| foundedYear, countryOfOrigin | brand                                           | Хедер (Est., Страна) + Бренд      |
| CEO                          | legalData.ceo, brandDNA.ceo                     | Юр. данные, DNA                   |
| b2bEmail                     | contacts.b2bEmail, brandContacts.externalEmails | Контакты, Legal                   |
| showroom.site                | brandInfo.showroom.site                         | Шоурум (отдельно от сайта бренда) |

---

## 3. Поля по подразделам (детально)

### О бренде

| Поле            | Тип                 | Валидация       | Источник        |
| --------------- | ------------------- | --------------- | --------------- |
| name / nameRU   | string              | Обязательно     | brand           |
| logos[]         | { id, url, isMain } | Основной — один | brandInfo.logos |
| foundedYear     | number              | 1900–2100       | brand           |
| countryOfOrigin | string              | ISO или текст   | brand           |

### Шоурум

| Поле         | Тип                     | Кнопки                                  |
| ------------ | ----------------------- | --------------------------------------- |
| name         | string                  | —                                       |
| address      | string                  | Открыть на карте (yandexMapUrl)         |
| phone        | string                  | tel: ссылка                             |
| site         | string                  | Сайт шоурума (отдельно от сайта бренда) |
| yandexMapUrl | string                  | Открыть на карте                        |
| workingHours | Record<mon–sun, string> | Tooltip «График работы»                 |

### Сайт и соцсети

| Поле         | ROUTES                   |
| ------------ | ------------------------ |
| website      | Сайт бренда              |
| instagram    | @handle                  |
| twitter / X  | @handle                  |
| tiktok       | @handle (опционально)    |
| youtube      | URL канала (опционально) |
| isSocialSync | Badge «Синхронизировано» |

### Контакты и доступ

| Тип            | Структура          | Подпись            |
| -------------- | ------------------ | ------------------ |
| emails         | { value, label }[] | Общий, Пресса, B2B |
| phones         | { value, label }[] | Общий, Пресса, B2B |
| telegrams      | { value, label }[] | Общий, B2B         |
| whatsapps      | { value, label }[] | B2B                |
| externalEmails | { value, label }[] | Пресса, B2B        |
| portalLogin    | string             | Логин в проект     |

---

## 4. Быстрые ссылки из профиля (ROUTES)

| Куда                         | Route                               |
| ---------------------------- | ----------------------------------- |
| Шоурум (полноценный)         | ROUTES.brand.showroom               |
| B2B заказы                   | ROUTES.brand.b2bOrders              |
| Лайншиты                     | ROUTES.brand.b2bLinesheets          |
| Выставки                     | ROUTES.brand.tradeShows             |
| Команда                      | ROUTES.brand.team                   |
| Юр. данные (вкладка)         | /brand?tab=legal                    |
| Настройки                    | ROUTES.brand.settings               |
| Сравнение цен (маркетплейсы) | ROUTES.brand.pricingPriceComparison |

---

## 5. Completeness (полнота профиля)

Блоки: brand, legal, certificates, commerce, presskit, linesheets, pricing.

Расширить при необходимости: showroom, stores, onlineStores, contacts.

---

## 6. Чек-лист при правках

- [ ] Нет дублирования (один факт — одно место)
- [ ] У подраздела есть описание и источник данных
- [ ] Кнопки используют ROUTES.\*
- [ ] Контакты — { value, label } с подписью
- [ ] Шоурум: yandexMapUrl для «Открыть на карте»
