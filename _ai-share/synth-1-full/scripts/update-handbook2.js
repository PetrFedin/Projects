const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/lib/production/workshop-size-handbook.ts');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `if (cat === 'women-apparel' || cat === 'men-apparel') {`,
  `if (cat.startsWith('women-apparel') || cat.startsWith('men-apparel')) {`
);

content = content.replace(
  `cat === 'women-apparel'`,
  `cat.startsWith('women-apparel')`
);

content = content.replace(
  `function findApparelBodyGridRowByScaleSize(
  cat: 'women-apparel' | 'men-apparel',`,
  `function findApparelBodyGridRowByScaleSize(
  cat: string,`
);

content = content.replace(
  `const cat = gridIdx[1] as 'women-apparel' | 'men-apparel';`,
  `const cat = gridIdx[1];`
);

content = content.replace(
  `const cat = m[1] as 'women-apparel' | 'men-apparel';`,
  `const cat = m[1];`
);

// We need to fix findApparelBodyGridRowByScaleSize logic:
content = content.replace(
  `if (cat === 'women-apparel') {`,
  `if (cat.startsWith('women-apparel')) {`
);

content = content.replace(
  `catL1Id === 'men-apparel' ? MEN_OUTERWEAR_BODY_GRID_CM : WOMEN_OUTERWEAR_BODY_GRID_CM`,
  `catL1Id.startsWith('men-apparel') ? MEN_OUTERWEAR_BODY_GRID_CM : WOMEN_OUTERWEAR_BODY_GRID_CM`
);

fs.writeFileSync(file, content, 'utf8');
