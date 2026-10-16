import { useState } from "react";
import {
  useChatUIStore,
  useTemplateUIStore,
} from "../../../../../../../stores/homeStore";
import { useDataChat } from "../../bodyHome/chatHome/data/useDataChat";
import { useApiToken } from "../../../../../../../hooks/useApiToken";
import { useInsertDocument } from "../../../../../../../functions/supabase/streaming/useInsertDocument";
import { config } from "../../../../../../../config/config";
import { HeaderMenuModal } from "./common/HeaderMenuModal";
import { SeekerMenuModal } from "./common/SeekerMenuModal";
import { ChatListMenuModal } from "./common/ChatListMenuModal";
import { ButtonMenuModal } from "./common/ButtonMenuModal";
import { useTypeRequest } from "../../../../../../../hooks/useUtilities";

export type MenuModalProps = {
  type?: "Foward" | "Template";
};
export const MenuModal = ({ type = "Foward" }: MenuModalProps) => {
  //Se obtiene el store de chat ui
  const {
    isForwardModalOpen,
    setForwardModalOpen,
    selectedMessages,
    clearSelection,
  } = useChatUIStore();

  //Se obtiene el store de template ui

  const {
    endpoint,
    normalizedVariables,
    selectedFile,
    isMenuModalOpen,
    setMenuModalOpen,
    setIsTemplateLoading,
  } = useTemplateUIStore();

  const { data } = useTypeRequest({
    normalizedVariables: normalizedVariables,
    endpoint: endpoint,
    selectedFile: selectedFile,
  });

  //Se obtiene los datos de los chats
  const { chats } = useDataChat();

  //Se obtiene e hook para llamar a la api
  const { postApiToken, postFormDataApiToken } = useApiToken();

  //States para el manejo de los chats dentro del componente
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  //Hook que almacenara el mensaje en la base de datos
  const { insertDoc } = useInsertDocument("messages");

  //Si no esta abierto el modal, se retorna null
  if (type === "Foward") {
    if (!isForwardModalOpen) return null;
  } else if (type === "Template") {
    if (!isMenuModalOpen) return null;
  }

  //Se selecciona el chat al que se reenviara el mensaje
  const toggleChatSelection = (chatId: string) => {
    setSelectedChats((prev) =>
      prev.includes(chatId)
        ? prev.filter((id) => id !== chatId)
        : [...prev, chatId],
    );
  };

  //Chat Filtrado
  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  //Funcion que maneja el reenvio de los mensajes
  const handleForwardMessages = async () => {
    if (selectedChats.length === 0 || selectedMessages.length === 0) return;

    setForwardModalOpen(false);
    clearSelection();

    try {
      const chatsMap = new Map(chats.map((c) => [c.id, c]));

      //Almacenamiento de funciones
      const allTasks = [];

      for (const chatId of selectedChats) {
        const targetChat = chatsMap.get(chatId);
        if (!targetChat) continue;

        for (const msg of selectedMessages) {
          allTasks.push(async () => {
            try {
              const tempWaId = `agent-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

              await insertDoc({
                chat_id: chatId,
                sender: "agent",
                text: msg.text,
                media_type: msg.media_type,
                media_id: msg.media_id,
                wa_id: tempWaId,
              });

              await postApiToken({
                url: "send-whatsapp",
                token: config.BEARER_TOKEN,
                body: {
                  name: targetChat.name,
                  phone: targetChat.bsuid,
                  text: msg.text,
                  media_type: msg.media_type,
                  media_id: msg.media_id,
                  wa_id: tempWaId,
                },
              });
            } catch (err) {
              console.error(`Error enviando a ${targetChat.name}:`, err);
            }
          });
        }
      }

      //Configuración de los Lotes (Chunks)
      const CHUNK_SIZE = 10;
      const DELAY_MS = 500;

      // Procesamiento en Lotes
      for (let i = 0; i < allTasks.length; i += CHUNK_SIZE) {
        const chunk = allTasks.slice(i, i + CHUNK_SIZE);

        // Ejecutamos solo este lote concurrentemente
        await Promise.all(chunk.map((task) => task()));

        // Si aún quedan tareas pendientes, hacemos una pequeña pausa para no saturar la API
        if (i + CHUNK_SIZE < allTasks.length) {
          await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
        }
      }
    } catch (error) {
      console.error("Error crítico al preparar el reenvío:", error);
    } finally {
      setSelectedChats([]);
    }
  };

  const handleSendTemplates = async () => {
    if (selectedChats.length === 0) return;
    setIsTemplateLoading(true);
    if (type === "Foward") {
      setForwardModalOpen(false);
    } else if (type === "Template") {
      setMenuModalOpen(false);
    }
    try {
      //Map de chat
      const chatsMap = new Map(chats.map((c) => [c.id, c]));

      //Almacenamiento de funciones
      const allTasks = [];

      for (const chatId of selectedChats) {
        const targetChat = chatsMap.get(chatId);

        if (!targetChat) continue;

        allTasks.push(async () => {
          try {
            const phone = targetChat?.bsuid;
            const tempWaId = `agent-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
            switch (data?.endpoint) {
              case "reminder-pet":
                const { time, cost, range, endpoint: reminderPet } = data;
                const payloadReminderPet = {
                  time,
                  cost,
                  range,
                  phone,
                  wa_id: tempWaId,
                };
                await insertDoc({
                  chat_id: chatId,
                  sender: "agent",
                  text: "Template Recordatorio General Mascota Enviado",
                  wa_id: tempWaId,
                });
                await postApiToken({
                  url: `templates/${reminderPet}`,
                  token: config.BEARER_TOKEN,
                  body: payloadReminderPet,
                });
                break;

              case "pets-time-change":
                const { time: timeChange, endpoint: petsTimeChange } = data;
                const payloadTimeChange = {
                  time: timeChange,
                  phone,
                  wa_id: tempWaId,
                };

                await insertDoc({
                  chat_id: chatId,
                  sender: "agent",
                  text: "Template Adelantamos tu Cita Enviado",
                  wa_id: tempWaId,
                });

                await postApiToken({
                  url: `templates/${petsTimeChange}`,
                  token: config.BEARER_TOKEN,
                  body: payloadTimeChange,
                });
                break;

              case "pets-reminder":
                const { ownerName, petName, endpoint: petsReminder } = data;
                const payloadPetsReminder = {
                  ownerName,
                  petName,
                  phone,
                  wa_id: tempWaId,
                };
                await insertDoc({
                  chat_id: chatId,
                  sender: "agent",
                  text: "Template Recordatorio Mascota Enviado",
                  wa_id: tempWaId,
                });

                await postApiToken({
                  url: `templates/${petsReminder}`,
                  token: config.BEARER_TOKEN,
                  body: payloadPetsReminder,
                });
                break;

              case "welcome-system":
                const { endpoint: welcomeSystemEndpoint } = data;

                await insertDoc({
                  chat_id: chatId,
                  sender: "agent",
                  text: "Template Bienvenido Sistema Enviado",
                  wa_id: tempWaId,
                });

                await postApiToken({
                  url: `templates/${welcomeSystemEndpoint}`,
                  token: config.BEARER_TOKEN,
                  body: {
                    phone,
                    wa_id: tempWaId,
                  },
                });
                break;

              case "welcome-pet":
                const { petName: petWelcomName, endpoint: welcomePet } = data;
                const payloadWelcomePet = {
                  petName: petWelcomName,
                  phone,
                  wa_id: tempWaId,
                };

                await insertDoc({
                  chat_id: chatId,
                  sender: "agent",
                  text: "Template Bienvenido Mascota Enviado",
                  wa_id: tempWaId,
                });

                await postApiToken({
                  url: `templates/${welcomePet}`,
                  token: config.BEARER_TOKEN,
                  body: payloadWelcomePet,
                });

                break;
              case "coffee-template":
                const { file, product, endpoint: coffeTemplate } = data;
                await insertDoc({
                  chat_id: chatId,
                  sender: "agent",
                  text: "Template Aviso Café Enviado",
                  wa_id: tempWaId,
                });

                const form = new FormData();
                form.append("phone", String(phone));
                form.append("product", String(product));
                form.append("wa_id", String(tempWaId));
                if (file) {
                  form.append("file", file);
                }

                await postFormDataApiToken({
                  url: `templates/${coffeTemplate}`,
                  token: config.BEARER_TOKEN,
                  formData: form,
                });
                break;
              default:
                break;
            }
          } catch (err) {
            console.error(`Error enviando a ${targetChat.bsuid}:`, err);
          }
        });
      }

      //Configuración de los Lotes (Chunks)
      const CHUNK_SIZE = 10;
      const DELAY_MS = 500;
      // Procesamiento en Lotes
      for (let i = 0; i < allTasks.length; i += CHUNK_SIZE) {
        const chunk = allTasks.slice(i, i + CHUNK_SIZE);

        // Ejecutamos solo este lote concurrentemente
        await Promise.all(chunk.map((task) => task()));

        // Si aún quedan tareas pendientes, hacemos una pequeña pausa para no saturar la API
        if (i + CHUNK_SIZE < allTasks.length) {
          await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
        }
      }
    } catch (error) {
      console.error("Error crítico al enviar los templates:", error);
    } finally {
      setSelectedChats([]);
      setIsTemplateLoading(false);
    }
  };

  return (
    <div className="forward-modal-overlay">
      <div className="forward-modal">
        {/* Header */}
        <HeaderMenuModal
          setFowardModalOpen={() => {
            if (type === "Foward") {
              setForwardModalOpen(false);
            } else if (type === "Template") {
              setMenuModalOpen(false);
            }
          }}
        />

        {/* Buscador */}
        <SeekerMenuModal
          searchTerm={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Cambiar para que reciba el titulo dinamico */}
        <span className="recent-label">
          {type === "Foward" ? "Chats recientes" : "Chats disponibles"}
        </span>

        {/* Lista de Chats */}
        <ChatListMenuModal
          filteredChats={filteredChats}
          toggleChatSelection={toggleChatSelection}
          selectedChats={selectedChats}
        />

        {/* Footer (Botón de enviar flotante) */}
        {selectedChats.length > 0 && (
          <ButtonMenuModal
            selectedChats={selectedChats}
            onClick={
              type === "Foward" ? handleForwardMessages : handleSendTemplates
            }
          />
        )}
      </div>
    </div>
  );
};
