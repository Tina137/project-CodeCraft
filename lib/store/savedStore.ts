import { create } from "zustand";

interface SavedState {
  savedList: string[];
  setSavedList: (list: string[]) => void;
  toggleSaved: (id: string) => void;
}

export const useSavedStore = create<SavedState>((set) => ({
  savedList: [],
  setSavedList: (list) => set({ savedList: list }),
  toggleSaved: (id) =>
    set((state) => {
      const exists = state.savedList.includes(id);
      return {
        savedList: exists
          ? state.savedList.filter((s) => s !== id)
          : [...state.savedList, id],
      };
    }),
}));
