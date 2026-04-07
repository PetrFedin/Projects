# JOOR Strategic Intelligence: Design Philosophy & Project Structure

This document outlines the visual and structural principles applied to the Syntha Brand Cabinet to achieve the "JOOR Effect" — a high-density, professional B2B operational environment.

## 1. Psychological Principles (The JOOR Effect)

*   **Operational Density:** By reducing font sizes (9px-11px) and tightening whitespace, we provide more information per square inch. This creates a "Control Center" feeling, reducing the need for scrolling and making the user feel in command of complex data.
*   **Hierarchical Flatness:** Avoiding heavy shadows and rounded corners in favor of 1px borders and sharp edges. This communicates stability, seriousness, and professional utility.
*   **Tabular Confidence:** Consistent use of `tabular-nums` for all financial and count data. Alignment is critical: text is left-aligned, numbers are right-aligned.
*   **Visual Silence:** Using a palette of Slate greys (50-900) as the canvas. Accents (Blue, Emerald, Rose) are used sparingly only for status or critical alerts, ensuring they "pop" without creating visual noise.

## 2. Technical Implementation (UI-Kit)

### Core Components
*   **DataTable (Strategic Table):** Built using standard HTML table tags with Tailwind utilities.
    *   `sticky left-0`: For primary identifiers (Product Name, Order ID).
    *   `border-collapse`: For a seamless grid feel.
    *   `hover:bg-slate-50/50`: For row tracking without high contrast.
*   **Analytical Grid:** Compact 4-column layouts for high-level KPIs.
*   **Strategic Sidebar:** AI-driven context panels in dark (Slate 900) to distinguish "Insight" from "Operation".

### Project Structure (src/components)
```text
src/
  components/
    brand/             # Brand-specific modules
      blog/            # Content & News
      inventory/       # Assortment Management
      messages/        # B2B Strategic Chat
    data/              # Complex data components
      DataTable/       # Core Strategic Table
    ui/                # Atomic JOOR Components
      JoorButton.tsx
      JoorBadge.tsx
      JoorInput.tsx
      JoorCard.tsx
```

## 3. Design Tokens (design/tokens.json)
*   **Font:** Inter (Sans-serif) is mandatory for readability at small sizes.
*   **Colors:**
    *   `Canvas`: #FFFFFF
    *   `Sub-Canvas`: #F8FAFC (Slate 50)
    *   `Borders`: #E2E8F0 (Slate 200)
    *   `Primary Text`: #0F172A (Slate 900)
*   **Radius:** `0px` for containers, `2px-4px` for internal elements (buttons/badges).

## 4. Cursor Guidance (Prompting)
To maintain this style, always instruct Cursor with:
> "Implement using JOOR Strategic Intelligence style: high density, Inter font, Slate palette, tabular alignment, 1px borders, and operational density."
