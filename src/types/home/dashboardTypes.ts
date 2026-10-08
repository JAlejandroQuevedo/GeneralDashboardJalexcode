//Types de las cards counter

import type { UserFormType } from "../form/userForm";
import type { ChatType, MessageType } from "./chatSectionTypes";

export type DashboardDataType = {
  title: string;
  counter: string;
  phrase: string;
  icon: string;
  alt: string;
  color?: string;
};

export type CardsComponentProps = {
  data: DashboardDataType[];
  dinamicHeightMobile?: string;
  dinamicHeightDesktop?: string;
};

//Types de las cards list

export type ListElementType = {
  detailTitle: string;
  detailSubtitle: string;
  date: string;
};

export type DashboardListDataType = {
  title: string;
  subtitle: string;
  btnTxt: string;
  isOpen: boolean;
  btnVoidPopoup: () => void;
  btnVoid: () => void;
  type: string;
  listDetailData: ListElementType[];
};

export type ListComponentProps = {
  data: DashboardListDataType[] | null;
};

//Popup Dashboard Types

export type PopUpHomePropsType = {
  isOpen: boolean;
  btnVoid: () => void;
  type?: string;
};

//Fast icons types

export type FastActionTypes = {
  icon: string;
  alt: string;
  btnTxt: string;
  isInactive: boolean;
  onClick: () => void;
};

export type FastActionsComponentProps = {
  data: FastActionTypes[];
};

//Staff types

export type RoleType = "super-admin" | "admin" | "user" | "staff" | "";
export type UserDataType = {
  id: string;
  name: string;
  email: string;
  created_at: string;
  username: string;
  role: RoleType;
};

export type StaffProfileType = {
  name: string;
  photo: string;
};
export type PolicyProfileType = {
  name: string;
  photo: string;
  policyNumber: number;
};

//Use get messages types
export type UseMessagesProps = {
  dataChats: ChatType[] | null;
  dataMessages: MessageType[] | null;
};

//Form types

export type UserFormProps = {
  initialValues?: UserFormType;
  handleDiscard?: () => void;
  onSubmitAction: (data: UserFormType) => Promise<void> | void;
  isLoading?: boolean;
  isDiscardVisible?: boolean;
  error?: string;
  isElementsVisible?: boolean;
};

//Policies type

export type PoliciesType = {
  id: string;
  created_at: string;
  document: string | null;
  userId: string;
  policy_number: number;
  users: UserDataType;
};
