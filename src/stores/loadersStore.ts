import { create } from "zustand";

/* Dasboard */

//dashboardStaffLoader
type isStaffLoading = {
  isLoading: boolean;
  setisLoading: (isLoading: boolean) => void;
};

export const useisStaffLoading = create<isStaffLoading>((set) => ({
  isLoading: false,
  setisLoading: (isLoading: boolean) => set({ isLoading: isLoading }),
}));

//dashboardChatsLoader

type isChatDashboardLoading = {
  isLoading: boolean;
  setisLoading: (isLoading: boolean) => void;
};

export const useisChatDashboardLoading = create<isChatDashboardLoading>(
  (set) => ({
    isLoading: false,
    setisLoading: (isLoading: boolean) => set({ isLoading: isLoading }),
  }),
);

//dashboardMessagesLoader

type isMessageDashboardLoading = {
  isLoading: boolean;
  setisLoading: (isLoading: boolean) => void;
};

export const useisMessageDashboardLoading = create<isMessageDashboardLoading>(
  (set) => ({
    isLoading: false,
    setisLoading: (isLoading: boolean) => set({ isLoading: isLoading }),
  }),
);

/* Staff Admin */

type isStaffAdminLoading = {
  isLoading: boolean;
  setisLoading: (isLoading: boolean) => void;
};

export const useisStaffAdminLoading = create<isStaffAdminLoading>((set) => ({
  isLoading: false,
  setisLoading: (isLoading: boolean) => set({ isLoading: isLoading }),
}));

/* Chat */

//Chat loader

type isChatLoading = {
  isLoading: boolean;
  setisLoading: (isLoading: boolean) => void;
};

export const useisChatLoading = create<isChatLoading>((set) => ({
  isLoading: false,
  setisLoading: (isLoading: boolean) => set({ isLoading: isLoading }),
}));

//Messages loader
type isMessagesLoading = {
  isLoading: boolean;
  setisLoading: (isLoading: boolean) => void;
};

export const useisMessagesLoading = create<isMessagesLoading>((set) => ({
  isLoading: false,
  setisLoading: (isLoading: boolean) => set({ isLoading: isLoading }),
}));
