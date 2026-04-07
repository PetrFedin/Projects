export interface ARWaypoint {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'shelf' | 'fitting_room' | 'checkout' | 'entrance' | 'promo';
  description?: string;
}

export interface ARRoute {
  id: string;
  name: string;
  waypoints: ARWaypoint[];
  estimatedTime: number; // in seconds
}

export interface ARDiscoveryItem {
  id: string;
  name: string;
  waypointId: string;
  price: number;
  image: string;
  discount?: string;
  isPromo: boolean;
}

export interface ARSession {
  userId: string;
  storeId: string;
  currentLocation: { x: number; y: number };
  activeRoute?: ARRoute;
  discoveredItems: ARDiscoveryItem[];
}
