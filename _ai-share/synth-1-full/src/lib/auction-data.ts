import { Auction } from "./types";

export const mockAuctions: Auction[] = [
  {
    id: "auc-1",
    title: "Производство капсульной коллекции FW26",
    description: "Требуется пошив 500 единиц (жакеты, брюки) из высококачественного кашемира. Все лекала готовы. Срок отгрузки: 15 сентября.",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800",
    type: "production",
    brandId: "syntha",
    brandName: "Syntha",
    category: "Пошив одежды",
    targetQuantity: 500,
    targetPrice: 4500,
    status: "active",
    endDate: "2026-02-15T18:00:00Z",
    createdAt: "2026-01-10T10:00:00Z",
    bids: [
      {
        id: "bid-1",
        auctionId: "auc-1",
        bidderId: "fact-1",
        bidderName: "Фабрика #1 (Москва)",
        bidderRating: 4.8,
        amount: 4200,
        deliveryDays: 45,
        status: "leading",
        createdAt: "2026-01-12T14:30:00Z",
        aiAnalysis: {
          reliabilityScore: 92,
          riskLevel: "low",
          riskFactor: "Стабильная история поставок",
          summary: "Поставщик имеет высокий рейтинг и успешный опыт работы с аналогичными категориями. Цена ниже целевой на 7%."
        }
      },
      {
        id: "bid-2",
        auctionId: "auc-1",
        bidderId: "fact-2",
        bidderName: "Ателье 'Стежок'",
        bidderRating: 4.5,
        amount: 4400,
        deliveryDays: 40,
        status: "outbid",
        createdAt: "2026-01-11T09:15:00Z",
        aiAnalysis: {
          reliabilityScore: 85,
          riskLevel: "medium",
          riskFactor: "Высокая загрузка в феврале",
          summary: "Сжатые сроки могут привести к задержке на 3-5 дней из-за текущей загруженности цеха пошива."
        }
      }
    ]
  },
  {
    id: "auc-2",
    title: "Поставка фурнитуры (молнии YKK)",
    description: "Закупка 2000 комплектов молний YKK 20см черного цвета.",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800",
    type: "materials",
    brandId: "syntha",
    brandName: "Syntha",
    category: "Фурнитура",
    targetQuantity: 2000,
    targetPrice: 120,
    status: "active",
    endDate: "2026-02-20T12:00:00Z",
    createdAt: "2026-01-14T08:00:00Z",
    bids: []
  },
  {
    id: "auc-3",
    title: "Партия эко-хлопка (OrganiX)",
    description: "Требуется 300 метров сертифицированного органического хлопка, плотность 180г/м.",
    image: "https://images.unsplash.com/photo-1528476513691-07e6f563d97f?q=80&w=800",
    type: "materials",
    brandId: "brand-pro",
    brandName: "Future Wear",
    category: "Ткани",
    targetQuantity: 300,
    targetPrice: 850,
    status: "active",
    endDate: "2026-02-10T10:00:00Z",
    createdAt: "2026-01-12T15:00:00Z",
    bids: [
      {
        id: "bid-3",
        auctionId: "auc-3",
        bidderId: "supp-1",
        bidderName: "Текстиль Плюс",
        bidderRating: 4.9,
        amount: 820,
        deliveryDays: 14,
        status: "leading",
        createdAt: "2026-01-13T11:00:00Z",
        aiAnalysis: {
          reliabilityScore: 98,
          riskLevel: "low",
          riskFactor: "Прямой импортер",
          summary: "Поставщик является проверенным партнером с прозрачной цепочкой поставок эко-материалов."
        }
      }
    ]
  },
  {
    id: "auc-4",
    title: "Коллаборация: Стилист-инфлюенсер (Premium segment)",
    description: "Предлагаю создание серии Reels и Stories с обзором новой коллекции. Аудитория: ценители качества и минимализма. Полный анализ гардероба и стилизация луков.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800",
    type: "collaboration",
    brandId: "stylist-anna",
    brandName: "Анна Смирнова",
    category: "Стилист / Блогер",
    status: "active",
    endDate: "2026-03-01T15:00:00Z",
    createdAt: "2026-02-01T12:00:00Z",
    influencerData: {
      platform: 'instagram',
      er: 4.8,
      followers: 125000,
      realAudienceScore: 94,
      topGeography: ["Москва", "Санкт-Петербург", "Лондон"],
      audienceQuality: "Высокая концентрация Fashion-энтузиастов и байеров."
    },
    aiSmartAdvisor: {
      relevanceScore: 96,
      matchAnalysis: "Идеально для сегмента Premium. Высокая концентрация целевой аудитории в Москве и СПБ. Стилистика инфлюенсера полностью совпадает с ДНК бренда."
    },
    bids: []
  },
  {
    id: "auc-5",
    title: "TG-канал 'Fashion Insight': Обзор коллекции",
    description: "Размещение подробного лонгрида с фотографиями и ссылками в авторском Telegram-канале о моде. Охват одного поста более 45к просмотров.",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800",
    type: "collaboration",
    brandId: "fashion-insight",
    brandName: "Fashion Insight",
    category: "Telegram Канал",
    status: "active",
    endDate: "2026-02-25T10:00:00Z",
    createdAt: "2026-02-03T09:00:00Z",
    influencerData: {
      platform: 'telegram',
      er: 12.5,
      followers: 52000,
      realAudienceScore: 98,
      topGeography: ["РФ", "СНГ"],
      audienceQuality: "Профессиональное комьюнити: дизайнеры, стилисты, владельцы бутиков."
    },
    aiSmartAdvisor: {
      relevanceScore: 89,
      matchAnalysis: "Отличный охват среди профессионального сообщества. Рекомендуется для B2B продвижения и повышения узнаваемости среди экспертов индустрии."
    },
    bids: []
  },
  {
    id: 'auc-6',
    title: 'Fashion Photographer for SS26 Campaign',
    description: 'Looking for a high-end fashion photographer for a 3-day shoot in Paris. Concept: Urban Minimalism.',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800',
    type: 'services',
    brandId: 'org-brand-1',
    brandName: 'Syntha Lab',
    category: 'Media',
    status: 'active',
    endDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    createdAt: new Date().toISOString(),
    bids: [],
    aiSmartAdvisor: {
      relevanceScore: 92,
      matchAnalysis: 'Top photographers in your area are active. High ROI expected for this visual concept.'
    }
  }
];
