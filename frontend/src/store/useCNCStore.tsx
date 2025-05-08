// src/store/useCNCStore.ts
import { create } from "zustand";

interface CNCStore {
  contourPath: string | null;
  spiralPath: string | null;
  setFolders: (contourPath: string, spiralPath: string) => void;
  clearFolders: () => void;
}

export const useCNCStore = create<CNCStore>((set) => ({
  contourPath: null,
  spiralPath: null,
  setFolders: (contourPath, spiralPath) =>
    set({ contourPath, spiralPath }),
  clearFolders: () => set({ contourPath: null, spiralPath: null }),
}));
