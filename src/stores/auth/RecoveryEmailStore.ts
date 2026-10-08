import { create } from "zustand";

type RecoveryUsernameState = {
  userName: string;
  setUsername: (value: string) => void;
};
export const useRecoveryUsernameStore = create<RecoveryUsernameState>(
  (set) => ({
    userName: "",
    setUsername: (value) => set({ userName: value }),
  }),
);
