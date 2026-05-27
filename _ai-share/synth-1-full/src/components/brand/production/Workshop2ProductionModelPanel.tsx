import type {
  Workshop2DossierPhase1,
  Workshop2ProductionModel,
  Workshop2ProductionNode,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { ensureWorkshop2ProductionModel } from '@/lib/production/workshop2-production-model-from-dossier';
import { buildWorkshop2ProductionPreflightSnapshot } from '@/lib/production/workshop2-production-preflight';

type Props = {
  dossier: Workshop2DossierPhase1;
  onChange: (patch: Partial<Workshop2DossierPhase1>) => void;
  disabled?: boolean;
};

export function Workshop2ProductionModelPanel({ dossier, onChange, disabled = false }: Props) {
  const model = ensureWorkshop2ProductionModel(dossier);
  const preflight = buildWorkshop2ProductionPreflightSnapshot({
    ...dossier,
    productionModel: model,
  });

  function updateModel(next: Workshop2ProductionModel): void {
    onChange({ productionModel: next });
  }

  function updateNode(nodeId: string, patch: Partial<Workshop2ProductionNode>): void {
    updateModel({
      ...model,
      nodes: model.nodes.map((n) => (n.id === nodeId ? { ...n, ...patch } : n)),
    });
  }

  return (
    <section className="border-border-default rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <h3 className="text-base font-semibold">Карта изделия</h3>
          <p className="text-text-secondary mt-1 text-sm">
            Узлы изделия, описание для фабрики и мгновенная проверка блокеров.
          </p>
        </div>
        <div className="border-border-subtle bg-bg-surface rounded-lg border px-3 py-2 text-right">
          <div className="text-sm font-semibold">{preflight.score}/100</div>
          <div className="text-text-secondary text-xs">
            {preflight.canSendToFactory ? 'Готово к передаче' : 'Есть блокеры'}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {model.nodes
          .slice()
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((node) => {
            const nodeIssues = preflight.issues.filter((i) => i.anchor?.includes(node.id));
            const materials = model.materialLines.filter((m) => m.nodeId === node.id);
            const trims = model.trimLines.filter((m) => m.nodeId === node.id);
            const operations = model.operations.filter((m) => m.nodeId === node.id);
            return (
              <div
                key={node.id}
                className="border-border-subtle bg-bg-surface rounded-lg border p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">
                      {node.label}
                      {node.isRequired ? (
                        <span className="ml-2 rounded bg-red-50 px-1.5 py-0.5 text-xs font-normal text-red-700">
                          Обязательный
                        </span>
                      ) : null}
                    </div>
                    <div className="text-text-secondary mt-1 text-xs">
                      Материалы: {materials.length} · Фурнитура: {trims.length} · Операции:{' '}
                      {operations.length}
                    </div>
                  </div>
                  <label className="text-text-secondary flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={Boolean(node.notApplicable)}
                      disabled={disabled}
                      onChange={(e) => updateNode(node.id, { notApplicable: e.target.checked })}
                      className="text-accent-primary focus:ring-accent-primary rounded border-gray-300"
                    />
                    Нет в модели
                  </label>
                </div>

                {!node.notApplicable ? (
                  <div className="grid gap-3">
                    <textarea
                      className="border-border-default focus:ring-accent-primary min-h-[80px] rounded-md border p-3 text-sm focus:outline-none focus:ring-1"
                      value={node.description ?? ''}
                      disabled={disabled}
                      placeholder="Описание узла для производства..."
                      onChange={(e) =>
                        updateNode(node.id, {
                          description: e.target.value,
                          status: e.target.value.trim() ? 'draft' : 'empty',
                        })
                      }
                    />
                    {nodeIssues.length > 0 ? (
                      <div className="grid gap-2">
                        {nodeIssues.map((issue) => (
                          <div
                            key={issue.id}
                            className={
                              issue.severity === 'blocker'
                                ? 'rounded-md border border-red-200 bg-red-50 p-3 text-xs'
                                : 'rounded-md border border-amber-200 bg-amber-50 p-3 text-xs'
                            }
                          >
                            <strong className="mb-1 block font-semibold">{issue.label}</strong>
                            <div className="text-text-secondary">{issue.detail}</div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
      </div>
    </section>
  );
}
