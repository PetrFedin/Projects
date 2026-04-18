export type UserRole =
  | 'client'
  | 'b2b'
  | 'brand'
  | 'shop'
  | 'admin'
  | 'distributor'
  | 'supplier'
  | 'manufacturer';

/**
 * Granular Permissions Matrix
 */
export interface PermissionSet {
  canViewFinances: boolean;
  canEditPLM: boolean;
  canManageTeam: boolean;
  canViewAnalytics: boolean;
  canApproveOrders: boolean;
  canAccessAuditTrail: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  organizationId: string;
  action: 'create' | 'update' | 'delete' | 'view' | 'login' | 'export';
  targetType: 'order' | 'sku' | 'member' | 'financial' | 'plm';
  targetId: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface Organization {
  id: string;
  name: string;
  type: UserRole;
  logo: string;
  ownerId: string;
  participantsLimit: number;
  isVerified: boolean;
  visibility: 'public' | 'private' | 'restricted';
  tier?: 'standard' | 'premium' | 'vip' | 'partnership';
  linkedPartners?: string[];
  subscription?: {
    plan: string; // Package name (e.g. Enterprise)
    status: SubscriptionStatus;
    expiresAt: string;
    features: string[]; // Feature IDs
    loyalty: {
      points: number;
      level: string;
      benefits: string[];
    };
  };
  stats: {
    activeUsers: number;
    totalRevenue: number;
    orderVolume: number;
    complianceScore: number; // ESG / Quality score
    lastActivity: string;
  };
}

export interface TenantAccess {
  organizationId: string;
  roleInOrg: TeamMemberStatus;
  permissions: PermissionSet; // Upgraded from string[]
}

export type SubscriptionPlan = 'base' | 'start' | 'comfort' | 'premium';
export type SubscriptionStatus = 'active' | 'paused' | 'expired' | 'cancelled';
export type RenewalOffer =
  | {
      type: 'promo';
      code: string;
      discountPercent: number;
      expiresAt?: string; // ISO date
    }
  | {
      type: 'email';
      subject: string;
      instructions: string[];
    };

export type TeamMemberStatus = 'admin' | 'co-admin' | 'member';

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  nickname: string;
  role: string; // Position/Job title
  status: TeamMemberStatus;
  organizationId: string; // SCOPE: Every member belongs to a specific Org profile
  department?: string; // Group/Department (e.g., 'Finance', 'Logistics')
  avatar: string;
  isOnline?: boolean;
  activity?: string;
  lastSeen?: string;
  isArchived?: boolean;
  permissions?: string[]; // List of accessible sections/functions
  privacySettings?: {
    showCalendar: boolean;
    showTasks: boolean;
    showMessages: boolean;
    showFinancials: boolean;
    showActivity: boolean;
  };
  requiresApproval?: boolean; // Whether actions need admin confirmation
  joinedAt: string;
  invitationStatus?: 'pending' | 'accepted' | 'expired';
  onboardingStep?: 'password' | 'verification' | 'profile' | 'completed';
  socials?: {
    telegram?: string;
    whatsapp?: string;
    instagram?: string;
    max?: string;
  };
  password?: string;
  stats?: {
    timeSpentBySection: Record<string, number>; // section name -> minutes
    results?: Record<string, number>; // role-specific metrics like 'sales', 'deals'
  };
  history?: Array<{
    id: string;
    action: string;
    target: string;
    date: string;
    duration?: number; // Minutes spent on this action
    category?: 'view' | 'edit' | 'task' | 'system';
    isPrivate?: boolean; // Ethical privacy flag for specific actions
    idleTime?: number; // Idle minutes during this session
    comments?: Array<{
      id: string;
      user: string;
      text: string;
      date: string;
      reactions?: string[];
    }>;
  }>;
  workload?: number; // 0-100% load
  liveAction?: string; // Current contextual action (Presence 2.0)
  kpiMetrics?: Record<string, { value: number; label: string; trend?: 'up' | 'down' | 'neutral' }>;
  skills?: string[];
  partnerAssignments?: Array<{
    partnerId: string;
    partnerName: string;
    role: 'lead' | 'support' | 'curator';
  }>;
  approvalWorkflow?: Array<{
    action: string;
    status: 'auto' | 'manual' | 'restricted';
    approverRole?: string;
  }>;
}

