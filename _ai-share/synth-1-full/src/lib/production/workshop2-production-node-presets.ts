import type {
  Workshop2ProductionModel,
  Workshop2ProductionNode,
} from './workshop2-dossier-phase1.types';

function node(
  id: string,
  kind: Workshop2ProductionNode['kind'],
  label: string,
  isRequired = true,
  sortOrder = 0
): Workshop2ProductionNode {
  return { id, kind, label, isRequired, sortOrder, status: 'empty' };
}

export function buildDefaultProductionModelForL3(l3Label: string | undefined): Workshop2ProductionModel {
  const l3 = (l3Label ?? '').toLowerCase();
  let nodes: Workshop2ProductionNode[];

  if (l3.includes('пальто') || l3.includes('coat')) {
    nodes = [
      node('body', 'body', 'Корпус', true, 10),
      node('front', 'front', 'Перед', true, 20),
      node('back', 'back', 'Спинка', true, 30),
      node('sleeve', 'sleeve', 'Рукава', true, 40),
      node('collar', 'collar', 'Воротник / лацканы', true, 50),
      node('closure', 'closure', 'Застежка', true, 60),
      node('pocket', 'pocket', 'Карманы', false, 70),
      node('lining', 'lining', 'Подкладка', false, 80),
      node('hem', 'hem', 'Низ изделия', true, 90),
      node('label', 'label', 'Бирка / маркировка', true, 100),
      node('packaging', 'packaging', 'Упаковка', false, 110),
    ];
  } else {
    nodes = [
      node('body', 'body', 'Корпус', true, 10),
      node('closure', 'closure', 'Застежка', false, 20),
      node('pocket', 'pocket', 'Карманы', false, 30),
      node('label', 'label', 'Бирка / маркировка', true, 40),
    ];
  }

  return {
    version: 1,
    generatedFromCategoryKey: l3Label,
    generatedAt: new Date().toISOString(),
    nodes,
    materialLines: [],
    trimLines: [],
    operations: [],
    measurements: [],
  };
}
