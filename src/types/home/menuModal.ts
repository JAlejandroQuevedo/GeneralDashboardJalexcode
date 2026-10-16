import type { ChangeEventHandler } from "react";
import type { ChatType } from "./chatSectionTypes";

export type HeaderModalProps = {
  title?: string;
  setFowardModalOpen: () => void;
};

export type SeekerMenuModalProps = {
  searchTerm: string;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
};
export type ChatListModalProps = {
  filteredChats: ChatType[];
  selectedChats: string[];
  toggleChatSelection: (chatId: string) => void;
};

export type ButtonMenuModalProps = {
  selectedChats: string[];
  isLoading?: boolean;
  onClick: () => void;
};
