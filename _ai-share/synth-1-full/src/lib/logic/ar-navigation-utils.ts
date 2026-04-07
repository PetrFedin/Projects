import { ARWaypoint, ARRoute, ARDiscoveryItem, ARSession } from '../types/ar-navigation';

export const MOCK_WAYPOINTS: ARWaypoint[] = [
  { id: 'w1', name: 'Вход', x: 50, y: 90, type: 'entrance' },
  { id: 'w2', name: 'Новинки недели', x: 50, y: 70, type: 'promo', description: 'Лучшие образы сезона весна-лето' },
  { id: 'w3', name: 'Примерочные', x: 10, y: 20, type: 'fitting_room' },
  { id: 'w4', name: 'Аксессуары', x: 80, y: 40, type: 'shelf' },
  { id: 'w5', name: 'Кассовая зона', x: 50, y: 10, type: 'checkout' },
  { id: 'w6', name: 'Мужская коллекция', x: 80, y: 70, type: 'shelf' },
];

export const MOCK_ITEMS: ARDiscoveryItem[] = [
  { id: 'i1', name: 'Костюм "Tech Noir"', waypointId: 'w2', price: 24500, image: 'https://images.unsplash.com/photo-1594932224828-b4b059b6f6f5?q=80&w=200', isPromo: true, discount: '-15%' },
  { id: 'i2', name: 'Сумка "Aura"', waypointId: 'w4', price: 12800, image: 'https://images.unsplash.com/photo-1584917033904-49033bb7a67b?q=80&w=200', isPromo: false },
  { id: 'i3', name: 'Ботинки "Stellar"', waypointId: 'w4', price: 18200, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200', isPromo: true, discount: 'Double Points' },
];

export const MOCK_ROUTES: ARRoute[] = [
  { id: 'r1', name: 'Быстрый шоппинг: Новинки', waypoints: [MOCK_WAYPOINTS[0], MOCK_WAYPOINTS[1], MOCK_WAYPOINTS[4]], estimatedTime: 480 },
  { id: 'r2', name: 'Полный обзор: Весь зал', waypoints: [MOCK_WAYPOINTS[0], MOCK_WAYPOINTS[1], MOCK_WAYPOINTS[5], MOCK_WAYPOINTS[3], MOCK_WAYPOINTS[2], MOCK_WAYPOINTS[4]], estimatedTime: 1200 },
];

export const MOCK_AR_SESSION: ARSession = {
  userId: 'u1',
  storeId: 's1',
  currentLocation: { x: 50, y: 85 },
  discoveredItems: MOCK_ITEMS,
  activeRoute: MOCK_ROUTES[0],
};
