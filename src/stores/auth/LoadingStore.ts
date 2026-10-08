import { create } from "zustand";

type LoadingState = {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
  toggleLoading: () => void;
};

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: true,

  setLoading: (value) => set({ isLoading: value }),

  toggleLoading: () => set((state) => ({ isLoading: !state.isLoading })),
}));
