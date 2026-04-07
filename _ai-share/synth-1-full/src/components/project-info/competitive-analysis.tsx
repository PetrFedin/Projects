
'use client';

import { cn } from "@/lib/utils";

const analysisData = [
    {
        title: "🩵 1. CORE / Общие функции",
        headers: ["Функция", "Syntha", "Lamoda", "TSUM", "Farfetch", "Mytheresa", "Zalando", "ASOS", "Wildberries", "Shein", "Depop", "Vestiaire", "RealReal", "JOOR"],
        rows: [
            { "Функция": "Multi-роль (бренд / магазин / клиент / B2B)", "Syntha": "✔", "Lamoda": "≈", "TSUM": "≈", "Farfetch": "✔", "Mytheresa": "✔", "Zalando": "✔", "ASOS": "✔", "Wildberries": "≈", "Shein": "≈", "Depop": "✔", "Vestiaire": "✔", "RealReal": "✔", "JOOR": "✔" },
            { "Функция": "Marketplace (B2C)", "Syntha": "✔", "Lamoda": "✔", "TSUM": "✔", "Farfetch": "✔", "Mytheresa": "✔", "Zalando": "✔", "ASOS": "✔", "Wildberries": "✔", "Shein": "✔", "Depop": "✔", "Vestiaire": "✔", "RealReal": "✔", "JOOR": "—" },
            { "Функция": "B2B wholesale / pre-order", "Syntha": "✔", "Lamoda": "≈", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "≈", "Zalando": "✔", "ASOS": "—", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "✔" },
            { "Функция": "Circularity / Second Life", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "—", "Zalando": "—", "ASOS": "—", "Wildberries": "—", "Shein": "—", "Depop": "✔", "Vestiaire": "✔", "RealReal": "✔", "JOOR": "—" },
            { "Функция": "Try-Before-Pay", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "✔", "Zalando": "✔", "ASOS": "✔", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "—" },
            { "Функция": "Click-&-Collect / Pickup", "Syntha": "✔", "Lamoda": "✔", "TSUM": "✔", "Farfetch": "✔", "Mytheresa": "✔", "Zalando": "✔", "ASOS": "✔", "Wildberries": "✔", "Shein": "✔", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "—" },
        ]
    },
    {
        title: "🤖 2. AI-TECH / Персонализация и интеллектуальные модули",
        headers: ["Функция", "Syntha", "Lamoda", "TSUM", "Farfetch", "Mytheresa", "Zalando", "ASOS", "Wildberries", "Shein", "Depop", "Vestiaire", "RealReal", "JOOR"],
        rows: [
            { "Функция": "AI-Stylist / генерация луков", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "≈", "Mytheresa": "—", "Zalando": "✔", "ASOS": "✔", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "—" },
            { "Функция": "AI-Size Predictor", "Syntha": "✔", "Lamoda": "≈", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "✔", "Zalando": "✔", "ASOS": "✔", "Wildberries": "—", "Shein": "✔", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "—" },
            { "Функция": "Visual Search (по фото)", "Syntha": "✔", "Lamoda": "✔", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "✔", "Zalando": "✔", "ASOS": "✔", "Wildberries": "≈", "Shein": "✔", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "—" },
            { "Функция": "AI-Trend Forecast / Demand Prediction", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "✔", "Zalando": "✔", "ASOS": "✔", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "✔" },
            { "Функция": "AI-Moodboard / Outfit Generator", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "—", "Mytheresa": "—", "Zalando": "—", "ASOS": "—", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "—" },
            { "Функция": "AI-Brand Story / Content Automation", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "—", "Mytheresa": "—", "Zalando": "—", "ASOS": "—", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "—" },
        ]
    },
    {
        title: "🕶 3. AR / UX / Digital Experience",
        headers: ["Функция", "Syntha", "Lamoda", "TSUM", "Farfetch", "Mytheresa", "Zalando", "ASOS", "Wildberries", "Shein", "Depop", "Vestiaire", "RealReal", "JOOR"],
        rows: [
            { "Функция": "AR-примерка / 3D Preview", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "≈", "Mytheresa": "—", "Zalando": "≈", "ASOS": "≈", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "—" },
            { "Функция": "Виртуальные рейлы коллекций", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "—", "Mytheresa": "—", "Zalando": "—", "ASOS": "—", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "✔" },
            { "Функция": "QR-пакеты коллекций", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "—", "Mytheresa": "—", "Zalando": "—", "ASOS": "—", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "✔" },
            { "Функция": "Shoppable Video / интерактивное видео", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "✔", "Zalando": "—", "ASOS": "—", "Wildberries": "—", "Shein": "✔", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "—" },
            { "Функция": "Live-Shopping / Runway", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "✔", "Zalando": "—", "ASOS": "—", "Wildberries": "—", "Shein": "✔", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "—" },
            { "Функция": "Phygital-капсулы (цифровой двойник вещи)", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "—", "Zalando": "—", "ASOS": "—", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "—" },
        ]
    },
    {
        title: "🧵 4. B2B / Wholesale & Retail",
        headers: ["Функция", "Syntha", "Lamoda", "TSUM", "Farfetch", "Mytheresa", "Zalando", "ASOS", "Wildberries", "Shein", "Depop", "Vestiaire", "RealReal", "JOOR"],
        rows: [
            { "Функция": "Linesheet / Digital Showroom", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "—", "Zalando": "✔", "ASOS": "—", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "✔" },
            { "Функция": "MOQ / Prepack Templates", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "—", "Zalando": "—", "ASOS": "—", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "✔" },
            { "Функция": "Private VR Showrooms", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "—", "Zalando": "—", "ASOS": "—", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "✔" },
            { "Функция": "Unified Multi-brand Order", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "—", "Mytheresa": "—", "Zalando": "—", "ASOS": "—", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "✔" },
            { "Функция": "E-Contracts / Digital Signature", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "—", "Zalando": "—", "ASOS": "—", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "✔" },
            { "Функция": "Dynamic Linesheet Sharing", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "—", "Zalando": "—", "ASOS": "—", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "✔" },
        ]
    },
    {
        title: "🌱 5. Sustainability / ESG / Upcycling",
        headers: ["Функция", "Syntha", "Lamoda", "TSUM", "Farfetch", "Mytheresa", "Zalando", "ASOS", "Wildberries", "Shein", "Depop", "Vestiaire", "RealReal", "JOOR"],
        rows: [
            { "Функция": "Eco-rating / Conscious label", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "—", "Zalando": "✔", "ASOS": "✔", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "✔", "RealReal": "✔", "JOOR": "—" },
            { "Функция": "CO₂ Offset API", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "✔", "Zalando": "✔", "ASOS": "—", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "✔", "RealReal": "✔", "JOOR": "—" },
            { "Функция": "Upcycling / Repair Programs", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "—", "Zalando": "—", "ASOS": "—", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "—" },
            { "Функция": "Sustainability Index (бренд)", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "✔", "Zalando": "✔", "ASOS": "—", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "✔", "RealReal": "✔", "JOOR": "—" },
            { "Функция": "Carbon Impact per Order", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "✔", "Zalando": "✔", "ASOS": "—", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "—" },
        ]
    },
    {
        title: "💬 6. Community / Engagement",
        headers: ["Функция", "Syntha", "Lamoda", "TSUM", "Farfetch", "Mytheresa", "Zalando", "ASOS", "Wildberries", "Shein", "Depop", "Vestiaire", "RealReal", "JOOR"],
        rows: [
            { "Функция": "Социальные профили / подписки", "Syntha": "✔", "Lamoda": "≈", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "—", "Zalando": "✔", "ASOS": "✔", "Wildberries": "≈", "Shein": "✔", "Depop": "✔", "Vestiaire": "✔", "RealReal": "✔", "JOOR": "—" },
            { "Функция": "UGC / Looks / Reels", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "✔", "Zalando": "✔", "ASOS": "✔", "Wildberries": "—", "Shein": "✔", "Depop": "✔", "Vestiaire": "✔", "RealReal": "✔", "JOOR": "—" },
            { "Функция": "Gamification / Missions", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "—", "Mytheresa": "—", "Zalando": "✔", "ASOS": "—", "Wildberries": "—", "Shein": "✔", "Depop": "✔", "Vestiaire": "—", "RealReal": "—", "JOOR": "—" },
            { "Функция": "Referral System", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "—", "Mytheresa": "—", "Zalando": "—", "ASOS": "✔", "Wildberries": "—", "Shein": "✔", "Depop": "✔", "Vestiaire": "—", "RealReal": "—", "JOOR": "—" },
            { "Функция": "Reviews & Ratings", "Syntha": "✔", "Lamoda": "✔", "TSUM": "✔", "Farfetch": "✔", "Mytheresa": "✔", "Zalando": "✔", "ASOS": "✔", "Wildberries": "✔", "Shein": "✔", "Depop": "✔", "Vestiaire": "✔", "RealReal": "✔", "JOOR": "—" },
        ]
    },
    {
        title: "📊 7. Analytics / BI / AI Insights",
        headers: ["Функция", "Syntha", "Lamoda", "TSUM", "Farfetch", "Mytheresa", "Zalando", "ASOS", "Wildberries", "Shein", "Depop", "Vestiaire", "RealReal", "JOOR"],
        rows: [
            { "Функция": "Brand Insights Dashboard", "Syntha": "✔", "Lamoda": "✔", "TSUM": "✔", "Farfetch": "✔", "Mytheresa": "✔", "Zalando": "✔", "ASOS": "✔", "Wildberries": "✔", "Shein": "✔", "Depop": "—", "Vestiaire": "—", "RealReal": "✔", "JOOR": "✔" },
            { "Функция": "Customer 360 (LTV, CLV)", "Syntha": "✔", "Lamoda": "≈", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "✔", "Zalando": "✔", "ASOS": "✔", "Wildberries": "≈", "Shein": "✔", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "✔" },
            { "Функция": "Heatmaps / Geo Analytics", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "—", "Zalando": "✔", "ASOS": "✔", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "✔" },
            { "Функция": "Predictive Analytics", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "—", "Zalando": "✔", "ASOS": "✔", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "✔" },
            { "Функция": "A/B-Testing Suite", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "—", "Zalando": "✔", "ASOS": "✔", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "✔" },
        ]
    },
    {
        title: "🧩 8. Infrastructure / Governance",
        headers: ["Функция", "Syntha", "Lamoda", "TSUM", "Farfetch", "Mytheresa", "Zalando", "ASOS", "Wildberries", "Shein", "Depop", "Vestiaire", "RealReal", "JOOR"],
        rows: [
            { "Функция": "Multi-Currency / Duty-Free", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "✔", "Zalando": "✔", "ASOS": "✔", "Wildberries": "—", "Shein": "✔", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "—" },
            { "Функция": "Centralized Fulfillment", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "✔", "Zalando": "✔", "ASOS": "✔", "Wildberries": "✔", "Shein": "✔", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "✔" },
            { "Функция": "API / SDK Marketplace", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "✔", "Zalando": "✔", "ASOS": "✔", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "✔" },
            { "Функция": "ERP / CRM Integration", "Syntha": "✔", "Lamoda": "≈", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "✔", "Zalando": "✔", "ASOS": "✔", "Wildberries": "≈", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "✔" },
            { "Функция": "E-Contracts / Legal Vault", "Syntha": "✔", "Lamoda": "—", "TSUM": "—", "Farfetch": "✔", "Mytheresa": "—", "Zalando": "—", "ASOS": "—", "Wildberries": "—", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "✔" },
            { "Функция": "Fraud / Trust Hub", "Syntha": "✔", "Lamoda": "≈", "TSUM": "≈", "Farfetch": "✔", "Mytheresa": "✔", "Zalando": "✔", "ASOS": "✔", "Wildberries": "≈", "Shein": "—", "Depop": "—", "Vestiaire": "—", "RealReal": "—", "JOOR": "✔" },
        ]
    },
    {
        title: "🩶 ИТОГОВОЕ СРАВНЕНИЕ (по блокам)",
        headers: ["Блок", "Syntha", "Лучший аналог сейчас"],
        rows: [
            { "Блок": "Core / eCommerce", "Syntha": "✔ Полный", "Лучший аналог сейчас": "Farfetch / Zalando" },
            { "Блок": "AI & Personalization", "Syntha": "✔ Лидер", "Лучший аналог сейчас": "Zalando" },
            { "Блок": "AR / UX", "Syntha": "✔ Уникальный", "Лучший аналог сейчас": "Farfetch (частично)" },
            { "Блок": "B2B / Wholesale", "Syntha": "✔ Конкурент JOOR", "Лучший аналог сейчас": "JOOR" },
            { "Блок": "Sustainability / ESG", "Syntha": "✔ Лидер", "Лучший аналог сейчас": "Farfetch / Zalando" },
            { "Блок": "Community", "Syntha": "✔ Лидер", "Лучший аналог сейчас": "Depop / Shein" },
            { "Блок": "Analytics / BI", "Syntha": "✔ На уровне Zalando", "Лучший аналог сейчас": "Zalando" },
            { "Блок": "Infrastructure / Global", "Syntha": "✔ Шире всех", "Лучший аналог сейчас": "Farfetch / Zalando" },
        ]
    }
];

export default function CompetitiveAnalysis() {
    return (
        <div className="space-y-6">
            <p className="text-sm text-muted-foreground">Обозначения: «✔» — реализовано, «≈» — частично, «—» — отсутствует или не заявлено публично.</p>
            {analysisData.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                    <h3 className="text-sm font-semibold mb-4">{section.title}</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted/50">
                                <tr>
                                    {section.headers.map((header, headerIndex) => (
                                        <th key={headerIndex} scope="col" className={cn("px-3 py-3.5 text-left text-sm font-semibold text-foreground whitespace-nowrap", header === 'Syntha' && 'bg-muted')}>
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border bg-background">
                                {section.rows.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {section.headers.map((header, cellIndex) => (
                                            <td key={cellIndex} className={cn("px-3 py-4 text-sm text-foreground whitespace-nowrap", header === 'Syntha' && 'bg-muted')}>
                                                {row[header as keyof typeof row]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    )
}
