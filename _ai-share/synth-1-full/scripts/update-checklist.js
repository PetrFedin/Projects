const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/lib/production/category-leaf-handbook-checklist.ts');
let content = fs.readFileSync(file, 'utf8');

// Add imports
content = content.replace(
  `import type { ProductionDocumentKind } from './category-leaf-production-types';`,
  `import type { ProductionDocumentKind } from './category-leaf-production-types';\nimport { getCategoryProductionParamsForLeaf } from './workshop-size-handbook';`
);

// Update LeafHandbookGuidance type
content = content.replace(
  `  attachmentChecklist: LeafHandbookAttachmentItem[];\n};`,
  `  attachmentChecklist: LeafHandbookAttachmentItem[];\n  productionParams?: ReturnType<typeof getCategoryProductionParamsForLeaf>;\n};`
);

// Update getLeafHandbookGuidance function
content = content.replace(
  `    attachmentChecklist,\n  };\n}`,
  `    attachmentChecklist,\n    productionParams: getCategoryProductionParamsForLeaf(leaf),\n  };\n}`
);

fs.writeFileSync(file, content, 'utf8');
