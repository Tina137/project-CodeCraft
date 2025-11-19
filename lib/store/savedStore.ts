import { create } from "zustand";

interface SavedState {
  savedList: string[];
  hydrated: boolean;
  setSavedList: (list: string[]) => void;
  toggleSaved: (id: string) => void;
}

export const useSavedStore = create<SavedState>((set) => ({
  savedList: [],
  hydrated: false,

  setSavedList: (list) =>
    set(() => ({
      savedList: list,
      hydrated: true,
    })),

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
