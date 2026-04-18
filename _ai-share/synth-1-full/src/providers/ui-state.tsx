'use client';

import { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';
import type {
  UserProfile,
  CartItem,
  WishlistItem,
  Product,
  SubscribedSize,
  AvailableSubscription,
  ComparisonListItem,
  SavedComparison,
  WishlistCollection,
  Lookboard,
  ColorInfo,
  SizeAvailabilityStatus,
  ImagePlaceholder,
  UserRole,
  GlobalCategory,
  SavedCartOutfit,
  CartOutfitLineRef,
} from '@/lib/types';
import {
  cartLineKey,
  cartItemToLineRef,
  lineRefMatchesCartItem,
  wishlistProductToLineRef,
  lineRefKey,
} from '@/lib/cart-outfit-utils';
import {
  readGuestOutfitsFromLocalStorage,
  writeGuestOutfitsToLocalStorage,
  ACTIVE_OUTFIT_STORAGE_KEY,
  normalizeOutfitsList,
  OUTFITS_SCHEMA_VERSION,
} from '@/lib/cart-outfits-storage';
import { lookboards as initialLookboards } from '@/lib/lookboards';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import allProductsData from '@/lib/products';
import { cartRepository, wishlistRepository, cartOutfitsRepository } from '@/lib/repositories';
import { useAuth } from './auth-provider';
import {
  applyUiPreferences,
  readUserSettings,
  USER_SETTINGS_UPDATED_EVENT,
} from '@/lib/user-settings';

interface UIState {
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isPreOrderOpen: boolean;
  likedVideos: string[];
  cart: CartItem[];
  preOrders: CartItem[];
  wishlist: WishlistItem[];
  wishlistCollections: WishlistCollection[];
  lookboards: Lookboard[];
  comparisonList: ComparisonListItem[];
  savedComparisons: SavedComparison[];
  manualWardrobe: Product[];
  followedBrands: string[];
  user: UserProfile | null;
  isUserLoading: boolean;
  subscribedSizes: SubscribedSize[];
  availableSubscriptions: AvailableSubscription[];
  newlyAvailableSizes: SubscribedSize[];
  isComparisonOpen: boolean;
  setIsComparisonOpen: (isOpen: boolean) => void;
  activeColorSelection: { productId: string; colorName: string } | null;
  setActiveColorSelection: (selection: { productId: string; colorName: string } | null) => void;
  purchasedItems: { productId: string; size: string; color: string }[];
  playingPodcast: ImagePlaceholder | null;
  setPlayingPodcast: (podcast: ImagePlaceholder | null) => void;
  viewRole: UserRole;
  setViewRole: (role: UserRole) => void;
  globalCategory: GlobalCategory;
  setGlobalCategory: (category: GlobalCategory) => void;
  isFlowMapOpen: 'production' | 'ecosystem' | 'workplace' | null;
  setIsFlowMapOpen: (state: 'production' | 'ecosystem' | 'workplace' | null) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (isOpen: boolean) => void;
  isMediaRadarOpen: boolean;
  setIsMediaRadarOpen: (isOpen: boolean) => void;
  isConstellationOpen: boolean;
  setIsConstellationOpen: (isOpen: boolean) => void;
  hoveredProduct: Product | null;
  setHoveredProduct: (product: Product | null) => void;
  pulseMode: 'floating' | 'ticker';
  setPulseMode: (mode: 'floating' | 'ticker') => void;
  checkATS: (productId: string, size: string, color?: string) => number;
  toggleCart: () => void;
  toggleWishlist: () => void;
  togglePreOrder: () => void;
  toggleLikedVideo: (videoUrl: string) => void;
  toggleFollowBrand: (brandId: string) => void;
  addCartItem: (product: Product, size?: string, quantity?: number) => void;
  removeCartItem: (productId: string, size?: string, color?: string) => void;
  updateCartItemQuantity: (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => void;
  updateCartItemDeliveryDate: (productId: string, size: string, deliveryDate: string) => void;
  addWishlistItem: (product: Product, collectionId?: string) => void;
  removeWishlistItem: (product: Product, collectionId?: string) => void;
  addWishlistCollection: (name: string) => Promise<WishlistCollection>;
  getCartItem: (productId: string, size: string) => CartItem | undefined;
  getCartItemById: (productId: string) => CartItem | undefined;
  getProductAvailability: (
    product: Product,
    activeColor?: ColorInfo
  ) => { status: SizeAvailabilityStatus; text: string; icon: any; className: string };
  addSubscribedSize: (productId: string, size: string) => void;
  removeSubscribedSize: (productId: string, size: string) => void;
  removeAvailableSubscription: (productId: string, size: string) => void;
  toggleComparisonItem: (product: Product) => void;
  clearComparisonList: () => void;
  saveComparison: (name: string) => void;
  addLookboard: (title: string, description: string) => Lookboard;
  addProductToLookboard: (product: Product, lookboardId: string) => void;
  addToManualWardrobe: (product: Product) => void;
  removeFromManualWardrobe: (productId: string) => void;
  switchOrganization: (orgId: string) => Promise<void>;
  activeCurrency: 'RUB' | 'USD' | 'AED' | 'EUR';
  setCurrency: (c: 'RUB' | 'USD' | 'AED' | 'EUR') => void;
  dashboardPeriod: 'week' | 'month' | 'year';
  setDashboardPeriod: (p: 'week' | 'month' | 'year') => void;
  businessMode: 'b2c' | 'b2b';
  setBusinessMode: (mode: 'b2c' | 'b2b') => void;
  filterChannel: 'all' | 'b2b' | 'b2c' | 'marketplace';
  setFilterChannel: (c: 'all' | 'b2b' | 'b2c' | 'marketplace') => void;
  filterRegion: 'all' | 'ru' | 'kz' | 'by';
  setFilterRegion: (r: 'all' | 'ru' | 'kz' | 'by') => void;
  filterCollection: string;
  setFilterCollection: (c: string) => void;
  savedCartOutfits: SavedCartOutfit[];
  activeCartOutfitId: string | null;
  setActiveCartOutfitId: (id: string | null) => void;
  saveCartOutfit: (name: string, lineKeys: string[]) => SavedCartOutfit | null;
  saveWishlistOutfit: (name: string, productIds: string[]) => SavedCartOutfit | null;
  deleteCartOutfit: (id: string) => void;
  applyCartOutfitToCart: (outfitId: string) => Promise<void>;
  renameCartOutfit: (id: string, name: string) => void;
  duplicateCartOutfit: (id: string) => void;
  removeLineFromCartOutfit: (outfitId: string, refKey: string) => void;
  replaceCartOutfitFromCartKeys: (outfitId: string, lineKeys: string[]) => void;
  importSharedOutfit: (payload: {
    name: string;
    lineRefs: CartOutfitLineRef[];
  }) => SavedCartOutfit | null;
  cartTotalsScope: 'full' | 'outfit';
  setCartTotalsScope: (s: 'full' | 'outfit') => void;
}

const UIStateContext = createContext<UIState | undefined>(undefined);

export function UIStateProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isPreOrderOpen, setIsPreOrderOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [likedVideos, setLikedVideos] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [preOrders, setPreOrders] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistCollections, setWishlistCollections] = useState<WishlistCollection[]>([]);
  const [lookboards, setLookboards] = useState<Lookboard[]>(initialLookboards);
  const [comparisonList, setComparisonList] = useState<ComparisonListItem[]>([]);
  const [savedComparisons, setSavedComparisons] = useState<SavedComparison[]>([]);
  const [manualWardrobe, setManualWardrobe] = useState<Product[]>([]);
  const [followedBrands, setFollowedBrands] = useState<string[]>([]);
  const [subscribedSizes, setSubscribedSizes] = useState<SubscribedSize[]>([]);
  const [availableSubscriptions, setAvailableSubscriptions] = useState<AvailableSubscription[]>([]);
  const [newlyAvailableSizes, setNewlyAvailableSizes] = useState<SubscribedSize[]>([]);
  const [activeColorSelection, setActiveColorSelection] = useState<{
    productId: string;
    colorName: string;
  } | null>(null);
  const [purchasedItems, setPurchasedItems] = useState<
    { productId: string; size: string; color: string }[]
  >([
    { productId: '1', size: 'M', color: 'Черный' },
    { productId: '2', size: '48', color: 'Серый' },
    { productId: '4', size: 'S', color: 'Розовый' },
  ]);
  const [playingPodcast, setPlayingPodcast] = useState<ImagePlaceholder | null>(null);
  const [viewRole, setViewRole] = useState<UserRole>('client');
  const [globalCategory, setGlobalCategory] = useState<GlobalCategory>('all');
  const [isFlowMapOpen, setIsFlowMapOpen] = useState<
    'production' | 'ecosystem' | 'workplace' | null
  >(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMediaRadarOpen, setIsMediaRadarOpen] = useState(false);
  const [isConstellationOpen, setIsConstellationOpen] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<Product | null>(null);
  const [pulseMode, setPulseModeState] = useState<'floating' | 'ticker'>('ticker');
  const [activeCurrency, setActiveCurrency] = useState<'RUB' | 'USD' | 'AED' | 'EUR'>('RUB');
  const [dashboardPeriod, setDashboardPeriodState] = useState<'week' | 'month' | 'year'>('month');
  const [businessMode, setBusinessModeState] = useState<'b2c' | 'b2b'>('b2b');

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const s = localStorage.getItem('brand-business-mode');
      if (s === 'b2b' || s === 'b2c') setBusinessModeState(s);
      const pm = localStorage.getItem('brand-pulse-mode');
      if (pm === 'floating' || pm === 'ticker') setPulseModeState(pm);
      const dp = localStorage.getItem('brand-dashboard-period');
      if (dp === 'week' || dp === 'month' || dp === 'year') setDashboardPeriodState(dp);
    } catch {}
  }, []);

  const setPulseMode = (mode: 'floating' | 'ticker') => {
    setPulseModeState(mode);
    try {
      if (typeof window !== 'undefined') localStorage.setItem('brand-pulse-mode', mode);
    } catch {}
  };

  const setDashboardPeriod = (p: 'week' | 'month' | 'year') => {
    setDashboardPeriodState(p);
    try {
      if (typeof window !== 'undefined') localStorage.setItem('brand-dashboard-period', p);
    } catch {}
  };

  const setBusinessMode = (mode: 'b2c' | 'b2b') => {
    setBusinessModeState(mode);
    try {
      localStorage.setItem('brand-business-mode', mode);
    } catch {}
  };
  const [filterChannel, setFilterChannel] = useState<'all' | 'b2b' | 'b2c' | 'marketplace'>('all');
  const [filterRegion, setFilterRegion] = useState<'all' | 'ru' | 'kz' | 'by'>('all');
  const [filterCollection, setFilterCollection] = useState<string>('all');
  const [savedCartOutfits, setSavedCartOutfits] = useState<SavedCartOutfit[]>([]);
  const [activeCartOutfitId, setActiveCartOutfitIdState] = useState<string | null>(null);
  const [cartOutfitsHydrated, setCartOutfitsHydrated] = useState(false);
  const [cartTotalsScope, setCartTotalsScopeState] = useState<'full' | 'outfit'>('full');
  const outfitsLoadedForUid = useRef<string | null>(null);

  /** Диалоги flow/calendar на главной размонтируются при навигации, но состояние оставалось — глушило сайдбар (pointer-events-none). */
  useEffect(() => {
    const p = pathname ?? '';
    if (p === '/' || p === '') return;
    setIsFlowMapOpen(null);
    setIsCalendarOpen(false);
    setIsMediaRadarOpen(false);
    setIsConstellationOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const active = localStorage.getItem(ACTIVE_OUTFIT_STORAGE_KEY);
      setActiveCartOutfitIdState(active?.trim() ? active.trim() : null);
    } catch {}
    setCartOutfitsHydrated(true);
  }, []);

  useEffect(() => {
    if (!cartOutfitsHydrated) return;
    if (user) return;
    const catalog = allProductsData as Product[];
    setSavedCartOutfits(readGuestOutfitsFromLocalStorage(catalog));
  }, [cartOutfitsHydrated, user?.uid]);

  useEffect(() => {
    if (!user) {
      outfitsLoadedForUid.current = null;
      return;
    }
    let cancelled = false;
    (async () => {
      const list = await cartOutfitsRepository.getOutfits(user.uid);
      if (cancelled) return;
      const catalog = allProductsData as Product[];
      setSavedCartOutfits(normalizeOutfitsList(list, catalog));
      outfitsLoadedForUid.current = user.uid;
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  useEffect(() => {
    if (!cartOutfitsHydrated) return;
    if (user) return;
    writeGuestOutfitsToLocalStorage(savedCartOutfits);
  }, [savedCartOutfits, cartOutfitsHydrated, user?.uid]);

  useEffect(() => {
    if (!user || !cartOutfitsHydrated) return;
    if (outfitsLoadedForUid.current !== user.uid) return;
    const t = window.setTimeout(() => {
      void cartOutfitsRepository.saveOutfits(user.uid, savedCartOutfits);
    }, 300);
    return () => clearTimeout(t);
  }, [savedCartOutfits, user?.uid, cartOutfitsHydrated]);

  useEffect(() => {
    if (!activeCartOutfitId) setCartTotalsScopeState('full');
  }, [activeCartOutfitId]);

  const setActiveCartOutfitId = (id: string | null) => {
    setActiveCartOutfitIdState(id);
    try {
      if (typeof window === 'undefined') return;
      if (id) localStorage.setItem(ACTIVE_OUTFIT_STORAGE_KEY, id);
      else localStorage.removeItem(ACTIVE_OUTFIT_STORAGE_KEY);
    } catch {}
  };

  const setCartTotalsScope = (s: 'full' | 'outfit') => setCartTotalsScopeState(s);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sync = () => applyUiPreferences(readUserSettings());
    sync();
    window.addEventListener(USER_SETTINGS_UPDATED_EVENT, sync);
    return () => window.removeEventListener(USER_SETTINGS_UPDATED_EVENT, sync);
  }, []);

  useEffect(() => {
    if (!user) {
      setCart([]);
      return;
    }
    const unsubscribe = cartRepository.onCartChange(user.uid, (items) => {
      setCart(items);
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      setWishlistCollections([{ id: 'default', name: 'Основное', items: [] }]);
      return;
    }
    const unsubscribe = wishlistRepository.onWishlistChange(user.uid, (items) => {
      setWishlist(items);
    });
    wishlistRepository.getCollections(user.uid).then((collections) => {
      setWishlistCollections(collections);
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    try {
      const allProducts: Product[] = allProductsData;
      setManualWardrobe(allProducts.slice(10, 12));
      setSavedComparisons([
        {
          id: 'comp1',
          name: 'Сравнение свитеров',
          items: allProducts.slice(0, 3),
          createdAt: new Date().toISOString(),
        },
      ]);
      setAvailableSubscriptions([{ productId: '1', size: 'XL' }]);
    } catch (error) {
      console.error('Failed to fetch initial product data for UI state:', error);
    }
  }, []);

  const getProductAvailability = (
    product: Product,
    activeColor?: ColorInfo
  ): { status: SizeAvailabilityStatus; text: string; icon: any; className: string } => {
    const colorsToCheck = activeColor ? [activeColor] : product.availableColors || [];
    if (colorsToCheck.length === 0) {
      const availability = product.availability || 'out_of_stock';
      switch (availability) {
        case 'in_stock':
          return {
            status: 'in_stock',
            text: 'В наличии',
            icon: CheckCircle,
            className: 'text-green-600',
          };
        case 'pre_order':
          return {
            status: 'pre_order',
            text: 'Предзаказ',
            icon: Clock,
            className: 'text-amber-600',
          };
        default:
          return {
            status: 'out_of_stock',
            text: 'Нет в наличии',
            icon: AlertCircle,
            className: 'text-red-600',
          };
      }
    }
    const hasInStock = colorsToCheck.some((color) =>
      color.sizeAvailability?.some((s) => s.status === 'in_stock' && (s.quantity || 0) > 0)
    );
    if (hasInStock)
      return {
        status: 'in_stock',
        text: 'В наличии',
        icon: CheckCircle,
        className: 'text-green-600',
      };
    const hasPreOrder = colorsToCheck.some((color) =>
      color.sizeAvailability?.some((s) => s.status === 'pre_order')
    );
    if (hasPreOrder)
      return { status: 'pre_order', text: 'Предзаказ', icon: Clock, className: 'text-amber-600' };
    return {
      status: 'out_of_stock',
      text: 'Нет в наличии',
      icon: AlertCircle,
      className: 'text-red-600',
    };
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const toggleWishlist = () => setIsWishlistOpen(!isWishlistOpen);
  const togglePreOrder = () => setIsPreOrderOpen(!isPreOrderOpen);

  const checkATS = (productId: string, size: string, color?: string): number => {
    const seed = (parseInt(productId) || 1) + size.length + (color?.length || 0);
    return ((seed * 17) % 50) + 5;
  };

  const addCartItem = async (product: Product, size: string = 'One Size', quantity: number = 1) => {
    if (!user) {
      setCart((prevCart) => {
        const targetColor = (product as any).color || product.color;
        const existingItemIndex = prevCart.findIndex(
          (item) =>
            item.id === product.id &&
            item.selectedSize === size &&
            ((item as any).color === targetColor || item.color === targetColor)
        );
        if (existingItemIndex > -1) {
          const newCart = [...prevCart];
          newCart[existingItemIndex].quantity += quantity;
          return newCart;
        }
        if (quantity > 0) return [...prevCart, { ...product, quantity, selectedSize: size }];
        return prevCart;
      });
      return;
    }
    await cartRepository.addItem(user.uid, { ...product, quantity, selectedSize: size });
  };

  const removeCartItem = async (productId: string, size?: string, color?: string) => {
    if (!user) {
      setCart((prevCart) =>
        prevCart.filter(
          (item) =>
            !(
              item.id === productId &&
              item.selectedSize === size &&
              (!color || (item as any).color === color || item.color === color)
            )
        )
      );
      return;
    }
    await cartRepository.removeItem(user.uid, productId, size || 'One Size', color);
  };

  const updateCartItemQuantity = async (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => {
    if (quantity <= 0) {
      await removeCartItem(productId, size, color);
      return;
    }
    const available = checkATS(productId, size || 'One Size', color);
    if (quantity > available) quantity = available;
    if (!user) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId &&
          item.selectedSize === size &&
          (!color || (item as any).color === color || item.color === color)
            ? { ...item, quantity }
            : item
        )
      );
      return;
    }
    await cartRepository.updateItem(user.uid, productId, size || 'One Size', quantity, color);
  };

  const updateCartItemDeliveryDate = (productId: string, size: string, deliveryDate: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId && item.selectedSize === size ? { ...item, deliveryDate } : item
      )
    );
  };

  const saveCartOutfit = (name: string, lineKeys: string[]): SavedCartOutfit | null => {
    const keySet = new Set(lineKeys);
    const picked = cart.filter((item) => keySet.has(cartLineKey(item)));
    if (!picked.length || !name.trim()) return null;
    const lineRefs = picked.map((item) => cartItemToLineRef(item, true));
    const first = picked[0];
    const cover = first?.images?.[0]?.url || (first as { image?: string }).image;
    const now = new Date().toISOString();
    const outfit: SavedCartOutfit = {
      id: `outfit-${Date.now()}`,
      name: name.trim(),
      createdAt: now,
      updatedAt: now,
      lineRefs,
      coverImageUrl: cover,
      schemaVersion: OUTFITS_SCHEMA_VERSION,
      source: 'cart',
    };
    setSavedCartOutfits((prev) => [outfit, ...prev]);
    return outfit;
  };

  const saveWishlistOutfit = (name: string, productIds: string[]): SavedCartOutfit | null => {
    const catalog = allProductsData as Product[];
    const lineRefs: CartOutfitLineRef[] = [];
    for (const pid of productIds) {
      const p = catalog.find((x) => x.id === pid);
      if (p) lineRefs.push(wishlistProductToLineRef(p));
    }
    if (!lineRefs.length || !name.trim()) return null;
    const first = catalog.find((x) => x.id === lineRefs[0].productId);
    const cover = first?.images?.[0]?.url || (first as { image?: string })?.image;
    const now = new Date().toISOString();
    const outfit: SavedCartOutfit = {
      id: `outfit-${Date.now()}`,
      name: name.trim(),
      createdAt: now,
      updatedAt: now,
      lineRefs,
      coverImageUrl: cover,
      schemaVersion: OUTFITS_SCHEMA_VERSION,
      source: 'wishlist',
    };
    setSavedCartOutfits((prev) => [outfit, ...prev]);
    return outfit;
  };

  const renameCartOutfit = (id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const now = new Date().toISOString();
    setSavedCartOutfits((prev) =>
      prev.map((o) => (o.id === id ? { ...o, name: trimmed, updatedAt: now } : o))
    );
  };

  const duplicateCartOutfit = (id: string) => {
    const src = savedCartOutfits.find((o) => o.id === id);
    if (!src) return;
    const now = new Date().toISOString();
    const copy: SavedCartOutfit = {
      ...src,
      id: `outfit-${Date.now()}`,
      name: `${src.name} (копия)`,
      createdAt: now,
      updatedAt: now,
      lineRefs: src.lineRefs.map((r) => ({ ...r })),
    };
    setSavedCartOutfits((prev) => [copy, ...prev]);
  };

  const removeLineFromCartOutfit = (outfitId: string, refKey: string) => {
    const now = new Date().toISOString();
    setSavedCartOutfits((prev) =>
      prev.map((o) =>
        o.id === outfitId
          ? { ...o, lineRefs: o.lineRefs.filter((r) => lineRefKey(r) !== refKey), updatedAt: now }
          : o
      )
    );
  };

  const replaceCartOutfitFromCartKeys = (outfitId: string, lineKeys: string[]) => {
    const keySet = new Set(lineKeys);
    const picked = cart.filter((item) => keySet.has(cartLineKey(item)));
    if (!picked.length) return;
    const lineRefs = picked.map((item) => cartItemToLineRef(item, true));
    const first = picked[0];
    const cover = first?.images?.[0]?.url || (first as { image?: string }).image;
    const now = new Date().toISOString();
    setSavedCartOutfits((prev) =>
      prev.map((o) =>
        o.id === outfitId
          ? {
              ...o,
              lineRefs,
              coverImageUrl: cover ?? o.coverImageUrl,
              updatedAt: now,
              schemaVersion: OUTFITS_SCHEMA_VERSION,
              source: 'cart',
            }
          : o
      )
    );
  };

  const importSharedOutfit = (payload: {
    name: string;
    lineRefs: CartOutfitLineRef[];
  }): SavedCartOutfit | null => {
    const catalog = allProductsData as Product[];
    const now = new Date().toISOString();
    const temp: SavedCartOutfit = {
      id: `outfit-${Date.now()}`,
      name: (payload.name || 'Образ').trim() || 'Образ',
      createdAt: now,
      updatedAt: now,
      lineRefs: payload.lineRefs,
      schemaVersion: OUTFITS_SCHEMA_VERSION,
      source: 'cart',
    };
    const normalized = normalizeOutfitsList([temp], catalog)[0];
    if (!normalized) return null;
    const p0 = catalog.find((x) => x.id === normalized.lineRefs[0]?.productId);
    const cover =
      p0?.images?.[0]?.url ||
      (p0 as { image?: string } | undefined)?.image ||
      normalized.coverImageUrl;
    const outfit = { ...normalized, coverImageUrl: cover };
    setSavedCartOutfits((prev) => [outfit, ...prev]);
    return outfit;
  };

  const deleteCartOutfit = (id: string) => {
    setSavedCartOutfits((prev) => prev.filter((o) => o.id !== id));
    setActiveCartOutfitIdState((cur) => {
      if (cur !== id) return cur;
      try {
        if (typeof window !== 'undefined') localStorage.removeItem(ACTIVE_OUTFIT_STORAGE_KEY);
      } catch {}
      return null;
    });
  };

  const applyCartOutfitToCart = async (outfitId: string) => {
    const outfit = savedCartOutfits.find((o) => o.id === outfitId);
    if (!outfit) return;
    const allProducts: Product[] = allProductsData;
    for (const ref of outfit.lineRefs) {
      const exists = cart.some((item) => lineRefMatchesCartItem(ref, item));
      if (exists) continue;
      const product = allProducts.find((p) => p.id === ref.productId);
      if (!product) continue;
      const size = ref.selectedSize === 'default' ? 'One Size' : ref.selectedSize;
      const withColor = ref.color ? ({ ...product, color: ref.color } as Product) : product;
      await addCartItem(withColor, size, 1);
    }
  };

  const addWishlistItem = async (product: Product, collectionId: string = 'default') => {
    if (!user) {
      setWishlistCollections((prev) =>
        prev.map((c) =>
          c.id === collectionId && !c.items.some((p) => p.id === product.id)
            ? { ...c, items: [...c.items, product] }
            : c
        )
      );
      setWishlist((prev) => (prev.some((p) => p.id === product.id) ? prev : [...prev, product]));
      return;
    }
    await wishlistRepository.addItem(user.uid, product, collectionId);
  };

  const removeWishlistItem = async (product: Product, collectionId?: string) => {
    if (!user) {
      setWishlistCollections((prev) =>
        prev.map((c) =>
          !collectionId || c.id === collectionId
            ? { ...c, items: c.items.filter((item) => item.id !== product.id) }
            : c
        )
      );
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      return;
    }
    await wishlistRepository.removeItem(user.uid, product.id, collectionId);
  };

  const addWishlistCollection = async (name: string): Promise<WishlistCollection> => {
    if (!user) {
      const newCol: WishlistCollection = { id: `col-${Date.now()}`, name, items: [] };
      setWishlistCollections((prev) => [...prev, newCol]);
      return newCol;
    }
    return await wishlistRepository.addCollection(user.uid, name);
  };

  const toggleComparisonItem = (product: Product) => {
    setComparisonList((prev) =>
      prev.some((item) => item.id === product.id)
        ? prev.filter((item) => item.id !== product.id)
        : prev.length < 4
          ? [...prev, product]
          : prev
    );
  };

  const toggleLikedVideo = (videoUrl: string) =>
    setLikedVideos((prev) =>
      prev.includes(videoUrl) ? prev.filter((v) => v !== videoUrl) : [...prev, videoUrl]
    );
  const toggleFollowBrand = (brandId: string) =>
    setFollowedBrands((prev) =>
      prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId]
    );
  const clearComparisonList = () => setComparisonList([]);
  const saveComparison = (name: string) =>
    setSavedComparisons((prev) => [
      {
        id: `comp-${Date.now()}`,
        name,
        items: [...comparisonList],
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  const addLookboard = (title: string, description: string) => {
    const lb: Lookboard = { id: `lb-${Date.now()}`, title, description, looks: [] };
    setLookboards((prev) => [lb, ...prev]);
    return lb;
  };
  const addProductToLookboard = (product: Product, lookboardId: string) => {
    const look = {
      id: `l-${Date.now()}`,
      imageUrl: product.images?.[0]?.url || '/placeholder.jpg',
      imageHint: product.name,
      description: `Образ с ${product.name}`,
      author: { name: 'Вы', handle: '@me', avatarUrl: '' },
      likesCount: 0,
      commentsCount: 0,
      products: [{ productId: product.id }],
    };
    setLookboards((prev) =>
      prev.map((lb) => (lb.id === lookboardId ? { ...lb, looks: [...lb.looks, look] } : lb))
    );
  };

  const addToManualWardrobe = (product: Product) =>
    setManualWardrobe((prev) =>
      prev.some((p) => p.id === product.id) ? prev : [...prev, product]
    );
  const removeFromManualWardrobe = (productId: string) =>
    setManualWardrobe((prev) => prev.filter((p) => p.id !== productId));

  const { updateProfile } = useAuth();
  const switchOrganization = async (orgId: string) => {
    if (user) await updateProfile({ activeOrganizationId: orgId });
  };

  const value = useMemo(
    () => ({
      isCartOpen,
      isWishlistOpen,
      isPreOrderOpen,
      cart,
      preOrders,
      wishlist,
      wishlistCollections,
      lookboards,
      comparisonList,
      savedComparisons,
      manualWardrobe,
      followedBrands,
      user: user || null,
      isUserLoading: false,
      subscribedSizes,
      availableSubscriptions,
      newlyAvailableSizes,
      isComparisonOpen,
      setIsComparisonOpen,
      activeColorSelection,
      setActiveColorSelection,
      purchasedItems,
      playingPodcast,
      setPlayingPodcast,
      viewRole,
      setViewRole,
      globalCategory,
      setGlobalCategory,
      isFlowMapOpen,
      setIsFlowMapOpen,
      isCalendarOpen,
      setIsCalendarOpen,
      isMediaRadarOpen,
      setIsMediaRadarOpen,
      isConstellationOpen,
      setIsConstellationOpen,
      hoveredProduct,
      setHoveredProduct,
      pulseMode,
      setPulseMode,
      checkATS,
      likedVideos,
      toggleLikedVideo,
      toggleCart,
      toggleWishlist,
      togglePreOrder,
      addCartItem,
      removeCartItem,
      updateCartItemQuantity,
      updateCartItemDeliveryDate,
      addWishlistItem,
      removeWishlistItem,
      addWishlistCollection,
      getCartItem: (productId: string, size: string) =>
        cart.find((item) => item.id === productId && item.selectedSize === size),
      getCartItemById: (productId: string) => cart.find((item) => item.id === productId),
      getProductAvailability,
      addSubscribedSize: (productId: string, size: string) =>
        setSubscribedSizes((prev) => [...prev, { productId, size }]),
      removeSubscribedSize: (productId: string, size: string) =>
        setSubscribedSizes((prev) =>
          prev.filter((s) => !(s.productId === productId && s.size === size))
        ),
      removeAvailableSubscription: (productId: string, size: string) =>
        setAvailableSubscriptions((prev) =>
          prev.filter((s) => !(s.productId === productId && s.size === size))
        ),
      toggleComparisonItem,
      clearComparisonList,
      saveComparison,
      addLookboard,
      addProductToLookboard,
      addToManualWardrobe,
      removeFromManualWardrobe,
      toggleFollowBrand,
      switchOrganization,
      activeCurrency,
      setCurrency: setActiveCurrency,
      dashboardPeriod,
      setDashboardPeriod: setDashboardPeriod,
      businessMode,
      setBusinessMode: (mode: 'b2c' | 'b2b') => setBusinessMode(mode),
      filterChannel,
      setFilterChannel,
      filterRegion,
      setFilterRegion,
      filterCollection,
      setFilterCollection,
      savedCartOutfits,
      activeCartOutfitId,
      setActiveCartOutfitId,
      saveCartOutfit,
      saveWishlistOutfit,
      deleteCartOutfit,
      applyCartOutfitToCart,
      renameCartOutfit,
      duplicateCartOutfit,
      removeLineFromCartOutfit,
      replaceCartOutfitFromCartKeys,
      importSharedOutfit,
      cartTotalsScope,
      setCartTotalsScope,
    }),
    [
      isCartOpen,
      isWishlistOpen,
      isPreOrderOpen,
      cart,
      preOrders,
      wishlist,
      wishlistCollections,
      lookboards,
      comparisonList,
      savedComparisons,
      manualWardrobe,
      followedBrands,
      user,
      subscribedSizes,
      availableSubscriptions,
      newlyAvailableSizes,
      isComparisonOpen,
      activeColorSelection,
      purchasedItems,
      playingPodcast,
      viewRole,
      globalCategory,
      isFlowMapOpen,
      isCalendarOpen,
      isMediaRadarOpen,
      isConstellationOpen,
      hoveredProduct,
      pulseMode,
      likedVideos,
      activeCurrency,
      dashboardPeriod,
      businessMode,
      filterChannel,
      filterRegion,
      filterCollection,
      savedCartOutfits,
      activeCartOutfitId,
      cartTotalsScope,
    ]
  );

  return <UIStateContext.Provider value={value}>{children}</UIStateContext.Provider>;
}

export const useUIState = () => {
  const context = useContext(UIStateContext);
  if (context === undefined) throw new Error('useUIState must be used within a UIStateProvider');
  return context;
};
