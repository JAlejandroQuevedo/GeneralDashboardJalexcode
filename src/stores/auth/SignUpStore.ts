import { create } from "zustand";

//Sign Up Form State

export type SignUpFormType = {
  name: string;
  username: string;
  email: string;
  password: string;
};

type SignUpState = {
  signUpState: SignUpFormType;
  setSignUp: (value: SignUpFormType) => void;
};

export const useSignUpStore = create<SignUpState>((set) => ({
  signUpState: {
    name: "",
    username: "",
    email: "",
    password: "",
  },
  setSignUp: (value) => set({ signUpState: value }),
}));
