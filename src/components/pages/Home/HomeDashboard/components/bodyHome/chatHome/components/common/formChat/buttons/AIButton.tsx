import { BeatLoader } from "react-spinners";
import type { AIButtonProps } from "../../../../../../../../../../../types/home/chatSectionTypes";
import { Astroid } from "lucide-react";

export const AIButton = ({
  isContextButtonDisabled,
  chatHistory,
  onSendMessage,
  isButtonProcessing,
}: AIButtonProps) => {
  return (
    <button
      type="button"
      className={`ai-context-btn ${isContextButtonDisabled ? "disabled" : ""}`}
      onClick={onSendMessage}
      disabled={isContextButtonDisabled}
      title={
        chatHistory.length < 10
          ? "Se necesitan al menos 10 mensajes"
          : "Generar contexto con IA"
      }
    >
      {isButtonProcessing ? (
        <div>
          <BeatLoader size={5} color="#00C0F0" />
        </div>
      ) : (
        <Astroid
          size={18}
          color={isContextButtonDisabled ? "#9da3ab" : "#00C0F0"}
        />
      )}
    </button>
  );
};
