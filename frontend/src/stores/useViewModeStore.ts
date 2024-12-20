import { create } from 'zustand';

interface ViewModeStore {
  mode: 'play' | 'edit';
  setMode: (mode: 'play' | 'edit') => void;
}

export const useViewModeStore = create<ViewModeStore>((set) => ({
  mode: 'edit',
  setMode: (mode) => set({ mode })
})); 