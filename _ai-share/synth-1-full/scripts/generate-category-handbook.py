#!/usr/bin/env python3
"""Генерация src/lib/data/category-handbook.ts из таксономии ур.1–3."""
from __future__ import annotations

from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "src" / "lib" / "data" / "category-handbook.ts"

# Заполнитель для «листа» без отдельного подтипа (в таблице показывается как «—»).
SINGLE_LEAF = "—"

HEADER = r'''/**
 * Справочник категорий — снимок строится через `npm run gen:category-catalog`.
 * Иерархия: Ур.1 → Ур.2 → лист (ур.3 в таблице).
 * Файл сгенерирован скриптом `scripts/generate-category-handbook.py` (не править дерево руками).
 */

export interface CategoryAttribute {
  id: string;
  name: string;
  type: 'select' | 'multiselect' | 'text' | 'number';
  options?: string[];
  required?: boolean;
}

export interface CategoryNode {
  id: string;
  name: string;
  children?: CategoryNode[];
  attributes?: CategoryAttribute[];
}

export interface Audience {
  id: string;
  name: string;
  categories: CategoryNode[];
}

export const GLOBAL_ATTRIBUTES: CategoryAttribute[] = [
  {
    id: 'color',
    name: 'Цвет',
    type: 'select',
    options: ['Чёрный', 'Белый', 'Тёмно-синий', 'Серый', 'Бежевый', 'Красный'],
  },
  {
    id: 'season',
    name: 'Сезон',
    type: 'select',
    options: ['Весна–лето', 'Осень–зима', 'Круиз', 'Пре-осень', 'Мультисезон'],
  },
  { id: 'composition', name: 'Состав', type: 'text' },
  {
    id: 'countryOfOrigin',
    name: 'Страна производства',
    type: 'select',
    options: ['Россия', 'Китай', 'Турция', 'Италия', 'Вьетнам', 'Беларусь', 'Узбекистан'],
  },
];

'''

# --- Taxonomy -------------------------------------------------

ODEZHDA: list[tuple[str, list[str]]] = [
    (
        "Верхняя одежда",
        [
            "Пальто",
            "Тренчи",
            "Парки",
            "Пуховики",
            "Куртки",
            "Бомберы",
            "Ветровки",
            "Жилеты",
            "Плащи",
            "Дождевики",
            "Пончо",
            "Шубы",
            "Лайнеры",
            "Подстёжки",
            "Комбинезоны",
            "Анораки",
            "Косухи",
            "Дубленки"
        ],
    ),
    (
        "Костюмы и жакеты",
        ["Костюмы", "Блейзеры", "Смокинги", "Фраки", "Пиджаки", "Жилеты"],
    ),
    ("Платья и сарафаны", ["Платья", "Сарафаны", "Туники"]),
    ("Юбки", ["Мини", "Миди", "Макси"]),
    ("Рубашки и блузы", ["Рубашки", "Блузы", "Сорочки"]),
    ("Топы и футболки", ["Топы", "Футболки", "Поло", "Майки", "Кроп-топы", "Лонгсливы"]),
    ("Джинсы", ["Прямые", "Зауженные", "Широкие", "Клеш", "Бойфренды", "Мом", "Скинни"]),
    ("Брюки", ["Классические", "Чиносы", "Спортивные", "Джоггеры", "Карго", "Леггинсы", "Шорты", "Бермуды"]),
    ("Трикотаж", ["Свитеры", "Худи", "Кардиганы", "Водолазки", "Джемперы", "Пуловеры", "Свитшоты"]),
    ("Нижнее бельё", ["Трусы", "Бюстгальтеры", "Бюстье", "Боди", "Термобелье", "Комбинации", "Корсеты"]),
    ("Спортивная одежда", ["Спортивные костюмы", "Тайтсы", "Рашгарды", "Спортивные топы", "Шорты для плавания"]),
    ("Пляжная мода", ["Слитные купальники", "Раздельные купальники", "Плавки", "Парео", "Пляжные туники"]),
    ("Пижамы и домашняя одежда", ["Халаты", "Комплекты", "Ночные сорочки", "Пижамы"]),
]

OBUV: list[tuple[str, list[str]]] = [
    ("Кроссовки", ["Спортивные", "Повседневные", "Хайтопы", "Сникерсы"]),
    ("Туфли", ["Классические / лодочки", "Балетки", "Лоферы", "Оксфорды", "Дерби", "Броги"]),
    ("Ботинки", ["Демисезонные", "Зимние", "Челси", "Дезерты", "Берцы", "Тимберленды", "Треккинговые"]),
    ("Сандалии и шлёпанцы", ["Сандалии", "Шлепанцы", "Босоножки", "Вьетнамки", "Сабо", "Мюли"]),
    ("Сапоги", ["Зимние", "Демисезонные", "Ботфорты", "Полусапоги", "Резиновые", "Казаки"]),
    ("Мокасины и топсайдеры", ["Мокасины", "Топсайдеры", "Слипоны", "Эспадрильи"]),
    ("Угги и унты", ["Валенки", "Угги", "Унты", "Дутики"]),
    ("Домашняя обувь", ["Тапочки", "Чуни"]),
]

