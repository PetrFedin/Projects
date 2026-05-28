const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/lib/production/workshop-size-handbook.ts');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `cat === 'women-apparel'`,
  `cat.startsWith('women-apparel')`
);

fs.writeFileSync(file, content, 'utf8');
