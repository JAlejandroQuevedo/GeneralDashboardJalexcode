import Picker from "@emoji-mart/react";
import type { CSSProperties } from "react";
import type { EmojiPickerTypeProps } from "../../../../../../../../../../../types/home/chatSectionTypes";

export const EmojiPicker = ({
  onEmojiClick,
  left = "20px",
  bottom = "100px",
}: EmojiPickerTypeProps) => {
  return (
    <div
      style={
        {
          "--dinamic-bottom": bottom,
          "--dinamic-left": left,
        } as CSSProperties
      }
      className="emoji-picker-floating"
    >
      <Picker
        locale="es"
        onEmojiSelect={onEmojiClick}
        theme="light"
        previewPosition="none"
        skinTonePosition="search"
        navPosition="top"
      />
    </div>
  );
};
