import * as THREE from "three";

export interface Hotspot {
  id: string;
  position: THREE.Vector3;
  label: string;
  description?: string;
  visible: boolean;
}

export interface SceneState {
  model: THREE.Group | null;
  hotspots: Hotspot[];
  selectedHotspot: string | null;
  isAddingHotspot: boolean;
}

export interface CameraControls {
  enableRotate: boolean;
  enablePan: boolean;
  enableZoom: boolean;
  autoRotate: boolean;
}

export interface ModelInfo {
  name: string;
  size: number;
  vertices: number;
  faces: number;
}
