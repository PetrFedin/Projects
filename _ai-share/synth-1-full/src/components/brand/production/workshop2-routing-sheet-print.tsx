import * as React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export interface RoutingSheetOperation {
  id: string;
  name: string;
  sash?: number;
  machineSetupTime?: number;
  costPerUnit?: number;
  status?: string;
}

export interface Workshop2RoutingSheetPrintProps {
  bundleId: string;
  operations: RoutingSheetOperation[];
  articleId?: string;
  className?: string;
}

export function Workshop2RoutingSheetPrint({
  bundleId,
  operations,
  articleId,
  className,
}: Workshop2RoutingSheetPrintProps) {
  const qrValue = `synth://bundle/${bundleId}`;

  const totalSash = operations.reduce((acc, op) => acc + (op.sash || 0), 0);
  const totalCost = operations.reduce((acc, op) => acc + (op.costPerUnit || 0), 0);

  return (
    <div className={`print-container bg-white p-8 font-sans text-black ${className || ''}`}>
      <div className="mb-6 flex items-start justify-between border-b-2 border-black pb-6">
        <div>
          <h1 className="mb-2 text-2xl font-bold uppercase tracking-wider">Routing Sheet</h1>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-semibold">Bundle ID:</span> {bundleId}
            </p>
            {articleId && (
              <p>
                <span className="font-semibold">Article ID:</span> {articleId}
              </p>
            )}
            <p>
              <span className="font-semibold">Date:</span> {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="border-4 border-black bg-white p-2">
            <QRCodeSVG value={qrValue} size={120} level="H" includeMargin={false} />
          </div>
          <p className="mt-2 w-full text-center font-mono text-xs">{bundleId}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-4 text-lg font-bold uppercase">Operations Sequence</h2>

        {operations.length === 0 ? (
          <p className="italic text-gray-500">No operations defined for this bundle.</p>
        ) : (
          <table className="w-full border-collapse border border-black text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="w-12 border border-black p-2 text-left font-bold">#</th>
                <th className="border border-black p-2 text-left font-bold">Operation Name</th>
                <th className="w-24 border border-black p-2 text-right font-bold">SASH (min)</th>
                <th className="w-24 border border-black p-2 text-right font-bold">Setup (min)</th>
                <th className="w-24 border border-black p-2 text-center font-bold">Sign-off</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((op, index) => (
                <tr key={op.id}>
                  <td className="border border-black p-2 text-center">{index + 1}</td>
                  <td className="border border-black p-2 font-medium">{op.name}</td>
                  <td className="border border-black p-2 text-right">
                    {op.sash?.toFixed(2) || '0.00'}
                  </td>
                  <td className="border border-black p-2 text-right">
                    {op.machineSetupTime || '0'}
                  </td>
                  <td className="border border-black p-2"></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-bold">
                <td colSpan={2} className="border border-black p-2 text-right">
                  Totals:
                </td>
                <td className="border border-black p-2 text-right">{totalSash.toFixed(2)}</td>
                <td className="border border-black p-2 text-right"></td>
                <td className="border border-black p-2"></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      <div className="mt-12 grid grid-cols-2 gap-8 text-sm">
        <div className="border-t border-black pt-2">
          <p className="font-bold">Issued By (Production)</p>
          <div className="h-16"></div>
        </div>
        <div className="border-t border-black pt-2">
          <p className="font-bold">Received By (Floor Manager)</p>
          <div className="h-16"></div>
        </div>
      </div>
    </div>
  );
}
