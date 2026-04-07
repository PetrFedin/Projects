#!/usr/bin/env python3
"""Генерация src/lib/data/category-handbook.ts из таксономии ур.1–3 (один список на женскую линию)."""
from __future__ import annotations

from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "src" / "lib" / "data" / "category-handbook.ts"

# Заполнитель для «листа» без отдельного подтипа (в таблице показывается как «—»).
SINGLE_LEAF = "—"

HEADER = r'''/**
 * Справочник категорий — снимок строится через `npm run gen:category-catalog`.
 * Иерархия: Ур.1 → Ур.2 → лист (ур.3 в таблице). Одна запись «Каталог» без разбиения по аудиториям.
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
    options: ['Весна–лето', 'Осень–зима', 'Круиз', 'Пре-осень'],
  },
  { id: 'composition', name: 'Состав', type: 'text' },
  {
    id: 'countryOfOrigin',
    name: 'Страна производства',
    type: 'select',
    options: ['Россия', 'Китай', 'Турция', 'Италия', 'Вьетнам'],
  },
];

'''

# --- Taxonomy (женская полная) -------------------------------------------------

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
        ],
    ),
    (
        "Костюмы и жакеты",
        ["Костюмы", "Блейзеры", "Смокинги", "Фраки", "Пиджаки", "Жилеты"],
    ),
    ("Платья и сарафаны", ["Платья", "Сарафаны"]),
    ("Юбки", [SINGLE_LEAF]),
    ("Рубашки и блузы", ["Рубашки", "Блузы"]),
    ("Топы и футболки", ["Топы", "Футболки", "Поло", "Майки", "Кроп-топы"]),
    ("Джинсы", [SINGLE_LEAF]),
    ("Брюки", ["Классические", "Чиносы", "Спортивные", "Джоггеры", "Карго"]),
    ("Трикотаж", ["Свитеры", "Худи", "Кардиганы", "Водолазки"]),
    ("Нижнее бельё", [SINGLE_LEAF]),
    ("Спортивная одежда", [SINGLE_LEAF]),
    ("Пляжная мода", [SINGLE_LEAF]),
    ("Пижамы и домашняя одежда", ["Халаты", "Лонгсливы", "Комплекты"]),
]

OBUV: list[tuple[str, list[str]]] = [
    ("Кроссовки", [SINGLE_LEAF]),
    ("Туфли", [SINGLE_LEAF]),
    ("Ботинки", [SINGLE_LEAF]),
    ("Сандалии и шлёпанцы", ["Сандалии", "Шлепанцы", "Босоножки"]),
    ("Сапоги", [SINGLE_LEAF]),
    ("Мокасины и топсайдеры", ["Мокасины", "Топсайдеры"]),
    ("Угги и унты", ["Валенки", "Угги", "Унты"]),
]

OBUV_SINGLE = [
    "Слипоны",
    "Эспадрильи",
    "Мюли",
    "Сабо",
    "Домашняя обувь",
]

OBUV_SPORT = ("Спортивная", [SINGLE_LEAF])

SUMKI: list[tuple[str, list[str]]] = [
    ("Повседневные", ["Тот", "Шоппер", "Кросс-боди", "Рюкзак", "Клатч", "Поясная"]),
    ("Вечерние", [SINGLE_LEAF]),
    ("Чемоданы", [SINGLE_LEAF]),
    ("Рабочие", ["Для ноутбука", "Портфель"]),
    ("Спортивные и дорожные", ["Спортивные сумки", "Дорожные сумки"]),
    ("Косметички", ["Несессеры"]),
]

