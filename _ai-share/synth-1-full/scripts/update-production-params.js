const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/lib/data/production-params.ts');
let content = fs.readFileSync(file, 'utf8');

// Add attributes to interface
content = content.replace(
  "  /** Особенности налогов (мех — спец. пошлины) */\n  taxNotes?: string;\n}",
  "  /** Особенности налогов (мех — спец. пошлины) */\n  taxNotes?: string;\n  /** Специфичные атрибуты */\n  attributes?: string[];\n}"
);

// We need to find each block and duplicate it.
function duplicateApparel(baseId, labelBase, dimensionsShoulder, dimensionsWaist) {
  // Find the block
  const regex = new RegExp(`{\\s*catL1Id:\\s*'${baseId}',[\\s\\S]*?fittingStages:[\\s\\S]*?},`, 'g');
  const match = content.match(regex);
  if (!match) return;
  
  let block = match[0];
  
  // Create shoulder block
  let shoulderBlock = block.replace(`catL1Id: '${baseId}'`, `catL1Id: '${baseId}-shoulder'`);
  shoulderBlock = shoulderBlock.replace(`label: '${labelBase}'`, `label: '${labelBase} (Плечевые)'`);
  shoulderBlock = shoulderBlock.replace(/dimensions:\s*\[[\s\S]*?\],/, `dimensions: ${JSON.stringify(dimensionsShoulder)},`);
  
  // Create waist block
  let waistBlock = block.replace(`catL1Id: '${baseId}'`, `catL1Id: '${baseId}-waist'`);
  waistBlock = waistBlock.replace(`label: '${labelBase}'`, `label: '${labelBase} (Поясные)'`);
  waistBlock = waistBlock.replace(/dimensions:\s*\[[\s\S]*?\],/, `dimensions: ${JSON.stringify(dimensionsWaist)},`);
  
  content = content.replace(block, `${shoulderBlock}\n  ${waistBlock}`);
}

duplicateApparel('men-apparel', 'Одежда (мужская)', 
  ['Обхват груди', 'Обхват талии', 'Обхват бёдер', 'Длина изделия', 'Длина рукава', 'Обхват шеи', 'Ширина плеч'],
  ['Обхват талии', 'Обхват бёдер', 'Длина по внешнему шву', 'Длина по внутреннему шву', 'Ширина низа штанины']
);

duplicateApparel('women-apparel', 'Одежда (женская)', 
  ['Обхват груди', 'Обхват талии', 'Обхват бёдер', 'Длина изделия', 'Длина рукава', 'Ширина плеч', 'Обхват шеи', 'Высота груди'],
  ['Обхват талии', 'Обхват бёдер', 'Длина по внешнему шву', 'Длина по внутреннему шву', 'Длина юбки', 'Ширина низа']
);

duplicateApparel('unisex-apparel', 'Одежда (унисекс)', 
  ['Обхват груди', 'Обхват талии', 'Обхват бёдер', 'Длина изделия', 'Длина рукава', 'Ширина плеч'],
  ['Обхват талии', 'Обхват бёдер', 'Длина по внешнему шву', 'Длина по внутреннему шву']
);

duplicateApparel('kids-apparel', 'Одежда (детская, общая)', 
  ['Рост', 'Обхват груди', 'Обхват талии', 'Обхват бёдер', 'Длина изделия', 'Длина рукава', 'Ширина плеч'],
  ['Рост', 'Обхват талии', 'Обхват бёдер', 'Длина по внешнему шву', 'Длина по внутреннему шву']
);

duplicateApparel('kids-apparel-boys', 'Одежда (мальчики)', 
  ['Рост', 'Обхват груди', 'Обхват талии', 'Обхват бёдер', 'Ширина плеч', 'Длина спины до талии', 'Длина верха (куртка/свитер)', 'Длина рукава', 'Обхват шеи (рубашка/поло)'],
  ['Рост', 'Обхват талии', 'Обхват бёдер', 'Внешний шов брюк / шорт', 'Внутренний шов брюк', 'Ширина низа']
);

duplicateApparel('kids-apparel-girls', 'Одежда (девочки)', 
  ['Рост', 'Обхват груди', 'Обхват под грудью (нижнее бельё/купальник, с возраста в ТЗ)', 'Обхват талии', 'Обхват бёдер', 'Ширина плеч', 'Длина верха', 'Длина рукава', 'Высота груди / клип'],
  ['Рост', 'Обхват талии', 'Обхват бёдер', 'Длина юбки от талии', 'Длина платья от плеча и от талии (линия талии в ТЗ)', 'Внешний шов брюк', 'Внутренний шов брюк']
);

