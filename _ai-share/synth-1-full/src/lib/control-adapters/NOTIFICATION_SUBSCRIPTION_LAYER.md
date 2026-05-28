# Control signal subscription / preferences (canonical copy)

> **Note:** If `docs/` is writable in your environment, copy this content to:
>
> - `docs/domain-model/notification-subscription.md`
> - plus checklist and architecture index as described in TASK_QUEUE.

See the same sections as the requested canonical doc — this file is the repo-deliverable when `docs/` is cursorignored.

## Executive summary

Minimal preference layer **downstream of `ControlOutput`**: what may surface as notifyable candidates, mute/follow/threshold — **no delivery, no bus, no second SoT**.

## What this layer is / is not

**Is:** preference shapes, pure visibility decisions, notifyable predicates.  
**Is not:** push/email/websocket, inbox, task auto-creation, mutating contracts.

## Notifyable candidates

- `risk` high/severe or critical status rollup → good candidate
- `deadline_pressure` overdue / due_today → good; upcoming → preference
- `blocker_summary.count > 0` → candidate
- `next_action` present → candidate after calibration
- Low noise: combine with prefs, not alone as inbox

## Preference model (v0)

- `followEntityTypes?: ControlEntityType[]`
- `minRiskLevel?: 'high' | 'severe'` (treat critical status as severe for threshold)
- `signalClasses?: ('risk' | 'deadline' | 'next_action' | 'blocker')[]`
- `mutedEntityRefs?: Array<{ entity_type; entity_id }>`
- `mutedReasonCodes?: ReasonCode[]`
- `ownedOnly?: boolean` (off if ownership unknown)

## Mute rules

Mute affects **visibility** only; never rewrites `ControlOutput`.

## Roles

v0: brand-side only; defer supplier/shop/client.

## Code contracts

- `ControlSignalPreference`
- `ControlSignalVisibilityDecision`
- `isNotifyableControlCandidate(output)`
- `resolveControlSignalVisibility(output, preference, context?)`

## First UI consumption

One surface; default empty preference = no behavior change.

## Implementation sequence

1. Pure module + tests — **done**
2. Brand surfaces (B2B orders, control-center order/article) — **done**
3. localStorage for UI hide toggles (`control-layer/control-signal-ui-prefs.ts`) — **done**
4. API / cross-device — **later**
5. RTL smoke (control-center `OrderControlSummaryList` + prefs) — **done**
6. RTL on article block + B2B list/detail + `OrderControlIndicators` — **done**

## Risks

Preferences ≠ truth; do not merge with task SoT; no inbox v1 in this slice.
