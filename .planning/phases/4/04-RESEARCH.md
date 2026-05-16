# Phase 4: Динамическое Планирование (Order Plan / PO) - Адаптация под Сэмплы - Research

**Researched:** 2026-05-15
**Domain:** Production Planning, Time & Action (T&A), AI Capacity Planning, Sample Room Management
**Confidence:** HIGH

## Summary

This phase adapts production planning tools specifically for the experimental workshop (sample room). Unlike mass B2B production, sample making involves high variability, frequent revisions, and smaller batches. The research covers a custom, lightweight Gantt chart implementation for T&A timelines and an AI-driven capacity planner to predict delays based on constructor/seamstress load and tech pack complexity.

**Primary recommendation:** Reuse the custom Tailwind + Framer Motion Gantt chart pattern from `ProductionGantt.tsx` adapted for sample milestones, and leverage the existing `genkit` infrastructure for AI risk and duration prediction based on tech pack complexity.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| T&A Timeline Visualization | Browser / Client | — | Renders the Gantt chart using Tailwind/Framer Motion without heavy external libraries. |
| Timeline State Management | API / Backend | Client Context | Stores milestones, actual vs. target dates. Optimistic UI via `useArticleWorkspace`. |
| AI Capacity Prediction | API / Backend | — | Uses Genkit + Gemini to analyze tech pack complexity and current room load, outputting risk scores. |
| Capacity Data Aggregation | Database / Storage | — | Aggregates historical sewing times and current active tasks per seamstress/constructor. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `framer-motion` | ^11.0.0 | Timeline animations | Already in project, lightweight, perfect for custom Gantt phase bars. |
| `@genkit-ai/google-genai` | ^1.21.0 | AI Prediction | Already configured in `src/ai/genkit.ts`. Gemini 1.5 Flash is fast and excellent at structured JSON output. |
| `lucide-react` | ^0.300.0 | UI Icons | Standard icon set for the project. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom Tailwind Gantt | `dhtmlx-gantt` or `frappe-gantt` | Commercial/heavy libraries bloat the bundle and clash with the strict JOOR/Oracle enterprise UI rules. Custom is better for read-heavy, simple edit workflows. |
| Heuristic formulas | AI Prediction | Hardcoded formulas fail to account for nuanced tech pack details (e.g., specific difficult fabrics combined with complex seams). AI handles unstructured complexity better. |

## Architecture Patterns

### System Architecture Diagram

```mermaid
graph TD
    A[Client: T&A Panel] -->|1. Request AI Prediction| B[API: /api/brand/workshop2/ai/capacity]
    B -->|2. Fetch Tech Pack & Load| C[(Database: Dossier & Active Tasks)]
    C -->|3. Return Data| B
    B -->|4. Prompt (Complexity + Load)| D[Genkit: Gemini 1.5 Flash]
    D -->|5. Structured JSON (Risk, Days)| B
    B -->|6. Return Predicted Timeline| A
    A -->|7. Update UI (Gantt)| E[Client: Render Custom Gantt]
```

### Recommended Project Structure
```text
src/components/brand/production/
├── workshop2-article-workspace-plan-po-panel.tsx      # Existing: Entry point
├── Workshop2TimeAndActionPanel.tsx                    # Existing: Needs adaptation for samples
├── Workshop2PredictiveRiskPanel.tsx                   # Existing: Needs wiring to AI API
├── workshop2-sample-gantt-chart.tsx                   # NEW: Visual timeline component
src/app/api/brand/workshop2/ai/capacity/
└── route.ts                                           # NEW: AI prediction endpoint
```

### Pattern 1: Custom Lightweight Gantt Chart
**What:** Using absolute positioning within a relative grid container to render timeline phases.
**When to use:** For visual timelines where heavy drag-and-drop dependency management (like MS Project) is not required.
**Example:**
```tsx
// Source: Adapted from existing ProductionGantt.tsx
<div className="relative flex h-8 w-full bg-bg-surface2 rounded-md overflow-hidden">
  {phases.map((phase) => (
    <motion.div
      key={phase.id}
      className={cn("absolute h-full flex items-center px-2 text-[10px] font-bold text-white", phase.color)}
      style={{ left: `${phase.startPercent}%`, width: `${phase.widthPercent}%` }}
    >
      {phase.name}
    </motion.div>
  ))}
</div>
```