// Now add attributes to shoes and bags
content = content.replace(
  /catL1Id: 'men-shoes',[\s\S]*?fittingStages: \['Proto', 'Size Set', 'TOP', 'Production'\],/g,
  match => match.replace("fittingStages: ['Proto', 'Size Set', 'TOP', 'Production'],", "fittingStages: ['Proto', 'Size Set', 'TOP', 'Production'],\n    attributes: ['Тип подошвы', 'Материал подкладки', 'Тип застежки', 'Полнота колодки'],")
);

content = content.replace(
  /catL1Id: 'women-shoes',[\s\S]*?fittingStages: \['Proto', 'Size Set', 'TOP', 'Production'\],/g,
  match => match.replace("fittingStages: ['Proto', 'Size Set', 'TOP', 'Production'],", "fittingStages: ['Proto', 'Size Set', 'TOP', 'Production'],\n    attributes: ['Тип подошвы', 'Материал подкладки', 'Тип застежки', 'Полнота колодки', 'Тип каблука'],")
);

content = content.replace(
  /catL1Id: 'kids-shoes',[\s\S]*?fittingStages: \['Proto', 'Size Set', 'Production'\],/g,
  match => match.replace("fittingStages: ['Proto', 'Size Set', 'Production'],", "fittingStages: ['Proto', 'Size Set', 'Production'],\n    attributes: ['Тип подошвы', 'Материал подкладки', 'Тип застежки', 'Полнота колодки', 'Супинатор'],")
);

content = content.replace(
  /catL1Id: 'unisex-shoes',[\s\S]*?fittingStages: \['Proto', 'Size Set', 'TOP', 'Production'\],/g,
  match => match.replace("fittingStages: ['Proto', 'Size Set', 'TOP', 'Production'],", "fittingStages: ['Proto', 'Size Set', 'TOP', 'Production'],\n    attributes: ['Тип подошвы', 'Материал подкладки', 'Тип застежки', 'Полнота колодки'],")
);

content = content.replace(
  /catL1Id: 'men-bags',[\s\S]*?fittingStages: \['Proto', 'TOP', 'Production'\],/g,
  match => match.replace("fittingStages: ['Proto', 'TOP', 'Production'],", "fittingStages: ['Proto', 'TOP', 'Production'],\n    attributes: ['Тип крепления ручек', 'Наличие подкладки', 'Количество отделений', 'Формат А4'],")
);

content = content.replace(
  /catL1Id: 'women-bags',[\s\S]*?fittingStages: \['Proto', 'TOP', 'Production'\],/g,
  match => match.replace("fittingStages: ['Proto', 'TOP', 'Production'],", "fittingStages: ['Proto', 'TOP', 'Production'],\n    attributes: ['Тип крепления ручек', 'Наличие подкладки', 'Количество отделений', 'Формат А4', 'Тип ремешка'],")
);

content = content.replace(
  /catL1Id: 'kids-bags',[\s\S]*?fittingStages: \['Proto', 'TOP', 'Production'\],/g,
  match => match.replace("fittingStages: ['Proto', 'TOP', 'Production'],", "fittingStages: ['Proto', 'TOP', 'Production'],\n    attributes: ['Тип крепления ручек', 'Наличие подкладки', 'Светоотражающие элементы', 'Эргономичная спинка'],")
);

content = content.replace(
  /catL1Id: 'men-headwear',[\s\S]*?fittingStages: \['Proto', 'Size Set', 'Production'\],/g,
  match => match.replace("fittingStages: ['Proto', 'Size Set', 'Production'],", "fittingStages: ['Proto', 'Size Set', 'Production'],\n    attributes: ['Наличие подкладки', 'Тип козырька', 'Регулировка размера'],")
);

content = content.replace(
  /catL1Id: 'women-headwear',[\s\S]*?fittingStages: \['Proto', 'Size Set', 'Production'\],/g,
  match => match.replace("fittingStages: ['Proto', 'Size Set', 'Production'],", "fittingStages: ['Proto', 'Size Set', 'Production'],\n    attributes: ['Наличие подкладки', 'Тип полей', 'Декоративные элементы'],")
);

fs.writeFileSync(file, content, 'utf8');
