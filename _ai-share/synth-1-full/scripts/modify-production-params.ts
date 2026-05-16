import * as fs from 'fs';
import * as path from 'path';

const file = path.join(__dirname, '../src/lib/data/production-params.ts');
let content = fs.readFileSync(file, 'utf8');

// Add attributes to interface
content = content.replace(
  "  /** Особенности налогов (мех — спец. пошлины) */\n  taxNotes?: string;\n}",
  "  /** Особенности налогов (мех — спец. пошлины) */\n  taxNotes?: string;\n  /** Специфичные атрибуты */\n  attributes?: string[];\n}"
);

// We need to split apparel into shoulder and waist.
// Let's just use regex or string replacement for the specific blocks.
// Actually, it's easier to just generate the whole file or do targeted replacements.

