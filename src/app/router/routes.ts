import { ConfirmPassword } from "../../components/pages/Home/Auth/forget/ConfirmPassword";
import { ForgetPassowrd } from "../../components/pages/Home/Auth/forget/ForgetPassowrd";
import { VerificationForgetPassword } from "../../components/pages/Home/Auth/forget/VerificationForgotPassword";
import { LoginScreen } from "../../components/pages/Home/Auth/Login";
import { HomeDashboard } from "../../components/pages/Home/HomeDashboard/HomeDashboard";

import type { BaseRouteType } from "../../types/routes/routeType";
import { RedirectToDashboard } from "./redirect/RedirectToDash";
import { ProtectedLayoutAuth } from "./security/ProtectedLayoutAuth";
import { PublicAuthLayout } from "./security/PublicLayoutAuth";

//Objeto de rutas, para editar rutas aqui y que se vean reflejadas en toda la app

export const objectRoutes = {
  dashboard: "/dashboard",
  login: "/login",
  forgetPassword: "/forgetpassword",
  verificationForget: "/verifiacationforget",
  setPassword: "/setpassword",
};

//Rutas

export const routes: BaseRouteType[] = [
  {
    id: "PublicLayout",
    Element: PublicAuthLayout,
    children: [
      {
        id: "Auth",
        path: objectRoutes.login,
        Element: LoginScreen,
      },
      {
        id: "ForgetPassword",
        path: objectRoutes.forgetPassword,
        Element: ForgetPassowrd,
      },
      {
        id: "VerificationForget",
        path: objectRoutes.verificationForget,
        Element: VerificationForgetPassword,
      },
      {
        id: "SetPassword",
        path: objectRoutes.setPassword,
        Element: ConfirmPassword,
      },
    ],
  },

  //Rutas protegidas por auth
  {
    id: "ProtectedLayoutAuth",
    path: "/",
    Element: ProtectedLayoutAuth,

    children: [
      {
        id: "RedirectToDash",
        path: "/",
        Element: RedirectToDashboard,
      },
      {
        id: "Dashboard",
        path: objectRoutes.dashboard,
        Element: HomeDashboard,
      },
    ],
  },
];