export type ProfessionalRole =
  | 'stylist'
  | 'designer'
  | 'buyer'
  | 'model'
  | 'photographer'
  | 'seamstress'
  | 'tailor'
  | 'logistician'
  | 'raw_material_buyer'
  | 'ai_specialist'
  | 'analyst'
  | 'creative_director'
  | 'visual_merchandiser'
  | 'blogger'
  | 'influencer';

export interface CareerResume {
  id: string;
  role: ProfessionalRole;
  experienceYears: number;
  skills: string[];
  portfolioUrls: string[];
  expectedRate?: string;
  availability: 'full_time' | 'part_time' | 'project';
  bio: string;
  updatedAt: string;
  isPublic: boolean;
}

export interface InfluenceMetrics {
  totalFollowers: number;
  platforms: {
    instagram?: { followers: number; er: number; synced: boolean };
    telegram?: { subscribers: number; reach: number; synced: boolean };
    tiktok?: { followers: number; likes: number; synced: boolean };
  };
  influenceScore: number; // 0-100 calculated by platform
  tier: 'micro' | 'macro' | 'mega' | 'star' | null;
}

export interface EducationCourse {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  targetRoles: UserRole[];
  category: 'economics' | 'design' | 'production' | 'analytics' | 'management' | 'retail' | 'legal';
  provider: 'Syntha Academy' | 'External' | 'Partner';
  rating: number;
  studentsCount: number;
  isNew?: boolean;
  isRecommended?: boolean;
  price?: number; // 0 for free
  curriculum?: string[];
  media?: Array<{ type: 'video' | 'file'; title: string; url: string; size?: string }>;
  relatedIds?: string[]; // IDs of related courses or articles
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string; // Markdown supported
  authorName: string;
  updatedAt: string;
  tags: string[];
  relatedIds?: string[];
  attachments?: Array<{ name: string; url: string; type: 'pdf' | 'xls' | 'doc' }>;
}

export interface AcademyEvent {
  id: string;
  title: string;
  description: string;
  type: 'webinar' | 'live_stream' | 'workshop';
  startTime: string;
  endTime: string;
  hostName: string;
  status: 'upcoming' | 'live' | 'ended';
  streamUrl?: string;
  relatedId?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: string[]; // Course IDs
  totalDuration: string;
  outcome: string; // e.g., "Certified B2B Manager"
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  courseId?: string;
  targetRoles: UserRole[];
  category: EducationCourse['category'];
  timeLimitMinutes?: number;
  passingScore: number; // Percentage
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: 'single_choice' | 'multiple_choice' | 'text';
  options?: string[];
  correctAnswer: string | string[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  bio?: string;
  nickname?: string;
  professionalRoles?: ProfessionalRole[];
  resume?: CareerResume;
  influence?: InfluenceMetrics;
  perks?: string[];
  styleGallery?: Array<{ url: string; isPrivate: boolean }>;
  identity?: {
    firstName?: string;
    lastName?: string;
    firstNameEn?: string;
    lastNameEn?: string;
    verified?: boolean;
    synced?: boolean;
  };
  personalInfo?: {
    gender?: 'female' | 'male';
    birthDate?: string;
    bodyType?: string;
    education?: string;
    country?: string;
    postalCode?: string;
    city?: string;
    emails?: { primary?: string; secondary?: string };
    phones?: { primary?: string; secondary?: string };
    addresses?: { primary?: string; secondary?: string };
    phoneNumbers?: Array<{ value: string; verified: boolean; primary: boolean }>;
    emailAddresses?: Array<{ value: string; verified: boolean; primary: boolean }>;
    addressBook?: Array<{
      country: string;
      postalCode: string;
      city: string;
      address: string;
      primary: boolean;
    }>;
  };
  socials?: Record<string, { value?: string; synced?: boolean; verified?: boolean }>;
  family?: { spouse?: string; children?: string; parents?: string };
  sync?: {
    accounts?: Array<{
      role: string;
      name?: string;
      phone?: string;
      contact?: string;
      gender?: 'female' | 'male';
      birthDate?: string;
      synced?: boolean;
      measurements?: UserProfile['measurements'];
      shareBonuses: boolean;
      accessLevel?: string;
      verified?: boolean;
    }>;
  };
  roles?: UserRole[];
  activeOrganizationId?: string; // Currently active tenant profile
  organizations?: TenantAccess[]; // All orgs this user can access
  team?: TeamMember[];
  teamLimit?: number;
  tasks?: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    assigneeId: string; // TeamMember ID
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    department?: string;
    isPrivate?: boolean; // Privacy flag
  }>;
  brands?: Array<{ id: string; name: string; email: string }>;
  partnerName?: string;
  isAnonymous?: boolean;
  loyaltyPlan?: SubscriptionPlan;
  loyaltyPoints?: number;
  loyaltyPointsBreakdown?: { qualifying: number; nonQualifying: number };
  loyaltyCardIssuedAt?: string;
  subscription?: {
    plan: SubscriptionPlan;
    status?: SubscriptionStatus;
    startDate?: string;
    endDate?: string;
    benefits?: string[];
    renewalOffer?: RenewalOffer;
  };
  measurements?: Record<string, any>;
  preferences?: Record<string, any>;
  lifestyle?: { city?: string; occupation?: string; age?: number };
  educationHistory?: Array<{
    courseId: string;
    status: 'enrolled' | 'completed';
    progress: number;
    completedAt?: string;
    assessmentResults?: Array<{
      assessmentId: string;
      score: number;
      passed: boolean;
      date: string;
    }>;
  }>;
}

