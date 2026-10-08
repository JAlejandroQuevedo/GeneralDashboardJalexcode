import { create } from "zustand";

type PopupState = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
};

export const usePopupOpen = create<PopupState>((set) => ({
  isOpen: false,

  setOpen: (value) => set({ isOpen: value }),
}));
