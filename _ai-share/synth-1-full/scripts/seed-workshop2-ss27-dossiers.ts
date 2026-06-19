/**
 * Seed SS27 demo dossiers into PostgreSQL (WORKSHOP2_DATABASE_URL).
 * npm run db:seed:workshop2-ss27-dossiers
 */
import pg from 'pg';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import { findHandbookLeafById } from '@/lib/production/category-handbook-leaves';
import {
  assembleWorkshop2ArticleFromTaxonomy,
  mergeAssembledDossierIntoExisting,
} from '@/lib/production/workshop2-article-assembler';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  buildWorkshop2Ss27MenCoat01FullTzDemoDossier,
  buildWorkshop2Ss27UnisexSneakers03DemoDossier,
  buildWorkshop2Ss27WomenDress02DemoDossier,
} from '@/lib/production/workshop2-ss27-demo-full-tz-dossier';
import { WORKSHOP2_SS27_RANGE_PLANNER_METADATA } from '@/lib/production/workshop2-core-collection-range-planner-metadata';

const COL = 'SS27';
const ORG = 'org-brand-001';

const url =
  process.env.WORKSHOP2_DATABASE_URL?.trim() ||
  process.env.WORKSHOP2_DOSSIER_DATABASE_URL?.trim() ||
  process.env.DATABASE_URL?.trim();

if (!url) {
  console.error('ERROR: WORKSHOP2_DATABASE_URL is required');
  process.exit(1);
}

type ArticleSeed = {
  id: string;
  sku: string;
  name: string;
  categoryLeafId: string;
  audienceId: string;
  isUnisex: boolean;
  demoBuilder?: (leaf: HandbookCategoryLeaf, by: string) => Workshop2DossierPhase1;
};

const ARTICLES: ArticleSeed[] = [
  {
    id: 'demo-ss27-01',
    sku: 'SS27-M-COAT-01',
    name: 'Пальто мужское SS27',
    categoryLeafId: 'catalog-apparel-g0-l0',
    audienceId: 'men',
    isUnisex: false,
    demoBuilder: buildWorkshop2Ss27MenCoat01FullTzDemoDossier,
  },
  {
    id: 'demo-ss27-02',
    sku: 'SS27-W-DRS-02',
    name: 'Платье женское SS27',
    categoryLeafId: 'catalog-apparel-g2-l0',
    audienceId: 'women',
    isUnisex: false,
    demoBuilder: buildWorkshop2Ss27WomenDress02DemoDossier,
  },
  {
    id: 'demo-ss27-03',
    sku: 'SS27-U-SNK-03',
    name: 'Кроссовки SS27',
    categoryLeafId: 'catalog-shoes-g0-l0',
    audienceId: 'unisex',
    isUnisex: true,
    demoBuilder: buildWorkshop2Ss27UnisexSneakers03DemoDossier,
  },
];

async function main(): Promise<void> {
  const pool = new pg.Pool({ connectionString: url, max: 1 });

  try {
    await pool.query(
      `INSERT INTO workshop2_collections (id, organization_id, display_name, metadata)
       VALUES ($1, $2, $3, $4::jsonb)
       ON CONFLICT (id) DO UPDATE SET
         display_name = EXCLUDED.display_name,
         metadata = EXCLUDED.metadata`,
      [COL, ORG, 'SS27 · весна–лето 2027', JSON.stringify(WORKSHOP2_SS27_RANGE_PLANNER_METADATA)]
    );

    for (const art of ARTICLES) {
      await pool.query(
        `INSERT INTO workshop2_articles (id, collection_id, organization_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (collection_id, id) DO NOTHING`,
        [art.id, COL, ORG]
      );

      const leaf = findHandbookLeafById(art.categoryLeafId);
      const asm = assembleWorkshop2ArticleFromTaxonomy({
        categoryLeafId: art.categoryLeafId,
        audienceId: art.audienceId,
        isUnisex: art.isUnisex,
        sku: art.sku,
        name: art.name,
        updatedBy: 'seed-ss27-assembler',
      });
      if (!asm) {
        console.warn(`skip: assembler failed for ${art.id}`);
        continue;
      }

      let dossier = asm.dossier;
      if (art.demoBuilder && leaf) {
        const demo = art.demoBuilder(leaf, 'seed-ss27-assembler');
        dossier = mergeAssembledDossierIntoExisting(demo, asm.dossier, asm.leaf);
      }

      await pool.query(
        `INSERT INTO workshop2_dossiers (collection_id, article_id, organization_id, version, updated_at, updated_by, dossier_json)
         VALUES ($1, $2, $3, 1, NOW(), 'seed-ss27-assembler', $4::jsonb)
         ON CONFLICT (collection_id, article_id) DO UPDATE SET
           dossier_json = EXCLUDED.dossier_json,
           version = workshop2_dossiers.version + 1,
           updated_at = NOW(),
           updated_by = EXCLUDED.updated_by`,
        [COL, art.id, ORG, JSON.stringify(dossier)]
      );
      console.log(`ok: ${COL}/${art.id} assembled (${asm.preview.oneLineRu})`);
    }
  } finally {
    await pool.end();
  }
}

void main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