export type ProductAudience =
  | 'Мужской'
  | 'Женский'
  | 'Унисекс'
  | 'Детский'
  | 'Мальчики'
  | 'Девочки'
  | 'Новорожденные';

export type GlobalCategory = 'all' | 'women' | 'men' | 'kids' | 'beauty' | 'home';

export type SizeAvailabilityStatus = 'in_stock' | 'pre_order' | 'out_of_stock';

export interface SizeInfo {
  name: string;
  measurements?: Record<string, string>;
}

export interface ColorInfo {
  id: string;
  name: string;
  hex: string;
  colorCode?: string;
  colorDescription?: string;
  status: 'active' | 'disabled';
  isBase: boolean;
  lifecycleStatus: 'in_stock' | 'outlet' | 'archived';
  noSale: boolean;
  carryOver: boolean;
  discounts?: {
    percentage: number;
    startDate: string;
    endDate: string;
  }[];
  sizeAvailability?: {
    size: string;
    status: SizeAvailabilityStatus;
    quantity?: number;
    preOrderDate?: string;
  }[];
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  hint: string;
  colorName?: string;
  isCover?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  productionCost?: number;
  description: string;
  images: ProductImage[];
  category: string;
  category_group?: string;
  sustainability: string[];
  outlet?: boolean;
  hasAR?: boolean;
  sku: string;
  color: string;
  season: string;
  tags?: ('carryover' | 'noSale' | 'newSeason')[];
  rating?: number;
  reviewCount?: number;
  wardrobeCompatibility?: {
    score: number;
    comment: string;
  };
  bestsellerRank?: number;
  isPromoted?: boolean;
  sizes?: { name: string }[];
  availableColors?: ColorInfo[];
  availability?: SizeAvailabilityStatus;
  audience?: ProductAudience;
  subcategory?: string;
  subcategory2?: string;
  composition?: string | { material: string; percentage: number }[];
  material?: string;
  videoUrls?: { url: string; label?: string }[];
  attributes?: Record<string, any>;
  clothing?: Record<string, any>;
  /** См. `lib/footwear-viewer/types` — 360°, GLB, пресеты низа */
  footwear?: Record<string, unknown>;
  /** PNG/WebP прозрачной оправы для виртуальной примерки (eyewear) */
  eyewearFrameUrl?: string;
  model3dUrls?: { url: string }[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  deliveryDate?: string;
}

export interface WishlistItem extends Product {}

export interface WishlistCollection {
  id: string;
  name: string;
  items: WishlistItem[];
}

/** Ссылка на позицию корзины для сохранённого образа (товар + размер + цвет). */
export interface CartOutfitLineRef {
  productId: string;
  selectedSize: string;
  color?: string;
  /** Цена за единицу при сохранении (₽) — для бейджа «цена обновлена». */
  snapshotPriceRub?: number;
  slug?: string;
}

/** Образ из корзины / избранного: состав и «Мои образы». */
export interface SavedCartOutfit {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
  lineRefs: CartOutfitLineRef[];
  coverImageUrl?: string;
  /** Схема данных в LS (миграции). */
  schemaVersion?: number;
  source?: 'cart' | 'wishlist';
  /** Задел под промо и черновик заказа. */
  promoOutfitId?: string;
}

export interface SavedComparison {
  id: string;
  name: string;
  items: Product[];
  createdAt: string;
}

export interface ComparisonListItem extends Product {}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax?: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  returnRequested?: boolean;
  returnReason?: string;
  /** Набор товаров (образ) для промо / аналитики. */
  outfitId?: string;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  nameRU?: string;
  description: string;
  fullDescription?: string;
  logo: { url: string; alt: string; hint: string };
  followers: number;
  website?: string;
  foundedYear?: number;
  countryOfOrigin?: string;
  city?: string;
  segment?: string;
  priceRange?: [number, number];
  startDate?: string;
  subscriptionTier?: 'Free' | 'Pro' | 'Elite';
  primaryLanguage?: 'ru' | 'en';
  socials?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    telegram?: string;
    youtube?: string;
    pinterest?: string;
    tiktok?: string;
  };
  contact?: {
    publicEmail?: string;
    b2bEmail?: string;
    phone?: string;
  };
  legal?: {
    entityName?: string;
    regNumber?: string;
    address?: string;
    bankDetails?: string;
    representative?: string;
  };
  locations?: { type: 'showroom' | 'store'; address: string }[];
  keyPeople?: { role: string; name: string }[];
  founder?: string;
  ceo?: string;
  creativeDirector?: string;
  showroomAddress?: string;
  flagshipAddress?: string;
  targetAudience?: string;
  keyMarkets?: string[];
  b2bPortalUrl?: string;
  helpCenterUrl?: string;
  pressKitUrl?: string;
  strategicGoals?: { year: number; goal: string; progress: number }[];
  awards?: { year: string; award: string; org: string }[];
  mediaMentions?: { outlet: string; title: string; link: string }[];
  esg?: {
    materialsAndSustainability?: string;
    socialInitiatives?: string;
    ethicalCode?: string;
    sustainabilityReportUrl?: string;
  };
  b2b?: {
    minOrderQuantity?: number;
    avgLeadTimeWeeks?: number;
    currency?: string;
    paymentTerms?: string;
    logisticsTerms?: string;
    shippingRegions?: string[];
  };
  press?: { name: string; logoUrl: string; link: string; articleTitle?: string }[];
  storefrontSettings?: {
    showPhilosophy?: boolean;
    showTechnology?: boolean;
    showESG?: boolean;
    showReviews?: boolean;
    showBehindTheScenes?: boolean;
    showBlog?: boolean;
    showEvents?: boolean;
    showSocialMentions?: boolean;
    showLiveShopping?: boolean;
    showActivePromo?: boolean;
  };
  behindTheScenes?: { type: string; imageUrl: string; title: string }[];
  team?: { name: string; role: string; bio: string; imageUrl: string; quote?: string }[];
  events?: { title: string; date: string; type: string }[];
  activePromo?: { code: string; description: string; expiry: string };
  articles?: {
    title: string;
    date: string;
    imageUrl: string;
    type: 'blog' | 'press';
    link?: string;
    name?: string;
    logoUrl?: string;
  }[];
  tags?: string[];
}

