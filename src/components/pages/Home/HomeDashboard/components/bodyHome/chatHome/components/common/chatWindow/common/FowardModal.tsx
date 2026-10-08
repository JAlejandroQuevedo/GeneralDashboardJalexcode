import { useState } from "react";
import { useApiToken } from "../../../../../../../../../../../hooks/useApiToken";
import { useChatUIStore } from "../../../../../../../../../../../stores/homeStore";
import { useDataChat } from "../../../../data/useDataChat";
import { Check, Forward, Search, X } from "lucide-react";
import { config } from "../../../../../../../../../../../config/config";
import { useInsertDocument } from "../../../../../../../../../../../functions/supabase/streaming/useInsertDocument";
import { useUtilities } from "../../../../../../../../../../../hooks/useUtilities";

export const ForwardModal = () => {
  //Se obtiene el store de chat ui
  const {
    isForwardModalOpen,
    setForwardModalOpen,
    selectedMessages,
    clearSelection,
  } = useChatUIStore();

  //Se obtiene el formateador de numeros desde el hook

  const { formatPhoneNumber } = useUtilities();

  //Se obtiene los datos de los chats
  const { chats } = useDataChat();

  //Se obtiene e hook para llamar a la api
  const { postApiToken } = useApiToken();

  //States para el manejo de los chats dentro del componente
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isForwarding, setIsForwarding] = useState(false);

  //Hook que almacenara el mensaje en la base de datos
  const { insertDoc } = useInsertDocument("messages");

  //Si no esta abierto el modal, se retorna null
  if (!isForwardModalOpen) return null;

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
    if (selectedChats.length === 0) return;
    setIsForwarding(true);
    setForwardModalOpen(false);
    clearSelection();

    try {
      for (const chatId of selectedChats) {
        const targetChat = chats.find((c) => c.id === chatId);
        if (!targetChat) continue;

        for (const msg of selectedMessages) {
          const tempWaId = `agent-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

          const payload = {
            chat_id: chatId,
            sender: "agent",
            text: msg.text,
            media_type: msg.media_type,
            media_id: msg.media_id,
            wa_id: tempWaId,
          };

          await insertDoc(payload);

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
        }
      }
    } catch (error) {
      console.error("Error al reenviar:", error);
    } finally {
      setIsForwarding(false);
      setSelectedChats([]);
    }
  };

  return (
    <div className="forward-modal-overlay">
      <div className="forward-modal">
        {/* Cabecera */}
        <div className="modal-header">
          <h3>Reenviar mensaje a</h3>
          <button
            className="close-btn"
            onClick={() => setForwardModalOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* Buscador */}
        <div className="modal-search-container">
          <div className="search-input-wrapper">
            <Search color="#54656f" size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar nombre de contacto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <span className="recent-label">Chats recientes</span>

        {/* Lista de Chats */}
        <div className="modal-body chat-list">
          {filteredChats.map((chat) => {
            const isChecked = selectedChats.includes(chat.id);
            return (
              <div
                key={chat.id}
                className="chat-select-row"
                onClick={() => toggleChatSelection(chat.id)}
              >
                {/* Checkbox personalizado */}
                <div
                  className={`custom-checkbox ${isChecked ? "checked" : ""}`}
                >
                  {isChecked && <Check color="#fdfdfd" />}
                </div>

                {/* Avatar (Placeholder si no tienes imagen) */}
                <div className="chat-avatar">
                  {/* Aquí iría tu <img> si tienes avatar */}
                  <span>{chat.name.charAt(0).toUpperCase()}</span>
                </div>

                {/* Info del chat */}
                <div className="chat-info">
                  <span className="chat-name">{chat.name}</span>
                  <span className="chat-subtext">
                    {formatPhoneNumber(chat.bsuid) || "Contacto"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer (Botón de enviar flotante) */}
        {selectedChats.length > 0 && (
          <div className="modal-footer">
            <div className="selected-preview">
              <span>{selectedChats.length} chat(s) seleccionado(s)</span>
            </div>
            <button
              className="send-forward-btn"
              disabled={isForwarding}
              onClick={handleForwardMessages}
            >
              <Forward size={24} color="white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
