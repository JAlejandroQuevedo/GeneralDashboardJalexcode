import { SendHorizontal } from "lucide-react";
import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { ButtonModal } from "../../../buttons/ButtonModal";
import { EmojiButton } from "../../../buttons/EmojiButton";
import { EmojiPicker } from "../../../containers/EmojiPicker";
import type { CaptionAreatTypeProps } from "../../../../../../../../../../../../../types/home/chatSectionTypes";

export const CaptionArea = ({
  files,
  onSend,
  isDisabled = false,
}: CaptionAreatTypeProps) => {
  //States que permiten el mostrar el picker de los emojis y el set del caption del textarea
  const [caption, setCaption] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  //Funcion para mostrar el cuadro de emojis
  const onEmojiClick = (emojiData: any) => {
    setCaption((prev) => prev + emojiData.native);
  };
  //Referencia para el text area, ayuda a aumentar el tamaño de manera dinamica
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  //Handle para manejar el caption del textarea
  const handleCaptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCaption(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };
  //Handle para el keyDown
  const handleKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend(files, caption);
    }
  };
  return (
    <>
      {showEmojiPicker && (
        <EmojiPicker bottom="68px" left="350px" onEmojiClick={onEmojiClick} />
      )}
      <div className="preview-caption-container">
        <textarea
          ref={textareaRef}
          autoFocus
          placeholder="Añade un mensaje..."
          value={caption}
          onChange={handleCaptionChange}
          className="preview-caption-input input-text-area"
          rows={1}
          onKeyDown={handleKeyDown}
        />

        <EmojiButton
          showEmojiPicker={showEmojiPicker}
          onClick={() => {
            setShowEmojiPicker(!showEmojiPicker);
          }}
        />
      </div>
      <ButtonModal
        className="preview-send-btn"
        isDisabled={isDisabled}
        onClick={() => onSend(files, caption)}
      >
        <SendHorizontal
          color="#959595"
          size={18}
          className="preview-send-icon"
        />
      </ButtonModal>
    </>
  );
};