export interface Look {
  id: string;
  author: {
    name: string;
    handle: string;
    avatarUrl: string;
  };
  imageUrl: string;
  imageHint: string;
  description: string;
  likesCount: number;
  commentsCount: number;
  products?: { productId: string }[];
  title?: string;
}

export interface Lookboard {
  id: string;
  title: string;
  description: string;
  looks: Look[];
}

export type ActiveFilters = Record<string, string[] | number[]>;

export interface ImagePlaceholder {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  category?: string;
  hashtags?: string[];
  date?: string;
  duration?: number;
  hosts?: string[];
  guests?: string[];
}

export interface ProductReview {
  id: number;
  productId?: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  color?: string;
  images?: { id: string; url: string; alt: string }[];
  userMeasurements?: {
    height?: number;
    weight?: number;
    footLength?: number;
  };
}

export type PromotionType =
  | 'catalog_boost'
  | 'homepage_banner'
  | 'stories_feature'
  | 'email_blast'
  | 'shoppable_video'
  | 'shop_the_look'
  | 'live_shopping_event'
  | 'ugc_sponsorship'
  | 'kickstarter_boost'
  | 'outlet_boost';

export type Kpi = 'roi' | 'ctr' | 'reach' | 'conversion';

export type PromotionStatus =
  | 'active'
  | 'pending'
  | 'frozen'
  | 'archived'
  | 'rejected'
  | 'unpublished'
  | 'appealed';

