import type { CSSProperties } from "react";
import type { QuotedMessageProps } from "../../../../../../../../../../types/home/chatSectionTypes";
import { QuotedMediaThumbnail } from "./QuotedMediaThumbnail";

export const QuotedMessage = ({
  chat,
  quotedMsg,
  onClick,
  fullWidth = false,
}: QuotedMessageProps) => {
  if (!quotedMsg) return null;

  const senderName = quotedMsg.sender === "client" ? chat?.name : "Tú";

  // Lógica para determinar el texto o contexto a mostrar
  let previewText = quotedMsg.text || "";

  switch (quotedMsg.media_type) {
    case "image":
      previewText = previewText || "Foto";
      break;
    case "video":
      previewText = previewText || "Video";
      break;
    case "audio":
      previewText = quotedMsg.transcript || "Nota de voz";
      break;
    case "document":
      previewText = quotedMsg.file_name || "Documento";
      break;
    case "sticker":
      previewText = "Sticker";
      break;
    default:
      break;
  }

  // Verifica si el mensaje tiene una imagen que debamos renderizar a la derecha
  const hasThumbnail = quotedMsg.media_id && quotedMsg.media_type === "image";
  //Const border form
  const borderForm = "5px solid";
  const senderType = quotedMsg.sender === "client" ? true : false;
  return (
    <div
      style={
        {
          "--dinamic-full-width": fullWidth ? "100%" : "260px",
          "--dinamic-quoter-border": !senderType
            ? `${borderForm} #F1A6AE`
            : `${borderForm} #027eb5`,
        } as CSSProperties
      }
      className="quoted-message-wrapper"
      onClick={onClick}
    >
      <div className="quoted-content">
        <div className="quoted-text-block">
          <span className="quoted-sender">{senderName}</span>
          <span className="quoted-text">{previewText}</span>
        </div>

        {/* Si es una imagen, montamos el hook para buscarla en el caché */}
        {hasThumbnail && (
          <div className="quoted-thumbnail-container">
            <QuotedMediaThumbnail mediaId={quotedMsg.media_id || ""} />
          </div>
        )}
      </div>
    </div>
  );
};
