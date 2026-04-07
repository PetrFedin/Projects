# AI Project Map (synth-1)

## Architecture Overview
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: React Context (`providers/ui-state.tsx`) + Local State
- **Icons**: Lucide React

## Key Entry Points
- **Home**: `src/app/page.tsx`
- **Brand Profile**: `src/app/b/[brandId]/page.tsx` (Heavily refactored into `_components/`)
- **User Profile**: `src/app/u/page.tsx`
- **B2B Matrix**: `src/app/shop/b2b/matrix/page.tsx`
- **Factory Dashboard**: `src/app/factory/page.tsx`

## Data Layer
- **Location**: `public/data/*.json`
- **Usage**: Loaded via `fetch()` in `useEffect` or passed as props.
- **Important Files**:
  - `brands.json`: Brand metadata and settings.
  - `products.json`: Global product catalog.
  - `categories.json`: Multi-level category hierarchy.

## Types & Utils
- **Shared Types**: `src/lib/types.ts`
- **Mock Data**: `src/lib/placeholder-data.ts`
- **Utilities**: `src/lib/utils.ts`

## Component Strategy
- **Shared UI**: `src/components/ui/` (Radix based)
- **Global Components**: `src/components/`
- **Page-Specific Components**: `src/app/**/_components/` (Extracted to keep pages < 500 lines)

## Conventions
- **Imports**: Always use absolute paths `@/*`.
- **Modularity**: Extract large JSX blocks into domain-specific components early.
- **Refactoring**: Use `diff` for changes; never rewrite whole files.