export interface Promotion {
  id: string;
  productId: string;
  productName: string;
  productSku?: string;
  targetType?: 'products' | 'categories' | 'brand';
  brandName: string;
  type: PromotionType;
  startDate: string;
  endDate: string;
  budget: {
    value: number;
    model: 'cpm' | 'cpc' | 'fixed';
    bid?: number;
  };
  status: PromotionStatus;
  source: 'admin' | 'brand' | 'system';
  metrics?: {
    views: number;
    engagement: number;
    ctr: number;
    roi: number;
  };
  evaluation?: {
    aiSummary: string;
    brandRating: { metric: string; score: number }[];
  };
}

export interface PromotionCreative {
  id: string;
  url: string;
  performance?: {
    views: number;
    clicks: number;
    ctr: number;
    roas: number;
    cpa: number;
  };
}

/** JOOR Pay: статус оплаты по заказу (не только кредит в матрице) */
export type B2BOrderPaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled';

/** NuORDER/JOOR: связка eventId / priceTier / territory / credit для заказа и матрицы */
export type B2BOrder = {
  order: string;
  status: string;
  shop: string;
  brand: string;
  amount: string;
  date: string;
  deliveryDate: string;
  /** NuORDER: режим заказа. См. b2b-features ShipWindowType: pre_order≈pre_order, buy_now≈at_once, reorder≈re_order */
  orderMode?: 'buy_now' | 'reorder' | 'pre_order';
  /** JOOR: привязка к событию (выставка, шоурум) */
  eventId?: string;
  /** JOOR Passport: привязка к слоту встречи на выставке */
  passportSlotId?: string;
  /** SparkLayer: ценовой уровень партнёра */
  priceTier?: 'retail_a' | 'retail_b' | 'outlet';
  /** Территория партнёра (для проверок и отчётов) */
  territory?: string;
  /** Доступный кредитный лимит на момент заказа (мок) */
  creditLimit?: number;
  /** JOOR Pay: статус оплаты по заказу */
  paymentStatus?: B2BOrderPaymentStatus;
  /** Сумма оплачено (мок, для partial) */
  paidAmount?: number;
};

export type Plan = {
  name: string;
  price: number | string;
  priceSuffix?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant?: 'default' | 'secondary' | 'outline';
  disabled?: boolean;
  badgeText?: string;
  periods?: { label: string; price: number; gift?: string }[];
};

export type CategoryAttributes = {
  fit?: string[];
  length?: string[];
  sleeveLength?: string[];
  cuff?: string[];
  collar?: string[];
  fastening?: string[];
  waist?: string[];
  pockets?: string[];
  lining?: string[];
  stitching?: string[];
  decor?: string[];
  hardware?: string[];
  fabricTexture?: string[];
  processingTech?: string[];
  pattern?: string[];
  shoulder?: string[];
  backDetails?: string[];
  hemType?: string[];
  waistband?: string[];
  transformation?: string[];
  reinforcement?: string[];
  seam?: string[];
  combination?: string[];
  drapery?: string[];
  hemFinish?: string[];
  style?: string[];
  occasion?: string[];
  heelHeight?: string[];
  upperMaterial?: string[];
  soleMaterial?: string[];
};

