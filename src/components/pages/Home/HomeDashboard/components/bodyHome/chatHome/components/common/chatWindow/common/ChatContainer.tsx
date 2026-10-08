import { Fragment } from "react/jsx-runtime";
import type { ChatContainerProps } from "../../../../../../../../../../../types/home/chatSectionTypes";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  formatDate,
  formatMessageTime,
} from "../../../../../../../../../../../functions/helpersChat";
import { LazyMedia } from "./media/LasyMedia";
import { LazyAudio } from "./media/LasyAudio";
import { LazySticker } from "./media/LazySticker";
import { LazyDocument } from "./media/LazyDocuments";
import { LazyVideo } from "./media/LazyVideo";
import { MessageStatusIcon } from "./MessageStatusIcon";
import {
  useActiveChat,
  useChatUIStore,
  useReactionStore,
} from "../../../../../../../../../../../stores/homeStore";

import { MessageMenu } from "./MessageMenu";
import { ReactionMenu } from "./ReactionMenu";
import { useDataChat } from "../../../../data/useDataChat";
import { LazyMediaAlbum } from "./media/LazyMediaAlbum";
import { useGroupedMessages } from "../../../../../../../../../../../hooks/useUtilities";
import { QuotedMessage } from "../../quoted/QuotedMessage";

