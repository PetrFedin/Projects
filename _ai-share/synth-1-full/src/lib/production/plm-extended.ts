/**
 * Extended Production API — cutting, materials, operations, QC, PPS
 * Integrates with backend /api/v1/plm/*
 */

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

function authHeaders(): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('syntha_access_token');
    if (token) h['Authorization'] = `Bearer ${token}`;
  }
  return h;
}

export async function createCuttingMarker(data: {
  batch_id: number;
  sku_id: string;
  marker_number: string;
  planned_length_m: number;
  roll_id?: number;
  efficiency_percent?: number;
  selvage_cm?: number;
  waste_m?: number;
}) {
  const res = await fetch(`${API}/plm/cutting/markers`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.detail || 'Failed to create marker');
  return json.data ?? json;
}

export async function getCuttingMarkers(batchId: number) {
  const res = await fetch(`${API}/plm/cutting/batches/${batchId}/markers`, {
    headers: authHeaders(),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.detail || 'Failed to load markers');
  return json.data ?? json ?? [];
}

export async function createCuttingReport(data: {
  marker_id: number;
  batch_id: number;
  bom_planned_m: number;
  actual_used_m: number;
}) {
  const res = await fetch(`${API}/plm/cutting/reports`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.detail || 'Failed to create report');
  return json.data ?? json;
}

export async function addMaterialAllowance(data: {
  sku_id: string;
  material_id: string;
  operation: string;
  allowance_percent: number;
  unit?: string;
}) {
  const res = await fetch(`${API}/plm/materials/allowance`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.detail || 'Failed to add allowance');
  return json.data ?? json;
}

export async function recordInlineQC(data: {
  batch_id: number;
  operation_id: number;
  sample_size: number;
  defects_found?: number;
  result: string;
  inspector_id: string;
  photo_url?: string;
}) {
  const res = await fetch(`${API}/plm/qc/inline`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.detail || 'Failed to record inline QC');
  return json.data ?? json;
}

export async function getDefectTypes() {
  const res = await fetch(`${API}/plm/qc/defect-types`, { headers: authHeaders() });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) return [];
  return json.data ?? json ?? [];
}

export async function registerDefectType(data: {
  code: string;
  name_ru: string;
  category: string;
  name_en?: string;
  operation_code?: string;
}) {
  const res = await fetch(`${API}/plm/qc/defect-types`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.detail || 'Failed to register defect type');
  return json.data ?? json;
}

export async function createPPSSample(batchId: number, skuId: string) {
  const res = await fetch(
    `${API}/plm/production/batches/${batchId}/pps?sku_id=${encodeURIComponent(skuId)}`,
    {
      method: 'POST',
      headers: authHeaders(),
    }
  );
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.detail || 'Failed to create PPS');
  return json.data ?? json;
}

export async function getProductionMessages(params?: {
  batch_id?: string;
  sku_id?: string;
  limit?: number;
}) {
  const sp = new URLSearchParams();
  if (params?.batch_id) sp.set('batch_id', params.batch_id);
  if (params?.sku_id) sp.set('sku_id', params.sku_id);
  if (params?.limit) sp.set('limit', String(params.limit));
  const qs = sp.toString();
  const res = await fetch(`${API}/plm/messages${qs ? '?' + qs : ''}`, { headers: authHeaders() });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) return [];
  return json.data ?? json ?? [];
}

export async function sendProductionMessage(data: {
  text: string;
  batch_id?: string;
  sku_id?: string;
  entity_type?: string;
  entity_id?: string;
}) {
  const res = await fetch(`${API}/plm/messages`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.detail || 'Failed to send');
  return json.data ?? json;
}

export async function createGRN(data: {
  material_order_id: number;
  received_qty: number;
  ordered_qty: number;
  status: string;
  received_by: string;
  notes?: string;
}) {
  const res = await fetch(`${API}/plm/grn`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.detail || 'Failed to create GRN');
  return json.data ?? json;
}

export async function getGRNs(materialOrderId?: number) {
  const qs = materialOrderId ? `?material_order_id=${materialOrderId}` : '';
  const res = await fetch(`${API}/plm/grn${qs}`, { headers: authHeaders() });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) return [];
  return json.data ?? json ?? [];
}

export async function createCAPA(data: {
  defect_type_code: string;
  description: string;
  action_type: string;
  batch_id?: number;
  operator_id?: string;
}) {
  const res = await fetch(`${API}/plm/qc/capa`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.detail || 'Failed to create CAPA');
  return json.data ?? json;
}