export interface SavedScenario {
  id: string;
  name: string;
  edits: Record<string, Partial<ProductWithAnalytics>>;
}

export type ProductWithAnalytics = Product & {
  salesPerWeek: number;
  stock: number;
  aiRecommendation: number;
  aiPotential: 'Хит' | 'Стабильный' | 'Рискованный';
  riskProfile: 'Низкий' | 'Средний' | 'Высокий';
  orderQty: number;
  rrp: number;
  margin: number;
  markup: number;
  forecastRevenue: number;
  forecastProfit: number;
  forecastSellOut: number;
  lifecycleStage: 'New Arrival' | 'Bestseller' | 'Core Item' | 'Last Chance';
};

export type RailProduct = {
  id: string;
  title: string;
  category?: string;
  subcategory?: string;
  brand: string;
  heroRailImageUrl: string;
  variants: {
    variantId: string;
    colorCode: string;
    colorName: string;
    sizeRun: string[];
    images: string[];
  }[];
  pricing: {
    currentPrice: number;
    currency: string;
  };
  badges?: {
    newIn?: boolean;
    bestseller?: boolean;
  };
};

export type Capsule = {
  id: string;
  title: string;
  description: string;
  items: (RailProduct | Look)[];
};

export interface SubscribedSize {
  productId: string;
  size: string;
}

export interface AvailableSubscription {
  productId: string;
  size: string;
}

export interface SegmentInfo {
  code: string;
  name: string;
  description: string;
  group: string;
}

export type ReactionType = 'like' | 'dislike' | null;

export type MessageType = 'message' | 'task';

export type TaskStatus = 'pending' | 'in_progress' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ChatAttachment {
  type: 'file' | 'link';
  name: string;
  url: string;
  size?: string;
}

export interface TaskSubtask {
  id: string;
  text: string;
  assignee: string;
  status: TaskStatus;
}

export interface ChatComment {
  user: string;
  text: string;
  date: string;
}

export interface HistoryEntry {
  user: string;
  action: string;
  date: string;
  from?: string;
  to?: string;
}

export interface ChatParticipant {
  id: string;
  name: string;
  role: UserRole;
  isOnline: boolean;
  isAdmin?: boolean;
  isCoAdmin?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  subtitle?: string;
  avatar?: string | string[];
  participantsCount: number;
  type:
    | 'admin'
    | 'brand'
    | 'distributor'
    | 'supplier'
    | 'production'
    | 'shop'
    | 'team'
    | 'client'
    | 'b2b_orders'
    | 'collections';
  isArchived?: boolean;
  isStarred?: boolean;
  isPinned?: boolean;
  time?: string;
  participants?: ChatParticipant[];
  creatorId?: string;
  /** Контекст: ссылка на заказ B2B */
  linkOrderId?: string;
  /** Контекст: ссылка на коллекцию/производство */
  linkCollectionId?: string;
  /** Партнёр-профиль (shop, manufacturer, supplier и т.д.) */
  partnerProfile?: string;
  /** Ссылка в календарь с контекстом партнёра/слоёв */
  calendarHref?: string;
}

export type MessageEntityType = 'order' | 'task' | 'event' | 'escrow' | 'production' | 'product';

export interface ChatMessage {
  id: number;
  chatId?: string;
  user: string;
  text: string;
  time: string;
  type?: 'message' | 'task' | 'scheduled_call' | 'call_recap' | 'system' | 'reminder';
  /** Ссылка на сущность: заказ, задача, событие, производство, товар */
  entityId?: string;
  entityType?: MessageEntityType;
  isPrivate?: boolean; // Privacy flag for personal notes or sensitive messages
  status?: TaskStatus;
  deadline?: Date;
  attachedProduct?: Product;
  attachment?: ChatAttachment;
  isSystem?: boolean;
  assignees?: string[];
  likes?: number;
  dislikes?: number;
  userReaction?: ReactionType;
  priority?: TaskPriority;
  subtasks?: TaskSubtask[];
  history?: HistoryEntry[];
  comments?: ChatComment[];
  parentId?: number;
  isPinned?: boolean;
  isStarred?: boolean;
  isArchived?: boolean;
  forwardedFromChatId?: string;
  audio?: { mime: string; url: string };
  deadlineExtensions?: any[];
  createdAt?: number;
  readBy?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  urgency?: 'high' | 'medium' | 'low';
  isDecision?: boolean;
  widgetTags?: string[];
  callData?: {
    theme: string;
    date: string;
    time: string;
    participants: string[];
    confirmedBy?: string[];
  };
  reminderData?: {
    title: string;
    description: string;
    date: string;
    time: string;
    assignedTo: string[];
    isSyncedWithCalendar: boolean;
    reminderType: 'countdown' | 'exact_time';
  };
  fileVersions?: Array<{ id: string; url: string; name: string; date: string; user: string }>;
  transcription?: string;
  isNegotiationActive?: boolean;
}

