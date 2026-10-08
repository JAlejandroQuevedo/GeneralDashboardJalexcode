import { create } from "zustand";
import type { RoleType } from "../types/home/dashboardTypes";
export type userAuthType = {
  role: RoleType;
  uuId: string;
  supabaseToken: string;
};
type UserState = {
  user: userAuthType | null;
  setUser: (user: userAuthType | null) => void;
};

export const useAuthStore = create<UserState>((set) => ({
  user: {} as userAuthType,
  setUser: (user: userAuthType | null) =>
    set({
      user: user,
    }),
}));
