import { Check } from "lucide-react";
import { useUtilities } from "../../../../../../../../hooks/useUtilities";
import type { ChatListModalProps } from "../../../../../../../../types/home/menuModal";

export const ChatListMenuModal = ({
  filteredChats,
  selectedChats,
  toggleChatSelection,
}: ChatListModalProps) => {
  //Se obtiene el formateador de numeros desde el hook

  const { formatPhoneNumber } = useUtilities();

  return (
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
            <div className={`custom-checkbox ${isChecked ? "checked" : ""}`}>
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
  );
};
