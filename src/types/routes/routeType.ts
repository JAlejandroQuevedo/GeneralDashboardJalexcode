export type BaseRouteType = {
  id: string;
  path?: string;
  Element: React.ComponentType;
  children?: BaseRouteType[];
  index?: boolean;
};
