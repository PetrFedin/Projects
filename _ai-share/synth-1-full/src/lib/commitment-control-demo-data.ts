/**
 * Demo-only commitment inputs for read-only control surfaces.
 * Dates are derived from `as_of` so rows stay visible (overdue / upcoming / due today) regardless of wall clock.
 * Not production data — replace when a real commitment read model exists.
 */
import type { CommitmentControlInput } from '@/lib/control-adapters/commitment-control-output';

/** Shift YYYY-MM-DD by whole days (UTC calendar). */
export function shiftCommittedYmd(anchorYmd: string, deltaDays: number): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(anchorYmd.trim());
  if (!m) return anchorYmd;
  const t = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) + deltaDays * 86_400_000;
  return new Date(t).toISOString().slice(0, 10);
}

/**
 * Build demo commitments anchored to the same snapshot day as control `as_of`.
 */
export function buildCommitmentDemoInputs(as_of: string): CommitmentControlInput[] {
  const day = as_of.slice(0, 10);
  if (day.length !== 10 || day[4] !== '-' || day[7] !== '-') {
    return [];
  }

  return [
    {
      as_of,
      commitment_id: 'cmt-mfg-204',
      commitment_kind: 'production_po',
      party_type: 'factory',
      party_id: 'fab-turkey-01',
      display_label: 'PO · корпус пальто FW26',
      article_id: 'art-2',
      commitment_status: 'in_progress',
      committed_date_ymd: shiftCommittedYmd(day, -6),
      is_capacity_confirmed: true,
      is_material_ready: true,
    },
    {
      as_of,
      commitment_id: 'cmt-mat-118',
      commitment_kind: 'material_po',
      party_type: 'supplier',
      party_id: 'sup-milano-textile',
      display_label: 'Ткань основная · чёрный',
      article_id: 'art-1',
      commitment_status: 'in_progress',
      committed_date_ymd: shiftCommittedYmd(day, 2),
      is_material_ready: false,
      is_capacity_confirmed: true,
    },
    {
      as_of,
      commitment_id: 'cmt-cap-07',
      commitment_kind: 'capacity_reservation',
      party_type: 'factory',
      party_id: 'fab-portugal-02',
      display_label: 'Резерв линии · неделя',
      collection_id: 'col-fw26',
      commitment_status: 'confirmed',
      committed_date_ymd: shiftCommittedYmd(day, 1),
      is_capacity_confirmed: false,
    },
    {
      as_of,
      commitment_id: 'cmt-qc-03',
      commitment_kind: 'subcontract',
      party_type: 'subcontractor',
      party_id: 'sub-embroidery-kyiv',
      display_label: 'Вышивка логотипа · партия A',
      sample_id: 'smp-12',
      commitment_status: 'qc_hold',
      is_qc_blocked: true,
      committed_date_ymd: shiftCommittedYmd(day, 2),
    },
    {
      as_of,
      commitment_id: 'cmt-req-501',
      commitment_kind: 'sample_commitment',
      party_type: 'factory',
      party_id: 'fab-local-01',
      display_label: 'Золотой сэмпл · согласование',
      article_id: 'art-3',
      commitment_status: 'requested',
      committed_date_ymd: shiftCommittedYmd(day, 10),
    },
    // Спокойный кейс: часто не попадает в control-center (нет дедлайна в окне / нет next) — для полноты демо-набора.
    {
      as_of,
      commitment_id: 'cmt-ok-900',
      commitment_kind: 'production_po',
      party_type: 'factory',
      party_id: 'fab-turkey-01',
      display_label: 'Серийный запуск · без отклонений',
      article_id: 'art-4',
      commitment_status: 'in_progress',
      committed_date_ymd: shiftCommittedYmd(day, 18),
      is_capacity_confirmed: true,
      is_material_ready: true,
    },
  ];
}
