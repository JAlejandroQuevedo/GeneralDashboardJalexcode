import { create } from "zustand";

//Verification Code Store

type VerificationCodeState = {
  code: string;
  setCode: (value: string) => void;
};
export const useVerificationCodeReset = create<VerificationCodeState>(
  (set) => ({
    code: "",
    setCode: (value) => set({ code: value }),
  })
);

//Verification Email Store
type VerificationEmailState = {
  email: string;
  setEmail: (value: string) => void;
};
export const useVerificationEmailStore = create<VerificationEmailState>(
  (set) => ({
    email: "",
    setEmail: (value) => set({ email: value }),
  })
);

//Cofirm Password Store

export type ConfirmPasswordType = {
  password: string;
  confirmPassword: string;
};

type ConfirmPasswordState = {
  confirmPassword: ConfirmPasswordType;
  setConfirmPassword: (value: ConfirmPasswordType) => void;
};

export const useConfirmPasswordStore = create<ConfirmPasswordState>((set) => ({
  confirmPassword: {
    password: "",
    confirmPassword: "",
  },
  setConfirmPassword: (value) => set({ confirmPassword: value }),
}));