AKS: list[tuple[str, list[str]]] = [
    ("Очки", [SINGLE_LEAF]),
    ("Ремни и подтяжки", ["Ремни", "Подтяжки"]),
    ("Перчатки и варежки", ["Перчатки", "Варежки"]),
    ("Шарфы", [SINGLE_LEAF]),
    ("Галстуки и бабочки", ["Галстуки", "Бабочки"]),
    ("Платки", [SINGLE_LEAF]),
    ("Украшения", [SINGLE_LEAF]),
    ("Кожгалантерея мелкая", [SINGLE_LEAF]),
    ("Зонты", [SINGLE_LEAF]),
    # Часы и носимая техника — в одном узле с тех-аксессуарами (не дублировать L2).
    ("Тех-аксессуары", [SINGLE_LEAF]),
    ("Маски и бафы", ["Маски", "Балаклавы", "Бафы"]),
]

HEADWEAR: list[tuple[str, list[str]]] = [
    ("Кепки", [SINGLE_LEAF]),
    ("Панамы", [SINGLE_LEAF]),
    ("Шляпы", [SINGLE_LEAF]),
    ("Береты", [SINGLE_LEAF]),
    ("Шапки", [SINGLE_LEAF]),
]

HOSIERY: list[tuple[str, list[str]]] = [
    ("Носки", [SINGLE_LEAF]),
    ("Колготки", [SINGLE_LEAF]),
    ("Чулки", [SINGLE_LEAF]),
    ("Гольфы", [SINGLE_LEAF]),
    ("Гетры", [SINGLE_LEAF]),
]

BEAUTY: list[tuple[str, list[str]]] = [
    ("Парфюмерия", [SINGLE_LEAF]),
    ("Косметика", [SINGLE_LEAF]),
    ("Уход", [SINGLE_LEAF]),
]

HOME: list[tuple[str, list[str]]] = [
    ("Текстиль", ["Пледы", "Скатерти", "Постельное", "Полотенца", "Коврики для ванной", "Шторы"]),
    ("Декор", [SINGLE_LEAF]),
    ("Аксессуары", [SINGLE_LEAF]),
    ("Питомцы", ["Одежда", "Лежанки", "Переноски", "Поводки"]),
    ("Lifestyle-гаджеты", [SINGLE_LEAF]),
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


def build_obuv(aud: str, label: str = "Обувь") -> str:
    root_id = f"{aud}-shoes"
    blocks: list[str] = []
    gi = 0
    for l2_name, leaves in OBUV:
        _, block = node_group(root_id, gi, l2_name, leaves)
        blocks.append(block)
        gi += 1
    for name in OBUV_SINGLE:
        _, block = node_group(root_id, gi, name, [SINGLE_LEAF])
        blocks.append(block)
        gi += 1
    sp2, sp3 = OBUV_SPORT
    _, block = node_group(root_id, gi, sp2, sp3)
    blocks.append(block)
    inner = "\n".join(blocks)
    return f"""      {{
        id: '{root_id}',
        name: '{escape_ts_str(label)}',
        children: [
{inner}
        ],
      }},"""


def audience_block(
    aud: str,
    aud_label: str,
    apparel_groups: list[tuple[str, list[str]]],
    include_beauty_home: bool,
) -> str:
    parts = [
        "  {",
        f"    id: '{aud}',",
        f"    name: '{escape_ts_str(aud_label)}',",
        "    categories: [",
        build_root_apparel(aud, "Одежда", apparel_groups),
        build_obuv(aud),
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
    parts.append(
        build_root_groups(
            aud,
            "toys",
            "Игрушки (детские)",
            [(SINGLE_LEAF, [SINGLE_LEAF])],
        )
    )
    parts.append("    ],")
    parts.append("  },")
    return "\n".join(parts)


def main() -> None:
    catalog = audience_block("catalog", "Каталог", ODEZHDA, True)

    content = (
        HEADER
        + "\nexport const CATEGORY_HANDBOOK: Audience[] = [\n"
        + catalog
        + "\n];\n"
    )
    OUT.write_text(content, encoding="utf-8")
    print(f"Wrote {OUT} ({len(content)} bytes)")


if __name__ == "__main__":
    main()
