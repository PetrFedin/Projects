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
    <div className={`print-container bg-white text-black p-8 font-sans ${className || ''}`}>
      <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">Routing Sheet</h1>
          <div className="text-sm space-y-1">
            <p><span className="font-semibold">Bundle ID:</span> {bundleId}</p>
            {articleId && <p><span className="font-semibold">Article ID:</span> {articleId}</p>}
            <p><span className="font-semibold">Date:</span> {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="border-4 border-black p-2 bg-white">
            <QRCodeSVG value={qrValue} size={120} level="H" includeMargin={false} />
          </div>
          <p className="text-xs font-mono mt-2 text-center w-full">{bundleId}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold uppercase mb-4">Operations Sequence</h2>
        
        {operations.length === 0 ? (
          <p className="text-gray-500 italic">No operations defined for this bundle.</p>
        ) : (
          <table className="w-full text-sm border-collapse border border-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2 text-left font-bold w-12">#</th>
                <th className="border border-black p-2 text-left font-bold">Operation Name</th>
                <th className="border border-black p-2 text-right font-bold w-24">SASH (min)</th>
                <th className="border border-black p-2 text-right font-bold w-24">Setup (min)</th>
                <th className="border border-black p-2 text-center font-bold w-24">Sign-off</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((op, index) => (
                <tr key={op.id}>
                  <td className="border border-black p-2 text-center">{index + 1}</td>
                  <td className="border border-black p-2 font-medium">{op.name}</td>
                  <td className="border border-black p-2 text-right">{op.sash?.toFixed(2) || '0.00'}</td>
                  <td className="border border-black p-2 text-right">{op.machineSetupTime || '0'}</td>
                  <td className="border border-black p-2"></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-bold">
                <td colSpan={2} className="border border-black p-2 text-right">Totals:</td>
                <td className="border border-black p-2 text-right">{totalSash.toFixed(2)}</td>
                <td className="border border-black p-2 text-right"></td>
                <td className="border border-black p-2"></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      <div className="grid grid-cols-2 gap-8 mt-12 text-sm">
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
