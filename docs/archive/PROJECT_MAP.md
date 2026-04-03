# PROJECT_MAP.md — Карта Synth-1 (v57.0)

## 🏗️ Core Layers
- **Frontend App**: `/src/app` (Next.js 15 App Router)
- **Shared Context**: `/src/providers` (AuthProvider, UIStateProvider, B2BStateProvider)
- **Data Repositories**: `/src/lib/repositories` (Firestore interaction layers)
- **Logic / Utils**: `/src/lib/logic` (Landed Cost, Tech Pack, Escrow, Sample Control, Duty, Passport, ESL, Shadow Inventory, Editorial, **Blockchain IP**, **RFID**, **Production IoT**, **Marketing AI**)
- **Types**: `/src/lib/types` (B2B, B2C, Production, Finance, Samples, Compliance, Logistics, Passport, Retail, Immersive, **IP**, **Warehouse**, **Marketing**)
- **Navigation Components**: `/src/components/layout/role-panel.tsx` (Core Role Switcher)

## 🏢 Business Modules (Profiles)
- **Brand OS**: `/src/app/brand` (Collections, PLM, Dashboard, Logistics, VR Showroom, Headless Hub, Shadow Inventory, **Production Control**, **AI Content Factory**, **Assets**, **ESG**, **Loyalty**, **AI Pricing**, **Digital Passport Hub**, **Smart Contracts**, **Production Hub**)
- **Shop OS**: `/src/app/shop` (POS, Inventory, Clienteling, Smart Fitting Room, ESL Sync, **Retail Service**, **VMI**, **Staff HR-OS**, **Sustainability QR Verification**, **Escrow Release**)
- **Distributor OS**: `/src/app/distributor` (B2B Metrics, Retailer Management, VR Showroom Buyer View, **Quota & Regional OS**, **Logistics Hub**, **Settlement Hub**)
- **Production OS**: `/src/app/factory` (Manufacturer & Supplier Dashboards, GANTT, QC, **IoT Monitoring**, **RFID Gates**, **Batch Control**, **Maintenance**, **Risk Radar**, **Sustainability Proofs**, **Auto-Bonus**)
- **Client OS**: `/src/app/client` (Digital Dashboard, AI Body Scan, Wallet, Wardrobe, **Personal Hub**, **Digital Passport Scanner**)
- **Admin OS**: `/src/app/admin` (Dispute Center, Compliance Hub, Integration Gateway, Marketroom CMS, **Global Tax Engine**, **Transparency Ledger**, **Escalator Control**)
- **Marketroom Public**: `/src/app/marketroom` (Magazine, Shop the Look, AI Trend Radar)

## 🧠 AI & Intelligence Layer
- **Genkit Engine**: `/src/ai/genkit.ts` (Core flow orchestrator)
- **Token Economy**: `/src/ai/token-guard.ts` (Quota & Audit)
- **Vision Hub**: `/src/ai/vision` (QC, Pattern Nesting, HS Auto-Coder)
- **AI Planning Flow**: `/src/ai/flows/sku-planner.ts` (Demand forecasting)
- **AI Styling Hub**: `/src/ai/flows/body-scanner.ts` (Personalization)

## ⚙️ Infrastructure & Compliance
- **Headless Hub**: `/src/app/api/headless` (Product & Order APIs)
- **Firebase Hub**: `/src/lib/firebase/config.ts` (Auth, Firestore, Storage)
- **Compliance Hub**: `/src/lib/compliance` (Chestny ZNAK, EDO, DDP)
- **Fintech Hub**: `/src/lib/fintech` (Escrow Engine, BNPL, Factoring, Wallet)

## 📊 Analytics & BI
- **BI Layer**: `/src/lib/analytics` (Sell-through, Price Elasticity, Heatmap)
- **Audit Ledger**: `/src/lib/audit` (Action tracking)
