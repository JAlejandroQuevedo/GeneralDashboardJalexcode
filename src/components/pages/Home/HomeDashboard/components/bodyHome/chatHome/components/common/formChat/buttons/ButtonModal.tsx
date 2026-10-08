import type { ButtonModalPropsTypes } from "../../../../../../../../../../../types/home/chatSectionTypes";

export const ButtonModal = ({
  children,
  onClick,
  className = "preview-add-btn",
  isDisabled = false,
}: ButtonModalPropsTypes) => {
  return (
    <button disabled={isDisabled} onClick={onClick} className={className}>
      {children}
    </button>
  );
};
