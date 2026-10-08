import { create } from "zustand";
import type { OptionsType } from "../../types/home/lateralMenu";

import { persist } from "zustand/middleware";
import { useOptionsLateralPanel } from "../../components/pages/Home/HomeDashboard/components/lateralMenu/useOptions";

type SelectedState = {
  selected: string;
  setSelected: (value: string) => void;
};
const { optionConstantStaff, optionsConstantAdmin } = useOptionsLateralPanel();
const options: OptionsType[] = optionConstantStaff || optionsConstantAdmin;

export const useSelectedStore = create<SelectedState>()(
  persist(
    (set) => ({
      selected: options[0].name,
      setSelected: (selected: string) => set({ selected: selected }),
    }),
    {
      name: "selected-option",
    },
  ),
);
