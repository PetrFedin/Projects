import { readFileSync, globSync } from 'fs';
import { resolve } from 'path';

// Define expected anchors
const anchorsToFind = [
  { id: 'w2-passport-hub', patterns: ['id="w2-passport-hub"'] },
  { id: 'w2-passport-identity', patterns: ['id="w2-passport-identity"'] },
  { id: 'w2-passport-design-intent', patterns: ['id="w2-passport-design-intent"'] },
  { id: 'w2-visuals-refs', patterns: ['id="w2-visuals-refs"'] },
  { id: 'w2-visuals-attributes', patterns: ['id="w2-visuals-attributes"'] },
  { id: 'w2-material-hub', patterns: ['id="w2-material-hub"'] },
  { id: 'w2-material-mat', patterns: ['id="w2-material-mat"'] },
  { id: 'w2-composition-label', patterns: ['id="w2-composition-label"', 'W2_MATERIAL_SUBPAGE_ANCHORS.compositionLabel'] },
  { id: 'w2-construction-hub', patterns: ['id="w2-construction-hub"', 'W2_CONSTRUCTION_SUBPAGE_ANCHORS.hub'] },
  { id: 'w2-construction-contour', patterns: ['id="w2-construction-contour"', 'W2_CONSTRUCTION_SUBPAGE_ANCHORS.contour'] },
  { id: 'w2-construction-cad', patterns: ['id="w2-construction-cad"', 'W2_CONSTRUCTION_SUBPAGE_ANCHORS.patternFiles'] },
  { id: 'w2-measurements-fields', patterns: ['id="w2-measurements-fields"'] },
];

const tsxFiles = globSync('src/components/brand/production/**/*.tsx');

let allFileContents = '';
for (const file of tsxFiles) {
  allFileContents += readFileSync(resolve(process.cwd(), file), 'utf8') + '\n';
}

let missing = 0;
for (const anchor of anchorsToFind) {
  const found = anchor.patterns.some(pattern => allFileContents.includes(pattern));
  if (!found) {
    console.error(`❌ Anchor ${anchor.id} not found (checked patterns: ${anchor.patterns.join(', ')})!`);
    missing++;
  } else {
    console.log(`✅ Anchor ${anchor.id} found.`);
  }
}

if (missing > 0) {
  process.exit(1);
} else {
  console.log('🎉 All anchors validated successfully!');
}
