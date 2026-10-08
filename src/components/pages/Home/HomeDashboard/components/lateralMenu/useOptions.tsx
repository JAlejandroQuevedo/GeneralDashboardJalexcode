import type { OptionsType } from "../../../../../../types/home/lateralMenu";

export const useOptionsLateralPanel = () => {
  const optionConstantUser: OptionsType[] = [
    {
      name: "Dashboard",
      iconActive: "/img/icons/home_icon.svg",
      iconInactive: "/img/icons/home_icon_inactive.svg",
      alt: "Icono Home",
    },
    {
      name: "Productos",
      iconActive: "/img/icons/logo_shield.svg",
      iconInactive: "/img/icons/logo_shield.svg",
      alt: "Icono productos",
    },
    {
      name: "Ajustes",
      iconActive: "/img/icons/settings.svg",
      iconInactive: "/img/icons/settings_inactive.svg",
      alt: "Icono ajustes",
    },
  ];
  const optionConstantStaff: OptionsType[] = [
    {
      name: "Dashboard",
      iconActive: "/img/icons/home_icon.svg",
      iconInactive: "/img/icons/home_icon_inactive.svg",
      alt: "Icono Home",
    },
    {
      name: "Usuarios",
      iconActive: "/img/icons/staff_icon.svg",
      iconInactive: "/img/icons/staff_icon_inactive.svg",
      alt: "Icono clientes",
    },
    {
      name: "Mensajes",
      iconActive: "/img/icons/messages_icon.svg",
      iconInactive: "/img/icons/messages_icon_inactive.svg",
      alt: "Icono contabilidad",
    },
    {
      name: "Ajustes",
      iconActive: "/img/icons/settings.svg",
      iconInactive: "/img/icons/settings_inactive.svg",
      alt: "Icono ajustes",
    },
  ];
  const optionsConstantAdmin: OptionsType[] = [
    {
      name: "Dashboard",
      iconActive: "/img/icons/home_icon.svg",
      iconInactive: "/img/icons/home_icon_inactive.svg",
      alt: "Icono productos",
    },
    {
      name: "Usuarios",
      iconActive: "/img/icons/staff_icon.svg",
      iconInactive: "/img/icons/staff_icon_inactive.svg",
      alt: "Icono clientes",
    },
    {
      name: "Mensajes",
      iconActive: "/img/icons/messages_icon.svg",
      iconInactive: "/img/icons/messages_icon_inactive.svg",
      alt: "Icono contabilidad",
    },
    {
      name: "Ajustes",
      iconActive: "/img/icons/settings.svg",
      iconInactive: "/img/icons/settings_inactive.svg",
      alt: "Icono ajustes",
    },
  ];

  return { optionConstantStaff, optionsConstantAdmin, optionConstantUser };
};