SUMKI: list[tuple[str, list[str]]] = [
    ("Повседневные", ["Тот", "Шоппер", "Кросс-боди", "Рюкзак", "Клатч", "Поясная", "Сумка-мешок", "Сумка-багет"]),
    ("Вечерние", ["Клатчи", "Минодьеры", "Сумки-конверты"]),
    ("Чемоданы", ["На колесах", "Сумки-тележки", "Кейсы"]),
    ("Рабочие", ["Для ноутбука", "Портфель", "Папки", "Сумка-портфель"]),
    ("Спортивные и дорожные", ["Спортивные сумки", "Дорожные сумки", "Рюкзаки туристические", "Дафл"]),
    ("Косметички", ["Несессеры", "Бьюти-кейсы", "Косметички"]),
]

AKS: list[tuple[str, list[str]]] = [
    ("Очки", ["Солнцезащитные", "Оправы", "Футляры для очков"]),
    ("Ремни и подтяжки", ["Ремни", "Подтяжки", "Пояса"]),
    ("Перчатки и варежки", ["Перчатки", "Варежки", "Митенки"]),
    ("Шарфы", ["Шарфы", "Снуды", "Палантины", "Горжетки"]),
    ("Галстуки и бабочки", ["Галстуки", "Бабочки", "Зажимы для галстука"]),
    ("Платки", ["Шейные платки", "Банданы", "Косынки"]),
    ("Украшения", ["Кольца", "Серьги", "Браслеты", "Колье", "Подвески", "Броши", "Цепочки"]),
    ("Кожгалантерея мелкая", ["Кошельки", "Портмоне", "Визитницы", "Ключницы", "Обложки для документов"]),
    ("Зонты", ["Трости", "Складные"]),
    ("Тех-аксессуары", ["Чехлы для телефонов", "Чехлы для наушников", "Ремешки для часов"]),
    ("Маски и бафы", ["Маски", "Балаклавы", "Бафы"]),
]

HEADWEAR: list[tuple[str, list[str]]] = [
    ("Кепки", ["Бейсболки", "Снепбеки", "Тракеры", "Кепки-уточки"]),
    ("Панамы", ["Панамы", "Шляпы-ведро"]),
    ("Шляпы", ["Федоры", "Трилби", "Канотье", "Широкополые", "Цилиндры", "Котелки"]),
    ("Береты", ["Классические", "Объемные"]),
    ("Шапки", ["Бини", "Ушанки", "С помпоном", "Капоры"]),
]

HOSIERY: list[tuple[str, list[str]]] = [
    ("Носки", ["Короткие", "Классические", "Спортивные", "Следки"]),
    ("Колготки", ["Капроновые", "Хлопковые", "Шерстяные", "Фантазийные"]),
    ("Чулки", ["С кружевом", "Под пояс", "Компрессионные"]),
    ("Гольфы", ["Капроновые", "Хлопковые"]),
    ("Гетры", ["Спортивные", "Вязаные"]),
]

BEAUTY: list[tuple[str, list[str]]] = [
    ("Парфюмерия", ["Духи", "Парфюмерная вода", "Туалетная вода", "Одеколоны", "Спреи для тела"]),
    ("Косметика", ["Для лица", "Для глаз", "Для губ", "Для бровей", "Палетки", "Кисти и спонжи"]),
    ("Уход", ["Для лица", "Для тела", "Для волос", "Для рук", "Для ног", "Солнцезащитные средства"]),
]

HOME: list[tuple[str, list[str]]] = [
    ("Текстиль", ["Пледы", "Скатерти", "Постельное", "Полотенца", "Коврики для ванной", "Шторы", "Салфетки"]),
    ("Декор", ["Вазы", "Свечи", "Подсвечники", "Картины", "Постеры", "Зеркала", "Статуэтки"]),
    ("Аксессуары", ["Ароматы для дома", "Диффузоры", "Саше", "Органайзеры"]),
    ("Питомцы", ["Одежда", "Лежанки", "Переноски", "Поводки", "Ошейники", "Игрушки", "Миски"]),
    ("Lifestyle-гаджеты", ["Будильники", "Лампы", "Увлажнители", "Массажеры"]),
]

