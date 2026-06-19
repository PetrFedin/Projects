# SECTION-DETAIL — sup-op-chain (Этап · materials_supplied)

> **Роль:** поставщик · столп 4 · order 3  
> **Оценка:** 7.5 (live) · UAT e2e core-01/02  
> **Surfaces:** hub `sup-op-chain-steps` · workspace `sup-op-chain-workspace`

## 1. Зачем поставщику

| Обязательно | Не нужно |
|-------------|----------|
| Видеть production_po + materials_supplied | Все 5 шагов (шум) |
| CTA confirm / чат бренду на шаге | Handoff write |
| Live refresh после PATCH | Push-уведомление бренду (P1) |

## 2. Cross-role

```
sup bulk-confirm → chain materials_supplied=true
       ↓
brand/shop/mfr pillar badges (read) · supplier чат бренду
```

## 3. Хорошо / плохо

| ✅ | ⚠️ |
|----|-----|
| SSE poll parity с brand/shop/mfr | SSE badge только при EventSource |
| Workspace badges исправлены (были мёртвые) | Дубль hub + workspace steps |

## 4. Волна 65

- `usePlatformCoreChainStatusPoll` в hub card
- `sup-op-chain-*` testids
- `procurementChainSteps` в materials-core (fix `chainMeta?.steps`)
- `refreshChainStatus()` после confirm

## 5. P1+

- Push notification бренду (не только SSE refetch)
