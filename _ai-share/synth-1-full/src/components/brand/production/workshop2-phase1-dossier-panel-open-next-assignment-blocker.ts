import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';
import { W2_CONSTRUCTION_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-construction-dossier-anchors';
import { W2_MATERIAL_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-material-bom-check';
import { W2_PASSPORT_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-passport-check';
import type { Workshop2TzGateId } from '@/lib/production/workshop2-tz-gates';
import type { Workshop2TzPreflightIssue } from '@/lib/production/workshop2-tz-trace';

export function runOpenNextAssignmentBlocker(opts: {
  firstUnmetId: Workshop2TzGateId | undefined;
  preflightFirstIssue: Workshop2TzPreflightIssue | undefined;
  jumpToSketchLineRefs: () => void;
  jumpToTzSectionAnchor: (section: Workshop2TzSignoffSectionKey, anchorId: string) => void;
  onFocusCriticalComments: () => void;
}): void {
  const {
    firstUnmetId,
    preflightFirstIssue,
    jumpToSketchLineRefs,
    jumpToTzSectionAnchor,
    onFocusCriticalComments,
  } = opts;

  if (firstUnmetId) {
    switch (firstUnmetId) {
      case 'sketch':
        jumpToSketchLineRefs();
        return;
      case 'zip_bytes':
        jumpToTzSectionAnchor('construction', W2_CONSTRUCTION_SUBPAGE_ANCHORS.patternFiles);
        return;
      case 'composition_label':
        jumpToTzSectionAnchor('material', W2_MATERIAL_SUBPAGE_ANCHORS.compositionLabel);
        return;
      case 'section_signoffs':
        jumpToTzSectionAnchor('construction', W2_CONSTRUCTION_SUBPAGE_ANCHORS.signoff);
        return;
      case 'handoff_marks':
        jumpToTzSectionAnchor('assignment', W2_CONSTRUCTION_SUBPAGE_ANCHORS.send);
        return;
      case 'critical_comments':
        onFocusCriticalComments();
        return;
      default:
        break;
    }
  }

  const issue = preflightFirstIssue;
  if (!issue) return;

  switch (issue.target) {
    case 'visuals':
      jumpToSketchLineRefs();
      return;
    case 'construction':
      jumpToTzSectionAnchor('construction', W2_CONSTRUCTION_SUBPAGE_ANCHORS.patternFiles);
      return;
    case 'assignment':
      jumpToTzSectionAnchor('assignment', W2_CONSTRUCTION_SUBPAGE_ANCHORS.send);
      return;
    case 'comments':
      onFocusCriticalComments();
      return;
    default:
      jumpToTzSectionAnchor('general', W2_PASSPORT_SUBPAGE_ANCHORS.start);
  }
}
