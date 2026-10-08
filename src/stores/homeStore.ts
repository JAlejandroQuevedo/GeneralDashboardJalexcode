//Store para mostrar el panel lateral

import { create } from "zustand";
import type { UserDataType } from "../types/home/dashboardTypes";
import type { MessageType } from "../types/home/chatSectionTypes";

type ShowLateralPanelStore = {
  isLateralPanelVisible: boolean;
  setisLateralPanelVisible: (isPopUpVisible: boolean) => void;
  typeOfContent: string;
  setTypeOfContent: (typeOfContent: string) => void;
};

export const useShowLateralPanelStore = create<ShowLateralPanelStore>(
  (set) => ({
    isLateralPanelVisible: true,
    setisLateralPanelVisible: (isVisible: boolean) =>
      set({ isLateralPanelVisible: isVisible }),
    typeOfContent: "laboral",
    setTypeOfContent: (typeContent: string) =>
      set({ typeOfContent: typeContent }),
  }),
);

//Popup stores

type ShowPopopStaffStore = {
  isPopupVisible: boolean;
  setisPopupVisible: (isPopUpVisible: boolean) => void;
  typeOfContent: string;
  setTypeOfContent: (typeOfContent: string) => void;
};

export const useShowPopopStaffStore = create<ShowPopopStaffStore>((set) => ({
  isPopupVisible: false,
  setisPopupVisible: (isVisible: boolean) => set({ isPopupVisible: isVisible }),
  typeOfContent: "laboral",
  setTypeOfContent: (typeContent: string) =>
    set({ typeOfContent: typeContent }),
}));

type ShowPopopChatsStore = {
  isPopupVisible: boolean;
  setisPopupVisible: (isPopUpVisible: boolean) => void;
  typeOfContent: string;
  setTypeOfContent: (typeOfContent: string) => void;
};

export const useShowPopopChatsStore = create<ShowPopopChatsStore>((set) => ({
  isPopupVisible: false,
  setisPopupVisible: (isVisible: boolean) => set({ isPopupVisible: isVisible }),
  typeOfContent: "laboral",
  setTypeOfContent: (typeContent: string) =>
    set({ typeOfContent: typeContent }),
}));

//Popup staff area

type ShowPopopStaffEdit = {
  data: UserDataType;
  setData: (data: UserDataType) => void;
  isPopupVisible: boolean;
  setisPopupVisible: (isPopUpVisible: boolean) => void;
  typeOfContent: string;
  setTypeOfContent: (typeOfContent: string) => void;
};

export const useShowPopopStaffEdit = create<ShowPopopStaffEdit>((set) => ({
  data: {
    id: "",
    name: "",
    dni: "",
    email: "",
    created_at: "",
    username: "",
    role: "",
  },
  setData: (data: UserDataType) => set({ data }),
  isPopupVisible: false,
  setisPopupVisible: (isVisible: boolean) => set({ isPopupVisible: isVisible }),
  typeOfContent: "laboral",
  setTypeOfContent: (typeContent: string) =>
    set({ typeOfContent: typeContent }),
}));

type ShowPopopStaffDelete = {
  data: UserDataType;
  setData: (data: UserDataType) => void;
  isPopupVisible: boolean;
  setisPopupVisible: (isPopUpVisible: boolean) => void;
  typeOfContent: string;
  setTypeOfContent: (typeOfContent: string) => void;
};

export const useShowPopopStaffDelete = create<ShowPopopStaffDelete>((set) => ({
  data: {
    id: "",
    name: "",
    dni: "",
    email: "",
    created_at: "",
    username: "",
    role: "",
  },
  setData: (data: UserDataType) => set({ data }),
  isPopupVisible: false,
  setisPopupVisible: (isVisible: boolean) => set({ isPopupVisible: isVisible }),
  typeOfContent: "laboral",
  setTypeOfContent: (typeContent: string) =>
    set({ typeOfContent: typeContent }),
}));

type ShowPopopStaffCreate = {
  isPopupVisible: boolean;
  setisPopupVisible: (isPopUpVisible: boolean) => void;
  typeOfContent: string;
  setTypeOfContent: (typeOfContent: string) => void;
};

export const useShowPopopStaffCreate = create<ShowPopopStaffCreate>((set) => ({
  isPopupVisible: false,
  setisPopupVisible: (isVisible: boolean) => set({ isPopupVisible: isVisible }),
  typeOfContent: "laboral",
  setTypeOfContent: (typeContent: string) =>
    set({ typeOfContent: typeContent }),
}));