### Anti-Patterns to Avoid
- **Anti-pattern:** Using mass-production milestones (e.g., "Bulk Fabric Delivery", "Ex-Works") for sample making. Sample milestones should be: "Pattern Drafting", "Toile Fitting", "Cutting", "Sewing Sample", "Final Review".
- **Anti-pattern:** Allowing the AI to hardcode specific dates. The AI should output *durations* (e.g., "needs 3 days") and *risk multipliers*, while the backend/client calculates the actual calendar dates based on working days.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| AI Token Management | Custom fetch calls to Gemini | `withTokenAudit` in `src/ai/genkit.ts` | Existing infrastructure handles caching, token quotas, and logging automatically. |
| Complex Gantt Logic | Full dependency engine | Simple date-diff percentages | We only need a visual representation of the critical path, not a full project management suite. |

## Common Pitfalls

### Pitfall 1: UI Clutter in Gantt Charts
**What goes wrong:** The timeline becomes unreadable on smaller screens or when too many milestones exist.
**Why it happens:** Trying to fit too much text or using oversized components.
**How to avoid:** Adhere strictly to the `JOOR_ORACLE_ENTERPRISE_UI.md` rules. Use dense rows, `text-[10px]` or `text-[11px]` for labels, and rely on tooltips/dialogs (like in `ProductionGantt.tsx`) for detailed phase information.

### Pitfall 2: AI Hallucinating Capacity
**What goes wrong:** The AI predicts a sample can be sewn in 1 hour when the historical average is 8 hours.
**Why it happens:** The prompt lacks grounding in historical baseline data.
**How to avoid:** Provide the AI with baseline metrics in the prompt (e.g., "Standard jacket takes 6 hours. This tech pack has 15 seams and silk fabric. Adjust duration.").

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Spreadsheet T&A | Integrated Visual Gantt | 2024+ | Immediate visibility into bottlenecks without leaving the PLM/workspace. |
| Heuristic Capacity | AI-Driven Risk Scoring | 2025+ | AI can read unstructured tech pack notes (e.g., "delicate fabric") to adjust risk, which static formulas miss. |

## Open Questions

1. **Capacity Data Source**
   - What we know: We need to know the current load of the sample room to predict delays.
   - What's unclear: Is there an existing table/endpoint that tracks active tasks per seamstress/constructor, or do we assume a global "sample room queue" metric for now?
   - Recommendation: Start with a global "Sample Room Load" metric (e.g., High/Medium/Low) passed to the AI, rather than individual seamstress tracking, to simplify Phase 4.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Genkit / Gemini | AI Capacity Planner | ✓ | ^1.21.0 | — |
| Framer Motion | Gantt Animations | ✓ | ^11.0.0 | CSS Transitions |

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes | Next.js Auth / API Guards |
| V4 Access Control | yes | `b2b-v1-api-guard.ts` (Ensure only authorized production managers can edit timelines) |
| V5 Input Validation | yes | Zod schemas for AI prompt inputs and timeline date updates |

### Known Threat Patterns for AI/Planning

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Prompt Injection via Tech Pack notes | Tampering | Sanitize and structure the tech pack JSON before passing to Genkit. Use strict output schemas (`generateObject`). |
| Unauthorized timeline edits | Elevation of Privilege | Enforce role checks (`production_manager`) on the PATCH endpoints for milestones. |

## Sources

### Primary (HIGH confidence)
- Codebase grep: `ProductionGantt.tsx` - Verified custom Gantt implementation pattern.
- Codebase grep: `src/ai/genkit.ts` - Verified AI infrastructure.
- Codebase grep: `src/design/JOOR_ORACLE_ENTERPRISE_UI.md` - Verified UI constraints.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Reusing proven internal patterns.
- Architecture: HIGH - Aligns with existing workspace context and AI flows.
- Pitfalls: HIGH - Based on known enterprise UI constraints and LLM behaviors.

**Research date:** 2026-05-15
**Valid until:** 2026-11-15
