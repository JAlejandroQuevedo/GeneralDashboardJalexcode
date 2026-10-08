import { Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import type { BaseRouteType } from "../../types/routes/routeType";

const renderRoutes = (routes: BaseRouteType[]) => {
  return routes.map(({ id, path, Element, children }) => (
    <Route key={id} path={path} element={<Element />}>
      {children && renderRoutes(children)}
    </Route>
  ));
};

export const AppRouter: React.FC = () => {
  return <Routes>{renderRoutes(routes)}</Routes>;
};