type ShowPopupCreateChat = {
  isPopupVisible: boolean;
  setisPopupVisible: (isPopUpVisible: boolean) => void;
  typeOfContent: string;
  setTypeOfContent: (typeOfContent: string) => void;
};

export const useShowPopupCreateChat = create<ShowPopupCreateChat>((set) => ({
  isPopupVisible: false,
  setisPopupVisible: (isVisible: boolean) => set({ isPopupVisible: isVisible }),
  typeOfContent: "laboral",
  setTypeOfContent: (typeContent: string) =>
    set({ typeOfContent: typeContent }),
}));

//Chat section setores

type ActiveChat = {
  activeChat: string;
  setActiveChat: (activeChat: string) => void;
};

export const useActiveChat = create<ActiveChat>((set) => ({
  activeChat: "",
  setActiveChat: (activeChat: string) => set({ activeChat: activeChat }),
}));

//Store para guardar el tipo de plataforma

type PlatformType = {
  type: string | null;
  setType: (type: string) => void;
};

export const usePlatformType = create<PlatformType>((set) => ({
  type: null,
  setType: (type: string | null) => set({ type: type }),
}));

//Store para el loader de reconexion con streaming

type LoaderReconnectStore = {
  isLoaderActive: boolean;
  setisLoaderActive: (isLoaderActive: boolean) => void;
};

export const useLoaderReconnectStore = create<LoaderReconnectStore>((set) => ({
  isLoaderActive: false,
  setisLoaderActive: (isActive: boolean) => set({ isLoaderActive: isActive }),
}));

//Store para guardar la reaccion del usuario
type ReactionStore = {
  optimisticReactions: Record<string, string | null>;
  updateLocalReaction: (messageId: string, emoji: string | null) => void;
  openMenuId: string | null;
  setOpenMenuId: (messageId: string | null) => void;
};

export const useReactionStore = create<ReactionStore>((set) => ({
  optimisticReactions: {},
  openMenuId: null,
  updateLocalReaction: (messageId, emoji) =>
    set((state) => ({
      optimisticReactions: {
        ...state.optimisticReactions,
        [messageId]: emoji,
      },
    })),
  setOpenMenuId: (id) => set({ openMenuId: id }),
}));

//Store para selecter y reply
type ChatUIState = {
  replyingTo: MessageType | null;
  setReplyingTo: (msg: MessageType) => void;
  clearReply: () => void;
  deletingIds: string[];
  setDeletingIds: (ids: string[]) => void;
  selectedMessages: MessageType[];
  isSelectionMode: boolean;
  toggleMessageSelection: (msg: MessageType) => void;
  clearSelection: () => void;
  targetMediaToOpen: string | null;
  setTargetMediaToOpen: (wa_id: string | null) => void;
  selectionType: "normal" | "forward";
  isForwardModalOpen: boolean;
  setForwardModalOpen: (isOpen: boolean) => void;
  initiateForward: (msg: MessageType) => void;
};

export const useChatUIStore = create<ChatUIState>((set) => ({
  replyingTo: null,
  setReplyingTo: (msg) => set({ replyingTo: msg }),
  clearReply: () => set({ replyingTo: null }),
  selectedMessages: [],
  isSelectionMode: false,
  deletingIds: [],
  targetMediaToOpen: null,
  selectionType: "normal",
  isForwardModalOpen: false,

  setForwardModalOpen: (isOpen) => set({ isForwardModalOpen: isOpen }),

  // Inicia la selección en modo "Reenviar" y autoselecciona el mensaje origen
  initiateForward: (msg) =>
    set({
      selectedMessages: [msg],
      isSelectionMode: true,
      selectionType: "forward",
    }),

  toggleMessageSelection: (msg) =>
    set((state) => {
      const isSelected = state.selectedMessages.some((m) => m.id === msg.id);
      const newSelection = isSelected
        ? state.selectedMessages.filter((m) => m.id !== msg.id)
        : [...state.selectedMessages, msg];

      // Si deseleccionamos todo, reseteamos el modo
      if (newSelection.length === 0) {
        return {
          selectedMessages: [],
          isSelectionMode: false,
          selectionType: "normal",
        };
      }

      return {
        selectedMessages: newSelection,
        isSelectionMode: true,
        // Conservamos el tipo de selección actual (normal o forward)
      };
    }),

  clearSelection: () =>
    set({
      selectedMessages: [],
      isSelectionMode: false,
      selectionType: "normal",
    }),
  setDeletingIds: (ids) => set({ deletingIds: ids }),
  setTargetMediaToOpen: (wa_id) => set({ targetMediaToOpen: wa_id }),
}));
