/**
 * @jest-environment node
 */
import {
  CORE1_FLOW_OUTPUT_KIND_PO,
  applyBundlePoRefsToUnifiedFlowPoStep,
  buildCore1PlanTabBridgeState,
  collectBundlePoRefsForMatrix,
  getSkuStageOutputRefsForKind,
  matrixPoOutputsAlignWithBundlePos,
} from '@/lib/production/workshop2-core1-linkage';
import type { CollectionSkuFlowDoc } from '@/lib/production/unified-sku-flow-store';
import type { ArticleWorkspaceBundle } from '@/lib/production/article-workspace/types';

function docWithPoOutput(skuId: string, ref: string): CollectionSkuFlowDoc {
  return {
    v: 1,
    skus: {
      [skuId]: {
        label: skuId,
        stages: {
          po: {
            status: 'in_progress',
            outputs: [{ kind: CORE1_FLOW_OUTPUT_KIND_PO, ref }],
          },
        },
      },
    },
  };
}

describe('workshop2-core1-linkage', () => {
  it('extracts po output refs', () => {
    const d = docWithPoOutput('a1', 'PO-100');
    expect(getSkuStageOutputRefsForKind(d, 'a1', 'po', CORE1_FLOW_OUTPUT_KIND_PO)).toEqual(['PO-100']);
  });

  it('aligns matrix ref with bundle PO id', () => {
    const bundle: ArticleWorkspaceBundle = {
      schemaVersion: 1,
      planPo: {
        purchaseOrders: [{ id: 'po-1', label: 'Spring PO', status: 'draft' }],
      },
    };
    expect(matrixPoOutputsAlignWithBundlePos(['po-1'], bundle)).toBe(true);
    expect(matrixPoOutputsAlignWithBundlePos(['other'], bundle)).toBe(false);
  });

  it('buildCore1PlanTabBridgeState reports alignment when refs match', () => {
    const doc = docWithPoOutput('sku', 'po-1');
    const bundle: ArticleWorkspaceBundle = {
      schemaVersion: 1,
      planPo: {
        purchaseOrders: [{ id: 'po-1', label: 'L1', status: 'draft' }],
      },
    };
    const st = buildCore1PlanTabBridgeState(doc, 'sku', bundle);
    expect(st.matrixPoOutputRefs).toEqual(['po-1']);
    expect(st.bundlePurchaseOrderCount).toBe(1);
    expect(st.poBundleAlignedWithMatrix).toBe(true);
  });

  it('collectBundlePoRefsForMatrix prefers id over empty', () => {
    const bundle: ArticleWorkspaceBundle = {
      schemaVersion: 1,
      planPo: {
        purchaseOrders: [
          { id: 'PO-A', label: 'L', status: 'draft' },
          { id: '', label: 'Fallback label', status: 'draft' },
        ],
      },
    };
    expect(collectBundlePoRefsForMatrix(bundle)).toEqual(['PO-A', 'Fallback label']);
  });

  it('applyBundlePoRefsToUnifiedFlowPoStep appends new po outputs', () => {
    const doc: CollectionSkuFlowDoc = { v: 1, skus: {} };
    const bundle: ArticleWorkspaceBundle = {
      schemaVersion: 1,
      planPo: {
        purchaseOrders: [{ id: 'NEW-PO', label: 'x', status: 'draft' }],
      },
    };
    const { doc: next, addedRefs } = applyBundlePoRefsToUnifiedFlowPoStep(doc, 'sku-x', bundle);
    expect(addedRefs).toEqual(['NEW-PO']);
    expect(next.skus['sku-x']?.stages.po?.outputs).toEqual([
      { kind: CORE1_FLOW_OUTPUT_KIND_PO, ref: 'NEW-PO' },
    ]);
    const again = applyBundlePoRefsToUnifiedFlowPoStep(next, 'sku-x', bundle);
    expect(again.addedRefs).toEqual([]);
  });
});
