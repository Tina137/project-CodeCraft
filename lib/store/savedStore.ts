import { create } from "zustand";

interface SavedStore {
  savedList: string[];
  savedLoaded: boolean;

  userId: string | null;

  setSavedList: (list: string[]) => void;
  toggleSaved: (id: string) => void;

  setSavedLoaded: (v: boolean) => void;
  setUserId: (id: string | null) => void;
}

export const useSavedStore = create<SavedStore>((set) => ({
  savedList: [],
  savedLoaded: false,
  userId: null,

  setSavedList: (list) => set({ savedList: list }),

  toggleSaved: (id) =>
    set((state) => ({
      savedList: state.savedList.includes(id)
        ? state.savedList.filter((i) => i !== id)
        : [...state.savedList, id],
    })),

  setSavedLoaded: (v) => set({ savedLoaded: v }),

  setUserId: (id) => set({ userId: id }),
}));
