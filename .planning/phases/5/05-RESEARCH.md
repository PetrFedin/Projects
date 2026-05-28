<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
None locked yet.

### Claude's Discretion
- Selection of barcode/QR generation libraries.
- Visualization techniques for Bottleneck Detection.
- Media handling approaches for short video instructions.

### Deferred Ideas (OUT OF SCOPE)
- Mass production tracking (focused on samples and small batches).
</user_constraints>

# Phase 5: Мониторинг Производства (Production / Release) - Research

**Researched:** 2026-05-15
**Domain:** Manufacturing Execution System (MES), Real-time Tracking, Media Attachments
**Confidence:** HIGH

## Summary

This phase transitions the current static `workshop2-article-workspace-release-panel.tsx` into an active tracking system (Shop Floor Control). The static operations list ("pending", "in_progress", "completed") will be driven by field events via tablet scanning. Key enablers are QR-based routing sheets, a live WIP (Work In Progress) dashboard for bottleneck detection, and inline video instructions for complex sewing nodes.

**Primary recommendation:** Use frontend QR generation (`qrcode.react`) for routing sheets, standard Recharts + existing polling/real-time infrastructure for bottlenecks, and native HTML5 `<video>` for MP4/GIF instructions loaded from S3.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Route Sheet Generation | Browser / Client | Frontend Server | Generating QR codes is best done client-side for print-ready layouts, avoiding server overhead for image generation. |
| QR/Barcode Scanning | Browser / Client | API / Backend | HTML5 camera APIs or external tablet scanners inputting to browser. API handles the state mutation. |
| Bottleneck Dashboard | API / Backend | Browser / Client | Aggregation of WIP states over time must happen on the backend. Client renders via Recharts. |
| Media Delivery (Video) | CDN / Static | API / Backend | S3/CDN serves the MP4/GIFs. API simply provides the presigned URLs or metadata. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `qrcode.react` | ^3.1.0 | QR code generation | Native React, renders SVG/Canvas, ideal for print layouts without backend load. |
| `recharts` | ^2.12.0 | Bottleneck visualization | Existing standard in Synth-1 for all dashboard charts. |
| HTML5 `<video>` | N/A | Video instructions | No external library needed for short MP4s; standard native performance. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `react-webcam` / `html5-qrcode` | ^3.0.0 / ^2.3.8 | Tablet scanning | If tablets lack hardware scanners and need browser-based camera scanning. |

**Installation:**
```bash
npm install qrcode.react
```

## Architecture Patterns

### System Architecture Diagram
(Conceptual data flow for Production Tracking)
```
[Tablet / Scanner] --(Scan Event: QR ID)--> [API: /api/processes/[id]/events]
                                                  |
                                                  v
                                          [Order / Bundle State]
                                                  |
[WIP Dashboard] <--(Poll / SSE: State Aggregation)-+
```

### Recommended Project Structure
```text
src/
├── components/brand/production/
│   ├── workshop2-routing-sheet-print.tsx   # Print layout with QR
│   ├── workshop2-bottleneck-dashboard.tsx  # WIP dashboard
│   ├── workshop2-operation-media.tsx       # Video/GIF player
```

### Pattern 1: Print-Ready Routing Sheets
**What:** Generating a specialized layout for printing that includes the bundle ID as a QR code and operations as barcodes.
**When to use:** When releasing a bundle to the floor.
**Example:**
```tsx
import { QRCodeSVG } from 'qrcode.react';

export function RouteSheet({ bundleId }) {
  return (
    <div className="print-only">
      <h1>Bundle {bundleId}</h1>
      <QRCodeSVG value={`synth://bundle/${bundleId}`} size={128} />
    </div>
  );
}
```

### Anti-Patterns to Avoid
- **Generating QR codes as PNGs on the backend:** Wastes server CPU and memory. Generate them as SVGs on the client.
- **Heavy Video Players (e.g., video.js):** For short 5-10 second instruction loops, native `<video loop muted playsInline>` is vastly superior.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| QR Generation | Canvas drawing algorithms | `qrcode.react` | SVGs scale infinitely and are reliable for print. |
| Charting | Custom SVG charts | `recharts` | Consistency with the rest of the project and responsive design. |

## Runtime State Inventory

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | Operations array in `release` object | Needs schema expansion to store media URLs and scan timestamps. |
| Live service config | None — verified | none |
| OS-registered state | None — verified | none |
| Secrets/env vars | None — verified | none |
| Build artifacts | None — verified | none |

## Common Pitfalls

### Pitfall 1: Unreadable Barcodes/QRs
**What goes wrong:** Tablets or scanners fail to read the printed codes.
**Why it happens:** SVG scaling issues, low contrast, or embedding too much data in the QR.
**How to avoid:** Embed only the ID (`bundleId` or `operationId`), not the whole payload. Ensure high contrast and a quiet zone around the QR.

### Pitfall 2: Video Autoplay Blocking
**What goes wrong:** Videos require a click to play, breaking the seamless instruction flow for workers with full hands.
**Why it happens:** Browser policies block unmuted autoplay.
**How to avoid:** Always use `<video autoPlay loop muted playsInline>`.

## Code Examples

### Native Video Instruction Loop
```tsx
<video 
  src={mediaUrl} 
  autoPlay 
  loop 
  muted 
  playsInline 
  className="w-full rounded-md object-cover"
/>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Complex JS Video Players | Native HTML5 Video | ~2020 | Lighter bundle, better mobile/tablet performance for short loops. |
| Server-side Barcode APIs | Client-side SVG generation | ~2018 | Zero latency, perfect print scaling. |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| [ASSUMED] A1 | Existing API can handle scan events | Architecture | Need to build new endpoint if `/api/processes/...` is insufficient. |
| [ASSUMED] A2 | Tablets have built-in scanners or can use camera | Standard Stack | May need to integrate HID scanner events instead of camera API. |

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| S3/Object Storage | Video instructions | ✓ | N/A | Base64 strings (not recommended) |

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes | Role-based tablet sessions |
| V4 Access Control | yes | Verify user has production role |
| V5 Input Validation | yes | Validate scanned payload structure |

### Known Threat Patterns for Next.js / MES

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Scanning forged QRs | Spoofing | Cryptographic signatures on IDs or strict validation against DB state |
| Insecure direct object reference (IDOR) on videos | Information Disclosure | Presigned S3 URLs |

## Sources

### Primary (HIGH confidence)
- [CITED: github.com/zpao/qrcode.react] - Standard approach for client-side QR.
- [CITED: developer.mozilla.org/en-US/docs/Web/HTML/Element/video] - Autoplay policies for muted videos.

### Secondary (MEDIUM confidence)
- N/A

### Tertiary (LOW confidence)
- N/A

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - qrcode.react and HTML5 video are industry standards.
- Architecture: HIGH - Fits perfectly into the existing Next.js + API polling paradigm.
- Pitfalls: HIGH - Autoplay and barcode readability are classic MES issues.

**Research date:** 2026-05-15
**Valid until:** 2026-11-15
