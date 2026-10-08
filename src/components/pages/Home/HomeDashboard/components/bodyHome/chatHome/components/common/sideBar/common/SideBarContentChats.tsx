import { StickerIcon } from "../../../../../../../../../../../constants/icons/Icons";

import { FileText, Image, Play, SquarePlay } from "lucide-react";
import type { SideBarContentChatsProps } from "../../../../../../../../../../../types";
import { ContentChatIconContainer } from "./components/ContentChatIconContainer";
import { useUtilities } from "../../../../../../../../../../../hooks/useUtilities";

//Diccionario para la data a mostrar
const MEDIA_CONFIG: Record<string, { icon: any; label: string }> = {
  image: { icon: Image, label: "Imagen" },
  audio: { icon: Play, label: "Audio" },
  document: { icon: FileText, label: "Documento" },
  video: { icon: SquarePlay, label: "Video" },
  sticker: { icon: StickerIcon, label: "Sticker" },
};

export const SideBarContentChats = ({
  message,
  chat,
}: SideBarContentChatsProps) => {
  const type = message?.media_type;
  const reaction = message?.reaction;
  const { getFirstName } = useUtilities();

  //Funcion para limpiar el markdown

  const cleanMarkdown = (text?: string) => {
    if (!text) return "";
    return text
      .replace(/(\*\*|__)(.*?)\1/g, "$2") // Quita Negrita
      .replace(/(\*|_)(.*?)\1/g, "$2") // Quita Cursiva
      .replace(/(~~)(.*?)\1/g, "$2") // Quita Tachado
      .replace(/`{1,3}([^`]+)`{1,3}/g, "$1") // Quita Código
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1") // Extrae el texto de los enlaces
      .replace(/^[#>*-]\s+/gm, "") // Quita viñetas, citas y encabezados
      .replace(/\n/g, " ") // Convierte saltos de línea en espacios
      .trim();
  };

  const previewText = cleanMarkdown(message?.text);
  // Si no hay type se retorna el texto plano
  if (!type) {
    return (
      <span className="text">
        {reaction &&
          (message.reaction_owner === "client"
            ? `${getFirstName(chat?.name)} reaccionó ${reaction} a `
            : `Reaccionaste ${reaction} a`)}{" "}
        {previewText}
      </span>
    );
  }
  //Segun el tipo, obtenemos lo correspondiente del diccionario
  const mediaInfo = MEDIA_CONFIG[type];
  //Si no se reconoce el type, se retorna null
  if (!mediaInfo) return null;
  //Se obteiene el icono
  const Icon = mediaInfo.icon;

  // Componente visual del archivo
  const mediaContent = (
    <ContentChatIconContainer>
      <Icon size={15} />
      <p className="text">{mediaInfo.label}</p>
    </ContentChatIconContainer>
  );

  // Si es un archivo con raccion, lo retornamos
  if (reaction) {
    return (
      <span className="text">
        {message.reaction_owner === "client"
          ? `${getFirstName(chat?.name)} reaccionó ${reaction} a `
          : `Reaccionaste ${reaction} a `}{" "}
        {mediaContent}
      </span>
    );
  }

  // Si es solo el archivo (sin reacción) lo retornamos
  return mediaContent;
};
