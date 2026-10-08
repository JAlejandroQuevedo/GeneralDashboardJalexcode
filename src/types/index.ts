import type { ReactNode } from "react";
import type { SVGProps } from "react";
import type { ChatType, MessageType } from "./home/chatSectionTypes";
export type ConfigType = {
  ENV_PRIMARY: string;
  API_URL: string;
  VITE_API_WHATSAPP_URL: string;
  CLIENT_ID: string;
  CLIENT_POOL: string;
  COGNITO_DOMAIN: string;
  CALLBACK_AUTH: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_URL: string;
  BEARER_TOKEN: string;
  DEV_USER_ADMIN: string;
  ID_DEV_USER: string;
  ID_DEV_CHAT: string;
};

export type ContentSearchType = {
  icon: string;
  text: string;
};

export type PopupProps = {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: string;
  height?: string;
  disableCloseOnOverlay?: boolean;
  disableCloseOnEsc?: boolean;
};

export type LoginType = {
  emailUsername: string;
  password: string;
};

export type TokenType = {
  token: string | undefined;
};

export type FetchIndexType = {
  endpoint: string;
  token: string | undefined;
  key: string;
};

export type LoginPropsType = {
  slogan?: string;
  author?: string;
  children: ReactNode;
};

export type AuthFormPropsType = {
  logo?: string;
  title?: string;
  subtitle?: string;
  linkContent?: string;
  linkText?: string;
  linkTo?: string;
  children: ReactNode;
  visibleContainer?: boolean;
  visibleText?: boolean;
  linkVisibleText?: string;
  linkToVisbileText?: string;

  onClick?: () => void;
};

export type LoaderPropsType = {
  width?: string;
  height?: string;
};

export type PoolDataType = {
  UserPoolId: string;
  ClientId: string;
};

export type IconInputProps = {
  icon: string;
  alt: string;
};

//Get API types

export type BearerTokenParam = {
  url: string;
  token: string;
  cloudflareToken?: string;
  responseKey?: string;
  body?: Record<string, any>;
  params?: Record<string, any>;
  formData?: FormData;
};

//Api types

export type ApiType = {
  url: string;
  body: string;
  responseKey?: string;
};

//Types de los componentes de create chat

export type FooterCreateChatPropsType = {
  isSubmitting: boolean;
};

export type ErrorCreateChatTypeProps = {
  error: string;
};

//Types para Lazy Media

export type LazyMediaProps = {
  mediaId: string;
  message: MessageType;
  altText?: string;
};

export type LazyDocumentProps = {
  mediaId: string;
  fileName?: string;
  mimeType?: string;
  message: MessageType;
};
export type LazyVideoProps = {
  mediaId: string;
};

export type LazyAudioProps = {
  mediaId: string;
  transcript?: string | null;
};

export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};

export type BaseIconProps = IconProps & {
  children: ReactNode;
};
export type SideBarContentChatsProps = {
  message: MessageType | undefined;
  chat: ChatType | undefined;
};
export type ContentChatIconContainerProps = {
  children: ReactNode;
};
export type UseClipboardMediaProps = {
  onFilesPasted: (files: File[]) => void;
};
export type MessageMenuProps = {
  message: any;
  canIReply?: boolean;
  isLast?: boolean;
  color?: string;
  bgc?: string;
};
export type MessageStatusIconProps = {
  status: string;
  color?: string;
  colorCheckRead?: string;
};
export type ReactionMenuProps = {
  message: any;
  phone: string;
  currentReaction?: string | null;
};
