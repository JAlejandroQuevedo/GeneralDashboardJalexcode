import type { BaseIconProps } from "../../types";

export const BaseIcon = ({
  size = 20,
  color = "currentColor",
  children,
  ...props
}: BaseIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {children}
    </svg>
  );
};
