import type { ProductAudience } from './types';

type CategoryStructure = Record<string, any>;

/**
 * Рекурсивно находит все дочерние категории для заданной родительской категории.
 * @param parentCategory - Категория, для которой нужно найти дочерние.
 * @param structure - Полная структура категорий.
 * @returns Массив, содержащий родительскую категорию и все ее дочерние категории.
 */
export function findSubcategories(parentCategory: string, structure: any): string[] {
  let categories: string[] = [parentCategory];

  const findChildren = (currentCategory: string, currentStructure: any) => {
    for (const key in currentStructure) {
      if (key === currentCategory) {
        const children = currentStructure[key];
        if (Array.isArray(children)) {
          categories = [...categories, ...(children as string[])];
        } else if (typeof children === 'object' && children !== null) {
          const childKeys = Object.keys(children);
          categories = [...categories, ...childKeys];
          childKeys.forEach((childKey) => findChildren(childKey, children));
        }
        return; // Нашли и обработали, выходим
      }
      // Рекурсивный поиск в дочерних объектах
      if (
        typeof currentStructure[key] === 'object' &&
        currentStructure[key] !== null &&
        !Array.isArray(currentStructure[key])
      ) {
        findChildren(currentCategory, currentStructure[key]);
      }
    }
  };

  findChildren(parentCategory, structure);
  return [...new Set(categories)]; // Возвращаем уникальные значения
}

/**
 * Рекурсивно фильтрует дерево категорий на основе audience.
 */
function filterTreeForAudience(structure: any, audience: 'Женский' | 'Мужской'): any {
  const newStructure: any = {};

  const menExclusions = [
    'Платья и сарафаны',
    'Юбки',
    'Бюстгальтеры',
    'Коктейльные',
    'Вечерние',
    'Балетки',
    'Ботфорты',
    'Кроп-топы',
    'Купальники',
    'Парео',
    'Пляжные платья',
    'Береты',
    'Клатч',
    'Тот',
    'Шоппер',
    'Вечерняя',
    'Bootcut',
    'Flare',
  ];
  const womenExclusions = ['Фрак', 'Плавки'];

  let exclusions: string[] = [];
  if (audience === 'Мужской') exclusions = menExclusions;
  if (audience === 'Женский') exclusions = womenExclusions;

  // Always exclude beauty and home from clothing audiences
  const commonExclusions = ['Beauty & Grooming', 'Home & Lifestyle'];
  exclusions = [...exclusions, ...commonExclusions];

  for (const key in structure) {
    if (exclusions.includes(key)) {
      continue;
    }

    const value = (structure as any)[key];
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const filteredSubtree = filterTreeForAudience(value, audience);
      if (Object.keys(filteredSubtree).length > 0) {
        newStructure[key] = filteredSubtree;
      }
    } else if (Array.isArray(value)) {
      const filteredArray = (value as string[]).filter((item) => !exclusions.includes(item));
      if (filteredArray.length > 0) {
        newStructure[key] = filteredArray;
      }
    } else {
      newStructure[key] = value;
    }
  }

  return newStructure;
}

/**
 * Возвращает отфильтрованную структуру категорий на основе выбранной аудитории.
 */
export function getFilteredCategoryStructure(
  audience: string,
  fullCategoryStructure: CategoryStructure
): CategoryStructure {
  switch (audience) {
    case 'Женский':
      return filterTreeForAudience(fullCategoryStructure, 'Женский');
    case 'Мужской':
      return filterTreeForAudience(fullCategoryStructure, 'Мужской');
    case 'Beauty':
      return {
        'Beauty & Grooming': fullCategoryStructure['Beauty & Grooming'],
      };
    case 'Home':
      return {
        'Home & Lifestyle': fullCategoryStructure['Home & Lifestyle'],
      };
    case 'Все':
    default:
      return fullCategoryStructure;
  }
}
