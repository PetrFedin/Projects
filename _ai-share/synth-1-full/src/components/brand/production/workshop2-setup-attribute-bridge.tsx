import { getAttributeById } from '@/lib/production/attribute-catalog';
import { WORKSHOP2_INFO_PICK_TO_CATALOG_ATTRIBUTE_ALIASES } from '@/lib/production/workshop2-attribute-id-aliases';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/** Read-only: связи осей info-pick ↔ канонический attribute-catalog Workshop2. */
export function Workshop2SetupAttributeBridge() {
  const rows = Object.entries(WORKSHOP2_INFO_PICK_TO_CATALOG_ATTRIBUTE_ALIASES).sort(([a], [b]) =>
    a.localeCompare(b, 'ru')
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Связи info-pick ↔ catalog</CardTitle>
        <CardDescription className="text-xs">
          Read-only мост из <code className="text-[11px]">workshop2-attribute-id-aliases.ts</code> —
          для сверки readiness и сиротских assignments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-64 overflow-auto rounded-md border">
          <table className="w-full text-left text-[11px]">
            <thead className="sticky top-0 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-2 py-1.5 font-semibold">info-pick id</th>
                <th className="px-2 py-1.5 font-semibold">catalog id</th>
                <th className="px-2 py-1.5 font-semibold">Подпись каталога</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([infoPickId, catalogId]) => (
                <tr key={infoPickId} className="border-t border-slate-100">
                  <td className="px-2 py-1 font-mono">{infoPickId}</td>
                  <td className="px-2 py-1 font-mono">{catalogId}</td>
                  <td className="px-2 py-1 text-slate-700">
                    {getAttributeById(catalogId)?.name ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
