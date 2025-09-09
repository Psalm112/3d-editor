import { create } from "zustand";
import * as THREE from "three";
import type { Hotspot, SceneState } from "../types";

interface EditorStore extends SceneState {
  // Model actions
  setModel: (model: THREE.Group | null) => void;

  // Hotspot actions
  addHotspot: (hotspot: Omit<Hotspot, "id">) => void;
  updateHotspot: (id: string, updates: Partial<Hotspot>) => void;
  removeHotspot: (id: string) => void;
  setSelectedHotspot: (id: string | null) => void;
  setIsAddingHotspot: (isAdding: boolean) => void;

  // Scene actions
  clearScene: () => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  // Initial state
  model: null,
  hotspots: [],
  selectedHotspot: null,
  isAddingHotspot: false,

  // Actions
  setModel: (model) => set({ model }),

  addHotspot: (hotspotData) => {
    const newHotspot: Hotspot = {
      id: `hotspot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...hotspotData,
    };
    set((state) => ({
      hotspots: [...state.hotspots, newHotspot],
      isAddingHotspot: false,
    }));
  },

  updateHotspot: (id, updates) =>
    set((state) => ({
      hotspots: state.hotspots.map((hotspot) =>
        hotspot.id === id ? { ...hotspot, ...updates } : hotspot
      ),
    })),

  removeHotspot: (id) =>
    set((state) => ({
      hotspots: state.hotspots.filter((hotspot) => hotspot.id !== id),
      selectedHotspot:
        state.selectedHotspot === id ? null : state.selectedHotspot,
    })),

  setSelectedHotspot: (id) => set({ selectedHotspot: id }),

  setIsAddingHotspot: (isAdding) => set({ isAddingHotspot: isAdding }),

  clearScene: () =>
    set({
      model: null,
      hotspots: [],
      selectedHotspot: null,
      isAddingHotspot: false,
    }),
}));