export const ChatContainer = ({ messages }: ChatContainerProps) => {
  //Referencia para saber cuando es el ultimo mensaje
  const messagesEndRef = useRef<HTMLDivElement>(null);

  //Store para los elementos chat ui
  const {
    isSelectionMode,
    selectedMessages,
    toggleMessageSelection,
    deletingIds,
  } = useChatUIStore();

  //Longitud para saber cuando hacer el scroll
  const lastMessage = messages[messages.length - 1];
  const scrollTrigger = lastMessage
    ? `${lastMessage.id}-${lastMessage.reply_to_id}`
    : "empty";

  //Funcion para saber cuando se debe hacer el scroll automatico
  const scrollToBottom = (isInitialLoad = false) => {
    // requestAnimationFrame espera a que el navegador termine de calcular las alturas del DOM
    requestAnimationFrame(() => {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: isInitialLoad ? "auto" : "smooth",
          block: "end", // Fuerza a que el ancla sea la parte inferior exacta
        });
      }, 150); // 150ms le da el respiro perfecto para renderizar componentes pesados como Quotes o Media
    });
  };
  // Historial local de mensajes eliminados
  const [localDeletingIds, setLocalDeletingIds] = useState<string[]>([]);

  // Scroll sin animación al entrar
  useEffect(() => {
    scrollToBottom(true);
  }, []);

  // Scroll con animación suave al recibir mensajes nuevos
  useEffect(() => {
    scrollToBottom(false);
  }, [scrollTrigger]);

  //Efecto para que la animacion no se corte cuando se limpie
  useEffect(() => {
    if (deletingIds.length > 0) {
      setLocalDeletingIds((prev) => {
        const newIds = deletingIds.filter((id) => !prev.includes(id));
        if (newIds.length > 0) {
          return [...prev, ...newIds];
        }
        return prev;
      });
    }
  }, [deletingIds]);

  // Limpieza: remover los IDs del estado local si ya no existen en `messages`
  useEffect(() => {
    setLocalDeletingIds((prev) =>
      prev.filter((id) => messages.some((m) => m.id === id)),
    );
  }, [messages]);
  //Se obtiene el mensaje original mediante un find, sirve para los quoted messages, para encontrarlos en el html al haer click
  const getOriginalMessage = (replyToId?: string | null) => {
    if (!replyToId) return null;
    return messages.find((m) => m.wa_id === replyToId) || null;
  };
  //Se obtiene el chat activo del state
  const { activeChat } = useActiveChat();
  //Se obtienen los chats
  const { chats } = useDataChat();

  //Se obtienen las reacciones optimistas instantaneas
  const { optimisticReactions, setOpenMenuId } = useReactionStore();

  //Se filtra la informacion del chat activo
  const activeChatInfo = (chats || []).filter((m) => m.id === activeChat);

  //Se obtiene el current chat activo
  const currentActiveChat = activeChatInfo[0] || null;

  // Algoritmo Agrupador de Imágenes
  const { groupedMessages } = useGroupedMessages(messages);
  return (
    <div
      className={`chat-container ${isSelectionMode ? "selection-mode-active" : ""}`}
    >
      {/* Se agrupan los mensajes quitando todo lo multimedia */}
      {groupedMessages.map((msg, index) => {
        const previousMsg = messages[index - 1];
        //Condicional para cuando es una burbuja media type
        const isMediaTypeBubble = [
          "image",
          "audio",
          "document",
          "video",
        ].includes(msg.media_type ?? "");

        // Variables de estado del mensaje
        const isDeleting =
          localDeletingIds.includes(msg.id) || deletingIds.includes(msg.id);

        //Se obtiene el ultimo mensaje para desplegar el menu hacia arriba
        const isLastMessages =
          index >= groupedMessages.length - 2 && index !== 0;

        //Se obtiene el dia actual en string
        const currentDayStr = new Date(msg.created_at).toDateString();

        //Se obtiene el dia previo en string
        const previousDayStr = previousMsg
          ? new Date(previousMsg.created_at).toDateString()
          : null;

        //Se obtiene el valor para la division de la fecha en el chat
        const showDateDivider =
          !previousMsg || currentDayStr !== previousDayStr;

        //Se obtienee el mensaje citado
        const quotedMsg = getOriginalMessage(msg.reply_to_id);

        //Variable que almacena el mensaje seleccionado
        const isSelected = selectedMessages.some((m) => m.id === msg.id);

        //Se obtiene la reaccion obtimista
        const optReaction = optimisticReactions[msg.id];

        //Se hace display de la reaccion
        const displayReaction =
          optReaction !== undefined ? optReaction : msg.reaction;

        return (
          <Fragment key={msg.id}>
            {/* Separador de Fecha */}
            {showDateDivider && (
              <div className="date-divider">
                <span>{formatDate(msg.created_at)}</span>
              </div>
            )}

            {/* Fila del Mensaje (Contiene Checkbox + Burbuja + Animación) */}
            <div
              className={`message-row ${msg.sender} ${isDeleting ? "is-deleting" : ""}`}
            >
              {/* Checkbox de Selección */}
              {isSelectionMode && (
                <div
                  className="message-checkbox"
                  onClick={() => toggleMessageSelection(msg)}
                >
                  <input type="checkbox" checked={isSelected} readOnly />
                </div>
              )}

              {/* Burbuja Principal */}
              <div
                id={`msg-${msg.wa_id}`}
                className={`message-bubble ${msg.sender} ${isMediaTypeBubble ? "bubble-media" : ""} ${isSelected ? "selected" : ""}`}
              >
                {/* Botón de Reacciones */}
                {!isSelectionMode && msg.sender !== "agent" && (
                  <ReactionMenu
                    message={msg}
                    phone={currentActiveChat?.bsuid}
                    currentReaction={displayReaction}
                  />
                )}

                {/* Menú Desplegable */}
                {!isSelectionMode && msg.sender !== "agent-IA" && (
                  <MessageMenu
                    bgc={msg.sender === "agent" ? "#D9FDD3" : "#fdfdfd"}
                    color={msg.sender === "agent" ? "#667781" : ""}
                    message={msg}
                    isLast={isLastMessages}
                    canIReply={msg.isAlbum ? false : true}
                  />
                )}

                {/* Cita de Mensaje Respondido */}
                {quotedMsg && (
                  <QuotedMessage
                    chat={activeChatInfo[0]}
                    quotedMsg={quotedMsg}
                    onClick={() => {
                      const targetElement =
                        document.getElementById(`msg-${quotedMsg.wa_id}`) ||
                        document
                          .querySelector(`[data-wa-id="${quotedMsg.wa_id}"]`)
                          ?.closest(".message-row");

                      targetElement?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });

                      // Si el mensaje es una imagen, le avisamos al store global
                      if (quotedMsg.media_type === "image") {
                        useChatUIStore
                          .getState()
                          .setTargetMediaToOpen(quotedMsg.wa_id);
                      }
                    }}
                  />
                )}

                {/* Multimedia */}
                {msg.isAlbum ? (
                  <LazyMediaAlbum messages={msg.messages} />
                ) : (
                  <>
                    {msg.media_id && msg.media_type === "image" && (
                      <LazyMedia
                        message={msg}
                        mediaId={msg.media_id}
                        altText={msg.text}
                      />
                    )}
                  </>
                )}
                {msg.media_id && msg.media_type === "video" && (
                  <LazyVideo mediaId={msg.media_id} />
                )}
                {msg.media_id && msg.media_type === "audio" && (
                  <LazyAudio
                    transcript={msg.transcript}
                    mediaId={msg.media_id}
                  />
                )}
                {msg.media_id && msg.media_type === "sticker" && (
                  <div className="sticker-wrapper">
                    <LazySticker message={msg} mediaId={msg.media_id} />
                  </div>
                )}
                {msg.media_id && msg.media_type === "document" && (
                  <LazyDocument
                    message={msg}
                    mediaId={msg.media_id}
                    fileName={msg.file_name}
                    mimeType={msg.mime_type}
                  />
                )}

                {/* Texto Markdown */}
                <div
                  style={
                    {
                      "--dinamic-color":
                        msg.sender === "client" ? "#212121" : "#667781",
                    } as CSSProperties
                  }
                  className="markdown"
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>

                {/* Pie del Mensaje (Hora y Palomitas) */}
                <span className="time">
                  {formatMessageTime(msg.created_at)}
                  {msg.sender === "agent" && (
                    <MessageStatusIcon status={msg.status} />
                  )}
                </span>
                {displayReaction && (
                  <div
                    onClick={() => {
                      setOpenMenuId(msg.id);
                    }}
                    className="reaction-badge"
                  >
                    {displayReaction}
                  </div>
                )}
              </div>
            </div>
          </Fragment>
        );
      })}
      {/* Separador y referencia al ultimo mensaje */}
      <div className={`selection-spacer ${isSelectionMode ? "active" : ""}`} />
      <div ref={messagesEndRef} />
    </div>
  );
};
