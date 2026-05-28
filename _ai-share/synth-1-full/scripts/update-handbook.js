const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/lib/production/workshop-size-handbook.ts');
let content = fs.readFileSync(file, 'utf8');

const target = `  const l1 = leaf.l1Name.trim();
  const table: Record<string, Partial<Record<string, string>>> = {`;

const replacement = `  const l1 = leaf.l1Name.trim();
  const table: Record<string, Partial<Record<string, string>>> = {`;

// We need to inject the logic after table lookup.
const lookupTarget = `  return table[l1]?.[a];`;
const lookupReplacement = `  const baseId = table[l1]?.[a];
  if (!baseId) return undefined;

  if (l1 === 'Одежда') {
    const l2 = leaf.l2Name?.trim() || '';
    const isWaist = ['Брюки', 'Джинсы', 'Юбки', 'Нижнее бельё', 'Пляжная мода'].includes(l2);
    return isWaist ? \`\${baseId}-waist\` : \`\${baseId}-shoulder\`;
  }
  return baseId;`;

content = content.replace(lookupTarget, lookupReplacement);

fs.writeFileSync(file, content, 'utf8');