NEWBORN: list[tuple[str, list[str]]] = [
    ("Коляски", ["Коляски", "Аксессуары для колясок"]),
    ("Аксессуары", ["Пелёнки", "Бутылочки", "Соски и пустышки", "Подгузники", "Поильники", "Гигиена и купание", "Переноски и слинги", "Прочее"]),
]

TOYS: list[tuple[str, list[str]]] = [
    ("Игрушки", ["Мягкие игрушки", "Развивающие", "Конструкторы", "Куклы", "Машинки", "Настольные игры"]),
]


def escape_ts_str(s: str) -> str:
    return s.replace("\\", "\\\\").replace("'", "\\'")


def node_group(root_id: str, gidx: int, l2_name: str, l3_names: list[str]) -> tuple[str, str]:
    """Уникальные id: {root}-g{gidx} и листья {root}-g{gidx}-l{j} (кириллица только в name)."""
    l2_id = f"{root_id}-g{gidx}"[:72]
    lines = [
        "          {",
        f"            id: '{l2_id}',",
        f"            name: '{escape_ts_str(l2_name)}',",
        "            children: [",
    ]
    for j, leaf in enumerate(l3_names):
        lid = f"{root_id}-g{gidx}-l{j}"[:90]
        lines.append(
            f"              {{ id: '{lid}', name: '{escape_ts_str(leaf)}' }},"
        )
    lines.append("            ],")
    lines.append("          },")
    return l2_id, "\n".join(lines)


def build_root_apparel(aud: str, label: str, groups: list[tuple[str, list[str]]]) -> str:
    root_id = f"{aud}-apparel"
    parts = [
        "      {",
        f"        id: '{root_id}',",
        f"        name: '{escape_ts_str(label)}',",
        "        children: [",
    ]
    for gi, (l2_name, leaves) in enumerate(groups):
        _, block = node_group(root_id, gi, l2_name, leaves)
        parts.append(block)
    parts.append("        ],")
    parts.append("      },")
    return "\n".join(parts)


def build_root_groups(
    aud: str, root_id_suffix: str, root_name: str, groups: list[tuple[str, list[str]]]
) -> str:
    root_id = f"{aud}-{root_id_suffix}"
    parts = [
        "      {",
        f"        id: '{root_id}',",
        f"        name: '{escape_ts_str(root_name)}',",
        "        children: [",
    ]
    for gi, (l2_name, leaves) in enumerate(groups):
        _, block = node_group(root_id, gi, l2_name, leaves)
        parts.append(block)
    parts.append("        ],")
    parts.append("      },")
    return "\n".join(parts)


def audience_block(
    aud: str,
    aud_label: str,
    apparel_groups: list[tuple[str, list[str]]],
    include_beauty_home: bool,
    include_newborn: bool,
) -> str:
    parts = [
        "  {",
        f"    id: '{aud}',",
        f"    name: '{escape_ts_str(aud_label)}',",
        "    categories: [",
        build_root_apparel(aud, "Одежда", apparel_groups),
        build_root_groups(aud, "shoes", "Обувь", OBUV),
        build_root_groups(aud, "bags", "Сумки", SUMKI),
        build_root_groups(aud, "accessories", "Аксессуары", AKS),
        build_root_groups(aud, "headwear", "Головные уборы", HEADWEAR),
        build_root_groups(aud, "hosiery", "Носочно-чулочные", HOSIERY),
    ]
    if include_beauty_home:
        parts.append(
            build_root_groups(aud, "beauty", "Красота и уход", BEAUTY)
        )
        parts.append(
            build_root_groups(aud, "home", "Дом и стиль жизни", HOME)
        )
    if include_newborn:
        parts.append(
            build_root_groups(aud, "newborn", "Аксессуары для новорождённых", NEWBORN)
        )
    parts.append(
        build_root_groups(
            aud,
            "toys",
            "Игрушки (детские)",
            TOYS,
        )
    )
    parts.append("    ],")
    parts.append("  },")
    return "\n".join(parts)


def main() -> None:
    catalog = audience_block("catalog", "Каталог", ODEZHDA, True, True)
    women = audience_block("women", "Женщины", ODEZHDA, True, False)
    men = audience_block("men", "Мужчины", ODEZHDA, True, False)
    kids = audience_block("kids", "Дети", ODEZHDA, False, True)
    unisex = audience_block("unisex", "Унисекс", ODEZHDA, True, False)

    content = (
        HEADER
        + "\nexport const CATEGORY_HANDBOOK: Audience[] = [\n"
        + catalog + "\n" + women + "\n" + men + "\n" + kids + "\n" + unisex
        + "\n];\n"
    )
    OUT.write_text(content, encoding="utf-8")
    print(f"Wrote {OUT} ({len(content)} bytes)")


if __name__ == "__main__":
    main()
