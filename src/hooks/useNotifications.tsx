import { useEffect, useRef } from "react";
import type { ChatType, MessageType } from "../types/home/chatSectionTypes";

export const useDesktopNotifications = (
  chats: ChatType[],
  messages: MessageType[],
  activeChatId: string | null,
  onNotificationClick: (chatId: string) => void,
) => {
  const prevMessagesLength = useRef(messages.length);

  // Instanciamos el audio una sola vez para no saturar la memoria
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Inicializamos el objeto de audio al montar el hook
    audioRef.current = new Audio("/img/not_sound.mp3");

    // Reproducimos y pausamos el audio instantáneamente en el primer clic del usuario.
    const unlockAudio = () => {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            audioRef.current?.pause();
            audioRef.current!.currentTime = 0;
          })
          .catch(() => {});
      }
      // Una vez que logramos el clic, destruimos el listener para no gastar recursos
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };

    // Escuchamos cualquier interacción global en la página
    document.addEventListener("click", unlockAudio);
    document.addEventListener("keydown", unlockAudio);

    // Solicitamos permisos de notificaciones
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  // Escuchar cambios en los mensajes y lanzar la notificación nativa
  useEffect(() => {
    if (messages.length <= prevMessagesLength.current) {
      prevMessagesLength.current = messages.length;
      return;
    }

    const latestMessage = messages[messages.length - 1];
    prevMessagesLength.current = messages.length;

    if (
      latestMessage.sender === "client" &&
      latestMessage.chat_id !== activeChatId
    ) {
      if ("Notification" in window && Notification.permission === "granted") {
        const chatInfo = chats.find((c) => c.id === latestMessage.chat_id);
        const title = chatInfo ? chatInfo.name : "Nuevo mensaje de WhatsApp";

        let bodyText = latestMessage.text;
        if (latestMessage.media_type?.startsWith("image/"))
          bodyText = "📷 Fotografía";
        if (latestMessage.media_type?.startsWith("video/"))
          bodyText = "🎥 Video";
        if (latestMessage.media_type?.startsWith("audio/"))
          bodyText = "🎤 Nota de voz";
        if (latestMessage.media_type?.startsWith("application/"))
          bodyText = "📄 Documento";

        const notif = new Notification(title, {
          body: bodyText,
          icon: "/img/favicon.ico",
        });

        notif.onclick = (e) => {
          e.preventDefault();
          window.focus();
          onNotificationClick(latestMessage.chat_id);
          notif.close();
        };

        // REPRODUCIR EL AUDIO AUTORIZADO
        if (audioRef.current) {
          audioRef.current.currentTime = 0; // Reiniciamos por si suena dos veces rápido
          audioRef.current.play().catch((error) => {
            console.log(
              "El navegador bloqueó el audio porque no hubo interacción previa:",
              error,
            );
          });
        }
      }
    }
  }, [messages, activeChatId, chats, onNotificationClick]);
};
