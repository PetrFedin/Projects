import { CustomizationProject, CustomOrder, BodyMeasurements, CustomOption } from "../types/customization";

export const MOCK_CUSTOMIZATION_PROJECTS: CustomizationProject[] = [
  {
    id: "proj-001",
    brandId: "org-brand-001",
    name: "Classic Cashmere Coat",
    description: "Настройте идеальное пальто из премиального кашемира под ваши параметры.",
    basePrice: 45000,
    availableOptions: {
      fabrics: [
        { id: "f-001", name: "Black Cashmere", type: "fabric", value: "#000000", priceDelta: 0, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=100&auto=format&fit=crop" },
        { id: "f-002", name: "Camel Cashmere", type: "fabric", value: "#c19a6b", priceDelta: 2000, image: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=100&auto=format&fit=crop" },
        { id: "f-003", name: "Navy Cashmere", type: "fabric", value: "#000080", priceDelta: 1000, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=100&auto=format&fit=crop" }
      ],
      buttons: [
        { id: "b-001", name: "Horn Buttons", type: "button", value: "natural", priceDelta: 0 },
        { id: "b-002", name: "Silver Metal", type: "button", value: "silver", priceDelta: 1500 },
        { id: "b-003", name: "Gold Metal", type: "button", value: "gold", priceDelta: 2000 }
      ],
      pockets: [
        { id: "p-001", name: "Welt Pockets", type: "pocket", value: "welt", priceDelta: 0 },
        { id: "p-002", name: "Patch Pockets", type: "pocket", value: "patch", priceDelta: 500 },
        { id: "p-003", name: "Flap Pockets", type: "pocket", value: "flap", priceDelta: 800 }
      ],
      collars: [
        { id: "c-001", name: "Peak Lapel", type: "collar", value: "peak", priceDelta: 0 },
        { id: "c-002", name: "Notch Lapel", type: "collar", value: "notch", priceDelta: 0 },
        { id: "c-003", name: "Shawl Collar", type: "collar", value: "shawl", priceDelta: 1200 }
      ]
    },
    image: "https://images.unsplash.com/photo-1591047139829-d91aec16adcd?q=80&w=800&auto=format&fit=crop"
  }
];

export const MOCK_BODY_MEASUREMENTS: BodyMeasurements = {
  height: 178,
  chest: 98,
  waist: 82,
  hips: 102,
  shoulderWidth: 46,
  armLength: 64,
  inseam: 82,
  neck: 38,
  scannedAt: "2024-03-01T10:00:00Z",
  confidenceScore: 0.98
};

export const MOCK_CUSTOM_ORDERS: CustomOrder[] = [
  {
    id: "cust-001",
    clientId: "user-001",
    clientName: "Александр Иванов",
    brandId: "org-brand-001",
    brandName: "Syntha Premium",
    baseProductId: "prod-001",
    productName: "Classic Cashmere Coat",
    status: "in_production",
    selectedOptions: [
      { id: "f-002", name: "Camel Cashmere", type: "fabric", value: "#c19a6b", priceDelta: 2000 },
      { id: "b-002", name: "Silver Metal", type: "button", value: "silver", priceDelta: 1500 },
      { id: "p-003", name: "Flap Pockets", type: "pocket", value: "flap", priceDelta: 800 },
      { id: "c-001", name: "Peak Lapel", type: "collar", value: "peak", priceDelta: 0 }
    ],
    measurements: MOCK_BODY_MEASUREMENTS,
    totalPrice: 49300,
    createdAt: "2024-03-05T12:00:00Z",
    updatedAt: "2024-03-07T14:30:00Z",
    estimatedDelivery: "2024-03-20",
    digitalPassportUrl: "https://syntha.ai/passport/cust-001"
  }
];

export const getStatusLabel = (status: string) => {
  const labels: {[key: string]: string} = {
    'draft': 'Черновик',
    'configuration': 'Конфигурация',
    'measurement': 'Обмер',
    'payment_pending': 'Ожидает оплаты',
    'in_production': 'В производстве',
    'quality_control': 'Контроль качества',
    'ready_for_shipping': 'Готов к отправке',
    'shipped': 'Отправлен',
    'delivered': 'Доставлен'
  };
  return labels[status] || status;
};

export const getStatusColor = (status: string) => {
  const colors: {[key: string]: string} = {
    'draft': 'bg-slate-100 text-slate-600',
    'configuration': 'bg-blue-100 text-blue-600',
    'measurement': 'bg-indigo-100 text-indigo-600',
    'payment_pending': 'bg-amber-100 text-amber-600',
    'in_production': 'bg-purple-100 text-purple-600',
    'quality_control': 'bg-yellow-100 text-yellow-600',
    'ready_for_shipping': 'bg-emerald-100 text-emerald-600',
    'shipped': 'bg-sky-100 text-sky-600',
    'delivered': 'bg-green-100 text-green-600'
  };
  return colors[status] || 'bg-slate-100 text-slate-600';
};
