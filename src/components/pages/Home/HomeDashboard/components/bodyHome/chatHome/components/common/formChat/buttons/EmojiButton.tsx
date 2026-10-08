import { Smile, X } from "lucide-react";
import type { EmojiButtonProps } from "../../../../../../../../../../../types/home/chatSectionTypes";

export const EmojiButton = ({
  onClick,
  showEmojiPicker,
  isDisabled = false,
}: EmojiButtonProps) => {
  return (
    <button
      disabled={isDisabled}
      type="button"
      className="emoji-toggle-btn"
      onClick={onClick}
    >
      {showEmojiPicker ? (
        <X color="#54656f" />
      ) : (
        <Smile size={20} color="#54656f" />
      )}
    </button>
  );
};
