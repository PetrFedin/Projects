/**
 * VR Showroom Types
 */

export interface VRShowroomConfig {
  id: string;
  name: string;
  brandId: string;
  theme: 'minimalist' | 'cyberpunk' | 'industrial' | 'nature';
  scenes: VRScene[];
  activeHotspots: VRHotspot[];
}

export interface VRScene {
  id: string;
  panoramaUrl: string; // 360 equirectangular image
  initialView: { yaw: number; pitch: number };
}

export interface VRHotspot {
  id: string;
  sceneId: string;
  position: { x: number; y: number; z: number };
  type: 'product_link' | 'video_player' | 'info_panel';
  targetId?: string; // Product ID or Video ID
  label?: string;
}
