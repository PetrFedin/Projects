# PATH-AUDIT — Noise / UI dedup (Agent C)

**Date:** 2026-06-09 · **Scope:** hub, cabinet, workspace, side-paths, labels

## Automated guard

`npm run audit:platform-core-ui` — **11/11 PASS** (forbidden dupes, slim chrome, compact cross-role).

## Closed (wave 1–4)

| Item | Evidence |
|------|----------|
| Hub Business view | `PlatformHubInvestorSlim` |
| RoleCabinetStrip hidden in core | layout guards |
| Workspace slim headers | majority workspaces |
| Shop side-paths ~30 redirects | `core-04` e2e |
| entity-links filter | `platform-core-entity-links-registry.ts` |
| Single shop calendar | nav augment + delivery-calendar redirect |
| B2B-DEMO in labels | masked in inbox titles |
| SHOWROOM_SHOP_LEAD off core-path | nav augment test |

## Open P1

| Item | Path |
|------|------|
| materials tabs vs заголовки | `materials-core.tsx` / supplier workspace |
| ~~SynthaDemoMark on core surfaces~~ ✓ hidden in core mode |
| ~~Brand suppliers legacy hub~~ ✓ → materials BOM | `/brand/suppliers` |
| SECTION_AUDIT stale strings | brand comms «unified inbox» |

## Open P2

| Item | Path |
|------|------|
| `platform-core-b2b-side-path-redirect` copy tuning | catch-all tail |
| Duplicate calendar in shop dashboard vs comms | resolved in nav; verify dashboard |
| Investor matrix detailRu length | hub matrix table |

## Next

1. Run §3.3 UAT per role on SECTION_AUDIT links
2. Hide SynthaDemoMark when `NEXT_PUBLIC_PLATFORM_CORE_MODE=1`
3. Redirect `/brand/suppliers` → materials in core
4. Refresh SECTION_AUDIT good/bad after each wave

**Verdict:** UI dedup ~8.5/10; remaining noise is legacy routes outside core guards, not duplicate chrome on golden path.
