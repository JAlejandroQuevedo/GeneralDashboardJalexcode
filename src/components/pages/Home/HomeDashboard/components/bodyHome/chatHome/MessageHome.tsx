import { ChatInputArea } from "./components/common/formChat/ChatInputArea";
import { useDataChat } from "./data/useDataChat";
import { SideBar } from "./components/common/sideBar/SideBar";
import {
  useActiveChat,
  useChatUIStore,
  useLoaderReconnectStore,
} from "../../../../../../../stores/homeStore";
import { ChatWindow } from "./components/common/chatWindow/ChatWindow";
import { useKeyboardChat } from "../../../../../../../hooks/useKeyboardChat";
import { useInsertDocument } from "../../../../../../../functions/supabase/streaming/useInsertDocument";
import { useApiToken } from "../../../../../../../hooks/useApiToken";
import { config } from "../../../../../../../config/config";

import { BeatLoader } from "react-spinners";
import { useResponsive } from "../../../../../../../constants/reactResponsive";
import { useEffect, useState, type CSSProperties } from "react";
import { PopupCreateChat } from "./components/common/sideBar/common/popup/createChatPopup/PopupCreateChat";
import { useCleanHistory } from "../../../../../../../hooks/useUtilities";

export const ChatApp = () => {
  //Funcion para llamar a la data del chat de la base de datos

  const {
    messages,
    chats,
    chatsLoading,
    messagesLoader,
    disconnectedMessage,
    reconnectMessages,
  } = useDataChat();

  //Funcion para mostrar el loader cuando se esta reconectando el streaming
  const { isLoaderActive } = useLoaderReconnectStore();
  const [isStreamingLoading, setIsStreamingLoading] = useState<boolean>(false);

  //Chat activo en el panel
  const { activeChat } = useActiveChat();

  //Funcion para manejar la funcion de la key enter

  useKeyboardChat();

  //Filtro para el responsive
  const { isSm, isMd, isLg, isIpadPro } = useResponsive();

  //Variable que guarda el responsive en diferentes sizes

  const isSmall = isSm || isMd || isLg || isIpadPro;

  // Filtrar mensajes del chat activo
  const activeMessages = messages.filter((m) => m.chat_id === activeChat);

  //Se obtiene un chat limpio para poder enviar la transcripcion de audio

  const { cleanHistory } = useCleanHistory(messages, activeChat);

  //Filtrar el chat activo

  const activeChatInfo = chats.filter((m) => m.id === activeChat);

  //Effect para manejar la reconeccion del streaming
  useEffect(() => {
    let reconnectTimer: ReturnType<typeof setTimeout>;

    if (disconnectedMessage) {
      reconnectTimer = setTimeout(() => {
        setIsStreamingLoading(true);
        reconnectMessages();
      }, 5000);
    } else {
      setIsStreamingLoading(false);
    }
    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [disconnectedMessage, reconnectMessages]);

  //Handle para el send message, mediante un insert en el front

  const { insertDoc } = useInsertDocument("messages");

  //Funcion para enviar una peticion a la api

  const { postApiToken, postFormDataApiToken } = useApiToken();

  const { replyingTo, clearReply } = useChatUIStore();

  //Handle para el on submit txt
  const handleSendMessage = async (text: string) => {
    const currentReplyContext = replyingTo?.wa_id;
    clearReply();
    const tempWaId = `agent-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const payload = {
      chat_id: activeChat,
      sender: "agent",
      text: text,
      wa_id: tempWaId,
    };

    try {
      const docResult = await insertDoc(payload);
      if (docResult?.error) throw new Error(docResult.error);

      await postApiToken({
        url: "send-whatsapp",
        token: config.BEARER_TOKEN,
        body: {
          name: activeChatInfo[0].name,
          phone: activeChatInfo[0].bsuid,
          text: text,
          wa_id: tempWaId,
          context_wa_id: currentReplyContext,
        },
      });
      clearReply();
    } catch (error) {
      throw new Error("No se pudo enviar el mensaje");
    }
  };

  //Handle para el on submit audio

  const handleSendAudio = async (audioFile: File) => {
    //Se almacena el temp id
    const tempWaId = `agent-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    //Se construye el payload para la db
    const payload = {
      chat_id: activeChat,
      sender: "agent",
      wa_id: tempWaId,
      media_type: "audio",
      media_id: "isLoading",
    };

    try {
      //Se envia el documento con el id temporal
      const docResult = await insertDoc(payload);
      if (docResult?.error) throw new Error(docResult.error);
      //Se arma el formdata
      const form = new FormData();
      form.append("to", String(activeChatInfo[0].bsuid));
      form.append("type", "audio");
      form.append("wa_id", String(tempWaId));
      form.append("file", audioFile);

      await postFormDataApiToken({
        url: "send-media",
        token: config.BEARER_TOKEN,
        formData: form,
      });
    } catch (error) {
      throw new Error("No se pudo enviar el mensaje");
    }
  };

  //Manejo del envio de multimedia
  const handleSendMedia = async (files: File[], caption: string) => {
    // 1. Guardamos el contexto de respuesta para aplicarlo SOLO a la primera imagen
    const currentReplyContext = replyingTo?.wa_id;
    clearReply();

    // Se secuencialmente para garantizar el orden cronológico en el chat
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const tempWaId = `agent-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      // Se determinaa el tipo exacto de media
      let mediaType = "document"; // Por defecto, documento (incluye PDFs, ZIPs, etc.)

      if (file.type.startsWith("image/") && file.type !== "image/svg+xml") {
        mediaType = "image"; // Imágenes normales (JPG, PNG, WebP)
      } else if (file.type.startsWith("video/")) {
        mediaType = "video"; // Videos (MP4)
      }
      // Solo adjuntamos el caption y el reply en el PRIMER archivo
      const isFirstItem = i === 0;
      const fileCaption = isFirstItem ? caption : "";
      const fileContext = isFirstItem ? currentReplyContext : undefined;

      // Payload para la BD local (Para la UI instantánea)
      const payload = {
        chat_id: activeChat,
        sender: "agent",
        wa_id: tempWaId,
        media_type: mediaType,
        media_id: "isLoading",
        text: fileCaption,
      };

      try {
        // Insertamos en la UI
        const docResult = await insertDoc(payload);
        if (docResult?.error) throw new Error(docResult.error);

        // 5. Construimos el FormData para este archivo específico
        const form = new FormData();
        form.append("to", String(activeChatInfo[0].bsuid));
        form.append("type", mediaType);
        form.append("wa_id", String(tempWaId));
        form.append("file", file);

        // Adjuntamos texto y contexto si corresponde a este archivo
        if (fileCaption) form.append("caption", fileCaption);
        if (fileContext) form.append("context_wa_id", fileContext);

        // Se el archivo al backend
        await postFormDataApiToken({
          url: "send-media",
          token: config.BEARER_TOKEN,
          formData: form,
        });
      } catch (error) {
        console.error(`Error enviando el archivo ${file.name}:`, error);
      }
    }
  };
  //Manejo para el active chat
  const hasActiveChat = activeChat !== "" && activeChatInfo.length > 0;

  //Manejo para el isLoading segun diferentes factores
  const isLoading =
    chatsLoading || messagesLoader || isStreamingLoading || isLoaderActive;

  return (
    <>
      {isLoading ? (
        <div className="loader-card">
          <BeatLoader size={8} color="#85b6ff" />
        </div>
      ) : (
        <>
          <section className="chat-layout">
            {(!isSmall || !hasActiveChat) && <SideBar />}
            {(!isSmall || hasActiveChat) && (
              <main
                style={
                  {
                    "--dynamic-background": hasActiveChat
                      ? "url(img/bck_chat.jpg)"
                      : "none",

                    "--dynamic-background-color": !hasActiveChat
                      ? "#F7F5F3"
                      : "none",
                  } as CSSProperties
                }
                className="chat-window"
              >
                {hasActiveChat ? (
                  <>
                    <ChatWindow
                      chat={activeChatInfo[0]}
                      messages={activeMessages}
                    />
                    <ChatInputArea
                      activeChatInfo={activeChatInfo}
                      activeChat={activeChat}
                      onSendMessage={handleSendMessage}
                      onSendAudio={handleSendAudio}
                      onSendMedia={handleSendMedia}
                      chatHistory={cleanHistory}
                    />
                  </>
                ) : (
                  <div className="inactive-chat-window">
                    <div className="container-inactive-window-content">
                      <img src="/img/icons/logo_shield.svg" alt="" />
                      <p>JAlexcode Dashboard</p>
                    </div>
                  </div>
                )}
              </main>
            )}
          </section>
          <PopupCreateChat />
        </>
      )}
    </>
  );
};
