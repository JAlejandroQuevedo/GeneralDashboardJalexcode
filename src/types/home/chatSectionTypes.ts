import type {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  ReactNode,
  RefObject,
  SetStateAction,
} from "react";
import type { UserDataType } from "./dashboardTypes";
import type { SmartEditorRef } from "../form/inputsType";

export type ChatStatus = "Notstarted" | "Pendient" | "Completed" | "Unassigned";

//Data types
export type ChatType = {
  id: string;
  staff_id: string | null;
  name: string;
  phone: string;
  bsuid: string;
  status: ChatStatus;
  last_message_time: string;
  total_messages: number;
};
export type SenderType = "agent" | "client" | "agent-IA";

export type MessageType = {
  id: string;
  wa_id: string;
  chat_id: string;
  text: string;
  status: string;
  sender: SenderType;
  media_id: string | null;
  media_type: string | null;
  file_name: string;
  mime_type: string;
  created_at: string;
  reply_to_id: string;
  reaction: string;
  reaction_owner: string;
  reaction_time: string | null;
  transcript: string | null;
};

//Search types

export type SearchContainerProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

//Chat list container types

export type ChatListProps = {
  filteredChats: ChatType[];
  openMenuId: string | null;
  menuOpen: Dispatch<SetStateAction<string | null>>;
};

//Chat window types

export type ChatWindowProps = {
  messages: MessageType[];
  chat: ChatType;
};

//Chat messages Container type

export type ChatProfileContainerProps = {
  chat: ChatType;
};

export type ChatContainerProps = {
  messages: MessageType[];
  lastDate?: string;
};

//Types para el sideBar content
export type SideBarContentProps = {
  chat: ChatType;
  isActive: boolean;
  staffData: UserDataType[];
  openMenuId: string | null;
  menuOpen: Dispatch<SetStateAction<string | null>>;
  isAssignedToCurrentUser?: boolean;
  chatId: string | null;
  onClick: () => void;
};

//Types para el menu de asign buttons
export type AssignMenuProps = {
  handleChangeStatus: (
    e: MouseEvent<HTMLButtonElement>,
    status: ChatStatus,
  ) => void;
  handleAssignClick: (e: MouseEvent<HTMLButtonElement>) => void;
  handleDeleteBtn: (e: MouseEvent<HTMLButtonElement>) => void;
  handleCleanBtn: (e: MouseEvent<HTMLButtonElement>) => void;
};

//Types para el menu de asign buttons - staff menu
export type AssignButtonsDropdownProps = {
  staffData: UserDataType[];
  handleAssignToStaff: () => void;
  handleBackButton: () => void;
};
//Form props

export type FormChatProps = {
  onSendMessage: (text: string) => Promise<void> | void;
  onSendAudio: (audioFile: File) => Promise<void> | void;
  onSendMedia: (files: File[], caption: string) => Promise<void>;
  chatHistory: MessageType[];
  activeChat: string;
  activeChatInfo: ChatType[];
};

export type StaffSelectionMenuProps = {
  staffData: UserDataType[];
  handleAssignToStaff: (
    e: MouseEvent<HTMLButtonElement>,
    staffId: string,
  ) => void;
  onBack: (e: MouseEvent<HTMLButtonElement>) => void;
  staffId: string | null;
};

//Types para el IA button
export type AIButtonProps = {
  isContextButtonDisabled: boolean;
  isButtonProcessing: boolean;
  chatHistory: MessageType[];
  onSendMessage: () => Promise<void> | void;
};
export type QuotedMessageProps = {
  chat: ChatType | null;
  quotedMsg: MessageType | null;
  fullWidth?: boolean;
  colorBorder?: boolean;
  onClick?: () => void;
};
export type SendButtonProps = {
  isSubmiting: boolean;
  isButtonDisabled: boolean;
  isChatDisabled: boolean;
};
export type AudioRecorderBarProps = {
  onSend: (audioFile: File) => void;
  onCancel: () => void;
};

export type AudioButtonPropsTypes = {
  onClick?: () => void;
  isButtonDisabled: boolean;
};
export type EmojiButtonProps = {
  isDisabled?: boolean;
  showEmojiPicker: boolean;
  onClick: () => void;
};
export type ButtonDocumentProps = {
  isDisabled?: boolean;
  showSender: boolean;
  onClick: () => void;
};
export type SenderDocumentProps = {
  onFilesSelected: (files: File[]) => void;
  onOpenCamera: () => void;
};
export type CameraModalProps = {
  onClose: () => void;
  onCapture: (file: File) => void;
};
export type MediaPreviewModalProps = {
  files: File[];
  onClose: () => void;
  onAddMore: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  onSend: (files: File[], caption: string) => void;
  onOpenCamera?: () => void;
};
export type ButtonModalPropsTypes = {
  onClick: () => void | undefined;
  children: ReactNode;
  className?: string;
  isDisabled?: boolean;
};
export type OptimizedViewerProps = {
  activeFile: {
    url: string;
    type: string;
  };
};
export type CaptionAreatTypeProps = {
  files: File[];
  isDisabled?: boolean;
  onSend: (f: File[], c: string) => void;
};
export type PreviewStateType = {
  url: string;
  type: string;
  name: string;
};
export type EmojiPickerTypeProps = {
  onEmojiClick: (emojiData: any) => void;
  left?: string;
  bottom?: string;
};
export type ThumbNailsScrollPropsType = {
  previews: PreviewStateType[];
  activeIndex: number;
  loadingCount: number;
  setActiveIndex: (value: SetStateAction<number>) => void;
  handleRemove: (index: number, e: MouseEvent) => void;
};
export type InputButtonContainerModalTypeProps = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  acceptTypes:
    | "image/jpeg,image/png,image/webp,video/mp4,video/3gpp"
    | ".pdf,.doc,.docx,.xls,.xlsx,.txt";
  onOpenCamera: (() => void) | undefined;
  isDisabled: boolean;
  isMediaMode: boolean;
  // openCamera: () => void;
  onAddMore: () => void;
  handleAddMoreFiles: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  files: File[];
  onSend: (files: File[], caption: string) => void;
};

export type LoaderModalProps = {
  onClick: () => void;
};

export type MarkdownToolbarProps = {
  editorRef: RefObject<SmartEditorRef | null>;
};