export type KickstarterStatus =
  | 'draft'
  | 'upcoming'
  | 'live'
  | 'successful'
  | 'failed'
  | 'production'
  | 'fulfilled'
  | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';
export type FulfillmentStatus = 'pending' | 'in_production' | 'shipped' | 'delivered' | 'cancelled';
export type KickstarterFundingModel = 'quantity' | 'monetary';

export interface KickstarterTier {
  id: string;
  name: string;
  price: number;
  description: string;
  rewards: string[];
  limit?: number | null;
}

export interface KickstarterStretchGoal {
  id: string;
  target: number;
  description: string;
  achieved: boolean;
}

export interface KickstarterUpdate {
  id: string;
  campaignId: string;
  authorBrandUserId: string;
  title: string;
  body: string;
  media?: { type: 'image' | 'video'; url: string }[];
  createdAt: string;
  forBackersOnly?: boolean;
}

export interface KickstarterFaq {
  id: string;
  question: string;
  answer: string;
}

export interface KickstarterProject {
  id: string;
  brandId: string;
  productId: string;
  creator: string;
  title: string;
  status: KickstarterStatus;
  fundingModel: KickstarterFundingModel;
  minQuantity: number;
  targetQuantity: number;
  goal: number;
  currentQuantity: number;
  currentRevenue: number;
  retailPrice: number;
  preorderPrice: number;
  wholesalePrice?: number;
  moqWholesale?: number;
  earlyBirdPrice?: number | null;
  earlyBirdLimit?: number | null;
  productionCost?: number;
  startAt: string;
  endAt: string;
  productionStartAt?: string;
  productionEndEstAt?: string;
  description: string;
  media: { type: 'image' | 'video'; url: string }[];
  pledged: number; // Duplicates currentRevenue, but let's keep for compatibility with mock
  backers: number; // Duplicates number of pledges, but useful
  daysLeft: number; // Can be derived, but good for display
  isFunded: boolean; // Can be derived
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  imageHint?: string;
  tiers?: KickstarterTier[];
  stretchGoals?: KickstarterStretchGoal[];
  updates?: KickstarterUpdate[];
  faqs?: KickstarterFaq[];
  product?: Product; // Added to link to the full product info
  segment?: string;
}

export interface KickstarterPledge {
  id: string;
  campaignId: string;
  userId: string;
  brandId: string;
  productId: string;
  tierId: string;
  variant: {
    size: string;
    color: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  tier: 'early_bird' | 'preorder' | 'other';
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  createdAt: string;
}

export interface AuctionBid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  bidderRating: number;
  amount: number;
  deliveryDays: number;
  status: 'leading' | 'outbid' | 'accepted' | 'rejected';
  createdAt: string;
  aiAnalysis: {
    reliabilityScore: number;
    riskLevel: 'low' | 'medium' | 'high';
    riskFactor: string;
    summary: string;
  };
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  image: string;
  type: 'production' | 'materials' | 'collaboration' | 'services';
  brandId: string;
  brandName: string;
  category: string;
  targetQuantity?: number;
  targetPrice?: number;
  status: 'active' | 'completed' | 'cancelled';
  endDate: string;
  createdAt: string;
  bids: AuctionBid[];
  influencerData?: {
    platform: 'instagram' | 'telegram';
    er: number;
    followers: number;
    realAudienceScore: number;
    topGeography: string[];
    audienceQuality: string;
  };
  aiSmartAdvisor?: {
    relevanceScore: number;
    matchAnalysis: string;
  };
}
