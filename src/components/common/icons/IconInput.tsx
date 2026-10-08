import type { IconInputProps } from "../../../types";

export const IconInput = ({ icon, alt }: IconInputProps) => {
  return <img className="iconInput" src={icon} alt={alt} />;
};
